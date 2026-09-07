# Deploiement - GlobeTrotter

Guide pas a pas pour mettre le projet en ligne :
- **Frontend** sur **Vercel** (ideal pour une SPA React/Vite - gratuit, deploiement en un clic).
- **Backend** sur **Railway** (supporte des services Docker qui tournent en continu + bases
  de donnees managees - ce que Vercel, plateforme "serverless", ne propose pas nativement).

> Pourquoi pas tout sur Vercel ? Notre backend est compose de 5 services Node.js qui tournent
> en permanence, plus PostgreSQL, Redis et **RabbitMQ** (une file de messages qui a besoin de
> connexions permanentes). Vercel execute du code a la demande (fonctions serverless) et ne
> propose pas d'hebergement pour RabbitMQ ni pour des conteneurs long-running : ce n'est pas
> le bon outil pour cette partie. Railway, lui, est concu exactement pour ce cas d'usage.

---

## Partie 1 - Backend sur Railway

### 1.1 Creer le projet

1. Aller sur [railway.app](https://railway.app), se connecter avec GitHub.
2. **New Project** -> **Deploy from GitHub repo** -> choisir `Jaysondjems/GlobeTrotter2026`.

### 1.2 Ajouter les bases de donnees managees

> **Limite du plan Railway : 3 volumes persistants maximum par projet.** Chaque plugin
> PostgreSQL/Redis consomme un volume. Il faut donc **une seule instance PostgreSQL partagee**
> (contenant les 3 bases, comme le fait `infra/init-db/01-create-databases.sql` en local) plutot
> que 3 instances separees - sinon Redis echoue avec `You can only have 3 volumes per project`.

1. `Add` -> `Database` -> `PostgreSQL` -> renommer en `postgres` (une seule instance).
2. Ouvrir l'onglet **Data -> Query** de ce service (ou s'y connecter en `psql` avec la chaine
   de connexion fournie) et executer :
   ```sql
   CREATE DATABASE globetrotter_destinations;
   CREATE DATABASE globetrotter_itineraries;
   ```
   (la base par defaut de Railway, ex. `railway`, sert pour `users-service`, ou en creer une
   troisieme `globetrotter_users` par coherence de nommage.)
3. `Add` -> `Database` -> `Redis`.
4. `Add` -> `Docker Image` -> image `rabbitmq:3-management-alpine` (expose les ports 5672 et
   15672). Ne pas lui attacher de volume : la persistance des messages n'est pas necessaire
   pour ce projet et cela garde le total a 2 volumes sur 3.

Le plugin PostgreSQL fournit des variables individuelles (`PGHOST`, `PGPORT`, `PGUSER`,
`PGPASSWORD`) que l'on recombine par service a l'etape suivante pour cibler la bonne base.

### 1.3 Deployer les 5 services

Pour **chacun** des dossiers `services/users-service`, `services/destinations-service`,
`services/itineraries-service`, `services/recommendations-service`, `services/api-gateway` :

1. `Add` -> `GitHub Repo` -> re-selectionner le meme depot.
2. Dans **Settings** du nouveau service : **Root Directory** = `services/<nom-du-service>`
   (Railway detecte automatiquement le `Dockerfile` present dans ce dossier).
3. Dans **Variables**, ajouter les variables d'environnement necessaires (voir tableau
   ci-dessous). Comme il n'y a plus qu'**une seule instance PostgreSQL** (`postgres`) partagee
   entre 3 services, construire `DATABASE_URL` manuellement pour cibler la bonne base :
   ```
   # users-service :
   DATABASE_URL = ${{postgres.DATABASE_URL}}

   # destinations-service :
   DATABASE_URL = postgresql://${{postgres.PGUSER}}:${{postgres.PGPASSWORD}}@${{postgres.PGHOST}}:${{postgres.PGPORT}}/globetrotter_destinations

   # itineraries-service :
   DATABASE_URL = postgresql://${{postgres.PGUSER}}:${{postgres.PGPASSWORD}}@${{postgres.PGHOST}}:${{postgres.PGPORT}}/globetrotter_itineraries
   ```
