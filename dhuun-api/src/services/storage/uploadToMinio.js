import fs from 'fs';

import minioClient from '../../config/minio.js';

import { v4 as uuidv4 } from 'uuid';

const uploadToMinio = async (
  filePath,
  originalName,
  mimetype,
  folder = 'uploads'
) => {
  const fileName = `${folder}/${uuidv4()}-${originalName}`;

  const fileStream = fs.createReadStream(filePath);

  const stats = fs.statSync(filePath);

  await minioClient.putObject(
    process.env.MINIO_BUCKET,
    fileName,
    fileStream,
    stats.size,
    {
      'Content-Type': mimetype
    }
  );

  return fileName;
};

export default uploadToMinio;