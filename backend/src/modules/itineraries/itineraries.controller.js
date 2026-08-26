const service = require('./itineraries.service');
const { success } = require('../../utils/apiResponse');

async function list(req, res, next) {
  try {
    const { data, pagination } = await service.listItineraries(req.user.id, req.query);
    return success(res, 200, data, { pagination });
  } catch (err) {
    return next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const itinerary = await service.getOwnedItinerary(req.params.id, req.user.id);
    return success(res, 200, itinerary);
  } catch (err) {
    return next(err);
  }
}

async function create(req, res, next) {
  try {
    const itinerary = await service.createItinerary(req.user.id, req.body);
    return success(res, 201, itinerary);
  } catch (err) {
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const itinerary = await service.updateItinerary(req.params.id, req.user.id, req.body);
    return success(res, 200, itinerary);
  } catch (err) {
    return next(err);
  }
}

async function remove(req, res, next) {
  try {
    await service.deleteItinerary(req.params.id, req.user.id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function addItem(req, res, next) {
  try {
    const item = await service.addItem(req.params.id, req.user.id, req.body);
    return success(res, 201, item);
  } catch (err) {
    return next(err);
  }
}

async function updateItem(req, res, next) {
  try {
    const item = await service.updateItem(req.params.id, req.params.itemId, req.user.id, req.body);
    return success(res, 200, item);
  } catch (err) {
    return next(err);
  }
}

async function removeItem(req, res, next) {
  try {
    await service.removeItem(req.params.id, req.params.itemId, req.user.id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = { list, getOne, create, update, remove, addItem, updateItem, removeItem };
