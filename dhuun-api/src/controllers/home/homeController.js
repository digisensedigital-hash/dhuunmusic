import TrendingTrack
  from '../../models/TrendingTrack.js';

import SavedTrack
  from '../../models/SavedTrack.js';

import RecentlyPlayed
  from '../../models/RecentlyPlayed.js';

import Playlist
  from '../../models/Playlist.js';

import Track
  from '../../models/Track.js';

import getRecommendations
  from '../../services/recommendation/getRecommendations.js';

import serializeTrack
  from '../../serializers/serializeTrack.js';

import serializeRecommendation
  from '../../serializers/serializeRecommendation.js';

import serializeRecentlyPlayed
  from '../../serializers/serializeRecentlyPlayed.js';

import serializeSavedTrack
  from '../../serializers/serializeSavedTrack.js';

import serializePlaylist
  from '../../serializers/serializePlaylist.js';

export const getHomeFeed =
  async (req, res) => {
    try {

      const userId =
        req.user?.id || null;

      // -----------------------------------
      // Trending Runtime
      // -----------------------------------

      let trending =
        await TrendingTrack.find({
          window: 'DAILY'
        })
          .sort({ rank: 1 })
          .limit(10)
          .populate({
            path: 'trackId',

            match: {

              publishingStatus:
                'PUBLISHED',

              processingStatus:
                'READY',

              isActive: true,
            },

            populate: {
              path: 'primaryArtist',

              select:
                'stageName profileImage',
            },
          });

      // -----------------------------------
      // Ensure Primary Artist Population
      // -----------------------------------

      for (const item of trending) {

        if (item.trackId) {

          await item.trackId.populate(
            'primaryArtist',
            'stageName profileImage'
          );
        }
      }

      // -----------------------------------
      // Remove Null Hydrated Tracks
      // -----------------------------------

      trending =
        trending.filter(
          (item) => item.trackId
        );

      // -----------------------------------
      // Sparse Catalog Fallback
      // -----------------------------------

      if (
        trending.length < 10
      ) {

        const existingIds =
          trending.map(
            (item) =>
              item.trackId?._id?.toString()
          );

        const fallbackTracks =
          await Track.find({

            _id: {
              $nin: existingIds
            },

            publishingStatus:
              'PUBLISHED',

            processingStatus:
              'READY',

            isActive: true,
          })
            .sort({
              createdAt: -1
            })
            .limit(
              10 -
              trending.length
            )
            .populate({
              path:
                'primaryArtist',

              select:
                'stageName profileImage'
            });

        const fallbackTrending =
          fallbackTracks.map(
            (
              track,
              index
            ) => ({
              rank:
                trending.length +
                index +
                1,

              score: 0,

              trackId: track
            })
          );

        trending = [
          ...trending,
          ...fallbackTrending
        ];
      }

      // -----------------------------------
      // Recommendations
      // -----------------------------------

      const recommended =
        userId
          ? await getRecommendations({
              userId
            })
          : [];

      // -----------------------------------
      // Recently Played
      // -----------------------------------

      const recentlyPlayed =
        userId
          ? (
              await RecentlyPlayed.find({
                userId
              })
                .sort({
                  playedAt: -1
                })
                .limit(50)
                .populate({
                  path: 'trackId',

                  match: {

                    publishingStatus:
                      'PUBLISHED',

                    processingStatus:
                      'READY',

                    isActive: true,
                  },

                  populate: {
                    path: 'primaryArtist',

                    select:
                      'stageName profileImage'
                  }
                })
            ).filter(
              (item) => item.trackId
            )
          : [];

      // -----------------------------------
      // Saved Tracks
      // -----------------------------------

      const savedTracks =
        userId
          ? (
              await SavedTrack.find({
                userId
              })
                .sort({
                  savedAt: -1
                })
                .limit(50)
                .populate({
                  path: 'trackId',

                  match: {

                    publishingStatus:
                      'PUBLISHED',

                    processingStatus:
                      'READY',

                    isActive: true,
                  },

                  populate: {
                    path: 'primaryArtist',

                    select:
                      'stageName profileImage'
                  }
                })
            ).filter(
              (item) => item.trackId
            )
          : [];

      // -----------------------------------
      // Playlists
      // -----------------------------------

      const playlists =
        userId
          ? await Playlist.find({
              ownerId: userId
            })
              .sort({
                updatedAt: -1
              })
              .limit(10)
              .populate({
                path: 'tracks.trackId',

                match: {

                  publishingStatus:
                    'PUBLISHED',

                  processingStatus:
                    'READY',

                  isActive: true,
                },

                populate: {
                  path: 'primaryArtist',

                  select:
                    'stageName profileImage'
                }
              })
          : [];

      // -----------------------------------
      // Remove Null Playlist Tracks
      // -----------------------------------

      for (const playlist of playlists) {

        playlist.tracks =
          playlist.tracks.filter(
            (item) => item.trackId
          );
      }

      // -----------------------------------
      // Response
      // -----------------------------------

      res.json({
        success: true,

        home: {

          trending:
            trending
              .filter(
                (item) => item.trackId
              )
              .map(
                (item) => ({
                  rank:
                    item.rank,

                  score:
                    item.score,

                  track:
                    serializeTrack(
                      item.trackId
                    )
                })
              ),

          recommended:
            recommended
              .filter(
                (item) =>
                  item.track &&
                  item.track
                    .publishingStatus ===
                    'PUBLISHED' &&
                  item.track
                    .processingStatus ===
                    'READY' &&
                  item.track
                    .isActive === true
              )
              .map(
                serializeRecommendation
              ),

          recentlyPlayed:
            recentlyPlayed
              .slice(0, 10)
              .map(
                serializeRecentlyPlayed
              ),

          savedTracks:
            savedTracks
              .slice(0, 10)
              .map(
                serializeSavedTrack
              ),

          playlists:
            playlists.map(
              serializePlaylist
            )
        }
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,

        message:
          'Failed to load home feed'
      });
    }
  };