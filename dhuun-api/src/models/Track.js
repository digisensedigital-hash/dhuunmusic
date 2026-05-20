import mongoose from 'mongoose';

/* -------------------------------------------------------------------------- */
/* Contributor Schema */
/* -------------------------------------------------------------------------- */

const contributorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      default: null,
    },

    displayName: {
      type: String,
      required: true,
      trim: true,
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
        'MASTER_ENGINEER',
      ],

      required: true,
    },

    royaltyShare: {
      type: Number,
      default: 0,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    credits: {
      type: String,
      default: '',
    },
  },
  {
    _id: false,
  }
);

/* -------------------------------------------------------------------------- */
/* Rights Ownership Schema */
/* -------------------------------------------------------------------------- */

const rightsOwnershipSchema = new mongoose.Schema(
  {
    masterOwner: {
      type: String,
      default: '',
    },

    publishingOwner: {
      type: String,
      default: '',
    },

    copyrightYear: {
      type: Number,
      default: new Date().getFullYear(),
    },

    copyrightText: {
      type: String,
      default: '',
    },

    distributionRights: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

/* -------------------------------------------------------------------------- */
/* AI Metadata Schema */
/* -------------------------------------------------------------------------- */

const aiMetadataSchema = new mongoose.Schema(
  {
    detectedMood: [String],

    detectedGenres: [String],

    energyScore: {
      type: Number,
      default: 0,
    },

    danceabilityScore: {
      type: Number,
      default: 0,
    },

    acousticnessScore: {
      type: Number,
      default: 0,
    },

    instrumentalnessScore: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

/* -------------------------------------------------------------------------- */
/* Main Track Schema */
/* -------------------------------------------------------------------------- */

const trackSchema = new mongoose.Schema(
  {
    /* ---------------------------------------------------------------------- */
    /* Core Metadata */
    /* ---------------------------------------------------------------------- */

    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Legacy Compatibility
    |--------------------------------------------------------------------------
    | Keep these for existing APIs & playback flows
    */

    primaryArtist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      required: true,
      index: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Future Multi-Artist Support
    |--------------------------------------------------------------------------
    */

    primaryArtists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
      },
    ],

    featuredArtists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
      },
    ],

    contributors: [contributorSchema],

    /* ---------------------------------------------------------------------- */
    /* Discovery Metadata */
    /* ---------------------------------------------------------------------- */

    genre: {
      type: String,
      default: 'Unknown',
      index: true,
    },

    language: {
      type: String,
      default: 'Hindi',
      index: true,
    },

    moods: [
      {
        type: String,
      },
    ],

    tags: [
      {
        type: String,
      },
    ],

    lyrics: {
      type: String,
      default: '',
    },

    isExplicit: {
      type: Boolean,
      default: false,
    },

    /* ---------------------------------------------------------------------- */
    /* Media Assets */
    /* ---------------------------------------------------------------------- */

    coverImage: {
      type: String,
      default: '',
    },

    originalAudio: {
      type: String,
      default: '',
    },

    hlsMasterUrl: {
      type: String,
      default: '',
    },

    waveform: [
      {
        type: Number,
      },
    ],

    /* ---------------------------------------------------------------------- */
    /* Audio Intelligence */
    /* ---------------------------------------------------------------------- */

    duration: {
      type: Number,
      default: 0,
    },

    bitrate: {
      type: Number,
      default: 0,
    },

    codec: {
      type: String,
      default: '',
    },

    audioFormat: {
      type: String,
      default: '',
    },

    lufs: {
      type: Number,
      default: 0,
    },

    peakDb: {
      type: Number,
      default: 0,
    },

    sampleRate: {
      type: Number,
      default: 0,
    },

    channels: {
      type: Number,
      default: 2,
    },

    /* ---------------------------------------------------------------------- */
    /* Release Metadata */
    /* ---------------------------------------------------------------------- */

    releaseType: {
      type: String,

      enum: [
        'SINGLE',
        'EP',
        'ALBUM',
      ],

      default: 'SINGLE',
    },

    releaseDate: {
      type: Date,
      default: Date.now,
    },

    isrc: {
      type: String,
      default: '',
      index: true,
    },

    upc: {
      type: String,
      default: '',
    },

    catalogNumber: {
      type: String,
      default: '',
    },

    visibility: {
      type: String,

      enum: [
        'PRIVATE',
        'PENDING',
        'PUBLISHED',
        'TAKEDOWN',
      ],

      default: 'PRIVATE',
    },

    processingStatus: {
      type: String,

      enum: [
        'UPLOADED',
        'PROCESSING',
        'READY',
        'FAILED',
      ],

      default: 'UPLOADED',
    },

    /* ---------------------------------------------------------------------- */
    /* Rights Infrastructure */
    /* ---------------------------------------------------------------------- */

    rightsOwnership: {
      type: rightsOwnershipSchema,
      default: () => ({}),
    },

    totalRoyaltyShare: {
      type: Number,
      default: 0,
    },

    /* ---------------------------------------------------------------------- */
    /* AI Metadata */
    /* ---------------------------------------------------------------------- */

    aiMetadata: {
      type: aiMetadataSchema,
      default: () => ({}),
    },

    /* ---------------------------------------------------------------------- */
    /* Analytics */
    /* ---------------------------------------------------------------------- */

    totalStreams: {
      type: Number,
      default: 0,
    },

    totalLikes: {
      type: Number,
      default: 0,
    },

    totalShares: {
      type: Number,
      default: 0,
    },

    totalSaves: {
      type: Number,
      default: 0,
    },

    completionRate: {
      type: Number,
      default: 0,
    },

    trendingScore: {
      type: Number,
      default: 0,
    },

    /* ---------------------------------------------------------------------- */
    /* System */
    /* ---------------------------------------------------------------------- */

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/* -------------------------------------------------------------------------- */
/* Text Search Index */
/* -------------------------------------------------------------------------- */

trackSchema.index({
  title: 'text',
  genre: 'text',
  tags: 'text',
  moods: 'text',
  lyrics: 'text',
});

/* -------------------------------------------------------------------------- */
/* Model */
/* -------------------------------------------------------------------------- */

const Track = mongoose.model('Track', trackSchema);

export default Track;