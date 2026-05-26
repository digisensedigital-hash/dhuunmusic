const IS_LOCAL =
  window.location.hostname ===
    'localhost' ||

  window.location.hostname ===
    '127.0.0.1';

/* ----------------------------------- */
/* Media Server */
/* ----------------------------------- */

const MEDIA_BASE_URL =
  import.meta.env
    .VITE_MEDIA_BASE_URL ||

  (
    IS_LOCAL
      ? 'http://localhost:9000'
      : 'https://media.dhuunmusic.in'
  );

/* ----------------------------------- */
/* API Server */
/* ----------------------------------- */

const API_BASE_URL =
  IS_LOCAL
    ? 'http://localhost:8000'
    : 'https://api.dhuunmusic.in';

export function getMediaUrl(
  path
) {

  if (!path) {
    return '';
  }

  /* ----------------------------------- */
  /* Already Absolute URL */
  /* ----------------------------------- */

  if (
    path.startsWith('http')
  ) {

    return encodeURI(
      path
        .replace(
          '127.0.0.1',
          'localhost'
        )
    );
  }

  /* ----------------------------------- */
  /* Normalize */
  /* ----------------------------------- */

  const normalizedPath =
    path.startsWith('/')
      ? path.slice(1)
      : path;

  /* ----------------------------------- */
  /* Legacy Express Uploads */
  /* ----------------------------------- */

  if (
    normalizedPath.startsWith(
      'uploads/'
    )
  ) {

    return encodeURI(
      `${API_BASE_URL}/${normalizedPath}`
    );
  }

  /* ----------------------------------- */
  /* MinIO Media */
  /* ----------------------------------- */

  const finalPath =
    normalizedPath.startsWith(
      'dhuun-media/'
    )
      ? normalizedPath
      : `dhuun-media/${normalizedPath}`;

  return encodeURI(
    `${MEDIA_BASE_URL}/${finalPath}`
  );
}