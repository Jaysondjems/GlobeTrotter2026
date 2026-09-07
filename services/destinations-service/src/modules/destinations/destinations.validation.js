const { isNonEmptyString } = require('../../middleware/validate');

function validateCreateDestination(body) {
  const errors = [];
  if (!isNonEmptyString(body.name)) errors.push('name is required');
  if (!isNonEmptyString(body.country)) errors.push('country is required');
  if (!isNonEmptyString(body.city)) errors.push('city is required');
  if (!isNonEmptyString(body.category)) errors.push('category is required');
  if (typeof body.averageBudget !== 'number' || body.averageBudget < 0) {
    errors.push('averageBudget must be a positive number');
  }
  if (body.popularityScore !== undefined && typeof body.popularityScore !== 'number') {
    errors.push('popularityScore must be a number');
  }
  if (body.activities !== undefined && !Array.isArray(body.activities)) {
    errors.push('activities must be an array');
  }
  return errors;
}

function validateUpdateDestination(body) {
  const errors = [];
  if (body.name !== undefined && !isNonEmptyString(body.name)) errors.push('name must not be empty');
  if (body.averageBudget !== undefined && typeof body.averageBudget !== 'number') {
    errors.push('averageBudget must be a number');
  }
  if (body.activities !== undefined && !Array.isArray(body.activities)) {
    errors.push('activities must be an array');
  }
  return errors;
}

function validateSearchQuery(query) {
  const errors = [];
  if (query.minBudget !== undefined && Number.isNaN(Number(query.minBudget))) errors.push('minBudget must be numeric');
  if (query.maxBudget !== undefined && Number.isNaN(Number(query.maxBudget))) errors.push('maxBudget must be numeric');
  if (
    query.minBudget !== undefined &&
    query.maxBudget !== undefined &&
    Number(query.minBudget) > Number(query.maxBudget)
  ) {
    errors.push('minBudget must be less than or equal to maxBudget');
  }
  return errors;
}

module.exports = { validateCreateDestination, validateUpdateDestination, validateSearchQuery };
