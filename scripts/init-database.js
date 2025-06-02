const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function initDatabase() {
  let connection;
  
  try {
    // Connexion à la base de données
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'admin',
      password: 'yourpassword',
      port: 3307,
      multipleStatements: true
    });

    console.log('Connexion à la base de données établie');

    // Sélection de la base de données
    await connection.query('USE cyna_database;');

    // Suppression des tables existantes dans le bon ordre
    console.log('Suppression des tables existantes...');
    await connection.query(`
      SET FOREIGN_KEY_CHECKS = 0;
      
      DROP TABLE IF EXISTS promo_code_usage;
      DROP TABLE IF EXISTS asso_roles_promocodes;
      DROP TABLE IF EXISTS role_promo_codes;
      DROP TABLE IF EXISTS asso_services_roles;
      DROP TABLE IF EXISTS asso_servicetypes_roles;
      DROP TABLE IF EXISTS asso_categoryproducts_roles;
      DROP TABLE IF EXISTS asso_addresses_user_profiles;
      DROP TABLE IF EXISTS asso_orderitems_services;
      DROP TABLE IF EXISTS asso_orderitems_products;
      DROP TABLE IF EXISTS stats;
      DROP TABLE IF EXISTS reviews;
      DROP TABLE IF EXISTS invoices;
      DROP TABLE IF EXISTS payments;
      DROP TABLE IF EXISTS order_items;
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS user_profiles;
      DROP TABLE IF EXISTS chatbot_history;
      DROP TABLE IF EXISTS chatbots;
      DROP TABLE IF EXISTS tickets;
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS services;
      DROP TABLE IF EXISTS carts;
      DROP TABLE IF EXISTS promo_codes;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS roles;
      DROP TABLE IF EXISTS service_types;
      DROP TABLE IF EXISTS product_categories;
      DROP TABLE IF EXISTS addresses;
      DROP TABLE IF EXISTS team_members;
      DROP TABLE IF EXISTS carousel_items;
      DROP TABLE IF EXISTS TEMP_PROMO_CODES;
      DROP TABLE IF EXISTS PROMO_CODES;
      
      SET FOREIGN_KEY_CHECKS = 1;
    `);
    console.log('Tables supprimées avec succès');

    // Lecture du fichier d'initialisation
    const initPath = path.join(__dirname, 'init-db.sql');
    const initSQL = await fs.readFile(initPath, 'utf8');

    // Exécution du script d'initialisation
    console.log('Initialisation de la base de données...');
    await connection.query(initSQL);
    console.log('Base de données initialisée avec succès !');

  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Connexion à la base de données fermée');
    }
  }
}

initDatabase(); 