const { Router } = require('express');
const controller = require('./users.controller');
const { validate } = require('../../middleware/validate');
const { validateCreateUser, validateUpdateUser } = require('./users.validation');

const router = Router();

router.get('/', controller.list);
router.get('/:id', controller.getOne);
router.post('/', validate(validateCreateUser), controller.create);
router.put('/:id', validate(validateUpdateUser), controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
