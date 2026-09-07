const prisma = require('../../config/db');

function create(data) {
  return prisma.user.create({ data });
}

function findAll({ skip, take }) {
  return Promise.all([
    prisma.user.findMany({ skip, take, orderBy: { createdAt: 'desc' } }),
    prisma.user.count(),
  ]);
}

function findById(id) {
  return prisma.user.findUnique({ where: { id } });
}

function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

function update(id, data) {
  return prisma.user.update({ where: { id }, data });
}

function remove(id) {
  return prisma.user.delete({ where: { id } });
}

module.exports = { create, findAll, findById, findByEmail, update, remove };
