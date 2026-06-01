const getSaveGateDecision = ({

  user,

  savedTracks = [],

  capabilities,

}) => {

  const currentCount =
    savedTracks.length;

  /* ----------------------------------- */
  /* Capabilities Not Ready */
  /* ----------------------------------- */

  if (!capabilities) {

    return {

      allowed: true,

      currentCount,

      limit: null,

      remaining: null,

      reason: null,

    };

  }

  const library =

    capabilities
      ?.features
      ?.library ??

    {

      maxSavedTracks: 0,

      unlimitedSavedTracks: false,

    };

  const limit =
    library.maxSavedTracks;

  const unlimited =

    library
      ?.unlimitedSavedTracks ||

    limit === null;

  /* ----------------------------------- */
  /* Unlimited Access */
  /* ----------------------------------- */

  if (unlimited) {

    return {

      allowed: true,

      currentCount,

      limit: null,

      remaining: null,

      reason: null,

    };

  }

  /* ----------------------------------- */
  /* Invalid Limit Fallback */
  /* ----------------------------------- */

  if (
    typeof limit !==
    'number'
  ) {

    return {

      allowed: true,

      currentCount,

      limit: null,

      remaining: null,

      reason: null,

    };

  }

  const remaining =
    Math.max(
      limit - currentCount,
      0
    );

  /* ----------------------------------- */
  /* Within Limit */
  /* ----------------------------------- */

  if (
    currentCount < limit
  ) {

    return {

      allowed: true,

      currentCount,

      limit,

      remaining,

      reason: null,

    };

  }

  /* ----------------------------------- */
  /* Guest Limit Reached */
  /* ----------------------------------- */

  if (!user) {

    return {

      allowed: false,

      currentCount,

      limit,

      remaining: 0,

      reason:
        'REGISTRATION_REQUIRED',

    };

  }

  /* ----------------------------------- */
  /* Free User Limit Reached */
  /* ----------------------------------- */

  return {

    allowed: false,

    currentCount,

    limit,

    remaining: 0,

    reason:
      'PREMIUM_REQUIRED',

  };

};

export default
  getSaveGateDecision;