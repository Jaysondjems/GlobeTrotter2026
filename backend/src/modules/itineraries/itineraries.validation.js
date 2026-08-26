const { isNonEmptyString, isValidDate } = require('../../middleware/validate');

function validateCreateItinerary(body) {
  const errors = [];
  if (!isNonEmptyString(body.title)) errors.push('title is required');
  if (!isValidDate(body.startDate)) errors.push('a valid startDate is required');
  if (!isValidDate(body.endDate)) errors.push('a valid endDate is required');
  if (
    isValidDate(body.startDate) &&
    isValidDate(body.endDate) &&
    new Date(body.startDate) > new Date(body.endDate)
  ) {
    errors.push('startDate must be before endDate');
  }
  return errors;
}

function validateUpdateItinerary(body) {
  const errors = [];
  if (body.title !== undefined && !isNonEmptyString(body.title)) errors.push('title must not be empty');
  if (body.startDate !== undefined && !isValidDate(body.startDate)) errors.push('startDate must be valid');
  if (body.endDate !== undefined && !isValidDate(body.endDate)) errors.push('endDate must be valid');
  if (
    body.startDate !== undefined &&
    body.endDate !== undefined &&
    new Date(body.startDate) > new Date(body.endDate)
  ) {
    errors.push('startDate must be before endDate');
  }
  return errors;
}

function validateCreateItem(body) {
  const errors = [];
  if (!isNonEmptyString(body.destinationId)) errors.push('destinationId is required');
  if (!isValidDate(body.date)) errors.push('a valid date is required');
  if (body.activities !== undefined && !Array.isArray(body.activities)) {
    errors.push('activities must be an array');
  }
  return errors;
}

function validateUpdateItem(body) {
  const errors = [];
  if (body.date !== undefined && !isValidDate(body.date)) errors.push('date must be valid');
  if (body.activities !== undefined && !Array.isArray(body.activities)) {
    errors.push('activities must be an array');
  }
  return errors;
}

module.exports = {
  validateCreateItinerary,
  validateUpdateItinerary,
  validateCreateItem,
  validateUpdateItem,
};
