import mongoose from 'mongoose';

const contributorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      default: null
    },

    name: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: [
        'SINGER',
        'WRITER',
        'COMPOSER',
        'PRODUCER',
        'FEATURED_ARTIST',
        'MIX_ENGINEER',
        'MASTER_ENGINEER'
      ],
      required: true
    },

    royaltyShare: {
      type: Number,
      required: true
    },

    verified: {
      type: Boolean,
      default: false
    }
  },
  {
    _id: false
  }
);

const trackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    slug: {
      type: String,
      required: true,
      unique: true
    },

    primaryArtist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      required: true
    },

    contributors: [contributorSchema],

    genre: {
      type: String,
      default: 'Unknown'
    },

    language: {
      type: String,
      default: 'Hindi'
    },

    coverImage: {
      type: String,
      default: ''
    },

    originalAudio: {
      type: String,
      default: ''
    },

    hlsMasterUrl: {
      type: String,
      default: ''
    },

    duration: {
      type: Number,
      default: 0
    },

    bitrate: {
      type: Number,
      default: 0
    },

    codec: {
      type: String,
      default: ''
    },

    audioFormat: {
      type: String,
      default: ''
    },

    releaseType: {
      type: String,
      enum: ['SINGLE', 'EP', 'ALBUM'],
      default: 'SINGLE'
    },

    visibility: {
      type: String,
      enum: ['PRIVATE', 'PENDING', 'PUBLISHED'],
      default: 'PRIVATE'
    },

    processingStatus: {
      type: String,
      enum: [
        'UPLOADED',
        'PROCESSING',
        'READY',
        'FAILED'
      ],
      default: 'UPLOADED'
    },

    totalRoyaltyShare: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Track = mongoose.model('Track', trackSchema);

export default Track;