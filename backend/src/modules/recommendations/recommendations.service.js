const usersRepository = require('../users/users.repository');
const destinationsRepository = require('../destinations/destinations.repository');
const { NotFoundError } = require('../../utils/errors');

// Simple, explainable scoring algorithm (no AI/ML) - see docs/PHASE1_EXPLANATION.md
const SCORE = {
  PREFERENCE_MATCH: 30, // destination category matches a user preference
  SIMILAR_TO_PAST: 20, // same category as a destination already visited
  POPULARITY: 10, // popularityScore above the threshold
  BUDGET_FIT: 5, // destination fits the user's budget preference
};

const POPULARITY_THRESHOLD = 70;

async function getRecommendationsForUser(userId, limit = 10) {
  const user = await usersRepository.findByIdWithItineraries(userId);
  if (!user) throw NotFoundError('User');

  const preferences = Array.isArray(user.travelPreferences) ? user.travelPreferences : [];

  const visitedDestinationIds = new Set();
  const pastCategories = new Set();
  for (const itinerary of user.itineraries) {
    for (const item of itinerary.items) {
      visitedDestinationIds.add(item.destinationId);
      if (item.destination) pastCategories.add(item.destination.category);
    }
  }

  const allDestinations = await destinationsRepository.findAllRaw();

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

  return scored;
}

module.exports = { getRecommendationsForUser, SCORE, POPULARITY_THRESHOLD };
