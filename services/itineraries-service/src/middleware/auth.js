const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { UnauthorizedError } = require('../utils/errors');

// Stateless verification: this service trusts any JWT signed with the shared JWT_SECRET
// (the same one users-service uses to issue tokens). No call to users-service is needed
// to authenticate a request - that's the point of JWTs in a microservices architecture.
function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(UnauthorizedError('Missing or invalid Authorization header'));
  }

  const token = header.slice('Bearer '.length);
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = { id: payload.sub, email: payload.email };
    return next();
  } catch (err) {
    return next(UnauthorizedError('Invalid or expired token'));
  }
}

module.exports = { authenticate };
