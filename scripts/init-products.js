const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function initProducts() {
  const productsPath = path.join(__dirname, '../src/data/products.json');
  let connection;

  try {
    // Lecture du fichier JSON
    const data = await fs.readFile(productsPath, 'utf8');
    const products = JSON.parse(data);

    // Connexion à la base de données
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'admin', // adapte selon ta config
      password: 'yourpassword', // adapte selon ta config
      database: 'cyna_database',
      port: 3307 // adapte selon ta config
    });

    // Suppression des anciens produits
    await connection.query('DELETE FROM products');

    // Insertion des nouveaux produits
    for (const prod of products) {
      await connection.query(
        `INSERT INTO products (
          id, name, description, price, stock, promotion, category_id, image, promo_code_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          prod.id,
          prod.name,
          prod.description,
          prod.price,
          prod.stock,
          prod.promotion,
          prod.category_id,
          prod.image,
          prod.promo_code_id
        ]
      );
    }

    console.log('Produits initialisés avec succès !');
  } catch (err) {
    console.error('Erreur lors de l\'initialisation des produits :', err);
  } finally {
    if (connection) await connection.end();
  }
}

initProducts();
