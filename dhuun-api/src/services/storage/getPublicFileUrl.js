const getPublicFileUrl = (
  objectKey
) => {
  return `${process.env.MINIO_PUBLIC_URL}/${process.env.MINIO_BUCKET}/${objectKey}`;
};

export default getPublicFileUrl;