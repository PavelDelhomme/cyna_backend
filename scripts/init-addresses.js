const path = require('path');
const envFile = process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env';
require('dotenv').config({ path: path.join(__dirname, '..', envFile) });
const mysql = require('mysql2/promise');
const fs = require('fs').promises;

async function initAddresses() {
  const addressesPath = path.join(__dirname, '../src/data/addresses.json');
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

    console.log('\nLecture du fichier addresses.json...');
    // Lecture du fichier JSON
    const addresses = JSON.parse(await fs.readFile(addressesPath, 'utf8'));

    // Connexion à la base de données
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    let inserted = 0;
    let errors = 0;

    for (const addr of addresses) {
      try {
        // Vérification de l'existence de l'utilisateur
        const [users] = await connection.execute(
          'SELECT id FROM users WHERE id = ?',
          [addr.user_id]
        );

        if (users.length === 0) {
          console.warn(`Utilisateur ${addr.user_id} non trouvé, adresse ignorée`);
          errors++;
          continue;
        }

        // Insertion dans la table addresses
        const [result] = await connection.execute(
          `INSERT INTO addresses (label, address1, line2, city, postalcode, region, country, is_default, user_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            addr.label || null,
            addr.line1 || addr.address1 || '',
            addr.line2 || null,
            addr.city,
            addr.postalcode || '',
            addr.region || null,
            addr.country,
            addr.isDefault || addr.is_default || false,
            addr.user_id
          ]
        );

        // Récupération (ou création) du user_profile_id correspondant
        let [userProfiles] = await connection.execute(
          'SELECT id FROM user_profiles WHERE user_id = ?',
          [addr.user_id]
        );

        if (userProfiles.length === 0) {
          // Création du profil si absent
          const [profileResult] = await connection.execute(
            'INSERT INTO user_profiles (user_id, created_at, updated_at) VALUES (?, NOW(), NOW())',
            [addr.user_id]
          );
          userProfiles = [{ id: profileResult.insertId }];
          console.log(`Profil utilisateur créé pour user_id ${addr.user_id}`);
        }

        // Insertion dans la table d'association
        await connection.execute(
          `INSERT INTO asso_addresses_user_profiles (address_id, user_profile_id, is_default)
           VALUES (?, ?, ?)`,
          [
            result.insertId,
            userProfiles[0].id,
            addr.isDefault || addr.is_default || false
          ]
        );
        inserted++;
      } catch (err) {
        console.error(`Erreur lors de l'insertion de l'adresse pour user_id ${addr.user_id} :`, err.message);
        errors++;
      }
    }
    console.log(`\n${inserted} adresses insérées avec succès !`);
    if (errors > 0) {
      console.log(`${errors} erreurs rencontrées.`);
    }
  } catch (err) {
    console.error('Erreur globale :', err);
  } finally {
    if (connection) await connection.end();
  }
}

initAddresses();
