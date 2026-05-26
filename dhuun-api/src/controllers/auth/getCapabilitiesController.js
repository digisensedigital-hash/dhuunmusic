import getUserCapabilities
  from '../../services/auth/getUserCapabilities.js';

const getCapabilitiesController =
  async (
    req,
    res
  ) => {

    try {

      const capabilities =
        getUserCapabilities(
          req.user || null
        );

      return res.json({

        success: true,

        capabilities,

      });

    } catch (error) {

      console.error(error);

      return res
        .status(500)
        .json({

          success: false,

          message:
            'Failed to fetch capabilities',

        });

    }

  };

export default
  getCapabilitiesController;