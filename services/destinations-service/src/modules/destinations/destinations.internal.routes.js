const { Router } = require('express');
const controller = require('./destinations.controller');

const router = Router();

// Mounted at /internal/destinations - service-to-service only, not exposed by the gateway.
router.get('/', controller.listAllInternal);
router.get('/by-ids', controller.getByIdsInternal);

module.exports = router;
