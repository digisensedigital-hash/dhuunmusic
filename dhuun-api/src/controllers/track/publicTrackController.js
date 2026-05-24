import Track from '../../models/Track.js';

import mongoose
  from 'mongoose';

import TrackAnalytics
  from '../../models/TrackAnalytics.js';

import TrendingTrack
  from '../../models/TrendingTrack.js';

import serializeTrack
  from '../../serializers/serializeTrack.js';

export const getPublicTracks =
  async (req, res) => {

    try {

      const tracks =
        await Track.find({

          publishingStatus:
            'PUBLISHED',

          processingStatus:
            'READY',

          isActive: true,

        })

          .populate(
            'primaryArtist',
            'stageName profileImage'
          )

          .sort({
            createdAt: -1,
          });

      return res.json({

        success: true,

        tracks:
          tracks.map(
            serializeTrack
          ),
      });

    } catch (error) {

      console.error(error);

      return res.status(500)
        .json({

          success: false,

          message:
            'Failed to fetch public tracks',
        });
    }
};

export const getPublicTrackDetails =
  async (req, res) => {
    try {

      const { identifier } =
        req.params;

      const query =

        mongoose.Types.ObjectId.isValid(
          identifier
        )

          ? { _id: identifier }

          : { slug: identifier };

      const track =
        await Track.findOne({

          ...query,

          /*
          |--------------------------------------------------------------------------
          | Publishing Protection
          |--------------------------------------------------------------------------
          | Only publicly available tracks
          */

          publishingStatus:
            'PUBLISHED',

          processingStatus:
            'READY',

          isActive: true,
        })

          .populate(
            'primaryArtist',
            'stageName profileImage bio'
          );

      if (!track) {

        return res.status(404)
          .json({
            success: false,

            message:
              'Track not found'
          });
      }

      /* ----------------------------------- */
      /* Variant Resolution */
      /* ----------------------------------- */

      let rootMasterTrackId =
        null;

      /*
      |--------------------------------------------------------------------------
      | Master Track
      |--------------------------------------------------------------------------
      */

      if (
        track.isMasterTrack
      ) {

        rootMasterTrackId =
          track._id;
      }

      /*
      |--------------------------------------------------------------------------
      | Variant Track
      |--------------------------------------------------------------------------
      */

      else if (
        track.masterTrackId
      ) {

        rootMasterTrackId =
          track.masterTrackId;
      }

      /* ----------------------------------- */
      /* Variants */
      /* ----------------------------------- */

      let variants = [];

      if (rootMasterTrackId) {

        const variantTracks =
          await Track.find({

            publishingStatus:
              'PUBLISHED',

            processingStatus:
              'READY',

            isActive: true,

            $or: [

              {
                _id:
                  rootMasterTrackId
              },

              {
                masterTrackId:
                  rootMasterTrackId
              }
            ]
          })

            .populate(
              'primaryArtist',
              'stageName profileImage'
            )

            .sort({
              createdAt: 1
            });

        variants =
          variantTracks.map(
            (variantTrack) => ({

              _id:
                variantTrack._id,

              title:
                variantTrack.title,

              language:
                variantTrack.language,

              versionType:
                variantTrack.versionType,

              isMasterTrack:
                variantTrack.isMasterTrack,

              coverImage:
                variantTrack.coverImage,

              primaryArtist:
                variantTrack.primaryArtist
                  ? {
                      _id:
                        variantTrack
                          .primaryArtist
                          ._id,

                      stageName:
                        variantTrack
                          .primaryArtist
                          .stageName,

                      profileImage:
                        variantTrack
                          .primaryArtist
                          .profileImage,
                    }
                  : null,
            })
          );
      }

      /* ----------------------------------- */
      /* Analytics */
      /* ----------------------------------- */

      const analytics =
        await TrackAnalytics.findOne({
          trackId:
            track._id
        });

      /* ----------------------------------- */
      /* Trending */
      /* ----------------------------------- */

      const trending =
        await TrendingTrack.findOne({
          trackId:
            track._id,

          window:
            'DAILY'
        });

      return res.json({
        success: true,

        track:
          serializeTrack(track),

        /*
        |--------------------------------------------------------------------------
        | Variants
        |--------------------------------------------------------------------------
        */

        variants,

        analytics: analytics
          ? {
              totalStreams:
                analytics.totalStreams,

              qualifiedStreams:
                analytics.qualifiedStreams,

              completionRate:
                analytics.completionRate,

              totalListeningTime:
                analytics.totalListeningTime
            }
          : null,

        trending: trending
          ? {
              rank:
                trending.rank,

              score:
                trending.score
            }
          : null
      });

    } catch (error) {

      console.error(error);

      return res.status(500)
        .json({
          success: false,

          message:
            'Failed to fetch track details'
        });
    }
  };