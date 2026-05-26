import api from '../client';

const getMe = async () => {

  const response =
    await api.get(
      '/auth/me'
    );

  return response.data;

};

export default getMe;