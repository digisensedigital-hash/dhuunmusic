import jwt from 'jsonwebtoken';

/* ----------------------------------- */
/* Generate Token */
/* ----------------------------------- */

export const generateToken =
  (user) => {

    return jwt.sign(
      {
        id:
          user._id,

        email:
          user.email,

        roles:
          user.roles,

        artistProfile:
          user.artistProfile ||
          null,

        labelProfile:
          user.labelProfile ||
          null,

        subscriptionStatus:
          user.subscriptionStatus,

        isVerified:
          user.isVerified ||
          false,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: '7d',
      }
    );
  };

/* ----------------------------------- */
/* Verify Token */
/* ----------------------------------- */

export const verifyToken =
  (token) => {
    return jwt.verify(
      token,
      process.env.JWT_SECRET
    );
  };