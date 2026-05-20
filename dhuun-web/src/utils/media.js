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

  const normalized =
    path.startsWith('/')
      ? path
      : `/${path}`;

  return `${MEDIA_BASE_URL}${normalized}`;
}