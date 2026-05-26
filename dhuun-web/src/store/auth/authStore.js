import { create } from 'zustand';

const authStore = create((set) => ({

  user: null,

  token:
    localStorage.getItem(
      'token'
    ) || null,

  isHydrating: true,

  setHydrating:
    (value) => {

      set({
        isHydrating: value,
      });

    },

  setUser:
    (user) => {

      set({
        user,
      });

    },

  setToken:
    (token) => {

      if (token) {

        localStorage.setItem(
          'token',
          token
        );

      } else {

        localStorage.removeItem(
          'token'
        );

      }

      set({
        token,
      });

    },

  logout:
    () => {

      localStorage.removeItem(
        'token'
      );

      set({
        user: null,
        token: null,
        isHydrating: false,
      });

    },

}));

export default authStore;