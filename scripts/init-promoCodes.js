const path = require('path');
const envFile = process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env';
require('dotenv').config({ path: path.join(__dirname, '..', envFile) });
const mysql = require('mysql2/promise');
const fs = require('fs').promises;

async function initPromoCodes() {
  const codesPath = path.join(__dirname, '../src/data/promoCodes.json');
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

    console.log('\nLecture du fichier promoCodes.json...');
    // Lecture du fichier JSON
    const data = await fs.readFile(codesPath, 'utf8');
    const promoCodes = JSON.parse(data);
    console.log('Données des codes promo chargées:', promoCodes);

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

      console.log('\nSuppression des anciens codes promo...');
      await connection.query('DELETE FROM promo_codes');
      console.log('Anciens codes promo supprimés');

      console.log('\nInsertion des nouveaux codes promo...');
      for (const code of promoCodes) {
        console.log('Insertion du code promo:', code);
        await connection.query(
          `INSERT INTO promo_codes (
            id, code, description, discount_type, discount_value, min_order_amount, max_discount_amount,
            start_date, end_date, max_uses, current_uses, is_active, is_public, created_by, is_first_purchase_only
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            code.id,
            code.code,
            code.description,
            code.discount_type,
            code.discount_value,
            code.min_order_amount,
            code.max_discount_amount,
            code.start_date,
            code.end_date,
            code.max_uses,
            code.current_uses,
            code.is_active,
            code.is_public,
            code.created_by,
            code.is_first_purchase_only
          ]
        );
      }

      console.log('\nRéactivation des contraintes de clé étrangère...');
      await connection.query('SET FOREIGN_KEY_CHECKS = 1');
      console.log('Contraintes réactivées');

      console.log('Codes promotionnels initialisés avec succès !');
    } catch (dbError) {
      console.error('Erreur de base de données:', dbError);
      throw dbError;
    }
  } catch (err) {
    console.error('Erreur lors de l\'initialisation des codes promo :', err);
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

initPromoCodes();
