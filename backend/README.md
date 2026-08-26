# GlobeTrotter Travel Assistant — Backend (Phase 1: Monolith)

## 1. Présentation

**GlobeTrotter Travel Assistant** est une application de recommandation et de gestion de voyages.
Cette Phase 1 livre un **backend monolithique** exposant une API REST permettant de :

- rechercher des destinations et obtenir des recommandations personnalisées ;
- créer, consulter, modifier et supprimer des itinéraires de voyage ;
- partager un itinéraire via un lien public.

## 2. Objectif de la Phase 1

Construire une première version fonctionnelle du produit sous forme d'une **application monolithique unique** (un seul backend Node.js, une seule base de données), tout en organisant le code par domaine métier afin de faciliter une future décomposition en microservices (Phase 2).

## 3. Technologies utilisées

| Technologie | Rôle |
|---|---|
| Node.js + Express.js | Serveur HTTP et API REST |
| PostgreSQL | Base de données relationnelle |
| Prisma ORM | Modélisation, migrations et requêtes vers PostgreSQL |
| JWT (jsonwebtoken) + bcrypt | Authentification et hachage des mots de passe |
| Swagger (swagger-jsdoc, swagger-ui-express) | Documentation interactive de l'API |
| Jest + Supertest | Tests automatisés |
| Helmet, CORS | Sécurité HTTP de base |

## 4. Installation

### Prérequis

- Node.js ≥ 18
- PostgreSQL ≥ 14

### Étapes

```bash
# 1. Installer les dépendances
cd backend
npm install

# 2. Configurer les variables d'environnement
cp .env.example .env
# éditer .env et renseigner DATABASE_URL et JWT_SECRET

# 3. Créer la base de données PostgreSQL (si elle n'existe pas)
#    ex. via psql : CREATE DATABASE globetrotter;

# 4. Appliquer les migrations Prisma
npm run prisma:migrate

# 5. Générer le client Prisma (fait automatiquement par migrate, sinon :)
npm run prisma:generate

# 6. Charger les données de démonstration
npm run seed

# 7. Démarrer le serveur
npm start
# ou en mode watch :
npm run dev
```

Le serveur démarre par défaut sur `http://localhost:3000`.

## 5. API

Toutes les réponses suivent le format :

```json
{ "success": true, "data": { } }
```

ou en cas d'erreur :

```json
{ "success": false, "error": { "code": "RESOURCE_NOT_FOUND", "message": "Destination not found" } }
```

### Endpoints principaux

| Domaine | Endpoint | Auth requise |
|---|---|---|
| Health | `GET /health` | non |
| Auth | `POST /api/auth/register` | non |
| Auth | `POST /api/auth/login` | non |
| Users | `GET/POST /api/users`, `GET/PUT/DELETE /api/users/:id` | non |
| Destinations | `GET/POST /api/destinations`, `GET/PUT/DELETE /api/destinations/:id` | non |
| Recommendations | `GET /api/users/:id/recommendations` | non |
| Itineraries | `GET/POST /api/itineraries`, `GET/PUT/DELETE /api/itineraries/:id` | **oui (JWT)** |
| Itinerary items | `POST /api/itineraries/:id/items`, `PUT/DELETE /api/itineraries/:id/items/:itemId` | **oui (JWT)** |
| Sharing | `POST /api/itineraries/:id/share` | **oui (JWT)** |
| Sharing | `GET /api/shared/itineraries/:shareToken` | non |

Pour les routes protégées, envoyer l'en-tête :

```
Authorization: Bearer <token>
```

(le token est obtenu via `POST /api/auth/register` ou `POST /api/auth/login`)

### Exemples de requêtes

```bash
# Rechercher des destinations "plage" au Canada, budget entre 500 et 2000
curl "http://localhost:3000/api/destinations?category=beach&minBudget=500&maxBudget=2000"

# S'inscrire
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Alice","lastName":"Martin","email":"alice@test.com","password":"secret123"}'

# Créer un itinéraire (avec le token reçu ci-dessus)
curl -X POST http://localhost:3000/api/itineraries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"Trip to Bali","startDate":"2026-06-01","endDate":"2026-06-10"}'
```

## 6. Tests

```bash
npm test
```

Les tests (Jest + Supertest) s'exécutent contre une vraie base PostgreSQL définie par `DATABASE_URL` : chaque suite crée ses propres données de test (emails uniques) et les supprime dans `afterAll`, sans dépendre des données de seed.

## 7. Swagger

Documentation interactive disponible une fois le serveur démarré :

```
http://localhost:3000/api-docs
```

## 8. Structure du projet

```
backend/
├── src/
│   ├── config/       # env, connexion Prisma, config Swagger
│   ├── modules/      # un dossier par domaine métier (users, auth, destinations,
│   │                 # recommendations, itineraries, sharing, health)
│   │   └── <module>/ # controller · service · repository · routes · validation
│   ├── middleware/    # auth (JWT), validation, gestion d'erreurs
│   ├── utils/         # logger, réponses API, pagination, erreurs typées
│   ├── app.js          # assemblage Express (middlewares + routes)
│   └── server.js       # démarrage du serveur
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── tests/
└── docs/PHASE1_EXPLANATION.md   # document académique complet (à la racine du dépôt)
```

## Note

Une vulnérabilité connue dans une dépendance transitive de compilation native de `bcrypt` (`tar`, via `@mapbox/node-pre-gyp`) est signalée par `npm audit`. Elle n'affecte que l'étape de build/installation, pas le code exécuté en production, et ne dispose pas encore de correctif publié sans casser `bcrypt`.
