const repository = require('./destinations.repository');
const cache = require('../../utils/cache');
const { NotFoundError } = require('../../utils/errors');
const { parsePagination, buildPaginationMeta } = require('../../utils/pagination');

const LIST_CACHE_TTL_SECONDS = 30;
const LIST_CACHE_PREFIX = 'destinations:list:';

function parseFilters(query) {
  return {
    country: query.country,
    category: query.category,
    search: query.search,
    minBudget: query.minBudget !== undefined ? Number(query.minBudget) : undefined,
    maxBudget: query.maxBudget !== undefined ? Number(query.maxBudget) : undefined,
  };
}

// Cache-aside: search results change rarely compared to how often they're read, so a short
// TTL absorbs repeated identical searches (e.g. the same popular filter hit by many users)
// without ever serving data more than LIST_CACHE_TTL_SECONDS stale.
async function listDestinations(query) {
  const { page, limit, skip } = parsePagination(query);
  const filters = parseFilters(query);

  const cacheKey = `${LIST_CACHE_PREFIX}${JSON.stringify({ filters, page, limit })}`;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const [destinations, total] = await repository.findAll(filters, { skip, take: limit });
  const result = { data: destinations, pagination: buildPaginationMeta(page, limit, total) };
  await cache.set(cacheKey, result, LIST_CACHE_TTL_SECONDS);
  return result;
}

async function getDestinationById(id) {
  const destination = await repository.findById(id);
  if (!destination) throw NotFoundError('Destination');
  return destination;
}

async function createDestination(payload) {
  const destination = await repository.create({
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
  await cache.delPattern(`${LIST_CACHE_PREFIX}*`);
  return destination;
}

async function updateDestination(id, payload) {
  await getDestinationById(id);
  const destination = await repository.update(id, payload);
  await cache.delPattern(`${LIST_CACHE_PREFIX}*`);
  return destination;
}

async function deleteDestination(id) {
  await getDestinationById(id);
  await repository.remove(id);
  await cache.delPattern(`${LIST_CACHE_PREFIX}*`);
}

module.exports = {
  listDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
};
