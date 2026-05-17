import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    stageName: {
      type: String,
      required: true
    },

    bio: {
      type: String,
      default: ''
    },

    profileImage: {
      type: String,
      default: ''
    },

    coverImage: {
      type: String,
      default: ''
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    artistType: {
      type: String,
      enum: ['DHUUN_ORIGINAL', 'INDIE'],
      default: 'INDIE'
    },

    socialLinks: {
      instagram: String,
      youtube: String,
      spotify: String
    }
  },
  {
    timestamps: true
  }
);

const Artist = mongoose.model('Artist', artistSchema);

export default Artist;