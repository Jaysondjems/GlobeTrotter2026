const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usersRepository = require('../users/users.repository');
const { toSafeUser } = require('../users/users.service');
const { ConflictError, UnauthorizedError } = require('../../utils/errors');
const env = require('../../config/env');

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = '7d';

function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, env.jwtSecret, {
    expiresIn: TOKEN_EXPIRY,
  });
}

async function register(payload) {
  const existing = await usersRepository.findByEmail(payload.email);
  if (existing) throw ConflictError('Email already in use');

  const passwordHash = await bcrypt.hash(payload.password, SALT_ROUNDS);
  const user = await usersRepository.create({
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    passwordHash,
    country: payload.country,
    budgetPreference: payload.budgetPreference,
    travelPreferences: payload.travelPreferences || [],
  });

  return { user: toSafeUser(user), token: signToken(user) };
}

async function login(email, password) {
  const user = await usersRepository.findByEmail(email);
  if (!user) throw UnauthorizedError('Invalid email or password');

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) throw UnauthorizedError('Invalid email or password');

  return { user: toSafeUser(user), token: signToken(user) };
}

module.exports = { register, login };
