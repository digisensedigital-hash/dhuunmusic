import api
  from '../../api/client';

const getCapabilities =
  async () => {

    const response =
      await api.get(
        '/auth/capabilities'
      );

    return response.data;

  };

export default
  getCapabilities;