const path = require('path');
const envFile = process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env';
require('dotenv').config({ path: path.join(__dirname, '..', envFile) });
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const bcrypt = require('bcrypt');

async function initUsers() {
  const usersPath = path.join(__dirname, '../src/data/users.json');
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

    console.log('\nLecture du fichier users.json...');
    // Lecture du fichier JSON
    const data = await fs.readFile(usersPath, 'utf8');
    const users = JSON.parse(data);
    console.log('Données des utilisateurs chargées:', users);

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

      console.log('\nSuppression des données liées aux utilisateurs...');
      console.log('Suppression des associations order_item_products...');
      await connection.query('DELETE FROM order_item_products WHERE order_item_id IN (SELECT id FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE cart_id IN (SELECT id FROM carts WHERE user_id > 1)))');
      
      console.log('Suppression des associations order_item_services...');
      await connection.query('DELETE FROM order_item_services WHERE order_item_id IN (SELECT id FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE cart_id IN (SELECT id FROM carts WHERE user_id > 1)))');
      
      console.log('Suppression des order items...');
      await connection.query('DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE cart_id IN (SELECT id FROM carts WHERE user_id > 1))');
      
      console.log('Suppression des commandes...');
      await connection.query('DELETE FROM orders WHERE cart_id IN (SELECT id FROM carts WHERE user_id > 1)');
      
      console.log('Suppression des paniers...');
      await connection.query('DELETE FROM carts WHERE user_id > 1');
      
      console.log('Suppression des profils utilisateurs...');
      await connection.query('DELETE FROM user_profiles WHERE user_id > 1');
      
      console.log('Suppression des utilisateurs (sauf admin)...');
      await connection.query('DELETE FROM users WHERE id > 1');
      console.log('Données supprimées avec succès');

      console.log('\nInsertion des nouveaux utilisateurs...');
      for (const user of users) {
        console.log('Traitement de l\'utilisateur:', user.name);
        // Hash du mot de passe
        console.log('Hashage du mot de passe...');
        const hashedPassword = await bcrypt.hash(user.password, 10);
        console.log('Mot de passe hashé avec succès');

        console.log('Insertion de l\'utilisateur...');
        await connection.query(
          `INSERT INTO users (id, name, email, password, phone, role_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            user.id,
            user.name,
            user.email,
            hashedPassword,
            user.phone,
            user.role_id
          ]
        );
        console.log('Utilisateur inséré avec succès');
      }

      console.log('\nRéactivation des contraintes de clé étrangère...');
      await connection.query('SET FOREIGN_KEY_CHECKS = 1');
      console.log('Contraintes réactivées');

      console.log('Utilisateurs initialisés avec succès (mots de passe hashés) !');
    } catch (dbError) {
      console.error('Erreur de base de données:', dbError);
      throw dbError;
    }
  } catch (err) {
    console.error('Erreur lors de l\'initialisation des utilisateurs :', err);
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

initUsers();
