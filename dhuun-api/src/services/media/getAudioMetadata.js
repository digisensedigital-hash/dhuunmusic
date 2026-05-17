import ffmpeg from 'fluent-ffmpeg';

const getAudioMetadata = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (error, metadata) => {
      if (error) {
        return reject(error);
      }

      const audioStream = metadata.streams.find(
        (stream) => stream.codec_type === 'audio'
      );

      resolve({
        duration: metadata.format.duration || 0,

        bitrate: metadata.format.bit_rate || 0,

        codec: audioStream?.codec_name || 'unknown',

        format: metadata.format.format_name || 'unknown'
      });
    });
  });
};

export default getAudioMetadata;