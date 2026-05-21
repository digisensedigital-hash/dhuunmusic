import mongoose from 'mongoose';

const trackScriptCacheSchema = new mongoose.Schema(
  {
    trackId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Track',
      required: true,
      index: true,
    },

    targetScript: {
      type: String,
      required: true,
      index: true,
    },

    convertedLyrics: {
      type: String,
      required: true,
    },

    model: {
      type: String,
      default: 'gpt-4.1-mini',
    },

    lyricsVersion: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

trackScriptCacheSchema.index(
  {
    trackId: 1,
    targetScript: 1,
    lyricsVersion: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model(
  'TrackScriptCache',
  trackScriptCacheSchema
);