const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const logger = require('./utils/logger');
const prisma = require('./config/db');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const itinerariesRoutes = require('./modules/itineraries/itineraries.routes');
const itinerariesInternalRoutes = require('./modules/itineraries/itineraries.internal.routes');
const { shareRouter, publicRouter } = require('./modules/sharing/sharing.routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

app.get('/health', async (req, res) => {
  let databaseStatus = 'connected';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    databaseStatus = 'disconnected';
  }
  res.status(200).json({ service: 'itineraries-service', status: databaseStatus === 'connected' ? 'ok' : 'degraded', database: databaseStatus });
});

app.use('/api/itineraries', itinerariesRoutes);
app.use('/api/itineraries', shareRouter);
app.use('/api/shared/itineraries', publicRouter);
app.use('/internal/itineraries', itinerariesInternalRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
