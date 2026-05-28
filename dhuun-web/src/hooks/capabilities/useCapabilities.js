import capabilityStore
  from '../../store/capabilityStore';

import authStore
  from '../../store/auth/authStore';

const useCapabilities =
  () => {

    const {
      capabilities,
      loading,
    } = capabilityStore();

    const {
      user,
    } = authStore();

    return {

      loading,

      /* ----------------------------------- */
      /* Identity */
      /* ----------------------------------- */

      isGuest:
        capabilities?.isGuest ??
        true,

      isRegistered:
        capabilities?.isRegistered ??
        false,

      isPremium:
        capabilities?.isPremium ??
        false,

      trialActive:
        capabilities?.trialActive ??
        false,

      trialExpired:
        capabilities?.trialExpired ??
        false,

      trialDaysRemaining:
        capabilities?.trialDaysRemaining ??
        0,

      /* ----------------------------------- */
      /* Structured Feature Matrix */
      /* ----------------------------------- */

      features:

        capabilities?.features ?? {

          lyrics: {

            meanings: false,

            allScripts: false,

            freeScripts: [

              'Original Script',

              'Hindi',

              'Roman English',

            ],

            allowedMeaningLanguages:
              [],

          },

          playback: {

            shuffle: false,

            repeat: false,

            offline: false,

            hdAudio: false,

          },

          library: {

            maxSavedTracks: 0,

            playlists: false,

          },

        },

      /* ----------------------------------- */
      /* Centralized Gating */
      /* ----------------------------------- */

      gating: {

        lyrics: {

          /* ----------------------------- */
          /* AI Meanings */
          /* ----------------------------- */

          meanings: {

            requiresRegistration:

              capabilities?.requiresRegistrationForMeanings ??

              !user,

            requiresPremium:

              capabilities?.requiresPremiumForMeanings ??

              false,

          },

          /* ----------------------------- */
          /* Script Selection */
          /* ----------------------------- */

          allScripts: {

            requiresRegistration:

              capabilities?.requiresRegistrationForScripts ??

              !user,

            requiresPremium:

              capabilities?.requiresPremiumForScripts ??

              false,

          },

        },

      },

      /* ----------------------------------- */
      /* Legacy Backward Compatibility */
      /* ----------------------------------- */

      canUseMeanings:
        capabilities?.canUseMeanings ??
        false,

      canPreviewMeanings:
        capabilities?.canPreviewMeanings ??
        true,

      requiresRegistrationForMeanings:
        capabilities?.requiresRegistrationForMeanings ??
        !user,

      requiresPremiumForMeanings:
        capabilities?.requiresPremiumForMeanings ??
        false,

      canUseShuffle:
        capabilities?.canUseShuffle ??
        false,

      canUseRepeat:
        capabilities?.canUseRepeat ??
        false,

      allowedMeaningLanguages:
        capabilities?.allowedMeaningLanguages ??
        [],

      maxSavedTracks:
        capabilities?.maxSavedTracks ??
        0,

    };

  };

export default
  useCapabilities;