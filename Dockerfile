FROM node:20.18.2

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers de configuration
COPY package*.json ./
COPY .env ./

# Installe les dépendances
RUN npm install

# Copie tout le contenu du projet
COPY . .

# Expose le port défini dans l'environnement ou 3000 par défaut
EXPOSE ${SERVER_PORT:-3000}

# Commande pour démarrer l'application
CMD ["npm", "run", "dev"]
