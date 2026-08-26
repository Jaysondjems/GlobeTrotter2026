const { Router } = require('express');
const controller = require('./destinations.controller');
const { validate } = require('../../middleware/validate');
const {
  validateCreateDestination,
  validateUpdateDestination,
  validateSearchQuery,
} = require('./destinations.validation');

const router = Router();

/**
 * @swagger
 * /api/destinations:
 *   get:
 *     summary: List / search destinations (filters + pagination)
 *     tags: [Destinations]
 *     parameters:
 *       - in: query
 *         name: country
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: minBudget
 *         schema: { type: number }
 *       - in: query
 *         name: maxBudget
 *         schema: { type: number }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: List of destinations }
 */
router.get('/', validate(validateSearchQuery, 'query'), controller.list);

/**
 * @swagger
 * /api/destinations/{id}:
 *   get:
 *     summary: Get a destination by id
 *     tags: [Destinations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Destination found }
 *       404: { description: Destination not found }
 */
router.get('/:id', controller.getOne);

/**
 * @swagger
 * /api/destinations:
 *   post:
 *     summary: Create a destination
 *     tags: [Destinations]
 *     requestBody:
 *       required: true
 *     responses:
 *       201: { description: Destination created }
 *       400: { description: Validation error }
 */
router.post('/', validate(validateCreateDestination), controller.create);

/**
 * @swagger
 * /api/destinations/{id}:
 *   put:
 *     summary: Update a destination
 *     tags: [Destinations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Destination updated }
 *       404: { description: Destination not found }
 */
router.put('/:id', validate(validateUpdateDestination), controller.update);

/**
 * @swagger
 * /api/destinations/{id}:
 *   delete:
 *     summary: Delete a destination
 *     tags: [Destinations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Destination deleted }
 *       404: { description: Destination not found }
 */
router.delete('/:id', controller.remove);

module.exports = router;
