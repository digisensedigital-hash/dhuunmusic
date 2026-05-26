import {
  useEffect,
  useState,
} from 'react';

import toast
  from 'react-hot-toast';

import {
  getArtists,
} from '../../api/getArtists';

import {
  deleteArtist,
} from '../../api/deleteArtist';

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

  const [
    deletingArtist,
    setDeletingArtist,
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

  /* ----------------------------------- */
  /* Delete Artist */
  /* ----------------------------------- */

  const handleDelete =
    async () => {

      if (
        !deletingArtist
      ) {
        return;
      }

      try {

        await deleteArtist(
          deletingArtist._id
        );

        toast.success(
          'Artist deleted successfully'
        );

        setDeletingArtist(
          null
        );

        fetchArtists();

      } catch (error) {

        console.error(error);

        toast.error(
          'Failed to delete artist'
        );

      }
    };

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
          onClick={() => {

            setSelectedArtist(
              null
            );

            setEditOpen(false);

            setCreateOpen(true);

          }}
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

                      setCreateOpen(false);

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
                    onClick={() =>
                      setDeletingArtist(
                        artist
                      )
                    }
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
      {/* Unified Artist Modal */}
      {/* ----------------------------------- */}

      <ArtistFormModal

        key={
          createOpen
            ? 'create-artist-modal'
            : `edit-${selectedArtist?._id || 'none'}`
        }

        mode={
          createOpen
            ? 'create'
            : 'edit'
        }

        open={
          createOpen ||
          editOpen
        }

        initialData={
          editOpen
            ? selectedArtist
            : null
        }

        onClose={() => {

          setCreateOpen(false);

          setEditOpen(false);

          setSelectedArtist(
            null
          );

        }}

        onSuccess={
          fetchArtists
        }
      />

      {/* ----------------------------------- */}
      {/* Delete Confirmation Modal */}
      {/* ----------------------------------- */}

      {deletingArtist && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">

          <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-8">

            <h2 className="text-2xl font-bold text-white">
              Delete Artist
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-zinc-400">

              Are you sure you want to delete{' '}

              <span className="font-semibold text-white">
                {
                  deletingArtist.stageName
                }
              </span>

              ?

              This action cannot be undone.

            </p>

            <div className="mt-8 flex items-center justify-end gap-3">

              <button
                onClick={() =>
                  setDeletingArtist(
                    null
                  )
                }
                className="rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={
                  handleDelete
                }
                className="rounded-2xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-400"
              >
                Delete Artist
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}