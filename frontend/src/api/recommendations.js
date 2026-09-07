import client from './client';

export async function getRecommendations(userId, limit = 9) {
  const res = await client.get(`/api/users/${userId}/recommendations`, { params: { limit } });
  return res.data.data;
}
