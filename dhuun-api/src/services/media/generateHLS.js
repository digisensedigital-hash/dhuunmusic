import ffmpeg from 'fluent-ffmpeg';

import fs from 'fs';

const generateHLS = async (
  inputPath,
  outputDir
) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, {
        recursive: true
      });
    }

    ffmpeg(inputPath)
      .outputOptions([
        '-codec:a aac',
        '-b:a 128k',
        '-hls_time 10',
        '-hls_playlist_type vod'
      ])

      .output(`${outputDir}/index.m3u8`)

      .on('end', () => {
        resolve({
          success: true
        });
      })

      .on('error', (error) => {
        reject(error);
      })

      .run();
  });
};

export default generateHLS;