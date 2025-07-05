FROM node:20.18.2-alpine

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Définit l'argument pour l'initialisation
ARG INIT_DB=false

RUN apk add --no-cache python3 make g++ bash

# Copie les fichiers de configuration
COPY package*.json ./
COPY .env* ./

# Installe les dépendances
RUN npm install --force --include=dev

# Copie tout le contenu du projet
COPY . .

# Expose le port défini dans l'environnement ou 3000 par défaut
EXPOSE ${SERVER_PORT:-3000}

# Ajoute le script wait-for-it
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Commande pour démarrer l'application
CMD ["bash", "-c", "/wait-for-it.sh cyna_db:3306 --timeout=30 --strict -- bash -c 'if [ \"$INIT_DB\" = \"true\" ]; then node ./scripts/init-all.js; fi && npm run start'"]
