const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function initServiceTypes() {
  const typesPath = path.join(__dirname, '../src/data/serviceTypes.json');
  let connection;

  try {
    // Lecture du fichier JSON
    const data = await fs.readFile(typesPath, 'utf8');
    const serviceTypes = JSON.parse(data);

    // Connexion à la base de données
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'admin', // adapte selon ta config
      password: 'yourpassword', // adapte selon ta config
      database: 'cyna_database',
      port: 3307 // adapte selon ta config
    });

    // Suppression des anciens types de services
    await connection.query('DELETE FROM service_types');

    // Insertion des nouveaux types de services
    for (const type of serviceTypes) {
      await connection.query(
        'INSERT INTO service_types (id, name, description) VALUES (?, ?, ?)',
        [type.id, type.name, type.description]
      );
    }

    console.log('Types de services initialisés avec succès !');
  } catch (err) {
    console.error('Erreur lors de l\'initialisation des types de services :', err);
  } finally {
    if (connection) await connection.end();
  }
}

initServiceTypes();
