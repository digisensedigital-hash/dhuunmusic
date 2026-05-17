import fs from 'fs';

import path from 'path';

import mime from 'mime-types';

import minioClient from '../../config/minio.js';

const uploadDirectoryToMinio = async (
  localDirectory,
  targetPrefix
) => {
  const uploadedFiles = [];

  const files = fs.readdirSync(localDirectory);

  for (const file of files) {
    const localFilePath = path.join(
      localDirectory,
      file
    );

    const stats = fs.statSync(localFilePath);

    if (!stats.isFile()) {
      continue;
    }

    const objectKey =
      `${targetPrefix}/${file}`;

    const fileStream =
      fs.createReadStream(localFilePath);

    const contentType =
      mime.lookup(localFilePath) ||
      'application/octet-stream';

    await minioClient.putObject(
      process.env.MINIO_BUCKET,
      objectKey,
      fileStream,
      stats.size,
      {
        'Content-Type': contentType
      }
    );

    uploadedFiles.push({
      file,
      objectKey,
      contentType
    });
  }

  return uploadedFiles;
};

export default uploadDirectoryToMinio;