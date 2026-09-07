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

router.use(authenticate);

router.get('/', controller.list);
router.get('/:id', controller.getOne);
router.post('/', validate(validateCreateItinerary), controller.create);
router.put('/:id', validate(validateUpdateItinerary), controller.update);
router.delete('/:id', controller.remove);

router.post('/:id/items', validate(validateCreateItem), controller.addItem);
router.put('/:id/items/:itemId', validate(validateUpdateItem), controller.updateItem);
router.delete('/:id/items/:itemId', controller.removeItem);

module.exports = router;
