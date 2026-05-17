import mongoose from 'mongoose';

const artistAnalyticsSchema =
  new mongoose.Schema(
    {
      artistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
        required: true,
        unique: true
      },

      totalStreams: {
        type: Number,
        default: 0
      },

      qualifiedStreams: {
        type: Number,
        default: 0
      },

      totalListeningTime: {
        type: Number,
        default: 0
      },

      totalTracks: {
        type: Number,
        default: 0
      },

      averageCompletionRate: {
        type: Number,
        default: 0
      },

      monthlyListeners: {
        type: Number,
        default: 0
      },

      topTrackId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Track',
        default: null
      },

      lastStreamedAt: {
        type: Date,
        default: null
      }
    },
    {
      timestamps: true
    }
  );

const ArtistAnalytics =
  mongoose.model(
    'ArtistAnalytics',
    artistAnalyticsSchema
  );

export default ArtistAnalytics;