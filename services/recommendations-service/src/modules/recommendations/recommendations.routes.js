const { Router } = require('express');
const controller = require('./recommendations.controller');

const router = Router();

router.get('/:id/recommendations', controller.getForUser);

module.exports = router;
