const service = require('./sharing.service');
const { success } = require('../../utils/apiResponse');

async function share(req, res, next) {
  try {
    const result = await service.createShareLink(req.params.id, req.user.id);
    return success(res, 201, result);
  } catch (err) {
    return next(err);
  }
}

async function getShared(req, res, next) {
  try {
    const itinerary = await service.getSharedItinerary(req.params.shareToken);
    return success(res, 200, itinerary);
  } catch (err) {
    return next(err);
  }
}

module.exports = { share, getShared };
