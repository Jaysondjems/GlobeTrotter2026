const usersClient = require('../../clients/usersClient');
const destinationsClient = require('../../clients/destinationsClient');
const itinerariesClient = require('../../clients/itinerariesClient');
const cache = require('../../utils/cache');
const { NotFoundError } = require('../../utils/errors');

const CACHE_TTL_SECONDS = 60;
const cacheKeyFor = (userId, limit) => `recommendations:${userId}:${limit}`;

// Same simple, explainable scoring algorithm as the Phase 1 monolith - only the data
// sourcing changed (HTTP calls to other services instead of local Prisma joins).
const SCORE = {
  PREFERENCE_MATCH: 30,
  SIMILAR_TO_PAST: 20,
  POPULARITY: 10,
  BUDGET_FIT: 5,
};

const POPULARITY_THRESHOLD = 70;

async function getRecommendationsForUser(userId, limit = 10) {
  const cacheKey = cacheKeyFor(userId, limit);
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const user = await usersClient.getUserById(userId);
  if (!user) throw NotFoundError('User');

  const [itineraries, allDestinations] = await Promise.all([
    itinerariesClient.getItinerariesForUser(userId),
    destinationsClient.getAllDestinations(),
  ]);

  const destinationsById = new Map(allDestinations.map((d) => [d.id, d]));
  const preferences = Array.isArray(user.travelPreferences) ? user.travelPreferences : [];

  const visitedDestinationIds = new Set();
  const pastCategories = new Set();
  for (const itinerary of itineraries) {
    for (const item of itinerary.items) {
      visitedDestinationIds.add(item.destinationId);
      const destination = destinationsById.get(item.destinationId);
      if (destination) pastCategories.add(destination.category);
    }
  }

  const scored = allDestinations
    .filter((destination) => !visitedDestinationIds.has(destination.id))
    .map((destination) => {
      let score = 0;
      const reasons = [];

      if (preferences.includes(destination.category)) {
        score += SCORE.PREFERENCE_MATCH;
        reasons.push('Matches one of your travel preferences');
      }
      if (pastCategories.has(destination.category)) {
        score += SCORE.SIMILAR_TO_PAST;
        reasons.push('Similar to a destination you already visited');
      }
      if (destination.popularityScore >= POPULARITY_THRESHOLD) {
        score += SCORE.POPULARITY;
        reasons.push('Popular destination among travelers');
      }
      if (user.budgetPreference && destination.averageBudget <= user.budgetPreference) {
        score += SCORE.BUDGET_FIT;
        reasons.push('Fits your budget preference');
      }

      return { destination, score, reasons };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  await cache.set(cacheKey, scored, CACHE_TTL_SECONDS);
  return scored;
}

module.exports = { getRecommendationsForUser, SCORE, POPULARITY_THRESHOLD };
