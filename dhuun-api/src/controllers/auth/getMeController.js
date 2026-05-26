import User
  from '../../models/User.js';

const getMeController =
  async (
    req,
    res
  ) => {

    try {

      if (
        !req.user?.id
      ) {

        return res
          .status(401)
          .json({

            success: false,

            message:
              'Unauthorized',

          });

      }

      const user =
        await User.findById(
          req.user.id
        ).select(
          '-password'
        );

      if (!user) {

        return res
          .status(404)
          .json({

            success: false,

            message:
              'User not found',

          });

      }

      return res.json({

        success: true,

        user,

      });

    } catch (error) {

      console.error(error);

      return res
        .status(500)
        .json({

          success: false,

          message:
            'Failed to fetch user',

        });

    }

  };

export default
  getMeController;