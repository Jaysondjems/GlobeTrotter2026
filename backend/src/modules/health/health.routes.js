const { Router } = require('express');
const controller = require('./health.controller');

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check (also verifies the PostgreSQL connection)
 *     tags: [Health]
 *     responses:
 *       200: { description: Service status }
 */
router.get('/', controller.check);

module.exports = router;
