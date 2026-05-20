import client
  from './client';

export default async function
deleteTrack(trackId) {

  const response =
    await client.delete(
      `/tracks/${trackId}`
    );

  return response.data;
}