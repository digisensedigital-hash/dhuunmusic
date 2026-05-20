import axios
  from 'axios';

const API_BASE_URL =
  import.meta.env
    .VITE_API_URL ||
  (
    window.location.hostname ===
    'localhost'
      ? 'http://localhost:8000/api'
      : 'https://api.dhuunmusic.in/api'
  );

const client =
  axios.create({
    baseURL:
      API_BASE_URL,
  });

/* ----------------------------------- */
/* Auth Interceptor */
/* ----------------------------------- */

client.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem(
        'token'
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

export default client;