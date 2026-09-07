const service = require('./destinations.service');
const repository = require('./destinations.repository');
const { success } = require('../../utils/apiResponse');

async function list(req, res, next) {
  try {
    const { data, pagination } = await service.listDestinations(req.query);
    return success(res, 200, data, { pagination });
  } catch (err) {
    return next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const destination = await service.getDestinationById(req.params.id);
    return success(res, 200, destination);
  } catch (err) {
    return next(err);
  }
}

async function create(req, res, next) {
  try {
    const destination = await service.createDestination(req.body);
    return success(res, 201, destination);
  } catch (err) {
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const destination = await service.updateDestination(req.params.id, req.body);
    return success(res, 200, destination);
  } catch (err) {
    return next(err);
  }
}

async function remove(req, res, next) {
  try {
    await service.deleteDestination(req.params.id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

// Internal, unauthenticated endpoint used by other services on the trusted network
// (e.g. recommendations-service needs the full catalogue to score every destination).
async function listAllInternal(req, res, next) {
  try {
    const destinations = await repository.findAllRaw();
    return success(res, 200, destinations);
  } catch (err) {
    return next(err);
  }
}

// Internal batch lookup used by itineraries-service to enrich itinerary items
// with destination details without an N+1 chain of single-id calls.
async function getByIdsInternal(req, res, next) {
  try {
    const ids = (req.query.ids || '').split(',').map((id) => id.trim()).filter(Boolean);
    const destinations = ids.length ? await repository.findByIds(ids) : [];
    return success(res, 200, destinations);
  } catch (err) {
    return next(err);
  }
}

module.exports = { list, getOne, create, update, remove, listAllInternal, getByIdsInternal };
