import mongoose from 'mongoose';

import Artist from '../../models/Artist.js';

/* -------------------------------------------------------------------------- */
/* Create Artist */
/* -------------------------------------------------------------------------- */

export const createArtist =
  async (req, res) => {

    try {

      const {
        stageName,
        realName,
        bio,
        artistType,
        isVerified,
      } = req.body;

      /* ----------------------------------- */
      /* Validate Stage Name */
      /* ----------------------------------- */

      if (
        !stageName?.trim()
      ) {

        return res.status(400).json({

          success: false,

          message:
            'Stage name is required',

        });
      }

      /* ----------------------------------- */
      /* Prevent Duplicate Stage Names */
      /* ----------------------------------- */

      const existingArtist =
        await Artist.findOne({

          stageName: {

            $regex:
              new RegExp(
                `^${stageName.trim()}$`,
                'i'
              ),

          },

        });

      if (existingArtist) {

        return res.status(400).json({

          success: false,

          message:
            'Artist with this stage name already exists',

        });
      }

      /* ----------------------------------- */
      /* Create Artist */
      /* ----------------------------------- */

      const artist =
        await Artist.create({

          userId:
            req.user.id,

          stageName:
            stageName.trim(),

          realName:
            realName || '',

          bio:
            bio || '',

          artistType:
            artistType ||
            'INDIE',

          isVerified:
            isVerified === true ||
            isVerified === 'true',

          profileImage:
            req.file
              ? `/uploads/${req.file.filename}`
              : '',

        });

      res.status(201).json({

        success: true,

        artist,

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          'Failed to create artist',

      });

    }
  };

/* -------------------------------------------------------------------------- */
/* Get Artists */
/* -------------------------------------------------------------------------- */

export const getArtists =
  async (req, res) => {

    try {

      const artists =
        await Artist.find()
          .sort({
            createdAt: -1,
          });

      res.status(200).json({

        success: true,

        artists,

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          'Failed to fetch artists',

      });

    }
  };

/* -------------------------------------------------------------------------- */
/* Update Artist */
/* -------------------------------------------------------------------------- */

export const updateArtist =
  async (req, res) => {

    try {

      const {
        stageName,
        realName,
        bio,
        artistType,
        isVerified,
      } = req.body;

      const artist =
        await Artist.findById(
          req.params.id
        );

      if (!artist) {

        return res.status(404).json({

          success: false,

          message:
            'Artist not found',

        });
      }

      /* ----------------------------------- */
      /* Prevent Duplicate Stage Names */
      /* ----------------------------------- */

      if (
        stageName &&
        stageName.trim() !==
          artist.stageName
      ) {

        const existingArtist =
          await Artist.findOne({

            _id: {
              $ne:
                artist._id,
            },

            stageName: {

              $regex:
                new RegExp(
                  `^${stageName.trim()}$`,
                  'i'
                ),

            },

          });

        if (existingArtist) {

          return res.status(400).json({

            success: false,

            message:
              'Artist with this stage name already exists',

          });
        }
      }

      /* ----------------------------------- */
      /* Update Artist */
      /* ----------------------------------- */

      artist.stageName =
        stageName?.trim() ||
        artist.stageName;

      artist.realName =
        realName ||
        artist.realName;

      artist.bio =
        bio ||
        artist.bio;

      artist.artistType =
        artistType ||
        artist.artistType;

      if (
        typeof isVerified !==
        'undefined'
      ) {

        artist.isVerified =
          isVerified === true ||
          isVerified === 'true';
      }

      if (req.file) {

        artist.profileImage =
          `/uploads/${req.file.filename}`;
      }

      await artist.save();

      res.status(200).json({

        success: true,

        artist,

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          'Failed to update artist',

      });

    }
  };

/* -------------------------------------------------------------------------- */
/* Delete Artist */
/* -------------------------------------------------------------------------- */

export const deleteArtist =
  async (req, res) => {

    try {

      const artist =
        await Artist.findById(
          req.params.id
        );

      if (!artist) {

        return res.status(404).json({

          success: false,

          message:
            'Artist not found',

        });
      }

      await artist.deleteOne();

      res.status(200).json({

        success: true,

        message:
          'Artist deleted successfully',

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          'Failed to delete artist',

      });

    }
  };