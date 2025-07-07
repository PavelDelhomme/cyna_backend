const path = require('path');
const envFile = process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env';
require('dotenv').config({ path: path.join(__dirname, '..', envFile) });
const mysql = require('mysql2/promise');
const fs = require('fs').promises;

async function initProducts() {
  const productsPath = path.join(__dirname, '../src/data/products.json');
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

    console.log('\nLecture du fichier products.json...');
    // Lecture du fichier JSON
    const data = await fs.readFile(productsPath, 'utf8');
    const products = JSON.parse(data);
    console.log('Données des produits chargées:', products);

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

      console.log('\nSuppression des anciens produits...');
      await connection.query('DELETE FROM products');
      console.log('Anciens produits supprimés');

      console.log('\nInsertion des nouveaux produits...');
      for (const prod of products) {
        console.log('Insertion du produit:', prod);
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
    } catch (dbError) {
      console.error('Erreur de base de données:', dbError);
      throw dbError;
    }
  } catch (err) {
    console.error('Erreur lors de l\'initialisation des produits :', err);
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

initProducts();
