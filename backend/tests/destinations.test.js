const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/config/db');

describe('Destinations API', () => {
  const createdIds = [];

  beforeAll(async () => {
    const d1 = await prisma.destination.create({
      data: {
        name: 'Test Beach Town',
        country: 'TestLand',
        city: 'Testville',
        category: 'beach',
        averageBudget: 500,
        popularityScore: 60,
        activities: ['swimming'],
      },
    });
    const d2 = await prisma.destination.create({
      data: {
        name: 'Test Mountain Retreat',
        country: 'TestLand',
        city: 'Hillview',
        category: 'nature',
        averageBudget: 1500,
        popularityScore: 90,
        activities: ['hiking'],
      },
    });
    createdIds.push(d1.id, d2.id);
  });

  afterAll(async () => {
    await prisma.destination.deleteMany({ where: { id: { in: createdIds } } });
    await prisma.$disconnect();
  });

  test('GET /api/destinations returns paginated results', async () => {
    const res = await request(app).get('/api/destinations?limit=5&page=1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toMatchObject({ page: 1, limit: 5 });
  });

  test('GET /api/destinations filters by country and category', async () => {
    const res = await request(app).get('/api/destinations?country=TestLand&category=beach');
    expect(res.status).toBe(200);
    expect(res.body.data.every((d) => d.country === 'TestLand' && d.category === 'beach')).toBe(true);
  });

  test('GET /api/destinations filters by budget range', async () => {
    const res = await request(app).get(
      '/api/destinations?country=TestLand&minBudget=1000&maxBudget=2000'
    );
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].name).toBe('Test Mountain Retreat');
  });

  test('GET /api/destinations rejects an inconsistent budget range', async () => {
    const res = await request(app).get('/api/destinations?minBudget=2000&maxBudget=100');
    expect(res.status).toBe(400);
  });

  test('GET /api/destinations/:id returns 404 for an unknown destination', async () => {
    const res = await request(app).get('/api/destinations/00000000-0000-0000-0000-000000000000');
    expect(res.status).toBe(404);
  });
});
