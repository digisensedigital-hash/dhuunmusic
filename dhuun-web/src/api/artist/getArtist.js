import client from '../client';

export default async function getArtist(
  identifier
) {
  const response =
    await client.get(
      `/artists/${identifier}`
    );

  return response.data;
}