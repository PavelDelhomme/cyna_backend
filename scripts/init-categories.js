const path = require('path');
const envFile = process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env';
require('dotenv').config({ path: path.join(__dirname, '..', envFile) });
const mysql = require('mysql2/promise');
const fs = require('fs').promises;

async function initCategories() {
  const categoriesPath = path.join(__dirname, '../src/data/productCategories.json');
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

    console.log('\nLecture du fichier productCategories.json...');
    // Lecture du fichier JSON
    const data = await fs.readFile(categoriesPath, 'utf8');
    const categories = JSON.parse(data);
    console.log('Données des catégories chargées:', categories);

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

      console.log('\nSuppression des anciennes données...');
      // Suppression des associations order items <-> produits
      await connection.query('DELETE FROM order_item_products');
      // Suppression des anciens produits
      await connection.query('DELETE FROM products');
      // Suppression des anciennes catégories
      await connection.query('DELETE FROM product_categories');
      console.log('Anciennes données supprimées');

      console.log('\nInsertion des nouvelles catégories...');
      // Insertion des nouvelles catégories
      for (const cat of categories) {
        console.log('Insertion de la catégorie:', cat);
        await connection.query(
          'INSERT INTO product_categories (id, name, description) VALUES (?, ?, ?)',
          [cat.id, cat.name, cat.description]
        );
      }

      console.log('Catégories initialisées avec succès !');
    } catch (dbError) {
      console.error('Erreur de base de données:', dbError);
      throw dbError;
    }
  } catch (err) {
    console.error('Erreur lors de l\'initialisation des catégories :', err);
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

initCategories();
