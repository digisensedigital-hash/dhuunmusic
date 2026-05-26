import api from '../client';

const login = async ({
  email,
  password,
}) => {

  const response =
    await api.post(
      '/auth/login',
      {
        email,
        password,
      }
    );

  const {
    token,
    user,
  } = response.data;

  if (token) {

    localStorage.setItem(
      'token',
      token
    );

  }

  return {
    token,
    user,
  };

};

export default login;