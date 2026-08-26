const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/config/db');

function uniqueEmail(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}@test.com`;
}

describe('Users API', () => {
  const createdUserIds = [];

  afterAll(async () => {
    if (createdUserIds.length) {
      await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
    }
    await prisma.$disconnect();
  });

  test('POST /api/users creates a user', async () => {
    const email = uniqueEmail('create');
    const res = await request(app).post('/api/users').send({
      firstName: 'Test',
      lastName: 'User',
      email,
      password: 'secret123',
      country: 'Canada',
      budgetPreference: 1500,
      travelPreferences: ['beach'],
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(email);
    expect(res.body.data.passwordHash).toBeUndefined();
    createdUserIds.push(res.body.data.id);
  });

  test('POST /api/users rejects an invalid payload', async () => {
    const res = await request(app).post('/api/users').send({ email: 'not-an-email' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  test('GET /api/users/:id returns a created user', async () => {
    const email = uniqueEmail('fetch');
    const createRes = await request(app).post('/api/users').send({
      firstName: 'Fetch',
      lastName: 'Me',
      email,
      password: 'secret123',
    });
    createdUserIds.push(createRes.body.data.id);

    const res = await request(app).get(`/api/users/${createRes.body.data.id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(email);
  });

  test('GET /api/users/:id returns 404 for an unknown user', async () => {
    const res = await request(app).get('/api/users/00000000-0000-0000-0000-000000000000');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('RESOURCE_NOT_FOUND');
  });
});
