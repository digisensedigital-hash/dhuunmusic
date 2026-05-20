import axios from 'axios';

const API_BASE =
  import.meta.env.VITE_API_URL;

export default async function deleteTrack(
  trackId
) {
  const token =
    localStorage.getItem(
      'token'
    );

  const { data } =
    await axios.delete(
      `${API_BASE}/api/tracks/${trackId}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return data;
}