import mongoose from 'mongoose';

const playlistSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true
      },

      description: {
        type: String,
        default: ''
      },

      ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },

      tracks: [
        {
          trackId: {
            type:
              mongoose.Schema.Types.ObjectId,
            ref: 'Track'
          },

          addedAt: {
            type: Date,
            default: Date.now
          }
        }
      ],

      visibility: {
        type: String,
        enum: [
          'PUBLIC',
          'PRIVATE',
          'UNLISTED'
        ],
        default: 'PUBLIC'
      },

      coverImage: {
        type: String,
        default: ''
      },

      totalTracks: {
        type: Number,
        default: 0
      },

      totalDuration: {
        type: Number,
        default: 0
      },

      followersCount: {
        type: Number,
        default: 0
      }
    },
    {
      timestamps: true
    }
  );

playlistSchema.index({
  ownerId: 1
});

playlistSchema.index({
  visibility: 1
});

const Playlist =
  mongoose.model(
    'Playlist',
    playlistSchema
  );

export default Playlist;