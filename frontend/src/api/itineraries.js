import client from './client';

export async function listItineraries(params) {
  const res = await client.get('/api/itineraries', { params });
  return res.data;
}

export async function getItinerary(id) {
  const res = await client.get(`/api/itineraries/${id}`);
  return res.data.data;
}

export async function createItinerary(payload) {
  const res = await client.post('/api/itineraries', payload);
  return res.data.data;
}

export async function updateItinerary(id, payload) {
  const res = await client.put(`/api/itineraries/${id}`, payload);
  return res.data.data;
}

export async function deleteItinerary(id) {
  await client.delete(`/api/itineraries/${id}`);
}

export async function addItem(itineraryId, payload) {
  const res = await client.post(`/api/itineraries/${itineraryId}/items`, payload);
  return res.data.data;
}

export async function updateItem(itineraryId, itemId, payload) {
  const res = await client.put(`/api/itineraries/${itineraryId}/items/${itemId}`, payload);
  return res.data.data;
}

export async function deleteItem(itineraryId, itemId) {
  await client.delete(`/api/itineraries/${itineraryId}/items/${itemId}`);
}

export async function shareItinerary(itineraryId) {
  const res = await client.post(`/api/itineraries/${itineraryId}/share`);
  return res.data.data;
}

export async function getSharedItinerary(shareToken) {
  const res = await client.get(`/api/shared/itineraries/${shareToken}`);
  return res.data.data;
}
