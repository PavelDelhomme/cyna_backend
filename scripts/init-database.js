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
    console.log('Fichier .env utilisé:', envFile);

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

      // Sélection de la base de données
      console.log('\nSélection de la base de données...');
      await connection.query('USE cyna_database;');
      console.log('Base de données sélectionnée');

      // Suppression des tables existantes dans le bon ordre
      console.log('\nSuppression des tables existantes...');
      await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
      console.log('Contraintes de clé étrangère désactivées');
      
      const tables = [
        'promo_code_usage',
        'asso_roles_promocodes',
        'role_promo_codes',
        'asso_services_roles',
        'asso_servicetypes_roles',
        'asso_categoryproducts_roles',
        'asso_addresses_user_profiles',
        'order_item_services',
        'order_item_products',
        'stats',
        'reviews',
        'invoices',
        'payments',
        'order_items',
        'orders',
        'user_profiles',
        'chatbot_history',
        'chatbots',
        'tickets',
        'products',
        'services',
        'carts',
        'promo_codes',
        'users',
        'roles',
        'service_types',
        'product_categories',
        'addresses',
        'team_members',
        'carousel_items',
        'TEMP_PROMO_CODES',
        'PROMO_CODES'
      ];

      console.log('Tables à supprimer:', tables.length);
      for (const table of tables) {
        console.log(`Suppression de la table ${table}...`);
        await connection.query(`DROP TABLE IF EXISTS ${table};`);
        console.log(`Table ${table} supprimée`);
      }

      await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
      console.log('Contraintes de clé étrangère réactivées');
      
      console.log('Tables supprimées avec succès');

      // Lecture du fichier d'initialisation
      console.log('\nLecture du fichier init-db.sql...');
      const initPath = path.join(__dirname, 'init-db.sql');
      const initSQL = await fs.readFile(initPath, 'utf8');
      console.log('Fichier SQL chargé');

      // Séparation des commandes SQL
      const commands = initSQL.split(';').filter(cmd => cmd.trim());
      console.log(`Nombre de commandes SQL à exécuter : ${commands.length}`);

      // Exécution du script d'initialisation
      console.log('\nInitialisation de la base de données...');
      for (let i = 0; i < commands.length; i++) {
        const command = commands[i];
        if (command.trim()) {
          console.log(`Exécution de la commande ${i + 1}/${commands.length}...`);
          await connection.query(command);
          console.log(`Commande ${i + 1} exécutée avec succès`);
        }
      }
      console.log('Base de données initialisée avec succès !');

    } catch (dbError) {
      console.error('Erreur de base de données:', dbError);
      throw dbError;
    }
  } catch (err) {
    console.error('Erreur lors de l\'initialisation de la base de données :', err);
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

initDatabase(); 