const path = require('path');
const envFile = process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env';
require('dotenv').config({ path: path.join(__dirname, '..', envFile) });
const mysql = require('mysql2/promise');
const fs = require('fs').promises;

async function initDatabase() {
  let connection;
  
  try {
    // Vérification des variables d'environnement
    console.log('Vérification des variables d\'environnement...');
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_NAME:', process.env.DB_NAME);
    console.log('DB_PORT:', process.env.DB_PORT);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('RESET_DB:', process.env.RESET_DB);
    console.log('Fichier .env utilisé:', envFile);

    // Lecture du fichier SQL
    console.log('\nLecture du fichier init-db.sql...');
    const sqlPath = path.join(__dirname, 'init-db.sql');
    const sqlContent = await fs.readFile(sqlPath, 'utf8');

    // Connexion à la base de données
    console.log('\nConnexion à la base de données...');
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

    // Désactivation des contraintes de clé étrangère
    console.log('\nDésactivation des contraintes de clé étrangère...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
    console.log('Contraintes désactivées');

    // Vérification de l'existence des tables
    const [tables] = await connection.query("SHOW TABLES");
    const tablesExist = tables.length > 0;

    if (process.env.RESET_DB === 'true' && tablesExist) {
      console.log('\nSuppression des tables existantes...');
      // Suppression des tables dans l'ordre inverse des dépendances
      const dropQueries = [
        'DROP TABLE IF EXISTS order_item_products',
        'DROP TABLE IF EXISTS order_item_services',
        'DROP TABLE IF EXISTS order_items',
        'DROP TABLE IF EXISTS orders',
        'DROP TABLE IF EXISTS carts',
        'DROP TABLE IF EXISTS users',
        'DROP TABLE IF EXISTS roles'
      ];

      for (const query of dropQueries) {
        await connection.query(query);
      }
      console.log('Tables supprimées avec succès');
    }

    // Exécution du script SQL
    console.log('\nExécution du script SQL...');
    const queries = sqlContent.split(';').filter(query => query.trim());
    
    for (const query of queries) {
      if (query.trim()) {
        await connection.query(query);
      }
    }
    console.log('Script SQL exécuté avec succès');

    // Réactivation des contraintes
    console.log('\nRéactivation des contraintes de clé étrangère...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log('Contraintes réactivées');

    console.log('\n✅ Initialisation de la base de données terminée avec succès !');

  } catch (err) {
    console.error('\nErreur lors de l\'initialisation de la base de données :', err);
    throw err;
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
  console.error('❌ Erreur non gérée:', error);
  process.exit(1);
});

initDatabase(); 