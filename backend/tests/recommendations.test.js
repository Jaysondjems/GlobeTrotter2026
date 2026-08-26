const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/config/db');

describe('Recommendations API', () => {
  let user;
  let matchingDestination;
  let popularDestination;

  beforeAll(async () => {
    user = await prisma.user.create({
      data: {
        firstName: 'Reco',
        lastName: 'Tester',
        email: `reco-${Date.now()}@test.com`,
        passwordHash: 'x',
        travelPreferences: ['beach'],
        budgetPreference: 5000,
      },
    });
    matchingDestination = await prisma.destination.create({
      data: {
        name: 'Reco Beach Match',
        country: 'TestLand',
        city: 'Testville',
        category: 'beach',
        averageBudget: 500,
        popularityScore: 40,
        activities: [],
      },
    });
    popularDestination = await prisma.destination.create({
      data: {
        name: 'Reco Popular City',
        country: 'TestLand',
        city: 'Metro',
        category: 'city',
        averageBudget: 500,
        popularityScore: 95,
        activities: [],
      },
    });
  });

  afterAll(async () => {
    await prisma.destination.deleteMany({
      where: { id: { in: [matchingDestination.id, popularDestination.id] } },
    });
    await prisma.user.delete({ where: { id: user.id } });
    await prisma.$disconnect();
  });

  test('ranks a preference-matching destination with a positive score', async () => {
    const res = await request(app).get(`/api/users/${user.id}/recommendations`);
    expect(res.status).toBe(200);
    const match = res.body.data.find((r) => r.destination.name === 'Reco Beach Match');
    expect(match).toBeDefined();
    expect(match.score).toBeGreaterThanOrEqual(30);
  });

  test('results are sorted by score descending', async () => {
    const res = await request(app).get(`/api/users/${user.id}/recommendations`);
    const scores = res.body.data.map((r) => r.score);
    const sorted = [...scores].sort((a, b) => b - a);
    expect(scores).toEqual(sorted);
  });

  test('returns 404 for an unknown user', async () => {
    const res = await request(app).get(
      '/api/users/00000000-0000-0000-0000-000000000000/recommendations'
    );
    expect(res.status).toBe(404);
  });
});
