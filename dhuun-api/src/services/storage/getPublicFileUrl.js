const getPublicFileUrl = (
  objectKey
) => {

  if (!objectKey) {
    return '';
  }

  // -----------------------------------
  // Already Absolute URL
  // -----------------------------------

  if (
    objectKey.startsWith(
      'http'
    )
  ) {
    return objectKey;
  }

  // -----------------------------------
  // Legacy Local Uploads
  // -----------------------------------

  if (
    objectKey.startsWith(
      '/uploads/'
    )
  ) {

    return `${process.env.API_BASE_URL}${objectKey}`;
  }

  // -----------------------------------
  // MinIO Object
  // -----------------------------------

  return `${process.env.MINIO_PUBLIC_URL}/${process.env.MINIO_BUCKET}/${objectKey}`;
};

export default getPublicFileUrl;