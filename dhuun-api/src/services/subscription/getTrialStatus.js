const TRIAL_DURATION_DAYS = 14;

const getTrialStatus = (
  user
) => {

  if (!user) {

    return {
      trialActive: false,
      trialExpired: false,
      trialDaysRemaining: 0,
    };

  }

  if (
    user.subscriptionStatus ===
    'PREMIUM'
  ) {

    return {
      trialActive: false,
      trialExpired: false,
      trialDaysRemaining: 0,
    };

  }

  const createdAt =
    new Date(user.createdAt);

  const now =
    new Date();

  const diffInMs =
    now - createdAt;

  const diffInDays =
    Math.floor(
      diffInMs /
      (1000 * 60 * 60 * 24)
    );

  const remainingDays =
    Math.max(
      0,
      TRIAL_DURATION_DAYS -
        diffInDays
    );

  const trialActive =
    remainingDays > 0;

  return {

    trialActive,

    trialExpired:
      !trialActive,

    trialDaysRemaining:
      remainingDays,

  };

};

export default getTrialStatus;