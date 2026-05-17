import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL;

export async function
loadPlaybackQueue(
  trackId
) {
  const response =
    await axios.get(
      `${API_BASE}/player/queue/${trackId}`,
      {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem(
              'token'
            )
          }`,
        },
      }
    );

  return response.data;
}