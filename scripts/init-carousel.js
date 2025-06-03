const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function initCarousel() {
  const carouselPath = path.join(__dirname, '../src/data/carousel.json');
  let connection;

  try {
    // Lecture du fichier JSON
    const data = await fs.readFile(carouselPath, 'utf8');
    const items = JSON.parse(data);

    // Connexion à la base de données
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'admin', // adapte selon ta config
      password: 'yourpassword', // adapte selon ta config
      database: 'cyna_database',
      port: 3307 // adapte selon ta config
    });

    // Suppression des anciens éléments du carrousel
    await connection.query('DELETE FROM carousel_items');

    // Insertion des nouveaux éléments
    for (const item of items) {
      await connection.query(
        `INSERT INTO carousel_items (product_id, service_id, \`order\`) VALUES (?, ?, ?)`,
        [
          item.product_id || null,
          item.service_id || null,
          item.order
        ]
      );
    }

    console.log('Carrousel initialisé avec succès !');
  } catch (err) {
    console.error('Erreur lors de l\'initialisation du carrousel :', err);
  } finally {
    if (connection) await connection.end();
  }
}

initCarousel();
