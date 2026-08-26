const { isEmail, isNonEmptyString } = require('../../middleware/validate');

function validateRegister(body) {
  const errors = [];
  if (!isNonEmptyString(body.firstName)) errors.push('firstName is required');
  if (!isNonEmptyString(body.lastName)) errors.push('lastName is required');
  if (!isEmail(body.email)) errors.push('a valid email is required');
  if (!isNonEmptyString(body.password) || body.password.length < 6) {
    errors.push('password is required and must be at least 6 characters');
  }
  return errors;
}

function validateLogin(body) {
  const errors = [];
  if (!isEmail(body.email)) errors.push('a valid email is required');
  if (!isNonEmptyString(body.password)) errors.push('password is required');
  return errors;
}

module.exports = { validateRegister, validateLogin };
