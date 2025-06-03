const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function initCategories() {
  const categoriesPath = path.join(__dirname, '../src/data/productCategories.json');
  let connection;

  try {
    // Lecture du fichier JSON
    const data = await fs.readFile(categoriesPath, 'utf8');
    const categories = JSON.parse(data);

    // Connexion à la base de données
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'admin', 
      password: 'yourpassword',
      database: 'cyna_database',
      port: 3307 
    });

    // Suppression des anciennes catégories
    await connection.query('DELETE FROM product_categories');

    // Insertion des nouvelles catégories
    for (const cat of categories) {
      await connection.query(
        'INSERT INTO product_categories (id, name, description) VALUES (?, ?, ?)',
        [cat.id, cat.name, cat.description]
      );
    }

    console.log('Catégories initialisées avec succès !');
  } catch (err) {
    console.error('Erreur lors de l\'initialisation des catégories :', err);
  } finally {
    if (connection) await connection.end();
  }
}

initCategories();
