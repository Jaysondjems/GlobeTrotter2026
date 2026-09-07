const crypto = require('crypto');
const itinerariesRepository = require('../itineraries/itineraries.repository');
const itinerariesService = require('../itineraries/itineraries.service');
const publisher = require('../../events/publisher');
const { NotFoundError } = require('../../utils/errors');

function generateToken() {
  return crypto.randomBytes(16).toString('hex');
}

async function createShareLink(itineraryId, userId) {
  const itinerary = await itinerariesService.getOwnedItinerary(itineraryId, userId);
  const shareToken = itinerary.shareToken || generateToken();
  const updated = await itinerariesRepository.update(itineraryId, { shareToken });
  await publisher.publish('itinerary.shared', { itineraryId, userId, shareToken });
  return { shareToken: updated.shareToken };
}

// Public view: never expose the owner's userId or account details.
async function getSharedItinerary(shareToken) {
  const itinerary = await itinerariesRepository.findByShareToken(shareToken);
  if (!itinerary) throw NotFoundError('Shared itinerary');
  const { userId, ...publicItinerary } = itinerary;
  return itinerariesService.enrichWithDestinations(publicItinerary);
}

module.exports = { createShareLink, getSharedItinerary };
