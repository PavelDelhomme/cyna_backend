#CYNA Backend


# Spécifications
1. Front-end : React
2. Backend : Express.js
 

1.	Gestion des entités principales : 

•	Produits/services SaaS (SOC, EDR, XDR). 

•	Utilisateurs (inscriptions, connexions, rôles). 

•	Commandes et abonnements (historique, renouvellement, suivi). 

•	Paiements sécurisés et traçabilité des transactions. 

2.	Scalabilité et performances : 

•	Capacité à gérer un nombre croissant d’utilisateurs et de commandes. 

•	Support pour des requêtes complexes (ex. recherche avancée). 

3.	Sécurité : 

•	Stockage sécurisé des données sensibles (mots de passe, paiements). 

•	Conformité aux normes de protection des données (ex. RGPD). 

4.	Flexibilité : 

•	Structure facilement extensible pour ajouter de nouvelles fonctionnalités (nouveaux services, options d’abonnement). 

 

. PostgreSQL (Relationnelle) 

 

Description : Base de données relationnelle robuste avec un excellent support pour les relations complexes entre entités. 

 

Avantages : 

•	Modèle relationnel structuré : 

•	Idéal pour les relations entre utilisateurs, commandes, abonnements et paiements. 

•	SQL puissant : 

•	Gestion avancée des requêtes (ex. tri par facettes pour la recherche de produits). 

•	Extensibilité : 

•	Support pour des types JSON pour combiner structure relationnelle et flexibilité NoSQL. 

•	Sécurité intégrée : 

•	Chiffrement des données en transit (SSL/TLS). 

•	Support large : 

•	Compatibilité avec des ORM comme Sequelize (Express.js). 

 

Limites : 

•	Complexité de gestion si les relations sont trop imbriquées. 

 

Cas d’utilisation : 

•	Idéal si l’on souhaite un contrôle rigoureux des relations entre les entités (ex. un utilisateur peut avoir plusieurs commandes liées à des produits distincts). 

 

MongoDB (NoSQL, Documentaire) 

 

Description : Base de données orientée documents, idéale pour des données non structurées ou semi-structurées. 

 

Avantages : 

•	Flexibilité des schémas : 

•	Permet de stocker des documents JSON, idéal pour des entités qui peuvent évoluer (produits, services). 

•	Performance : 

•	Rapide pour des requêtes sur des ensembles de données volumineux. 

•	Scalabilité horizontale : 

•	Facile à étendre pour gérer de grandes charges. 

•	Intégration native avec Node.js/Express.js : 

•	Compatible avec des bibliothèques comme Mongoose pour une gestion simplifiée. 

 

Limites : 

•	Moins adapté si les relations complexes entre les entités sont essentielles (par exemple, relations croisées entre utilisateurs et commandes). 

 

Cas d’utilisation : 

•	Idéal pour un projet nécessitant une grande flexibilité, comme un système e-commerce où les données des produits et des utilisateurs évoluent souvent. 

 
 # Procédure pour recréer un utilisateur test

 ## 1. Se connecter avec un compte *Admin*

• Appeler la route:
    • *Méthode*: `GET`
    • *URL*: `http://localhost:3000/api/auth/dev-admin`
    • (Si besoin de recréer l'admin)
    • Copier le `token` admin dans Postman pour le prochaines requêtes (`Authorization: Bearer <token>`)

## 2. Créer un *nouvel utilisateur* via `/api/auth/signup`

• *Méthode* : `POST`
• *URL*: `http://localhost:3000/api/auth/signup`
• **Body JSON**:
```json
{
    "name": "Test User",
    "email": "test@example.com",
    "password": "secure123"
}
```

• ✅ Cela crée automatiquement :
    • 1 utilisateur (`users`)
    • 1 `UserProfile` associé (`user_profiles`)

## 3. Vérifier que le nouvel utilisateur existe

• Appeler : `http://localhost:3000/api/dev/users`
• (⚠️ Avec le token **admin**)

Il doit y avoir :
```json
[
    {"id": 1, "name": "Admin Dev", ...},
    {"id": 2, "name": "Test User", ...}
]
```

## 4. Ajouter une adresse au *User ID 2*
• *Méthode* : `POST`
• *URL* : `http://localhost:3000/api/dev/addresses/2`

Et dans le contenu de la requete POST : 

```json
{
    "address1": "22 rue des Développeurs",
    "city": "Paris",
    "postalCode": "75012",
    "region": "Île-de-France",
    "country": "France",
    "type": "principal"
}
```

• ✅ Cela crée :
    • 1 adresse (`addresses`)
    • 1 liaison (`address_user_profiles`)


## 5. Vérifier que l'utilisateur peut voir ses adresses

• *Méthode* : `GET`
• *URL* : `http://localhost:3000/api/addresses/me`
• (⚠️ Avec le token **de l'utilisateur Test User**)

---


# 🚀 Résumé rapide

| Action | Méthode | URL | Token |
|:------|:--------|:----|:------|
| Créer utilisateur test | POST | `/api/auth/signup` | Aucun |
| Lister users | GET | `/api/dev/users` | Admin |
| Ajouter adresse user | POST | `/api/dev/addresses/2` | Admin |
| Voir ses adresses | GET | `/api/addresses/me` | User |

---

# ✨ Notes importantes
- **NE PAS faire `docker compose down -v`** sinon tu perds toutes les données ❌.
- Si tu perds les users ➔ recommence avec `/api/auth/dev-admin` + `/api/auth/signup`.
- **Admin gère tout** via `/api/dev/...` et **User gère ses trucs persos** via `/api/addresses/me`, `/api/users/me`, etc.

---