import mongoose from 'mongoose';

const trendingTrackSchema =
  new mongoose.Schema(
    {
      trackId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Track',
        required: true
      },

      score: {
        type: Number,
        default: 0
      },

      rank: {
        type: Number,
        default: 0
      },

      qualifiedStreams: {
        type: Number,
        default: 0
      },

      completionRate: {
        type: Number,
        default: 0
      },

      totalListeningTime: {
        type: Number,
        default: 0
      },

      window: {
        type: String,
        enum: [
          'DAILY',
          'WEEKLY',
          'MONTHLY'
        ],
        default: 'DAILY'
      },

      calculatedAt: {
        type: Date,
        default: Date.now
      }
    },
    {
      timestamps: true
    }
  );

trendingTrackSchema.index({
  window: 1,
  rank: 1
});

trendingTrackSchema.index({
  score: -1
});

const TrendingTrack =
  mongoose.model(
    'TrendingTrack',
    trendingTrackSchema
  );

export default TrendingTrack;