4. **Deploy**. Une fois deploye, Railway fournit une URL publique dans **Settings > Networking
   > Generate Domain** (a activer pour `api-gateway` au minimum ; pour les autres services,
   une URL interne suffit si vous utilisez le reseau prive Railway - voir note plus bas).

| Service | Root Directory | Variables cles |
|---|---|---|
| users-service | `services/users-service` | `DATABASE_URL` (postgres, db par defaut), `JWT_SECRET`, `PORT=4001` |
| destinations-service | `services/destinations-service` | `DATABASE_URL` (postgres, db `globetrotter_destinations`), `REDIS_URL`, `PORT=4002` |
| itineraries-service | `services/itineraries-service` | `DATABASE_URL` (postgres, db `globetrotter_itineraries`), `JWT_SECRET` (**identique** a users-service), `DESTINATIONS_SERVICE_URL`, `RABBITMQ_URL`, `PORT=4003` |
| recommendations-service | `services/recommendations-service` | `USERS_SERVICE_URL`, `DESTINATIONS_SERVICE_URL`, `ITINERARIES_SERVICE_URL`, `REDIS_URL`, `RABBITMQ_URL`, `PORT=4004` |
| api-gateway | `services/api-gateway` | `USERS_SERVICE_URL`, `DESTINATIONS_SERVICE_URL`, `ITINERARIES_SERVICE_URL`, `RECOMMENDATIONS_SERVICE_URL`, `PORT=3000` |

**Note reseau** : Railway relie automatiquement les services d'un meme projet via un reseau
prive (`<service>.railway.internal`). Pour `USERS_SERVICE_URL`, `DESTINATIONS_SERVICE_URL`,
etc., utiliser cette forme, par exemple `http://users-service.railway.internal:4001` -
plus rapide et gratuit (pas de trafic public) que d'utiliser les domaines publics entre services.
Seul `api-gateway` a besoin d'un domaine public (c'est lui que le frontend appellera).

### 1.4 Executer les migrations et le seed

Chaque Dockerfile lance deja `prisma migrate deploy` automatiquement au demarrage du
conteneur (voir `services/*/Dockerfile`). Pour charger les donnees de demonstration une fois
les services demarres, ouvrir un terminal Railway sur `users-service` puis :

```bash
node prisma/seed.js
```

Repeter pour `destinations-service`.

---

## Partie 2 - Frontend sur Vercel

### 2.1 Importer le projet

1. Aller sur [vercel.com](https://vercel.com), se connecter avec GitHub.
2. **Add New** -> **Project** -> selectionner `Jaysondjems/GlobeTrotter2026`.
3. **Root Directory** : cliquer sur `Edit` et choisir `frontend`.
4. Framework Preset : Vercel detecte automatiquement **Vite**.

### 2.2 Variable d'environnement

Dans **Environment Variables**, ajouter :

```
VITE_API_URL = https://<url-publique-de-votre-api-gateway-railway>
```

(l'URL generee a l'etape 1.3 pour `api-gateway`, sans `/` a la fin)

### 2.3 Deployer

Cliquer **Deploy**. Vercel construit (`npm run build`) et publie automatiquement `frontend/dist/`.
Le fichier `frontend/vercel.json` (deja present dans le depot) configure la redirection
necessaire pour que les routes React Router (`/destinations`, `/itineraries/:id`, etc.)
fonctionnent correctement au rafraichissement de page.

### 2.4 Deploiements automatiques

Par defaut, Vercel redeploiera automatiquement le frontend a chaque `git push` sur `main`.
Faire de meme cote Railway (active par defaut) pour le backend.

---

## Recapitulatif des URLs a la fin

- Frontend : `https://<votre-projet>.vercel.app`
- Backend (point d'entree) : `https://<api-gateway>.up.railway.app`
- RabbitMQ Management UI (optionnel, debogage) : URL publique du service RabbitMQ, port 15672
