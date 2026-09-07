const { ValidationError } = require('../utils/errors');

function validate(validatorFn, source = 'body') {
  return (req, res, next) => {
    const errors = validatorFn(req[source]) || [];
    if (errors.length > 0) return next(ValidationError(errors.join('; ')));
    return next();
  };
}

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

module.exports = { validate, isNonEmptyString };
