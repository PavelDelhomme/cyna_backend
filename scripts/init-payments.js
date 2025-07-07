const path = require('path');
const envFile = process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env';
require('dotenv').config({ path: path.join(__dirname, '..', envFile) });
const mysql = require('mysql2/promise');
const fs = require('fs').promises;

async function initPayments() {
  const paymentsPath = path.join(__dirname, '../src/data/paymentMethods.json');
  let connection;

  try {
    console.log('Lecture du fichier JSON des moyens de paiement...');
    const payments = JSON.parse(await fs.readFile(paymentsPath, 'utf8'));
    console.log('Moyens de paiement à insérer :', payments.length);

    console.log('Connexion à la base de données...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });
    console.log('Connexion établie');

    console.log('Suppression des anciens moyens de paiement...');
    await connection.query('DELETE FROM payments');
    console.log('Insertion des nouveaux moyens de paiement...');
    for (const p of payments) {
      await connection.query(
        `INSERT INTO payments (user_id, method, type, last4, expiry, isDefault, order_id, created_at, updated_at, amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?)`,
        [
          p.user_id,
          p.method,
          p.type,
          p.last4,
          p.expiry,
          p.isDefault ? 1 : 0,
          p.order_id,
          0, // amount par défaut
          'enregistré' // status par défaut
        ]
      );
      console.log(`Ajouté pour user_id=${p.user_id}, order_id=${p.order_id}`);
    }
    console.log('Tous les moyens de paiement ont été insérés !');
  } catch (err) {
    console.error('Erreur lors de l\'initialisation des moyens de paiement :', err);
    throw err;
  } finally {
    if (connection) {
      await connection.end();
      console.log('Connexion fermée');
    }
  }
}

process.on('unhandledRejection', (error) => {
  console.error('Erreur non gérée:', error);
  process.exit(1);
});

initPayments(); 