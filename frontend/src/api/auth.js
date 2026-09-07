import client from './client';

export async function register(payload) {
  const res = await client.post('/api/auth/register', payload);
  return res.data.data;
}

export async function login(email, password) {
  const res = await client.post('/api/auth/login', { email, password });
  return res.data.data;
}
