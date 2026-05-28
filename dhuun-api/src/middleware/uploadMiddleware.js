import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tempDirectory = path.resolve(
  __dirname,
  '../../storage/temp'
);

/*
|--------------------------------------------------------------------------
| Ensure Temp Directory Exists
|--------------------------------------------------------------------------
*/

if (!fs.existsSync(tempDirectory)) {
  fs.mkdirSync(tempDirectory, {
    recursive: true
  });
}

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, tempDirectory);
  },

  filename: (req, file, cb) => {

    const safeName =
      Date.now() +
      '-' +
      file.originalname
        .replace(/\s+/g, '-')
        .replace(/[^\w.-]/g, '');

    cb(null, safeName);
  }
});

const upload = multer({

  storage,

  limits: {
    fileSize: 250 * 1024 * 1024
  }
});

export default upload;