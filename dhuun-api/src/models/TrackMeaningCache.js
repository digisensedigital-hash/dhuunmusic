import mongoose from 'mongoose';

const trackMeaningCacheSchema =
  new mongoose.Schema(

    {
      trackId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: 'Track',

        required: true,

        index: true,
      },

      sourceLanguage: {
        type: String,

        default: 'AUTO',
      },

      targetLanguage: {
        type: String,

        required: true,

        default: 'English',
      },

      translatedLyrics: {
        type: String,

        required: true,
      },

      model: {
        type: String,

        default:
          'gpt-4.1-mini',
      },

      lyricsVersion: {
        type: Number,

        required: true,

        default: 1,
      },
    },

    {
      timestamps: true,
    }
  );

/* ----------------------------------- */
/* Unique Cache */
/* ----------------------------------- */

trackMeaningCacheSchema.index(

  {
    trackId: 1,

    targetLanguage: 1,

    lyricsVersion: 1,
  },

  {
    unique: true,
  }
);

const TrackMeaningCache =
  mongoose.model(
    'TrackMeaningCache',
    trackMeaningCacheSchema
  );

export default TrackMeaningCache;