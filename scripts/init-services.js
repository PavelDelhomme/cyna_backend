const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function initServices() {
  const servicesPath = path.join(__dirname, '../src/data/services.json');
  let connection;

  try {
    // Lecture du fichier JSON
    const data = await fs.readFile(servicesPath, 'utf8');
    const services = JSON.parse(data);

    // Connexion à la base de données
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'admin', // adapte selon ta config
      password: 'yourpassword', // adapte selon ta config
      database: 'cyna_database',
      port: 3307 // adapte selon ta config
    });

    // Suppression des anciens services
    await connection.query('DELETE FROM services');

    // Insertion des nouveaux services
    for (const svc of services) {
      await connection.query(
        `INSERT INTO services (
          id, name, description, status, price, subscription, subscriptiontype, usercount, promotion, service_type_id, promo_code_id, image
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          svc.id,
          svc.name,
          svc.description,
          svc.status,
          svc.price,
          svc.subscription,
          svc.subscriptiontype,
          svc.usercount,
          svc.promotion,
          svc.service_type_id,
          svc.promo_code_id,
          svc.image
        ]
      );
    }

    console.log('Services initialisés avec succès !');
  } catch (err) {
    console.error('Erreur lors de l\'initialisation des services :', err);
  } finally {
    if (connection) await connection.end();
  }
}

initServices();
