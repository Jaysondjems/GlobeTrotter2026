# GlobeTrotter Travel Assistant

Projet de semestre en 4 phases : Monolithe -> Microservices -> Cloud Deployment -> Resilience.

**Documentation complete (les 4 phases, installation, demonstration) :**
[`docs/GLOBETROTTER_EXPLANATION.docx`](docs/GLOBETROTTER_EXPLANATION.docx)

## Demarrage rapide (Phases 2 a 4 - recommande)

```bash
cd infra
docker compose up --build
curl http://localhost:3000/health
```

## Structure du depot

```
backend/    Phase 1 - monolithe Node.js/Express (conserve pour reference)
services/   Phase 2 - microservices (api-gateway, users, destinations, itineraries, recommendations)
infra/      Phase 3 - docker-compose.yml et manifests Kubernetes (infra/k8s/)
docs/       Document explicatif complet des 4 phases
```

Voir `docs/GLOBETROTTER_EXPLANATION.docx` pour tous les details : architecture, choix
techniques, installation pas a pas, et scenarios de demonstration pour chaque phase.
