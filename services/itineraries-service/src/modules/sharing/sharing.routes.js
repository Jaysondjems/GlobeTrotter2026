const { Router } = require('express');
const controller = require('./sharing.controller');
const { authenticate } = require('../../middleware/auth');

// Mounted at /api/itineraries - protected (owner-only).
const shareRouter = Router();
shareRouter.post('/:id/share', authenticate, controller.share);

// Mounted at /api/shared/itineraries - public, no auth required.
const publicRouter = Router();
publicRouter.get('/:shareToken', controller.getShared);

module.exports = { shareRouter, publicRouter };
