import api
  from './client';

export async function
getPublicTracks() {

  const { data } =
    await api.get(
      '/tracks/public'
    );

  return data;
}