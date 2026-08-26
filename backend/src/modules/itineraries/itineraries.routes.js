const { Router } = require('express');
const controller = require('./itineraries.controller');
const { authenticate } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const {
  validateCreateItinerary,
  validateUpdateItinerary,
  validateCreateItem,
  validateUpdateItem,
} = require('./itineraries.validation');

const router = Router();

// All itinerary routes are personal data -> protected by JWT.
router.use(authenticate);

/**
 * @swagger
 * /api/itineraries:
 *   get:
 *     summary: List the authenticated user's itineraries
 *     tags: [Itineraries]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of itineraries }
 *       401: { description: Missing or invalid token }
 */
router.get('/', controller.list);

/**
 * @swagger
 * /api/itineraries/{id}:
 *   get:
 *     summary: Get one itinerary owned by the authenticated user
 *     tags: [Itineraries]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Itinerary found }
 *       404: { description: Itinerary not found }
 */
router.get('/:id', controller.getOne);

/**
 * @swagger
 * /api/itineraries:
 *   post:
 *     summary: Create an itinerary
 *     tags: [Itineraries]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Itinerary created }
 *       400: { description: Validation error }
 */
router.post('/', validate(validateCreateItinerary), controller.create);

/**
 * @swagger
 * /api/itineraries/{id}:
 *   put:
 *     summary: Update an itinerary
 *     tags: [Itineraries]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Itinerary updated }
 *       404: { description: Itinerary not found }
 */
router.put('/:id', validate(validateUpdateItinerary), controller.update);

/**
 * @swagger
 * /api/itineraries/{id}:
 *   delete:
 *     summary: Delete an itinerary
 *     tags: [Itineraries]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Itinerary deleted }
 *       404: { description: Itinerary not found }
 */
router.delete('/:id', controller.remove);

/**
 * @swagger
 * /api/itineraries/{id}/items:
 *   post:
 *     summary: Add a day/step to an itinerary
 *     tags: [Itineraries]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201: { description: Item added }
 *       404: { description: Itinerary or destination not found }
 */
router.post('/:id/items', validate(validateCreateItem), controller.addItem);

/**
 * @swagger
 * /api/itineraries/{id}/items/{itemId}:
 *   put:
 *     summary: Update a step of an itinerary
 *     tags: [Itineraries]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Item updated }
 *       404: { description: Itinerary or item not found }
 */
router.put('/:id/items/:itemId', validate(validateUpdateItem), controller.updateItem);

/**
 * @swagger
 * /api/itineraries/{id}/items/{itemId}:
 *   delete:
 *     summary: Remove a step from an itinerary
 *     tags: [Itineraries]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Item removed }
 *       404: { description: Itinerary or item not found }
 */
router.delete('/:id/items/:itemId', controller.removeItem);

module.exports = router;
