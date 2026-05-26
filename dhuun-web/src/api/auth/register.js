import api from '../client';

const register = async ({
  name,
  email,
  password,
}) => {

  const response =
    await api.post(
      '/auth/register',
      {
        name,
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

export default register;