const { isEmail, isNonEmptyString } = require('../../middleware/validate');

function validateCreateUser(body) {
  const errors = [];
  if (!isNonEmptyString(body.firstName)) errors.push('firstName is required');
  if (!isNonEmptyString(body.lastName)) errors.push('lastName is required');
  if (!isEmail(body.email)) errors.push('a valid email is required');
  if (!isNonEmptyString(body.password) || body.password.length < 6) {
    errors.push('password is required and must be at least 6 characters');
  }
  if (body.travelPreferences !== undefined && !Array.isArray(body.travelPreferences)) {
    errors.push('travelPreferences must be an array');
  }
  if (body.budgetPreference !== undefined && typeof body.budgetPreference !== 'number') {
    errors.push('budgetPreference must be a number');
  }
  return errors;
}

function validateUpdateUser(body) {
  const errors = [];
  if (body.email !== undefined && !isEmail(body.email)) errors.push('email must be valid');
  if (body.firstName !== undefined && !isNonEmptyString(body.firstName)) errors.push('firstName must not be empty');
  if (body.lastName !== undefined && !isNonEmptyString(body.lastName)) errors.push('lastName must not be empty');
  if (body.travelPreferences !== undefined && !Array.isArray(body.travelPreferences)) {
    errors.push('travelPreferences must be an array');
  }
  if (body.budgetPreference !== undefined && typeof body.budgetPreference !== 'number') {
    errors.push('budgetPreference must be a number');
  }
  return errors;
}

module.exports = { validateCreateUser, validateUpdateUser };
