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

      trialExpired: false,

      canUseMeanings: false,

      canUseAllScripts: false,

      canPreviewMeanings: true,

      requiresRegistrationForMeanings: true,

      requiresRegistrationForScripts: true,

      requiresPremiumForScripts: false,

      ...GUEST_CAPABILITIES,

    };

  }

  /* ----------------------------------- */
  /* Premium */
  /* ----------------------------------- */

  if (
    [
      'PRO',
      'BUSINESS',
      'ENTERPRISE',
    ].includes(
      user.subscriptionStatus
    )
  ) {

    return {

      isGuest: false,

      isRegistered: true,

      isPremium: true,

      trialActive: false,

      trialExpired: false,

      canUseMeanings: true,

      canUseAllScripts: true,

      canPreviewMeanings: true,

      requiresRegistrationForScripts: false,

      requiresPremiumForScripts: false,

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

      canUseMeanings: true,

      canUseAllScripts: true,

      canPreviewMeanings: true,

      requiresRegistrationForScripts: false,

      requiresPremiumForScripts: false,

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

    canUseAllScripts: false,

    canPreviewMeanings: true,

    requiresPremiumForMeanings: true,

    requiresRegistrationForScripts: false,

    requiresPremiumForScripts: true,

    ...GUEST_CAPABILITIES,

  };

};

export default getUserCapabilities;