const path = require('path');
const envFile = process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env';
require('dotenv').config({ path: path.join(__dirname, '..', envFile) });
const mysql = require('mysql2/promise');
const fs = require('fs').promises;

async function initTeam() {
  const teamPath = path.join(__dirname, '../src/data/team.json');
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

    console.log('\nLecture du fichier team.json...');
    // Lecture du fichier JSON
    const data = await fs.readFile(teamPath, 'utf8');
    const team = JSON.parse(data);
    console.log('Données de l\'équipe chargées:', team);

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

      console.log('\nSuppression des anciens membres de l\'équipe...');
      await connection.query('DELETE FROM team_members');
      console.log('Anciens membres supprimés');

      console.log('\nInsertion des nouveaux membres...');
      for (const member of team) {
        console.log('Insertion du membre:', member);
        await connection.query(
          `INSERT INTO team_members (id, name, role, avatar, description) VALUES (?, ?, ?, ?, ?)`,
          [member.id, member.name, member.role, member.avatar, member.description]
        );
      }

      console.log('\nRéactivation des contraintes de clé étrangère...');
      await connection.query('SET FOREIGN_KEY_CHECKS = 1');
      console.log('Contraintes réactivées');

      console.log('Membres de l\'équipe initialisés avec succès !');
    } catch (dbError) {
      console.error('Erreur de base de données:', dbError);
      throw dbError;
    }
  } catch (err) {
    console.error('Erreur lors de l\'initialisation de l\'équipe :', err);
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

initTeam();