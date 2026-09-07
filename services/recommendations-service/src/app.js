const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const logger = require('./utils/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const recommendationsRoutes = require('./modules/recommendations/recommendations.routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// Stateless service: "healthy" simply means the process is up and able to serve requests.
// Its real dependencies (users/destinations/itineraries-service) are checked per-request,
// with circuit breakers protecting against their failure (see Phase 4).
app.get('/health', (req, res) => {
  res.status(200).json({ service: 'recommendations-service', status: 'ok' });
});

app.use('/api/users', recommendationsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
