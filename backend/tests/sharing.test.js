const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/config/db');

describe('Sharing API', () => {
  let token;
  let userId;
  let itineraryId;
  let shareToken;

  beforeAll(async () => {
    const email = `share-${Date.now()}@test.com`;
    const registerRes = await request(app).post('/api/auth/register').send({
      firstName: 'Share',
      lastName: 'Tester',
      email,
      password: 'secret123',
    });
    token = registerRes.body.data.token;
    userId = registerRes.body.data.user.id;

    const itinRes = await request(app)
      .post('/api/itineraries')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Shareable Trip', startDate: '2026-02-01', endDate: '2026-02-05' });
    itineraryId = itinRes.body.data.id;
  });

  afterAll(async () => {
    await prisma.itinerary.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
    await prisma.$disconnect();
  });

  test('POST /api/itineraries/:id/share generates a share token', async () => {
    const res = await request(app)
      .post(`/api/itineraries/${itineraryId}/share`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(201);
    expect(res.body.data.shareToken).toBeTruthy();
    shareToken = res.body.data.shareToken;
  });

  test('GET /api/shared/itineraries/:shareToken returns the itinerary without auth', async () => {
    const res = await request(app).get(`/api/shared/itineraries/${shareToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Shareable Trip');
    expect(res.body.data.userId).toBeUndefined();
  });

  test('GET /api/shared/itineraries/:shareToken returns 404 for an invalid token', async () => {
    const res = await request(app).get('/api/shared/itineraries/invalid-token-xyz');
    expect(res.status).toBe(404);
  });
});
