import mongoose from 'mongoose';

const socialLinksSchema = new mongoose.Schema(
  {
    instagram: {
      type: String,
      default: '',
    },

    youtube: {
      type: String,
      default: '',
    },

    spotify: {
      type: String,
      default: '',
    },

    appleMusic: {
      type: String,
      default: '',
    },

    website: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const analyticsSchema = new mongoose.Schema(
  {
    monthlyListeners: {
      type: Number,
      default: 0,
    },

    followers: {
      type: Number,
      default: 0,
    },

    popularityScore: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const ownershipSchema = new mongoose.Schema(
  {
    managedByLabel: {
      type: Boolean,
      default: false,
    },

    labelName: {
      type: String,
      default: '',
    },

    publishingOwner: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const artistSchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | User Ownership
    |--------------------------------------------------------------------------
    */

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    /*
    |--------------------------------------------------------------------------
    | Identity
    |--------------------------------------------------------------------------
    */

    stageName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    realName: {
      type: String,
      default: '',
    },

    bio: {
      type: String,
      default: '',
    },

    /*
    |--------------------------------------------------------------------------
    | Media
    |--------------------------------------------------------------------------
    */

    profileImage: {
      type: String,
      default: '',
    },

    coverImage: {
      type: String,
      default: '',
    },

    /*
    |--------------------------------------------------------------------------
    | Verification
    |--------------------------------------------------------------------------
    */

    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Artist Classification
    |--------------------------------------------------------------------------
    */

    artistType: {
      type: String,
      enum: [
        'DHUUN_ORIGINAL',
        'INDIE',
        'LABEL_ARTIST',
        'FEATURED_ARTIST',
        'PRODUCER',
        'WRITER',
        'COMPOSER',
      ],
      default: 'INDIE',
    },

    roles: [
      {
        type: String,

        enum: [
          'SINGER',
          'WRITER',
          'COMPOSER',
          'PRODUCER',
          'FEATURED_ARTIST',
          'MUSIC_ARRANGER',
          'MIX_ENGINEER',
          'MASTER_ENGINEER',
          'GUITARIST',
          'BASSIST',
          'DRUMMER',
          'PIANIST',
          'TABLA_PLAYER',
          'FLUTE_PLAYER',
        ],
      },
    ],

    /*
    |--------------------------------------------------------------------------
    | Discovery Metadata
    |--------------------------------------------------------------------------
    */

    genres: [
      {
        type: String,
        trim: true,
      },
    ],

    moods: [
      {
        type: String,
        trim: true,
      },
    ],

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    languages: [
      {
        type: String,
        trim: true,
      },
    ],

    /*
    |--------------------------------------------------------------------------
    | Rights & Ownership
    |--------------------------------------------------------------------------
    */

    ownership: {
      type: ownershipSchema,
      default: () => ({}),
    },

    /*
    |--------------------------------------------------------------------------
    | Streaming Analytics
    |--------------------------------------------------------------------------
    */

    analytics: {
      type: analyticsSchema,
      default: () => ({}),
    },

    /*
    |--------------------------------------------------------------------------
    | Social Links
    |--------------------------------------------------------------------------
    */

    socialLinks: {
      type: socialLinksSchema,
      default: () => ({}),
    },

    /*
    |--------------------------------------------------------------------------
    | Status
    |--------------------------------------------------------------------------
    */

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/*
|--------------------------------------------------------------------------
| Text Search Index
|--------------------------------------------------------------------------
*/

artistSchema.index({
  stageName: 'text',
  realName: 'text',
  bio: 'text',
  genres: 'text',
  tags: 'text',
});

/*
|--------------------------------------------------------------------------
| Auto Slug Generation
|--------------------------------------------------------------------------
*/

artistSchema.pre(
  'save',
  function () {

    if (
      !this.slug &&
      this.stageName
    ) {
      this.slug =
        this.stageName
          .toLowerCase()
          .trim()
          .replace(
            /[^\w\s-]/g,
            ''
          )
          .replace(
            /\s+/g,
            '-'
          )
          .replace(
            /-+/g,
            '-'
          );
    }
  }
);

const Artist = mongoose.model('Artist', artistSchema);

export default Artist;