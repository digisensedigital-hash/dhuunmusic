import multer from 'multer';

import path from 'path';

const tempDirectory = path.resolve(
  '../storage/temp'
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDirectory);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + path.extname(file.originalname);

    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,

  limits: {
    fileSize: 50 * 1024 * 1024
  }
});

export default upload;