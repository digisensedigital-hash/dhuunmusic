const getPublicFileUrl = (
  objectKey
) => {
  return `${process.env.PUBLIC_MEDIA_BASE_URL}/${process.env.MINIO_BUCKET}/${objectKey}`;
};

export default getPublicFileUrl;