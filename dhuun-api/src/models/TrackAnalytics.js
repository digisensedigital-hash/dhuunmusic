import mongoose from 'mongoose';

const trackAnalyticsSchema =
  new mongoose.Schema(
    {
      trackId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Track',
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

      completionRate: {
        type: Number,
        default: 0
      },

      uniqueListeners: {
        type: Number,
        default: 0
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

const TrackAnalytics =
  mongoose.model(
    'TrackAnalytics',
    trackAnalyticsSchema
  );

export default TrackAnalytics;