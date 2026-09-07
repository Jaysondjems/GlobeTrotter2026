const service = require('./recommendations.service');
const { success } = require('../../utils/apiResponse');

async function getForUser(req, res, next) {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const recommendations = await service.getRecommendationsForUser(req.params.id, limit);
    return success(res, 200, recommendations);
  } catch (err) {
    return next(err);
  }
}

module.exports = { getForUser };
