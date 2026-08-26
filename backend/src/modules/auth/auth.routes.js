const { Router } = require('express');
const controller = require('./auth.controller');
const { validate } = require('../../middleware/validate');
const { validateRegister, validateLogin } = require('./auth.validation');

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user and receive a JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *     responses:
 *       201: { description: User created and authenticated }
 *       400: { description: Validation error }
 *       409: { description: Email already in use }
 */
router.post('/register', validate(validateRegister), controller.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in and receive a JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *     responses:
 *       200: { description: Authenticated }
 *       401: { description: Invalid credentials }
 */
router.post('/login', validate(validateLogin), controller.login);

module.exports = router;
