import fs from 'fs';

import mongoose from 'mongoose';

import Artist from '../../models/Artist.js';

import uploadToMinio
  from '../../services/storage/uploadToMinio.js';

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
        roles,
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
      /* Upload Artist Image */
      /* ----------------------------------- */

      let profileImage = '';

      if (req.file) {

        profileImage =
          await uploadToMinio(

            req.file.path,

            req.file.originalname,

            req.file.mimetype,

            'artists'
          );

        fs.unlinkSync(
          req.file.path
        );
      }

      /* ----------------------------------- */
      /* Create Artist */
      /* ----------------------------------- */

      let normalizedRoles = [];

      if (roles) {

        normalizedRoles =

          typeof roles === 'string'

            ? JSON.parse(roles)

            : roles;
      }

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

          roles:
            normalizedRoles,

          isVerified:
            isVerified === true ||
            isVerified === 'true',

          profileImage,

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
        roles,
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

      if (roles) {

        artist.roles =

          typeof roles === 'string'

            ? JSON.parse(roles)

            : roles;
      }

      if (
        typeof stageName !==
        'undefined'
      ) {

        artist.stageName =
          stageName.trim();
      }

      if (
        typeof realName !==
        'undefined'
      ) {

        artist.realName =
          realName;
      }

      if (
        typeof bio !==
        'undefined'
      ) {

        artist.bio =
          bio;
      }

      if (
        typeof artistType !==
        'undefined'
      ) {

        artist.artistType =
          artistType;
      }

      if (
        typeof isVerified !==
        'undefined'
      ) {

        artist.isVerified =
          isVerified === true ||
          isVerified === 'true';
      }

      /* ----------------------------------- */
      /* Upload New Artist Image */
      /* ----------------------------------- */

      if (req.file) {

        const profileImage =

          await uploadToMinio(

            req.file.path,

            req.file.originalname,

            req.file.mimetype,

            'artists'
          );

        fs.unlinkSync(
          req.file.path
        );

        artist.profileImage =
          profileImage;
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