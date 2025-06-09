const path = require('path');
const { Sequelize } = require('sequelize');

const scripts = [
  'init-database.js',      // Création de la structure de la base de données
  'init-roles.js',         // Création des rôles (nécessaire pour les utilisateurs)
  'init-users.js',         // Création des utilisateurs (dépend des rôles)
  'init-userProfiles.js',  // Création des profils (dépend des utilisateurs)
  'init-serviceTypes.js',  // Création des types de services (nécessaire pour les services)
  'init-categories.js',    // Création des catégories (nécessaire pour les produits)
  'init-promoCodes.js',    // Création des codes promo (doit être avant les produits)
  'init-products.js',      // Création des produits (dépend des catégories et codes promo)
  'init-services.js',      // Création des services (dépend des types de services)
  'init-orders.js',        // Création des commandes (dépend des paniers)
  'init-team.js',          // Création de l'équipe (pas de dépendances)
  'init-carousel.js',      // Création du carousel (dépend des produits et services)
  'init-payments.js',      // Création des paiements (dépend des commandes)
  'init-addresses.js'      // Création des adresses (dépend des utilisateurs)
];

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function isAlreadyInitialized() {
  // Vérifie si la table 'products' existe
  const [tables] = await sequelize.query("SHOW TABLES LIKE 'products'");
  if (tables.length === 0) {
    console.log("La table 'products' n'existe pas encore.");
    return false;
  }
  // Si elle existe, on peut compter
  const [results] = await sequelize.query('SELECT COUNT(*) as count FROM products');
  return results[0].count > 0;
}

async function runScript(script) {
  const scriptPath = path.join(__dirname, script);
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🚀 Exécution de ${script}`);
  console.log(`${'='.repeat(80)}`);
  
  try {
    console.log(`📝 Chemin du script : ${scriptPath}`);
    console.log('⏳ Démarrage de l\'exécution...');
    
    const startTime = Date.now();
    // Au lieu d'utiliser execSync, on require le script
    require(scriptPath);
    const endTime = Date.now();
    
    console.log(`\n✅ ${script} terminé avec succès en ${(endTime - startTime) / 1000} secondes`);
    console.log('⏳ Attente de 1 seconde avant le prochain script...');
    await sleep(1000);
    return true;
  } catch (err) {
    console.error(`\n❌ Erreur lors de l'exécution de ${script} :`);
    console.error('Message d\'erreur:', err.message);
    console.error('Détails de l\'erreur:', err);
    console.error('Stack trace:', err.stack);
    return false;
  }
}

async function runAllScripts() {
  console.log('\n' + '='.repeat(80));
  console.log('🚀 DÉMARRAGE DE L\'INITIALISATION COMPLÈTE');
  console.log('='.repeat(80));
  
  const results = {
    success: [],
    failed: []
  };

  if (await isAlreadyInitialized()) {
    console.log('La base est déjà initialisée, on ne fait rien.');
    process.exit(0);
  }

  for (const script of scripts) {
    const success = await runScript(script);
    if (success) {
      results.success.push(script);
    } else {
      results.failed.push(script);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('📊 RÉSUMÉ DE L\'INITIALISATION');
  console.log('='.repeat(80));
  
  console.log('\n✅ Scripts réussis :', results.success.length);
  results.success.forEach(script => console.log(`   - ${script}`));
  
  if (results.failed.length > 0) {
    console.log('\n❌ Scripts en échec :', results.failed.length);
    results.failed.forEach(script => console.log(`   - ${script}`));
    console.log('\n⚠️ ATTENTION : Certains scripts ont échoué. Vérifiez les erreurs ci-dessus.');
    process.exit(1);
  } else {
    console.log('\n✨ INITIALISATION COMPLÈTE TERMINÉE AVEC SUCCÈS !');
  }
}

// Gestion des erreurs non capturées
process.on('unhandledRejection', (error) => {
  console.error('❌ Erreur non gérée:', error);
  process.exit(1);
});

runAllScripts();
