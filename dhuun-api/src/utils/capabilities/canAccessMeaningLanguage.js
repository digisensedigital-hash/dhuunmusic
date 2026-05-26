const canAccessMeaningLanguage = ({
  capabilities,
  language,
}) => {

  if (
    !capabilities
  ) {
    return false;
  }

  if (
    capabilities
      .allowedMeaningLanguages ===
    'ALL'
  ) {
    return true;
  }

  return (
    capabilities
      .allowedMeaningLanguages
      ?.includes(language)
  );

};

export default
  canAccessMeaningLanguage;