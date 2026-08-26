const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/config/db');

describe('Itineraries API', () => {
  let token;
  let userId;
  let destination;
  let itineraryId;
  let itemId;

  beforeAll(async () => {
    const email = `itin-${Date.now()}@test.com`;
    const registerRes = await request(app).post('/api/auth/register').send({
      firstName: 'Itin',
      lastName: 'Tester',
      email,
      password: 'secret123',
    });
    token = registerRes.body.data.token;
    userId = registerRes.body.data.user.id;

    destination = await prisma.destination.create({
      data: {
        name: 'Itin Test Destination',
        country: 'TestLand',
        city: 'Testville',
        category: 'culture',
        averageBudget: 500,
        popularityScore: 50,
        activities: [],
      },
    });
  });

  afterAll(async () => {
    await prisma.itinerary.deleteMany({ where: { userId } });
    await prisma.destination.delete({ where: { id: destination.id } });
    await prisma.user.delete({ where: { id: userId } });
    await prisma.$disconnect();
  });

  test('POST /api/itineraries requires authentication', async () => {
    const res = await request(app).post('/api/itineraries').send({});
    expect(res.status).toBe(401);
  });

  test('POST /api/itineraries creates an itinerary', async () => {
    const res = await request(app)
      .post('/api/itineraries')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Trip', startDate: '2026-01-01', endDate: '2026-01-05' });
    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe('Test Trip');
    itineraryId = res.body.data.id;
  });

  test('POST /api/itineraries rejects startDate after endDate', async () => {
    const res = await request(app)
      .post('/api/itineraries')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Bad Trip', startDate: '2026-05-01', endDate: '2026-01-01' });
    expect(res.status).toBe(400);
  });

  test('GET /api/itineraries/:id returns the created itinerary', async () => {
    const res = await request(app)
      .get(`/api/itineraries/${itineraryId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Test Trip');
  });

  test('PUT /api/itineraries/:id updates the itinerary', async () => {
    const res = await request(app)
      .put(`/api/itineraries/${itineraryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Trip' });
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Updated Trip');
  });

  test('POST /api/itineraries/:id/items adds a step', async () => {
    const res = await request(app)
      .post(`/api/itineraries/${itineraryId}/items`)
      .set('Authorization', `Bearer ${token}`)
      .send({ destinationId: destination.id, date: '2026-01-02', notes: 'Day 1' });
    expect(res.status).toBe(201);
    itemId = res.body.data.id;
  });

  test('PUT /api/itineraries/:id/items/:itemId updates a step', async () => {
    const res = await request(app)
      .put(`/api/itineraries/${itineraryId}/items/${itemId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ notes: 'Updated notes' });
    expect(res.status).toBe(200);
    expect(res.body.data.notes).toBe('Updated notes');
  });

  test('DELETE /api/itineraries/:id/items/:itemId removes a step', async () => {
    const res = await request(app)
      .delete(`/api/itineraries/${itineraryId}/items/${itemId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
  });

  test('DELETE /api/itineraries/:id deletes the itinerary', async () => {
    const res = await request(app)
      .delete(`/api/itineraries/${itineraryId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
  });
});
