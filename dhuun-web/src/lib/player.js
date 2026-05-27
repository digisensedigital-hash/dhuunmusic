import client from '../api/client';

export async function
loadPlaybackQueue(
  trackId
) {

  const response =

    await client.get(
      `/player/queue/${trackId}`
    );

  return response.data;
}