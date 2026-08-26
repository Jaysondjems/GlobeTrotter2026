const repository = require('./itineraries.repository');
const destinationsRepository = require('../destinations/destinations.repository');
const { NotFoundError } = require('../../utils/errors');
const { parsePagination, buildPaginationMeta } = require('../../utils/pagination');

async function listItineraries(userId, query) {
  const { page, limit, skip } = parsePagination(query);
  const [itineraries, total] = await repository.findAllByUser(userId, { skip, take: limit });
  return { data: itineraries, pagination: buildPaginationMeta(page, limit, total) };
}

// Internal lookup, no ownership check (used by the sharing module through findByShareToken instead).
async function getItineraryById(id) {
  const itinerary = await repository.findById(id);
  if (!itinerary) throw NotFoundError('Itinerary');
  return itinerary;
}

// Itineraries are personal data: a non-owner gets 404, not 403, to avoid leaking existence.
async function getOwnedItinerary(id, userId) {
  const itinerary = await getItineraryById(id);
  if (itinerary.userId !== userId) throw NotFoundError('Itinerary');
  return itinerary;
}

async function createItinerary(userId, payload) {
  return repository.create({
    userId,
    title: payload.title,
    description: payload.description,
    startDate: new Date(payload.startDate),
    endDate: new Date(payload.endDate),
    status: payload.status || 'DRAFT',
  });
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
}

async function addItem(itineraryId, userId, payload) {
  await getOwnedItinerary(itineraryId, userId);

  const destination = await destinationsRepository.findById(payload.destinationId);
  if (!destination) throw NotFoundError('Destination');

  return repository.addItem(itineraryId, {
    destinationId: payload.destinationId,
    date: new Date(payload.date),
    notes: payload.notes,
    activities: payload.activities || [],
  });
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
}

module.exports = {
  listItineraries,
  getItineraryById,
  getOwnedItinerary,
  createItinerary,
  updateItinerary,
  deleteItinerary,
  addItem,
  updateItem,
  removeItem,
};
