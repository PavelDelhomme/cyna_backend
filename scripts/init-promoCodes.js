const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function initPromoCodes() {
  const codesPath = path.join(__dirname, '../src/data/promoCodes.json');
  let connection;

  try {
    // Lecture du fichier JSON
    const data = await fs.readFile(codesPath, 'utf8');
    const promoCodes = JSON.parse(data);

    // Connexion à la base de données
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'admin', // adapte selon ta config
      password: 'yourpassword', // adapte selon ta config
      database: 'cyna_database',
      port: 3307 // adapte selon ta config
    });

    // Suppression des anciens codes promo
    await connection.query('DELETE FROM promo_codes');

    // Insertion des nouveaux codes promo
    for (const code of promoCodes) {
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

    console.log('Codes promotionnels initialisés avec succès !');
  } catch (err) {
    console.error('Erreur lors de l\'initialisation des codes promo :', err);
  } finally {
    if (connection) await connection.end();
  }
}

initPromoCodes();
