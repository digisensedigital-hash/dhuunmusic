import axios
  from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL;

export default async function
translateLyricsMeaning({

  trackId,

  targetLanguage =
    'English',
}) {

  const response =
    await axios.post(

      `${API_BASE_URL}/ai/meaning-translate`,

      {
        trackId,

        targetLanguage,
      }
    );

  return response.data;
}