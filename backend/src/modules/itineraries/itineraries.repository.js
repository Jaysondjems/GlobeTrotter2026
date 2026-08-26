const prisma = require('../../config/db');

function create(data) {
  return prisma.itinerary.create({ data, include: { items: true } });
}

function findAllByUser(userId, { skip, take }) {
  return Promise.all([
    prisma.itinerary.findMany({
      where: { userId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    }),
    prisma.itinerary.count({ where: { userId } }),
  ]);
}

function findById(id) {
  return prisma.itinerary.findUnique({
    where: { id },
    include: { items: { include: { destination: true }, orderBy: { date: 'asc' } } },
  });
}

function findByShareToken(token) {
  return prisma.itinerary.findUnique({
    where: { shareToken: token },
    include: { items: { include: { destination: true }, orderBy: { date: 'asc' } } },
  });
}

function update(id, data) {
  return prisma.itinerary.update({ where: { id }, data, include: { items: true } });
}

function remove(id) {
  return prisma.itinerary.delete({ where: { id } });
}

function addItem(itineraryId, data) {
  return prisma.itineraryItem.create({
    data: { ...data, itineraryId },
    include: { destination: true },
  });
}

function updateItem(itemId, data) {
  return prisma.itineraryItem.update({
    where: { id: itemId },
    data,
    include: { destination: true },
  });
}

function removeItem(itemId) {
  return prisma.itineraryItem.delete({ where: { id: itemId } });
}

function findItemById(itemId) {
  return prisma.itineraryItem.findUnique({ where: { id: itemId } });
}

module.exports = {
  create,
  findAllByUser,
  findById,
  findByShareToken,
  update,
  remove,
  addItem,
  updateItem,
  removeItem,
  findItemById,
};
