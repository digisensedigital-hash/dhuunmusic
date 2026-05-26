import { create } from 'zustand';

const capabilityStore =
  create((set) => ({

    capabilities: null,

    loading: true,

    setCapabilities:
      (capabilities) => {

        set({
          capabilities,
        });

      },

    setLoading:
      (loading) => {

        set({
          loading,
        });

      },

    reset:
      () => {

        set({
          capabilities: null,
          loading: false,
        });

      },

  }));

export default
  capabilityStore;