import mongoose from 'mongoose';

const recentlyPlayedSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },

      trackId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: 'Track',
        required: true
      },

      listenSessionId: {
        type: String,
        required: true
      },

      duration: {
        type: Number,
        default: 0
      },

      playedAt: {
        type: Date,
        default: Date.now
      }
    },
    {
      timestamps: true
    }
  );

recentlyPlayedSchema.index({
  userId: 1,
  playedAt: -1
});

recentlyPlayedSchema.index({
  trackId: 1
});

recentlyPlayedSchema.index({
  listenSessionId: 1
});

const RecentlyPlayed =
  mongoose.model(
    'RecentlyPlayed',
    recentlyPlayedSchema
  );

export default RecentlyPlayed;