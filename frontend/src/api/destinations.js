import client from './client';

export async function searchDestinations(params) {
  const res = await client.get('/api/destinations', { params });
  return res.data;
}

export async function getDestination(id) {
  const res = await client.get(`/api/destinations/${id}`);
  return res.data.data;
}
