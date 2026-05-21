import {
  Edit3,
  Eye,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';

import {
  getMediaUrl,
} from '../../utils/media';

export default function TrackTable({
  tracks,
  loading,
  error,
  onEdit,
  onDelete,
  onView,
}) {

  /* ----------------------------------- */
  /* Loading */
  /* ----------------------------------- */

  if (loading) {
    return (
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-10 text-center text-zinc-400">
        Loading tracks...
      </div>
    );
  }

  /* ----------------------------------- */
  /* Error */
  /* ----------------------------------- */

  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-10 text-center text-red-400">
        {error}
      </div>
    );
  }

  /* ----------------------------------- */
  /* Empty */
  /* ----------------------------------- */

  if (!tracks.length) {
    return (
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-10 text-center text-zinc-500">
        No tracks found
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950">

      {/* ----------------------------------- */}
      {/* Header */}
      {/* ----------------------------------- */}

      <div className="grid grid-cols-8 border-b border-zinc-800 bg-black/30 px-6 py-4 text-sm font-semibold text-zinc-400">

        <div className="col-span-3">
          Track
        </div>

        <div>
          Artist
        </div>

        <div>
          Release
        </div>

        <div>
          Analytics
        </div>

        <div>
          Status
        </div>

        <div className="text-right">
          Actions
        </div>
      </div>

      {/* ----------------------------------- */}
      {/* Rows */}
      {/* ----------------------------------- */}

      {tracks.map((track) => (
        <div
          key={track._id}
          className="grid grid-cols-8 items-center border-b border-zinc-900 px-6 py-5 transition hover:bg-zinc-900/40"
        >

          {/* ----------------------------------- */}
          {/* Track */}
          {/* ----------------------------------- */}

          <div className="col-span-3 flex items-center gap-4">

            {/* Artwork */}

            <div className="h-16 w-16 overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-zinc-800">

            <img
              src={
                track.coverImage
                  ? getMediaUrl(
                      track.coverImage
                    )
                  : undefined
              }
              alt={track.title}
              className="h-16 w-16 object-cover"
            />

          </div>

            {/* Metadata */}

            <div className="min-w-0 flex-1">

              <div className="flex items-center gap-2">

                <p className="truncate font-semibold text-white">
                  {track.title}
                </p>

                {track.isExplicit && (
                  <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-red-400">
                    Explicit
                  </span>
                )}
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500">

                <span>
                  {track.genre}
                </span>

                <span>•</span>

                <span>
                  {track.language}
                </span>

                <span>•</span>

                <span>
                  {track.releaseType}
                </span>

                {track.audioFormat && (
                  <>
                    <span>•</span>

                    <span>
                      {track.audioFormat}
                    </span>
                  </>
                )}
              </div>

              {/* Contributors */}

              {!!track.contributors?.length && (
                <div className="mt-2 flex flex-wrap gap-2">

                  {track.contributors
                    .slice(0, 3)
                    .map(
                      (
                        contributor,
                        index
                      ) => (
                        <span
                          key={index}
                          className="rounded-full border border-zinc-800 bg-black px-2 py-1 text-[10px] text-zinc-400"
                        >
                          {
                            contributor.displayName
                          }
                        </span>
                      )
                    )}

                  {track.contributors
                    .length > 3 && (
                    <span className="rounded-full border border-zinc-800 bg-black px-2 py-1 text-[10px] text-zinc-500">
                      +
                      {track
                        .contributors
                        .length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ----------------------------------- */}
          {/* Artist */}
          {/* ----------------------------------- */}

          <div>

            <p className="font-medium text-zinc-200">
              {track.primaryArtist
              ?.stageName ||
              'Unknown Artist'}
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              Primary Artist
            </p>
          </div>

          {/* ----------------------------------- */}
          {/* Release */}
          {/* ----------------------------------- */}

          <div>

            <p className="text-sm text-white">
              {track.releaseDate
                ? new Date(
                    track.releaseDate
                  ).toLocaleDateString()
                : 'N/A'}
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              {Math.floor(
                track.duration || 0
              )}s
            </p>
          </div>

          {/* ----------------------------------- */}
          {/* Analytics */}
          {/* ----------------------------------- */}

          <div>

            <p className="font-semibold text-white">
              {track.totalStreams || 0}
            </p>

            <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500">

              <span>
                ♥ {track.totalLikes || 0}
              </span>

              <span>
                ↗ {track.totalShares || 0}
              </span>
            </div>
          </div>

          {/* ----------------------------------- */}
          {/* Status */}
          {/* ----------------------------------- */}

          <div className="space-y-2">

            <div>

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                    track.publishingStatus ===
                    'PUBLISHED'

                      ? 'bg-emerald-500/15 text-emerald-400'

                      : track.publishingStatus ===
                        'UNDER_REVIEW'

                      ? 'bg-blue-500/15 text-blue-400'

                      : track.publishingStatus ===
                        'REJECTED'

                      ? 'bg-red-500/15 text-red-400'

                      : track.publishingStatus ===
                        'TAKEDOWN'

                      ? 'bg-red-500/15 text-red-400'

                      : track.publishingStatus ===
                        'HIDDEN'

                      ? 'bg-zinc-700/40 text-zinc-300'

                      : 'bg-yellow-500/15 text-yellow-400'
                  }`}
                >
                  {
                    track.publishingStatus ||
                    'DRAFT'
                  }
                </span>
              </div>

            <div>

              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                  track.processingStatus ===
                  'READY'

                    ? 'bg-emerald-500/15 text-emerald-400'

                    : track.processingStatus ===
                      'PROCESSING'

                    ? 'bg-blue-500/15 text-blue-400'

                    : track.processingStatus ===
                      'FAILED'

                    ? 'bg-red-500/15 text-red-400'

                    : 'bg-orange-500/15 text-orange-400'
                }`}
              >
                {
                  track.processingStatus
                }
              </span>
            </div>
          </div>

          {/* ----------------------------------- */}
          {/* Actions */}
          {/* ----------------------------------- */}

          <div className="flex justify-end gap-2">

            <button
              onClick={() =>
                onView?.(track)
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-black text-zinc-400 transition hover:border-zinc-700 hover:text-white"
            >
              <Eye size={16} />
            </button>

            <button
              onClick={() =>
                onEdit?.(track)
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-black text-zinc-400 transition hover:border-zinc-700 hover:text-white"
            >
              <Edit3 size={16} />
            </button>

            <button
              onClick={() =>
                onDelete?.(track)
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 transition hover:bg-red-500/20"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}