FROM node:20.18.2

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*


# Copie les fichiers de configuration
COPY package*.json ./
COPY .env* ./

# Installe les dépendances
RUN npm install --force --include=dev

# Copie tout le contenu du projet
COPY . .

# Expose le port défini dans l'environnement ou 3000 par défaut
EXPOSE ${SERVER_PORT:-3000}

# Commande pour démarrer l'application
CMD ["npm", "run", "dev"]
