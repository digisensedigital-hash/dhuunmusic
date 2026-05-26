import {
  GUEST_CAPABILITIES,
  TRIAL_CAPABILITIES,
  PREMIUM_CAPABILITIES,
} from '../../constants/capabilities/capabilityDefaults.js';

import getTrialStatus
  from '../subscription/getTrialStatus.js';

const getUserCapabilities = (
  user
) => {

  /* ----------------------------------- */
  /* Guest */
  /* ----------------------------------- */

  if (!user) {

    return {

      isGuest: true,

      isRegistered: false,

      isPremium: false,

      trialActive: false,

      canUseMeanings: false,

      canPreviewMeanings: true,

      requiresRegistrationForMeanings: true,

      ...GUEST_CAPABILITIES,

    };

  }

  /* ----------------------------------- */
  /* Premium */
  /* ----------------------------------- */

  if (
    user.subscriptionStatus ===
    'PREMIUM'
  ) {

    return {

      isGuest: false,

      isRegistered: true,

      isPremium: true,

      trialActive: false,

      canPreviewMeanings: true,

      ...PREMIUM_CAPABILITIES,

    };

  }

  /* ----------------------------------- */
  /* Trial */
  /* ----------------------------------- */

  const {
    trialActive,
    trialExpired,
    trialDaysRemaining,
  } = getTrialStatus(user);

  if (trialActive) {

    return {

      isGuest: false,

      isRegistered: true,

      isPremium: false,

      trialActive: true,

      trialExpired: false,

      trialDaysRemaining,

      canPreviewMeanings: true,

      ...TRIAL_CAPABILITIES,

    };

  }

  /* ----------------------------------- */
  /* Registered Free User */
  /* ----------------------------------- */

  return {

    isGuest: false,

    isRegistered: true,

    isPremium: false,

    trialActive: false,

    trialExpired,

    trialDaysRemaining,

    canUseMeanings: false,

    canPreviewMeanings: true,

    requiresPremiumForMeanings: true,

    ...GUEST_CAPABILITIES,

  };

};

export default getUserCapabilities;