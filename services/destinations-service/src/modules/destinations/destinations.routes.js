const { Router } = require('express');
const controller = require('./destinations.controller');
const { validate } = require('../../middleware/validate');
const {
  validateCreateDestination,
  validateUpdateDestination,
  validateSearchQuery,
} = require('./destinations.validation');

const router = Router();

router.get('/', validate(validateSearchQuery, 'query'), controller.list);
router.get('/:id', controller.getOne);
router.post('/', validate(validateCreateDestination), controller.create);
router.put('/:id', validate(validateUpdateDestination), controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
