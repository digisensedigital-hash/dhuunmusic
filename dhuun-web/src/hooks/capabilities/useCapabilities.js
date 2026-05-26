import capabilityStore
  from '../../store/capabilityStore';

import authStore
  from '../../store/auth/authStore';

const useCapabilities =
  () => {

    const {
      capabilities,
      loading,
    } = capabilityStore();

    const {
      user,
    } = authStore();

    return {

      loading,

      isGuest:
        capabilities?.isGuest ??
        true,

      isRegistered:
        capabilities?.isRegistered ??
        false,

      isPremium:
        capabilities?.isPremium ??
        false,

      trialActive:
        capabilities?.trialActive ??
        false,

      trialExpired:
        capabilities?.trialExpired ??
        false,

      trialDaysRemaining:
        capabilities?.trialDaysRemaining ??
        0,

      canUseMeanings:
        capabilities?.canUseMeanings ??
        false,

      canPreviewMeanings:
        capabilities?.canPreviewMeanings ??
        true,

      requiresRegistrationForMeanings:
        capabilities?.requiresRegistrationForMeanings ??
        !user,

      requiresPremiumForMeanings:
        capabilities?.requiresPremiumForMeanings ??
        false,

      canUseShuffle:
        capabilities?.canUseShuffle ??
        false,

      canUseRepeat:
        capabilities?.canUseRepeat ??
        false,

      allowedMeaningLanguages:
        capabilities?.allowedMeaningLanguages ??
        [],

      maxSavedTracks:
        capabilities?.maxSavedTracks ??
        0,

    };

  };

export default
  useCapabilities;