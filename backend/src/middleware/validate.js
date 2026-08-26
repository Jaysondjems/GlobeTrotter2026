const { ValidationError } = require('../utils/errors');

// Middleware factory: takes a validator function (body/query) -> array of error strings
function validate(validatorFn, source = 'body') {
  return (req, res, next) => {
    const errors = validatorFn(req[source]) || [];
    if (errors.length > 0) {
      return next(ValidationError(errors.join('; ')));
    }
    return next();
  };
}

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const isValidDate = (value) => value !== undefined && !Number.isNaN(Date.parse(value));

module.exports = { validate, isEmail, isNonEmptyString, isValidDate };
