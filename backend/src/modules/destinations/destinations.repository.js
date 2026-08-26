const prisma = require('../../config/db');

function buildWhere(filters) {
  const where = {};
  if (filters.country) where.country = { equals: filters.country, mode: 'insensitive' };
  if (filters.category) where.category = { equals: filters.category, mode: 'insensitive' };

  if (filters.minBudget !== undefined || filters.maxBudget !== undefined) {
    where.averageBudget = {};
    if (filters.minBudget !== undefined) where.averageBudget.gte = filters.minBudget;
    if (filters.maxBudget !== undefined) where.averageBudget.lte = filters.maxBudget;
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { city: { contains: filters.search, mode: 'insensitive' } },
      { country: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  return where;
}

function findAll(filters, { skip, take }) {
  const where = buildWhere(filters);
  return Promise.all([
    prisma.destination.findMany({ where, skip, take, orderBy: { popularityScore: 'desc' } }),
    prisma.destination.count({ where }),
  ]);
}

function findAllRaw() {
  return prisma.destination.findMany();
}

function findById(id) {
  return prisma.destination.findUnique({ where: { id } });
}

function create(data) {
  return prisma.destination.create({ data });
}

function update(id, data) {
  return prisma.destination.update({ where: { id }, data });
}

function remove(id) {
  return prisma.destination.delete({ where: { id } });
}

module.exports = { findAll, findAllRaw, findById, create, update, remove };
