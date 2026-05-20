import bcrypt from 'bcrypt';

import User from '../../models/User.js';

import {
  generateToken,
} from '../../services/auth/jwtService.js';

/* ----------------------------------- */
/* Sanitize User */
/* ----------------------------------- */

const sanitizeUser =
  (user) => ({
    _id:
      user._id,

    name:
      user.name,

    email:
      user.email,

    roles:
      user.roles,

    subscriptionStatus:
      user.subscriptionStatus,

    artistProfile:
      user.artistProfile,

    labelProfile:
      user.labelProfile,

    avatar:
      user.avatar,

    bio:
      user.bio,

    isVerified:
      user.isVerified,

    emailVerified:
      user.emailVerified,

    createdAt:
      user.createdAt,
  });

/* ----------------------------------- */
/* Register */
/* ----------------------------------- */

export const registerUser =
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
      } = req.body;

      const normalizedEmail =
        email
          .toLowerCase()
          .trim();

      const existingUser =
        await User.findOne({
          email:
            normalizedEmail,
        });

      if (existingUser) {
        return res.status(400)
          .json({
            success: false,

            message:
              'User already exists',
          });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const user =
        await User.create({
          name:
            name.trim(),

          email:
            normalizedEmail,

          password:
            hashedPassword,
        });

      const token =
        generateToken(user);

      return res.status(201)
        .json({
          success: true,

          token,

          user:
            sanitizeUser(
              user
            ),
        });

    } catch (error) {
      console.error(error);

      return res.status(500)
        .json({
          success: false,

          message:
            'Registration failed',
        });
    }
  };

/* ----------------------------------- */
/* Login */
/* ----------------------------------- */

export const loginUser =
  async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;

      const normalizedEmail =
        email
          .toLowerCase()
          .trim();

      const user =
        await User.findOne({
          email:
            normalizedEmail,
        });

      if (!user) {
        return res.status(401)
          .json({
            success: false,

            message:
              'Invalid credentials',
          });
      }

      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isMatch) {
        return res.status(401)
          .json({
            success: false,

            message:
              'Invalid credentials',
          });
      }

      /* ----------------------------------- */
      /* Login Intelligence */
      /* ----------------------------------- */

      user.lastLoginAt =
        new Date();

      await user.save();

      const token =
        generateToken(user);

      return res.status(200)
        .json({
          success: true,

          token,

          user:
            sanitizeUser(
              user
            ),
        });

    } catch (error) {
      console.error(error);

      return res.status(500)
        .json({
          success: false,

          message:
            'Login failed',
        });
    }
  };