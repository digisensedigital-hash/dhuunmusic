import Track from '../models/Track.js';

/* -------------------------------------------------------------------------- */
/* Publishing Scheduler */
/* -------------------------------------------------------------------------- */

const startPublishingScheduler =
  () => {

    console.log(
      '🕒 Publishing scheduler started'
    );

    /*
    |--------------------------------------------------------------------------
    | Check Every Minute
    |--------------------------------------------------------------------------
    */

    setInterval(
      async () => {

        try {

          const now =
            new Date();

          /* -------------------------------------------------------------- */
          /* Find Scheduled Tracks */
          /* -------------------------------------------------------------- */

          const tracks =
            await Track.find({

              publishingStatus:
                'DRAFT',

              scheduledPublishAt: {
                $ne: null,

                $lte: now,
              },

              processingStatus:
                'READY',

              isActive: true,
            });

          if (!tracks.length) {
            return;
          }

          console.log(
            `🚀 Publishing ${tracks.length} scheduled track(s)`
          );

          /* -------------------------------------------------------------- */
          /* Publish Tracks */
          /* -------------------------------------------------------------- */

          for (const track of tracks) {

            track.publishingStatus =
              'PUBLISHED';

            track.publishedAt =
              new Date();

            track.reviewedAt =
              new Date();

            await track.save();

            console.log(
              `✅ Published: ${track.title}`
            );
          }

        } catch (error) {

          console.error(
            '❌ Publishing scheduler failed'
          );

          console.error(error);
        }

      },

      /*
      |--------------------------------------------------------------------------
      | 1 Minute
      |--------------------------------------------------------------------------
      */

      60 * 1000
    );
  };

export default
  startPublishingScheduler;