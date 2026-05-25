import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  useSearchParams,
} from 'react-router-dom';

import toast from 'react-hot-toast';

import TrackTable
  from '../../components/tracks/TrackTable';

import TrackFormModal
  from '../../components/tracks/TrackFormModal';

import {
  getTracks,
} from '../../api/tracks';

import deleteTrackApi
  from '../../api/deleteTrack';

import {
  getMediaUrl,
} from '../../utils/media';

export default function TracksPage() {

  const [
  searchParams,
  ] = useSearchParams();

  const search =
    (
      searchParams.get(
        'search'
      ) || ''
    ).toLowerCase();

  /* ----------------------------------- */
  /* Upload Modal */
  /* ----------------------------------- */

  const [
    uploadOpen,
    setUploadOpen,
  ] = useState(false);

  /* ----------------------------------- */
  /* Selected Track */
  /* ----------------------------------- */

  const [
    selectedTrack,
    setSelectedTrack,
  ] = useState(null);

  /* ----------------------------------- */
  /* View Modal */
  /* ----------------------------------- */

  const [
    viewOpen,
    setViewOpen,
  ] = useState(false);

  /* ----------------------------------- */
  /* Edit Modal */
  /* ----------------------------------- */

  const [
    editOpen,
    setEditOpen,
  ] = useState(false);

  /* ----------------------------------- */
  /* Delete Loading */
  /* ----------------------------------- */

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  const [
  deleteModalOpen,
  setDeleteModalOpen,
  ] = useState(false);

  /* ----------------------------------- */
  /* Tracks State */
  /* ----------------------------------- */

  const [
    tracks,
    setTracks,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  /* ----------------------------------- */
  /* Pagination */
  /* ----------------------------------- */

  const [
    itemsPerPage,
    setItemsPerPage,
  ] = useState(10);

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  /* ----------------------------------- */
  /* Fetch Tracks */
  /* ----------------------------------- */

  const fetchTracks =
  async () => {

    try {

      setLoading(true);

      setError('');

      const data =
        await getTracks();

      setTracks(
        data?.tracks || []
      );

    } catch (err) {

      console.error(err);

      setError(
        'Failed to load tracks'
      );

      if (tracks.length > 0) {

        toast.error(
          'Failed to fetch tracks'
        );

      }

    } finally {

      setLoading(false);

    }
  };

  /* ----------------------------------- */
  /* Fetch Tracks */
  /* ----------------------------------- */

  useEffect(() => {

    fetchTracks();

  }, []);

  /* ----------------------------------- */
  /* Reset Page On Search */
  /* ----------------------------------- */

  useEffect(() => {

    setCurrentPage(1);

  }, [search]);

  /* ----------------------------------- */
  /* Search Filtering */
  /* ----------------------------------- */

  const filteredTracks = useMemo(() => {

    return tracks.filter((track) => {

      if (!search) {
        return true;
      }

      return (

        track.title
          ?.toLowerCase()
          .includes(search)

        ||

        track.artistName
          ?.toLowerCase()
          .includes(search)

        ||

        track.genre
          ?.toLowerCase()
          .includes(search)

        ||

        track.language
          ?.toLowerCase()
          .includes(search)

        ||

        track.publishingStatus
          ?.toLowerCase()
          .includes(search)
      );
    });

  }, [tracks, search]);

  /* ----------------------------------- */
  /* Pagination */
  /* ----------------------------------- */

  const totalPages =
    Math.ceil(
      filteredTracks.length /
      itemsPerPage
    );

  const paginatedTracks =
    filteredTracks.slice(

      (
        currentPage - 1
      ) * itemsPerPage,

      currentPage *
        itemsPerPage
      );

  /* ----------------------------------- */
  /* View Track */
  /* ----------------------------------- */

  const handleViewTrack =
    (track) => {
      setSelectedTrack(track);

      setViewOpen(true);
    };

  /* ----------------------------------- */
  /* Edit Track */
  /* ----------------------------------- */

  const handleEditTrack =
    (track) => {
      setSelectedTrack(track);

      setEditOpen(true);
      
    };

  /* ----------------------------------- */
  /* Open Delete Modal */
  /* ----------------------------------- */

  const handleDeleteTrack =
    (track) => {
      setSelectedTrack(track);

      setDeleteModalOpen(true);
    };

  /* ----------------------------------- */
  /* Confirm Delete */
  /* ----------------------------------- */

  const confirmDeleteTrack =
    async () => {
      if (!selectedTrack) {
        return;
      }

      try {
        setDeleting(true);

        const deletePromise =
          deleteTrackApi(
            selectedTrack._id
          );

        toast.promise(
          deletePromise,
          {
            loading:
              'Deleting track...',

            success:
              'Track deleted successfully',

            error:
              'Failed to delete track',
          }
        );

        await deletePromise;

        setTracks((prev) =>
          prev.filter(
            (track) =>
              track._id !==
              selectedTrack._id
          )
        );

        setDeleteModalOpen(false);

        setSelectedTrack(null);
      } catch (error) {
        console.error(error);

        toast.error(
          'Failed to delete track'
        );
      } finally {
        setDeleting(false);
      }
    };

  return (
<div>

      {/* ----------------------------------- */}
      {/* Header */}
      {/* ----------------------------------- */}

      <div className="mb-8 flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-bold text-white">
            Tracks
          </h1>

          <p className="mt-2 text-zinc-500">
            Manage streaming catalog, uploads, metadata, and publishing workflows.
          </p>
        </div>

        <button
          onClick={() =>
            setUploadOpen(true)
          }
          className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90"
        >
          Upload Track
        </button>
      </div>

      {/* Track Table */}

        <TrackTable
          tracks={paginatedTracks}
          loading={loading}
          error={error}
          onView={
            handleViewTrack
          }
          onEdit={
            handleEditTrack
          }
          onDelete={
            handleDeleteTrack
          }
        />

      {/* ----------------------------------- */}
      {/* Page Size */}
      {/* ----------------------------------- */}

      <div className="mb-4 flex justify-end">

        <select
          value={itemsPerPage}
          onChange={(e) => {

            setItemsPerPage(
              Number(
                e.target.value
              )
            );

            setCurrentPage(1);

          }}
          className="rounded-2xl border border-zinc-800 bg-black px-4 py-2 text-sm text-white outline-none"
        >

          <option value={10}>
            10 per page
          </option>

          <option value={25}>
            25 per page
          </option>

          <option value={50}>
            50 per page
          </option>

          <option value={100}>
            100 per page
          </option>

        </select>

      </div>  

      {/* ----------------------------------- */}
      {/* Pagination */}
      {/* ----------------------------------- */}

      <div className="mt-8 flex items-center justify-center gap-3">

        <button
          disabled={
            currentPage === 1 ||
            totalPages <= 1
          }
          onClick={() =>
            setCurrentPage(
              (prev) => prev - 1
            )
          }
          className="rounded-2xl border border-zinc-800 bg-black px-4 py-2 text-sm text-white transition hover:border-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-2 text-sm font-medium text-white">

          Page {currentPage} of {Math.max(totalPages, 1)}

        </div>

        <button
          disabled={
            currentPage >= totalPages ||
            totalPages <= 1
          }
          onClick={() =>
            setCurrentPage(
              (prev) => prev + 1
            )
          }
          className="rounded-2xl border border-zinc-800 bg-black px-4 py-2 text-sm text-white transition hover:border-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>

      </div>  

      {/* ----------------------------------- */}
      {/* Upload Modal */}
      {/* ----------------------------------- */}

      <TrackFormModal
        mode="create"
        open={uploadOpen}
        onClose={() =>
          setUploadOpen(false)
        }
        onSuccess={() => {
          fetchTracks();

          setUploadOpen(false);
        }}
      />

      {/* ----------------------------------- */}
      {/* Edit Modal */}
      {/* ----------------------------------- */}

      <TrackFormModal
        mode="edit"
        initialData={selectedTrack}
        open={editOpen}
        onClose={() => {
          setEditOpen(false);

          setSelectedTrack(null);
        }}
        onSuccess={() => {
          fetchTracks();

          setEditOpen(false);

          setSelectedTrack(null);
        }}
      />

      {/* ----------------------------------- */}
      {/* View Modal */}
      {/* ----------------------------------- */}

      {viewOpen &&
        selectedTrack && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">

            <div className="w-full max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-950 p-8">

              {/* Header */}

              <div className="mb-8 flex items-start justify-between">

                <div className="flex items-center gap-5">

                  <div className="h-28 w-28 overflow-hidden rounded-3xl bg-zinc-900">

                    {selectedTrack.coverImage ? (
                      <img
                        src={getMediaUrl(selectedTrack.coverImage)}
                        alt={
                          selectedTrack.title
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-600">
                        No Art
                      </div>
                    )}
                  </div>

                  <div>

                    <h2 className="text-3xl font-bold text-white">
                      {
                        selectedTrack.title
                      }
                    </h2>

                    <p className="mt-2 text-zinc-400">
                      {
                        selectedTrack.artistName
                      }
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
                        {
                          selectedTrack.genre
                        }
                      </span>

                      <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
                        {
                          selectedTrack.language
                        }
                      </span>

                      <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
                        {
                          selectedTrack.releaseType
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">

                  <button
                    onClick={() =>
                      setViewOpen(false)
                    }
                    className="rounded-2xl border border-zinc-800 bg-black px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-white"
                  >
                    Back
                  </button>

                  <button
                    onClick={() =>
                      setViewOpen(false)
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-800 bg-black text-zinc-400 transition hover:border-zinc-700 hover:text-white"
                  >
                    ✕
                  </button>

                </div>
              </div>

              {/* Metadata Grid */}

              <div className="grid grid-cols-2 gap-6">

                <div className="rounded-2xl border border-zinc-800 bg-black p-5">

                  <p className="text-sm text-zinc-500">
                    Streams
                  </p>

                  <p className="mt-2 text-2xl font-bold text-white">
                    {
                      selectedTrack.totalStreams || 0
                    }
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-black p-5">

                  <p className="text-sm text-zinc-500">
                    Duration
                  </p>

                  <p className="mt-2 text-2xl font-bold text-white">
                    {Math.floor(
                      selectedTrack.duration || 0
                    )}s
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-black p-5">

                  <p className="text-sm text-zinc-500">
                    Audio Format
                  </p>

                  <p className="mt-2 text-lg font-semibold text-white">
                    {
                      selectedTrack.audioFormat || 'N/A'
                    }
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-black p-5">

                  <p className="text-sm text-zinc-500">
                    Release Date
                  </p>

                  <p className="mt-2 text-lg font-semibold text-white">
                    {
                      selectedTrack.releaseDate
                        ? new Date(
                            selectedTrack.releaseDate
                          ).toLocaleDateString()
                        : 'N/A'
                    }
                  </p>
                </div>
              </div>

              {/* Contributors */}

              {!!selectedTrack.contributors
                ?.length && (
                <div className="mt-8">

                  <h3 className="mb-4 text-lg font-semibold text-white">
                    Contributors
                  </h3>

                  <div className="space-y-3">

                    {selectedTrack.contributors.map(
                      (
                        contributor,
                        index
                      ) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-black px-5 py-4"
                        >

                          <div>

                            <p className="font-medium text-white">
                              {
                                contributor.displayName
                              }
                            </p>

                            <p className="mt-1 text-xs text-zinc-500">
                              {
                                contributor.role
                              }
                            </p>
                          </div>

                          <div className="text-sm text-zinc-400">
                            {
                              contributor.royaltyShare
                            }%
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------------------------- */}
        {/* Delete Modal */}
        {/* ----------------------------------- */}

        {deleteModalOpen &&
          selectedTrack && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">

              <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-8">

                {/* Header */}

                <div className="mb-6">

                  <h2 className="text-2xl font-bold text-white">
                    Delete Track
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    Are you sure you want to delete
                    <span className="mx-1 font-medium text-white">
                      "{selectedTrack.title}"
                    </span>
                    from the Dhuun catalog?
                  </p>
                </div>

                {/* Track Preview */}

                <div className="mb-8 flex items-center gap-4 rounded-2xl border border-zinc-800 bg-black p-4">

                  <div className="h-16 w-16 overflow-hidden rounded-2xl bg-zinc-900">

                    {selectedTrack.coverImage ? (
                      <img
                        src={getMediaUrl(selectedTrack.coverImage)}
                        alt={
                          selectedTrack.title
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-zinc-600">
                        No Art
                      </div>
                    )}
                  </div>

                  <div>

                    <p className="font-semibold text-white">
                      {selectedTrack.title}
                    </p>

                    <p className="mt-1 text-sm text-zinc-500">
                      {
                        selectedTrack.artistName
                      }
                    </p>
                  </div>
                </div>

                {/* Actions */}

                <div className="flex justify-end gap-3">

                  <button
                    onClick={() => {
                      setDeleteModalOpen(false);

                      setSelectedTrack(null);
                    }}
                    className="rounded-2xl border border-zinc-800 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={
                      confirmDeleteTrack
                    }
                    disabled={deleting}
                    className="rounded-2xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-400 disabled:opacity-50"
                  >
                    {deleting
                      ? 'Deleting...'
                      : 'Delete Track'}
                  </button>
                </div>
              </div>
            </div>
          )}
    </div>
  );
}