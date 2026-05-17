import axios from 'axios';

const API_BASE =
  'http://localhost:8000/api';

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