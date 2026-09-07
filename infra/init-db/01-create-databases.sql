-- Runs automatically on first startup of the postgres container (docker-entrypoint-initdb.d).
-- Implements "database per service": each microservice owns its own database.
CREATE DATABASE globetrotter_users;
CREATE DATABASE globetrotter_destinations;
CREATE DATABASE globetrotter_itineraries;
