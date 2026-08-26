const bcrypt = require('bcrypt');
const repository = require('./users.repository');
const { NotFoundError, ConflictError } = require('../../utils/errors');
const { parsePagination, buildPaginationMeta } = require('../../utils/pagination');

const SALT_ROUNDS = 10;

function toSafeUser(user) {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
}

async function listUsers(query) {
  const { page, limit, skip } = parsePagination(query);
  const [users, total] = await repository.findAll({ skip, take: limit });
  return {
    data: users.map(toSafeUser),
    pagination: buildPaginationMeta(page, limit, total),
  };
}

async function getUserById(id) {
  const user = await repository.findById(id);
  if (!user) throw NotFoundError('User');
  return toSafeUser(user);
}

// Direct profile creation (no auto-login). See /api/auth/register for signup + token.
async function createUser(payload) {
  const existing = await repository.findByEmail(payload.email);
  if (existing) throw ConflictError('Email already in use');

  const passwordHash = await bcrypt.hash(payload.password, SALT_ROUNDS);
  const user = await repository.create({
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    passwordHash,
    country: payload.country,
    budgetPreference: payload.budgetPreference,
    travelPreferences: payload.travelPreferences || [],
  });
  return toSafeUser(user);
}

async function updateUser(id, payload) {
  await getUserById(id);
  const data = { ...payload };
  delete data.password;
  delete data.passwordHash;
  const user = await repository.update(id, data);
  return toSafeUser(user);
}

async function deleteUser(id) {
  await getUserById(id);
  await repository.remove(id);
}

module.exports = {
  toSafeUser,
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
