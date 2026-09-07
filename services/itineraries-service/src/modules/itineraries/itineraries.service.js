const repository = require('./itineraries.repository');
const destinationsClient = require('../../clients/destinationsClient');
const publisher = require('../../events/publisher');
const logger = require('../../utils/logger');
const { NotFoundError } = require('../../utils/errors');
const { parsePagination, buildPaginationMeta } = require('../../utils/pagination');

// Best-effort enrichment: if destinations-service is unreachable, the itinerary is still
// returned, just without embedded destination details (graceful degradation).
async function enrichWithDestinations(itinerary) {
  if (!itinerary || !itinerary.items.length) return itinerary;
  try {
    const ids = [...new Set(itinerary.items.map((item) => item.destinationId))];
    const destinations = await destinationsClient.getDestinationsByIds(ids);
    const byId = new Map(destinations.map((d) => [d.id, d]));
    return {
      ...itinerary,
      items: itinerary.items.map((item) => ({ ...item, destination: byId.get(item.destinationId) || null })),
    };
  } catch (err) {
    logger.warn(`Could not enrich itinerary items with destination details: ${err.message}`);
    return itinerary;
  }
}

async function listItineraries(userId, query) {
  const { page, limit, skip } = parsePagination(query);
  const [itineraries, total] = await repository.findAllByUser(userId, { skip, take: limit });
  return { data: itineraries, pagination: buildPaginationMeta(page, limit, total) };
}

async function getItineraryById(id) {
  const itinerary = await repository.findById(id);
  if (!itinerary) throw NotFoundError('Itinerary');
  return itinerary;
}

async function getOwnedItinerary(id, userId) {
  const itinerary = await getItineraryById(id);
  if (itinerary.userId !== userId) throw NotFoundError('Itinerary');
  return itinerary;
}

async function getOwnedItineraryEnriched(id, userId) {
  const itinerary = await getOwnedItinerary(id, userId);
  return enrichWithDestinations(itinerary);
}

async function createItinerary(userId, payload) {
  const itinerary = await repository.create({
    userId,
    title: payload.title,
    description: payload.description,
    startDate: new Date(payload.startDate),
    endDate: new Date(payload.endDate),
    status: payload.status || 'DRAFT',
  });
  await publisher.publish('itinerary.created', { itineraryId: itinerary.id, userId });
  return itinerary;
}

async function updateItinerary(id, userId, payload) {
  await getOwnedItinerary(id, userId);
  const data = { ...payload };
  if (data.startDate) data.startDate = new Date(data.startDate);
  if (data.endDate) data.endDate = new Date(data.endDate);
  return repository.update(id, data);
}

async function deleteItinerary(id, userId) {
  await getOwnedItinerary(id, userId);
  await repository.remove(id);
  await publisher.publish('itinerary.deleted', { itineraryId: id, userId });
}

async function addItem(itineraryId, userId, payload) {
  await getOwnedItinerary(itineraryId, userId);

  const destination = await destinationsClient.getDestinationById(payload.destinationId);
  if (!destination) throw NotFoundError('Destination');

  const item = await repository.addItem(itineraryId, {
    destinationId: payload.destinationId,
    date: new Date(payload.date),
    notes: payload.notes,
    activities: payload.activities || [],
  });
  await publisher.publish('itinerary.updated', { itineraryId, userId });
  return item;
}

async function updateItem(itineraryId, itemId, userId, payload) {
  await getOwnedItinerary(itineraryId, userId);

  const item = await repository.findItemById(itemId);
  if (!item || item.itineraryId !== itineraryId) throw NotFoundError('Itinerary item');

  const data = { ...payload };
  if (data.date) data.date = new Date(data.date);
  return repository.updateItem(itemId, data);
}

async function removeItem(itineraryId, itemId, userId) {
  await getOwnedItinerary(itineraryId, userId);

  const item = await repository.findItemById(itemId);
  if (!item || item.itineraryId !== itineraryId) throw NotFoundError('Itinerary item');

  await repository.removeItem(itemId);
  await publisher.publish('itinerary.updated', { itineraryId, userId });
}

module.exports = {
  listItineraries,
  getItineraryById,
  getOwnedItinerary,
  getOwnedItineraryEnriched,
  createItinerary,
  updateItinerary,
  deleteItinerary,
  addItem,
  updateItem,
  removeItem,
  enrichWithDestinations,
};
