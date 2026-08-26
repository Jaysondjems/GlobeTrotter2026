const { Router } = require('express');
const controller = require('./recommendations.controller');

const router = Router();

/**
 * @swagger
 * /api/users/{id}/recommendations:
 *   get:
 *     summary: Get personalized destination recommendations for a user (rule-based scoring)
 *     tags: [Recommendations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Ranked list of recommended destinations }
 *       404: { description: User not found }
 */
router.get('/:id/recommendations', controller.getForUser);

module.exports = router;
