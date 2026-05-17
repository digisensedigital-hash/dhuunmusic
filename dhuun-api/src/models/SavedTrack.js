import mongoose from 'mongoose';

const savedTrackSchema =
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

      savedAt: {
        type: Date,
        default: Date.now
      }
    },
    {
      timestamps: true
    }
  );

savedTrackSchema.index(
  {
    userId: 1,
    trackId: 1
  },
  {
    unique: true
  }
);

savedTrackSchema.index({
  userId: 1,
  savedAt: -1
});

const SavedTrack =
  mongoose.model(
    'SavedTrack',
    savedTrackSchema
  );

export default SavedTrack;