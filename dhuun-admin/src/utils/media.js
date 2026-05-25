const MEDIA_BASE_URL =
  import.meta.env
    .VITE_MEDIA_BASE_URL ||
  (
    window.location.hostname ===
    'localhost'
      ? 'http://127.0.0.1:9000'
      : 'https://media.dhuunmusic.in'
  );

export function getMediaUrl(
  path
) {

  if (!path) {
    return '';
  }

  // -----------------------------------
  // Already Absolute URL
  // -----------------------------------

  if (
    path.startsWith('http')
  ) {

    // Local Development
    if (
      window.location.hostname ===
      'localhost'
    ) {

      return path
        .replace(
          '127.0.0.1',
          'localhost'
        )
        .replace(
          'media.dhuunmusic.in',
          'localhost:9000'
        );
    }

    // Production
    return path
      .replace(
        '127.0.0.1:9000',
        'media.dhuunmusic.in'
      )
      .replace(
        'http://',
        'https://'
      );
  }

  // -----------------------------------
  // Normalize Relative Path
  // -----------------------------------

  const normalizedPath =
    path.startsWith('/')
      ? path.slice(1)
      : path;

  /*
  |--------------------------------------------------------------------------
  | Legacy Express Uploads
  |--------------------------------------------------------------------------
  */

  if (
    normalizedPath.startsWith(
      'uploads/'
    )
  ) {

    return encodeURI(
      window.location.hostname ===
        'localhost'
          ? `http://localhost:8000/${normalizedPath}`
          : `https://api.dhuunmusic.in/${normalizedPath}`
    );
  }

  /*
  |--------------------------------------------------------------------------
  | MinIO Media
  |--------------------------------------------------------------------------
  */

  return encodeURI(
    `${MEDIA_BASE_URL}/dhuun-media/${normalizedPath}`
  );
}