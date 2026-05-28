/* -------------------------------------------------------------------------- */
/* Guest */
/* -------------------------------------------------------------------------- */

export const GUEST_CAPABILITIES = {

  /* ----------------------------------- */
  /* Legacy */
  /* ----------------------------------- */

  canUseMeanings: false,

  canUseAllScripts: false,

  allowedMeaningLanguages: [
    'Hindi',
    'Roman English',
  ],

  canUseShuffle: false,

  canUseRepeat: false,

  canUseOffline: false,

  maxSavedTracks: 5,

  /* ----------------------------------- */
  /* Structured Features */
  /* ----------------------------------- */

  features: {

    lyrics: {

      meanings: false,

      allScripts: false,

      freeScripts: [

        'ORIGINAL',

        'HINDI',

        'ROMAN_ENGLISH',

      ],

      allowedMeaningLanguages: [

        'Hindi',

        'Roman English',

      ],

    },

    playback: {

      shuffle: false,

      repeat: false,

      offline: false,

      hdAudio: false,

    },

    library: {

      maxSavedTracks: 5,

      playlists: false,

    },

  },

};

/* -------------------------------------------------------------------------- */
/* Trial */
/* -------------------------------------------------------------------------- */

export const TRIAL_CAPABILITIES = {

  /* ----------------------------------- */
  /* Legacy */
  /* ----------------------------------- */

  canUseMeanings: true,

  canUseAllScripts: true,

  allowedMeaningLanguages:
    'ALL',

  canUseShuffle: true,

  canUseRepeat: true,

  canUseOffline: false,

  maxSavedTracks:
    Infinity,

  /* ----------------------------------- */
  /* Structured Features */
  /* ----------------------------------- */

  features: {

    lyrics: {

      meanings: true,

      allScripts: true,

      freeScripts: [

        'ORIGINAL',

        'HINDI',

        'ROMAN_ENGLISH',

      ],

      allowedMeaningLanguages:
        'ALL',

    },

    playback: {

      shuffle: true,

      repeat: true,

      offline: false,

      hdAudio: true,

    },

    library: {

      maxSavedTracks:
        Infinity,

      playlists: true,

    },

  },

};

/* -------------------------------------------------------------------------- */
/* Premium */
/* -------------------------------------------------------------------------- */

export const PREMIUM_CAPABILITIES = {

  /* ----------------------------------- */
  /* Legacy */
  /* ----------------------------------- */

  canUseMeanings: true,

  canUseAllScripts: true,

  allowedMeaningLanguages:
    'ALL',

  canUseShuffle: true,

  canUseRepeat: true,

  canUseOffline: true,

  maxSavedTracks:
    Infinity,

  /* ----------------------------------- */
  /* Structured Features */
  /* ----------------------------------- */

  features: {

    lyrics: {

      meanings: true,

      allScripts: true,

      freeScripts: [

        'Original Script',
        'Hindi',
        'Roman English',

      ],

      allowedMeaningLanguages:
        'ALL',

    },

    playback: {

      shuffle: true,

      repeat: true,

      offline: true,

      hdAudio: true,

    },

    library: {

      maxSavedTracks:
        Infinity,

      playlists: true,

    },

  },

};