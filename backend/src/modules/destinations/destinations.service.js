const repository = require('./destinations.repository');
const { NotFoundError } = require('../../utils/errors');
const { parsePagination, buildPaginationMeta } = require('../../utils/pagination');

function parseFilters(query) {
  return {
    country: query.country,
    category: query.category,
    search: query.search,
    minBudget: query.minBudget !== undefined ? Number(query.minBudget) : undefined,
    maxBudget: query.maxBudget !== undefined ? Number(query.maxBudget) : undefined,
  };
}

async function listDestinations(query) {
  const { page, limit, skip } = parsePagination(query);
  const filters = parseFilters(query);
  const [destinations, total] = await repository.findAll(filters, { skip, take: limit });
  return { data: destinations, pagination: buildPaginationMeta(page, limit, total) };
}

async function getDestinationById(id) {
  const destination = await repository.findById(id);
  if (!destination) throw NotFoundError('Destination');
  return destination;
}

async function createDestination(payload) {
  return repository.create({
    name: payload.name,
    country: payload.country,
    city: payload.city,
    description: payload.description,
    category: payload.category,
    averageBudget: payload.averageBudget,
    popularityScore: payload.popularityScore || 0,
    activities: payload.activities || [],
    imageUrl: payload.imageUrl,
  });
}

async function updateDestination(id, payload) {
  await getDestinationById(id);
  return repository.update(id, payload);
}

async function deleteDestination(id) {
  await getDestinationById(id);
  await repository.remove(id);
}

module.exports = {
  listDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
};
