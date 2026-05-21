import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL;

const getTrackDetails =
  async (trackId) => {

    const response =
      await axios.get(
        `${API_BASE_URL}/tracks/${trackId}`
      );

    return response.data;
  };

export default getTrackDetails;