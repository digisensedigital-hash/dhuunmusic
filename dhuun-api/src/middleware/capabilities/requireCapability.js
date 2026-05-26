import getUserCapabilities
  from '../../services/auth/getUserCapabilities.js';

const requireCapability =
  (capabilityKey) => {

    return (
      req,
      res,
      next
    ) => {

      const capabilities =
        getUserCapabilities(
          req.user || null
        );

      const allowed =
        capabilities?.[
          capabilityKey
        ];

      if (!allowed) {

        return res
          .status(403)
          .json({

            success: false,

            message:
              'This feature requires premium access.',

            capability:
              capabilityKey,

          });

      }

      req.capabilities =
        capabilities;

      next();

    };

  };

export default
  requireCapability;