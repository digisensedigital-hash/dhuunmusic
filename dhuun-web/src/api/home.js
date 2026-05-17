import client from './client';

export async function getHomeFeed() {
  const response =
    await client.get('/home');

  return response.data;
}