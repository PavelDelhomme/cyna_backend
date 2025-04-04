console.log('Server is Running');

const express = require('express');
const app = express();
const PORT = 3006;

// Middleware pour parser le JSON
app.use(express.json());

// Logger HTTP
const morgan = require('morgan');
app.use(morgan('tiny'));

// Sécurité avec Helmet
const helmet = require('helmet');
app.use(helmet());

// Prisma pour la base de données
const prisma = require('./utils/db');

// Liste des IPs à bloquer
const IPtoBlackList = [];

// ** Middleware: Blacklist des IPs **
function blacklistIP(req, res, next) {
    console.log(`IP: ${req.ip}`);
    if (IPtoBlackList.includes(req.ip)) {
        return res.status(403).json({ error: "You are BlackListed" });
    }
    next();
}

// ** Middleware: Modifier l'en-tête serveur **
function hideServerType(req, res, next) {
    res.setHeader('X-Powered-By', 'Raphael');
    next();
}

// ** Middleware: Logger des requêtes **
function requestsLogging(req, res, next) {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
}

// ** Authentification Basique **
const ADMIN_USER = {
    firstname: 'Admin',
    lastname: 'AdminLN',
    username: 'raphael',
    password: 'cynaPasswordAPI',
};


// Appliquer les middlewares globaux
app.use(blacklistIP);
app.use(hideServerType);
app.use(requestsLogging);

const authMiddleWare = require('./middlewares/authMiddleware');

// ** Charger les routes utilisateur **
const usersRoutes = require('./controllers/userController');

app.use('/users', usersRoutes);  // Prefixe "/api" 

// ** Route principale **
app.get('/', (req, res) => {
    res.send("API Cyna V1");
});

// ** Lancer le serveur **
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
