const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./config/swagger');
const logger = require('./utils/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const healthRoutes = require('./modules/health/health.routes');
const authRoutes = require('./modules/auth/auth.routes');
const usersRoutes = require('./modules/users/users.routes');
const recommendationsRoutes = require('./modules/recommendations/recommendations.routes');
const destinationsRoutes = require('./modules/destinations/destinations.routes');
const itinerariesRoutes = require('./modules/itineraries/itineraries.routes');
const { shareRouter, publicRouter } = require('./modules/sharing/sharing.routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

app.use('/health', healthRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/users', recommendationsRoutes); // adds GET /api/users/:id/recommendations
app.use('/api/destinations', destinationsRoutes);
app.use('/api/itineraries', itinerariesRoutes);
app.use('/api/itineraries', shareRouter); // adds POST /api/itineraries/:id/share
app.use('/api/shared/itineraries', publicRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
