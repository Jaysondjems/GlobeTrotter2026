const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const logger = require('./utils/logger');
const prisma = require('./config/db');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const destinationsRoutes = require('./modules/destinations/destinations.routes');
const destinationsInternalRoutes = require('./modules/destinations/destinations.internal.routes');

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
  res.status(200).json({ service: 'destinations-service', status: databaseStatus === 'connected' ? 'ok' : 'degraded', database: databaseStatus });
});

app.use('/api/destinations', destinationsRoutes);
app.use('/internal/destinations', destinationsInternalRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
