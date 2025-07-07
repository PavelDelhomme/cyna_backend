const path = require('path');
const envFile = process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env';
require('dotenv').config({ path: path.join(__dirname, '..', envFile) });
const mysql = require('mysql2/promise');
const fs = require('fs').promises;

async function initServiceTypes() {
  const typesPath = path.join(__dirname, '../src/data/serviceTypes.json');
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

    console.log('\nLecture du fichier serviceTypes.json...');
    // Lecture du fichier JSON
    const data = await fs.readFile(typesPath, 'utf8');
    const serviceTypes = JSON.parse(data);
    console.log('Données des types de services chargées:', serviceTypes);

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

      console.log('\nSuppression des anciens types de services...');
      await connection.query('DELETE FROM service_types');
      console.log('Anciens types supprimés');

      console.log('\nInsertion des nouveaux types de services...');
      for (const type of serviceTypes) {
        console.log('Insertion du type:', type);
        await connection.query(
          'INSERT INTO service_types (id, name, description) VALUES (?, ?, ?)',
          [type.id, type.name, type.description]
        );
      }

      console.log('Types de services initialisés avec succès !');
    } catch (dbError) {
      console.error('Erreur de base de données:', dbError);
      throw dbError;
    }
  } catch (err) {
    console.error('Erreur lors de l\'initialisation des types de services :', err);
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

initServiceTypes();
