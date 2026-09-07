# GlobeTrotter - Kubernetes local (Phase 3)

Ces manifests deploient toute la stack (Postgres, Redis, RabbitMQ, les 4 microservices et
l'API gateway) sur un cluster Kubernetes **local** (minikube ou kind), pour demontrer la
conteneurisation, le load balancing et l'auto-scaling sans compte cloud ni frais.

## Prerequis

- Docker Desktop
- [minikube](https://minikube.sigs.k8s.io/) (ou kind)
- kubectl

## 1. Demarrer le cluster local

```bash
minikube start
```

## 2. Construire les images directement dans le cluster

minikube a son propre daemon Docker, distinct de celui de votre machine. Pour que les
Deployments (configures avec `imagePullPolicy: Never`) trouvent les images, il faut les
construire a l'interieur de l'environnement Docker de minikube :

```bash
eval $(minikube docker-env)   # PowerShell : & minikube -p minikube docker-env | Invoke-Expression

docker build -t globetrotter/users-service:latest ../../services/users-service
docker build -t globetrotter/destinations-service:latest ../../services/destinations-service
docker build -t globetrotter/itineraries-service:latest ../../services/itineraries-service
docker build -t globetrotter/recommendations-service:latest ../../services/recommendations-service
docker build -t globetrotter/api-gateway:latest ../../services/api-gateway
```

## 3. Appliquer les manifests

```bash
kubectl apply -f .
```

Verifier que tout demarre :

```bash
kubectl get pods -n globetrotter -w
```

## 4. Acceder a l'API

```bash
minikube service api-gateway -n globetrotter --url
```

Cette URL pointe vers le Service `api-gateway` (type NodePort), qui repartit automatiquement
le trafic entre les pods `api-gateway` (2 replicas par defaut) - c'est le **load balancing**
Kubernetes en action.

## 5. Demontrer le load balancing

```bash
kubectl get pods -n globetrotter -l app=destinations-service
# Faire plusieurs requetes vers /api/destinations et observer, via les logs de chaque pod
# (kubectl logs <pod>), que les requetes sont reparties entre les replicas.
```

## 6. Demontrer le scaling manuel

```bash
kubectl scale deployment destinations-service -n globetrotter --replicas=5
kubectl get pods -n globetrotter -l app=destinations-service
```

## 7. Demontrer l'auto-scaling (HPA)

Un `HorizontalPodAutoscaler` est deja configure pour `destinations-service` et `api-gateway`
(2 a 6 replicas, cible 50% CPU). Pour l'observer reagir a de la charge :

```bash
kubectl get hpa -n globetrotter -w

# Dans un autre terminal, generer de la charge (necessite le pod "busybox" ci-dessous) :
kubectl run load-generator -n globetrotter --image=busybox --restart=Never -- \
  /bin/sh -c "while true; do wget -q -O- http://destinations-service:4002/api/destinations; done"
```

Observer dans `kubectl get hpa -n globetrotter -w` le nombre de replicas augmenter avec la
charge, puis redescendre une fois `load-generator` supprime (`kubectl delete pod load-generator -n globetrotter`).

## 8. Nettoyer

```bash
kubectl delete namespace globetrotter
minikube stop
```

## Note pedagogique

Cette configuration reste volontairement simple pour un cluster local a un seul noeud :
un seul pod Postgres (pas de replication), des secrets en clair dans `01-config-secret.yaml`
(a remplacer par un vrai gestionnaire de secrets en production), et des seuils de HPA bas
pour pouvoir declencher l'auto-scaling facilement en demonstration. Un vrai deploiement
cloud (Phase 3 "grandeur nature") ajouterait : un Ingress avec TLS, un registre d'images
(ECR/GCR/ACR) au lieu d'images locales, une base managee (RDS/Cloud SQL), et des sondes/
limites de ressources ajustees a la charge reelle.
