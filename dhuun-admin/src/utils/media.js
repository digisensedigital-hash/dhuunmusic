const MEDIA_BASE_URL =
  import.meta.env
    .VITE_MEDIA_BASE_URL ||
  '';

export function getMediaUrl(
  path
) {

  if (!path) {
    return '';
  }

  if (
    path.startsWith('http')
  ) {
    return path.replace(
      '127.0.0.1',
      'localhost'
    );
  }

  const normalizedPath =
    path.startsWith('/')
      ? path
      : `/${path}`;

  return encodeURI(
  `${MEDIA_BASE_URL}/dhuun-media${normalizedPath}`
);
}