const { Router } = require('express');
const repository = require('./itineraries.repository');
const { success } = require('../../utils/apiResponse');

const router = Router();

// Mounted at /internal/itineraries - service-to-service only (used by recommendations-service
// to read a user's itinerary history without going through JWT auth, since this is an
// internal, trusted-network call rather than a request made on behalf of a browser user).
router.get('/by-user/:userId', async (req, res, next) => {
  try {
    const itineraries = await repository.findAllByUserRaw(req.params.userId);
    return success(res, 200, itineraries);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
