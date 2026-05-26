import axios from 'axios';

const API_URL =

  import.meta.env
    .VITE_API_URL ||

  '/api';

export async function
loadPlaybackQueue(
  trackId
) {

  const token =

    localStorage.getItem(
      'token'
    );

  const response =

    await axios.get(

      `${API_URL}/player/queue/${trackId}`,

      {
        headers: token

          ? {
              Authorization:
                `Bearer ${token}`,
            }

          : {},
      }
    );

  return response.data;
}