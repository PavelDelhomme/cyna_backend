const path = require('path');
const envFile = process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env';
require('dotenv').config({ path: path.join(__dirname, '..', envFile) });
const mysql = require('mysql2/promise');
const fs = require('fs').promises;

async function initRoles() {
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

    // Lecture du fichier de données
    console.log('\nLecture du fichier roles.json...');
    const rolesPath = path.join(__dirname, 'data', 'roles.json');
    const rolesData = JSON.parse(await fs.readFile(rolesPath, 'utf8'));
    console.log('\nDonnées des rôles chargées:', rolesData);

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

    // Vérifier si la table existe
    const [tables] = await connection.query("SHOW TABLES LIKE 'roles'");
    const tableExists = tables.length > 0;

    if (!tableExists) {
      console.log('\nCréation de la table roles...');
      await connection.query(`
        CREATE TABLE roles (
          id INT PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(255) NOT NULL UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('Table roles créée avec succès');
    } else {
      console.log('\nDésactivation des contraintes de clé étrangère...');
      await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
      console.log('Contraintes désactivées');

      console.log('\nSuppression des anciens rôles...');
      await connection.query('DELETE FROM roles');
      console.log('Anciens rôles supprimés');
    }

    // Insertion des nouveaux rôles
    console.log('\nInsertion des nouveaux rôles...');
    for (const role of rolesData) {
      await connection.query('INSERT INTO roles (id, name) VALUES (?, ?)', [role.id, role.name]);
    }
    console.log('Nouveaux rôles insérés avec succès');

    // Réactivation des contraintes
    console.log('\nRéactivation des contraintes de clé étrangère...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log('Contraintes réactivées');

    console.log('\n✅ Initialisation des rôles terminée avec succès !');

  } catch (err) {
    console.error('\nErreur lors de l\'initialisation des rôles :', err);
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

initRoles();
