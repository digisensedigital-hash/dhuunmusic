import {
  useEffect,
  useState,
} from 'react';

import toast
  from 'react-hot-toast';

import {
  getArtists,
} from '../../api/getArtists';

import ArtistFormModal
  from '../../components/artists/ArtistFormModal';

export default function ArtistsPage() {

  const [
    artists,
    setArtists,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    createOpen,
    setCreateOpen,
  ] = useState(false);

  const [
    editOpen,
    setEditOpen,
  ] = useState(false);

  const [
    selectedArtist,
    setSelectedArtist,
  ] = useState(null);

  /* ----------------------------------- */
  /* Fetch Artists */
  /* ----------------------------------- */

  const fetchArtists =
    async () => {
      try {

        setLoading(true);

        const response =
          await getArtists();

        setArtists(
          response.artists || []
        );

      } catch (error) {
        console.error(error);

        toast.error(
          'Failed to load artists'
        );

      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchArtists();
  }, []);

  return (
    <div className="space-y-8">

      {/* ----------------------------------- */}
      {/* Header */}
      {/* ----------------------------------- */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold text-white">
            Artists
          </h1>

          <p className="mt-2 text-zinc-500">
            Manage artist identities, verification,
            discovery metadata, and catalog ownership.
          </p>

        </div>

        <button
          onClick={() =>
            setCreateOpen(true)
          }
          className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90"
        >
          Create Artist
        </button>
      </div>

      {/* ----------------------------------- */}
      {/* Loading */}
      {/* ----------------------------------- */}

      {loading ? (

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-10 text-center text-zinc-500">
          Loading artists...
        </div>

      ) : artists.length === 0 ? (

        /* ----------------------------------- */
        /* Empty State */
        /* ----------------------------------- */

        <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-950 p-16 text-center">

          <h2 className="text-2xl font-bold text-white">
            No artists yet
          </h2>

          <p className="mt-3 text-zinc-500">
            Create your first artist profile
            to start building the Dhuun catalog.
          </p>

        </div>

      ) : (

        /* ----------------------------------- */
        /* Artist Grid */
        /* ----------------------------------- */

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

          {artists.map((artist) => (

            <div
              key={artist._id}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-zinc-700"
            >

              {/* ----------------------------------- */}
              {/* Artist Header */}
              {/* ----------------------------------- */}

              <div className="flex items-start justify-between">

                <div>

                  <div className="flex items-center gap-2">

                    <h2 className="text-xl font-bold text-white">
                      {artist.stageName}
                    </h2>

                    {artist.isVerified && (
                      <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs font-medium text-blue-400">
                        Verified
                      </span>
                    )}
                  </div>

                  {artist.realName && (
                    <p className="mt-1 text-sm text-zinc-500">
                      {artist.realName}
                    </p>
                  )}
                </div>

                <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
                  {artist.artistType}
                </span>

              </div>

              {/* ----------------------------------- */}
              {/* Bio */}
              {/* ----------------------------------- */}

              <p className="mt-5 line-clamp-4 text-sm leading-relaxed text-zinc-400">

                {artist.bio ||
                  'No artist biography available yet.'}

              </p>

              {/* ----------------------------------- */}
              {/* Metadata */}
              {/* ----------------------------------- */}

              <div className="mt-6 flex flex-wrap gap-2">

                {artist.genres?.map(
                  (genre) => (
                    <span
                      key={genre}
                      className="rounded-full bg-zinc-900 px-3 py-1 text-xs text-zinc-400"
                    >
                      {genre}
                    </span>
                  )
                )}

              </div>

              {/* ----------------------------------- */}
              {/* Footer */}
              {/* ----------------------------------- */}

              <div className="mt-8 flex items-center justify-between border-t border-zinc-800 pt-5">

                <div className="text-sm text-zinc-500">

                  {artist.analytics
                    ?.monthlyListeners || 0}{' '}
                  monthly listeners

                </div>

                <div className="flex items-center gap-3">

                  <button
                    onClick={() => {

                      setSelectedArtist(
                        artist
                      );

                      setEditOpen(true);
                    }}
                    className="text-sm font-medium text-zinc-400 transition hover:text-white"
                  >
                    Edit
                  </button>

                  <button
                    className="text-sm font-medium text-red-400 transition hover:text-red-300"
                  >
                    Delete
                  </button>

                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* ----------------------------------- */}
      {/* Create Artist Modal */}
      {/* ----------------------------------- */}

      <ArtistFormModal
        open={createOpen}
        onClose={() =>
          setCreateOpen(false)
        }
        onSuccess={
          fetchArtists
        }
      />

      {/* ----------------------------------- */}
      {/* Edit Artist Modal */}
      {/* ----------------------------------- */}

      <ArtistFormModal
        mode="edit"
        open={editOpen}
        initialData={
          selectedArtist
        }
        onClose={() => {

          setEditOpen(false);

          setSelectedArtist(
            null
          );
        }}
        onSuccess={
          fetchArtists
        }
      />

    </div>
  );
}