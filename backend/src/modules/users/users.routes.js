const { Router } = require('express');
const controller = require('./users.controller');
const { validate } = require('../../middleware/validate');
const { validateCreateUser, validateUpdateUser } = require('./users.validation');

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: List users (paginated)
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: List of users }
 */
router.get('/', controller.list);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: User found }
 *       404: { description: User not found }
 */
router.get('/:id', controller.getOne);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a user profile directly
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *     responses:
 *       201: { description: User created }
 *       400: { description: Validation error }
 *       409: { description: Email already in use }
 */
router.post('/', validate(validateCreateUser), controller.create);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: User updated }
 *       404: { description: User not found }
 */
router.put('/:id', validate(validateUpdateUser), controller.update);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: User deleted }
 *       404: { description: User not found }
 */
router.delete('/:id', controller.remove);

module.exports = router;
