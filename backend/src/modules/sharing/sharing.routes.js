const { Router } = require('express');
const controller = require('./sharing.controller');
const { authenticate } = require('../../middleware/auth');

// Mounted at /api/itineraries - protected (owner-only).
const shareRouter = Router();

/**
 * @swagger
 * /api/itineraries/{id}/share:
 *   post:
 *     summary: Generate (or retrieve) a public share token for an itinerary
 *     tags: [Sharing]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201: { description: Share token generated }
 *       404: { description: Itinerary not found }
 */
shareRouter.post('/:id/share', authenticate, controller.share);

// Mounted at /api/shared/itineraries - public, no auth required.
const publicRouter = Router();

/**
 * @swagger
 * /api/shared/itineraries/{shareToken}:
 *   get:
 *     summary: View a publicly shared itinerary
 *     tags: [Sharing]
 *     parameters:
 *       - in: path
 *         name: shareToken
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Shared itinerary }
 *       404: { description: Shared itinerary not found }
 */
publicRouter.get('/:shareToken', controller.getShared);

module.exports = { shareRouter, publicRouter };
