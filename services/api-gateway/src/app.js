const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const axios = require('axios');
const httpProxy = require('http-proxy');

const env = require('./config/env');
const logger = require('./utils/logger');

const proxy = httpProxy.createProxyServer({ changeOrigin: true });
proxy.on('error', (err, req, res) => {
  logger.error(`Proxy error for ${req.originalUrl}: ${err.message}`);
  if (!res.headersSent) {
    res.status(502).json({ success: false, error: { code: 'BAD_GATEWAY', message: 'Upstream service unavailable' } });
  }
});

const app = express();

// IMPORTANT: no express.json() here - the gateway must forward the raw, unconsumed
// request body to the target service. Parsing it here would leave nothing to proxy.
app.use(helmet());
app.use(cors());

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

const SERVICES = {
  users: env.usersServiceUrl,
  destinations: env.destinationsServiceUrl,
  itineraries: env.itinerariesServiceUrl,
  recommendations: env.recommendationsServiceUrl,
};

app.get('/health', async (req, res) => {
  const checks = await Promise.allSettled(
    Object.entries(SERVICES).map(async ([name, baseUrl]) => {
      const { data } = await axios.get(`${baseUrl}/health`, { timeout: 1500 });
      return [name, data];
    })
  );

  const services = {};
  let allOk = true;
  checks.forEach((result, index) => {
    const name = Object.keys(SERVICES)[index];
    if (result.status === 'fulfilled') {
      services[name] = result.value[1];
      if (result.value[1].status !== 'ok') allOk = false;
    } else {
      services[name] = { status: 'unreachable' };
      allOk = false;
    }
  });

  res.status(200).json({ service: 'api-gateway', status: allOk ? 'ok' : 'degraded', services });
});

// Routing table: which downstream service owns which URL prefix.
// The recommendations route must be checked before the generic /api/users prefix.
function resolveTarget(path) {
  if (/^\/api\/users\/[^/]+\/recommendations(\/|$|\?)/.test(path)) return SERVICES.recommendations;
  if (path.startsWith('/api/auth') || path.startsWith('/api/users')) return SERVICES.users;
  if (path.startsWith('/api/destinations')) return SERVICES.destinations;
  if (path.startsWith('/api/itineraries') || path.startsWith('/api/shared/itineraries')) return SERVICES.itineraries;
  return null;
}

app.use((req, res) => {
  const target = resolveTarget(req.path);
  if (!target) {
    return res.status(404).json({
      success: false,
      error: { code: 'ROUTE_NOT_FOUND', message: `No service registered for ${req.method} ${req.path}` },
    });
  }
  proxy.web(req, res, { target });
});

module.exports = app;
