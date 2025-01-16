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

 