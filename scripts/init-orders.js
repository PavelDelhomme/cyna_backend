const path = require('path');
const envFile = process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env';
require('dotenv').config({ path: path.join(__dirname, '..', envFile) });
const mysql = require('mysql2/promise');
const fs = require('fs').promises;

async function initOrders() {
  const ordersPath = path.join(__dirname, '../src/data/orders.json');
  const orderItemsPath = path.join(__dirname, '../src/data/orderItems.json');
  const assoOrderItemsProductsPath = path.join(__dirname, '../src/data/assoOrderItemsProducts.json');
  const assoOrderItemsServicesPath = path.join(__dirname, '../src/data/assoOrderItemsServices.json');
  let connection;

  try {
    // Vérification des variables d'environnement
    console.log('Vérification des variables d\'environnement...');
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_NAME:', process.env.DB_NAME);
    console.log('DB_PORT:', process.env.DB_PORT);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('Fichier .env utilisé:', envFile);

    console.log('\nLecture des fichiers JSON...');
    // Lecture des fichiers JSON
    const orders = JSON.parse(await fs.readFile(ordersPath, 'utf8'));
    const orderItems = JSON.parse(await fs.readFile(orderItemsPath, 'utf8'));
    const assoOrderItemsProducts = JSON.parse(await fs.readFile(assoOrderItemsProductsPath, 'utf8'));
    const assoOrderItemsServices = JSON.parse(await fs.readFile(assoOrderItemsServicesPath, 'utf8'));

    console.log('Données chargées :');
    console.log('- Commandes:', orders.length);
    console.log('- Éléments de commande:', orderItems.length);
    console.log('- Associations produits:', assoOrderItemsProducts.length);
    console.log('- Associations services:', assoOrderItemsServices.length);

    console.log('\nConnexion à la base de données...');
    try {
      connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
      });
      console.log('Connexion établie avec succès');

      // Test de la connexion
      const [rows] = await connection.query('SELECT 1');
      console.log('Test de connexion réussi:', rows);

      console.log('\nDésactivation des contraintes de clé étrangère...');
      await connection.query('SET FOREIGN_KEY_CHECKS = 0');
      console.log('Contraintes désactivées');

      console.log('\nSuppression des anciennes données...');
      await connection.query('DELETE FROM order_item_services');
      await connection.query('DELETE FROM order_item_products');
      await connection.query('DELETE FROM order_items');
      await connection.query('DELETE FROM orders');
      console.log('Anciennes données supprimées');

      // Récupérer tous les cart_id nécessaires
      const cartIds = [...new Set(orders.map(order => order.cart_id))];
      console.log('\nCart IDs uniques trouvés:', cartIds);

      // Insérer les carts s'ils n'existent pas déjà
      console.log('\nVérification et création des paniers manquants...');
      for (const cartId of cartIds) {
        const userId = orders.find(order => order.cart_id === cartId).user_id;
        console.log(`Vérification du panier #${cartId} pour l'utilisateur #${userId}`);
        await connection.query(
          `INSERT IGNORE INTO carts (id, creationdate, lastupdate, user_id) VALUES (?, NOW(), NOW(), ?)`,
          [cartId, userId]
        );
      }

      console.log('\nInsertion des commandes...');
      for (const order of orders) {
        console.log('Insertion de la commande:', order);
        await connection.query(
          `INSERT INTO orders (id, user_id, cart_id, totalprice, status, creationdate) VALUES (?, ?, ?, ?, ?, ?)`,
          [order.id, order.user_id, order.cart_id, order.totalprice, order.status, order.creationdate]
        );
      }

      console.log('\nRécupération des prix des services...');
      const [services] = await connection.query('SELECT id, price FROM services');
      const servicePrices = services.reduce((acc, service) => {
        acc[service.id] = service.price;
        return acc;
      }, {});
      console.log('Prix des services chargés:', servicePrices);

      console.log('\nInsertion des éléments de commande...');
      for (const item of orderItems) {
        const serviceAsso = assoOrderItemsServices.find(asso => asso.order_item_id === item.id);
        const price = serviceAsso ? servicePrices[serviceAsso.service_id] : 0;
        console.log('Insertion de l\'élément:', { ...item, price });
        await connection.query(
          `INSERT INTO order_items (id, order_id, quantity, price) VALUES (?, ?, ?, ?)`,
          [item.id, item.order_id, item.Quantity, price]
        );
      }

      console.log('\nInsertion des associations produits...');
      for (const asso of assoOrderItemsProducts) {
        console.log('Insertion de l\'association produit:', asso);
        await connection.query(
          `INSERT INTO order_item_products (order_item_id, product_id, created_at, updated_at) VALUES (?, ?, NOW(), NOW())`,
          [asso.order_item_id, asso.product_id]
        );
      }

      console.log('\nInsertion des associations services...');
      for (const asso of assoOrderItemsServices) {
        console.log('Insertion de l\'association service:', asso);
        await connection.query(
          `INSERT INTO order_item_services (order_item_id, service_id, created_at, updated_at) VALUES (?, ?, NOW(), NOW())`,
          [asso.order_item_id, asso.service_id]
        );
      }

      console.log('\nRecalcul des totaux des commandes...');
      const [products] = await connection.query('SELECT id, price FROM products');
      const [servicesDb] = await connection.query('SELECT id, price FROM services');
      const productPrices = products.reduce((acc, p) => { acc[p.id] = p.price; return acc; }, {});
      const servicePricesDb = servicesDb.reduce((acc, s) => { acc[s.id] = s.price; return acc; }, {});

      for (const order of orders) {
        const [items] = await connection.query('SELECT id, quantity FROM order_items WHERE order_id = ?', [order.id]);
        let total = 0;
        console.log(`\nCalcul du total pour la commande #${order.id}`);
        for (const item of items) {
          const [prodAsso] = await connection.query('SELECT product_id FROM order_item_products WHERE order_item_id = ?', [item.id]);
          if (prodAsso.length > 0) {
            const productId = prodAsso[0].product_id;
            const price = productPrices[productId] || 0;
            const subtotal = price * item.quantity;
            total += subtotal;
            console.log(`  OrderItem #${item.id} : PRODUIT (id=${productId}) | prix=${price} x${item.quantity} = ${subtotal}`);
          } else {
            const [servAsso] = await connection.query('SELECT service_id FROM order_item_services WHERE order_item_id = ?', [item.id]);
            if (servAsso.length > 0) {
              const serviceId = servAsso[0].service_id;
              const price = servicePricesDb[serviceId] || 0;
              const subtotal = price * item.quantity;
              total += subtotal;
              console.log(`  OrderItem #${item.id} : SERVICE (id=${serviceId}) | prix=${price} x${item.quantity} = ${subtotal}`);
            } else {
              console.log(`  OrderItem #${item.id} : AUCUNE ASSO (ignoré)`);
            }
          }
        }
        console.log(`  TOTAL calculé pour commande #${order.id} : ${total}\n`);
        await connection.query(
          `UPDATE orders SET totalprice = ? WHERE id = ?`,
          [total, order.id]
        );
      }

      console.log('\nRéactivation des contraintes de clé étrangère...');
      await connection.query('SET FOREIGN_KEY_CHECKS = 1');
      console.log('Contraintes réactivées');

      console.log('Commandes et associations initialisées avec succès !');
    } catch (dbError) {
      console.error('Erreur de base de données:', dbError);
      throw dbError;
    }
  } catch (err) {
    console.error('Erreur lors de l\'initialisation des commandes :', err);
    throw err; // Propager l'erreur pour que init-all.js puisse la gérer
  } finally {
    if (connection) {
      console.log('\nFermeture de la connexion...');
      await connection.end();
      console.log('Connexion fermée');
    }
  }
}

// Gestion des erreurs non capturées
process.on('unhandledRejection', (error) => {
  console.error('Erreur non gérée:', error);
  process.exit(1);
});

initOrders();
