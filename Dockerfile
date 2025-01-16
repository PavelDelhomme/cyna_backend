# Utilise une image Node.js officielle
FROM node:18

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers de configuration
COPY package*.json ./
COPY .env ./

# Installe les dépendances
RUN npm install

# Copie tout le contenu du projet
COPY . .

# Expose le port 3000
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]
