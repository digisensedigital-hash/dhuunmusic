import axios
  from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL;

export default async function
convertLyricsScript({
  trackId,
  targetScript,
}) {

  const response =
    await axios.post(

      `${API_BASE_URL}/ai/script-convert`,

      {
        trackId,
        targetScript,
      }
    );

  return response.data;
}