const MEDIA_BASE_URL =
  import.meta.env
    .VITE_MEDIA_URL ||
  (
    window.location.hostname ===
    'localhost'
      ? 'http://localhost:8000'
      : 'https://media.dhuunmusic.in'
  );

export function getMediaUrl(
  path
) {

  if (!path) {
    return '';
  }

  /*
  |--------------------------------------------------------------------------
  | Already Absolute
  |--------------------------------------------------------------------------
  */

  if (
    path.startsWith('http')
  ) {
    return path;
  }

  /*
  |--------------------------------------------------------------------------
  | Normalize Leading Slash
  |--------------------------------------------------------------------------
  */

  const normalizedPath =
  path.startsWith('/')
    ? path
    : `/${path}`;

/*
|--------------------------------------------------------------------------
| Express Uploads
|--------------------------------------------------------------------------
*/

if (
  normalizedPath.startsWith(
    '/uploads'
  )
) {

  return encodeURI(
    window.location.hostname ===
      'localhost'
        ? `http://localhost:8000${normalizedPath}`
        : `https://api.dhuunmusic.in${normalizedPath}`
  );
}

/*
|--------------------------------------------------------------------------
| MinIO Media
|--------------------------------------------------------------------------
*/

return encodeURI(
  `${MEDIA_BASE_URL}${normalizedPath}`
);

}