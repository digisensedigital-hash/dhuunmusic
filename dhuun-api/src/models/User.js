import mongoose from 'mongoose';

const userSchema =
  new mongoose.Schema(
    {
      /* ----------------------------------- */
      /* Core Identity */
      /* ----------------------------------- */

      name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },

      password: {
        type: String,
        required: true,
      },

      /* ----------------------------------- */
      /* Roles */
      /* ----------------------------------- */

      roles: {
        type: [String],

        enum: [
          'LISTENER',
          'ARTIST',
          'LABEL',
          'MANAGER',
          'ADMIN',
          'SUPER_ADMIN',
        ],

        default: ['LISTENER'],
      },

      /* ----------------------------------- */
      /* Platform Relationships */
      /* ----------------------------------- */

      artistProfile: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: 'Artist',

        default: null,
      },

      labelProfile: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: 'Label',

        default: null,
      },

      /* ----------------------------------- */
      /* Verification */
      /* ----------------------------------- */

      isVerified: {
        type: Boolean,
        default: false,
      },

      emailVerified: {
        type: Boolean,
        default: false,
      },

      /* ----------------------------------- */
      /* Subscription */
      /* ----------------------------------- */

      subscriptionStatus: {
        type: String,

        enum: [
          'FREE',
          'PRO',
          'BUSINESS',
          'ENTERPRISE',
        ],

        default: 'FREE',
      },

      /* ----------------------------------- */
      /* Profile */
      /* ----------------------------------- */

      avatar: {
        type: String,
        default: '',
      },

      bio: {
        type: String,
        default: '',
      },

      /* ----------------------------------- */
      /* Auth Intelligence */
      /* ----------------------------------- */

      lastLoginAt: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

const User =
  mongoose.model(
    'User',
    userSchema
  );

export default User;