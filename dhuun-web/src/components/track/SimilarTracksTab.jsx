import {
  Play,
} from 'lucide-react';

export default function SimilarTracksTab({
  similarTracks,
  navigate,
  getMediaUrl,
}) {

  return (

    <div className="mt-8 flex h-[78vh] flex-col overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-b from-[#111018] to-[#0A0A10] shadow-[0_0_80px_rgba(168,85,247,0.05)]">

      {/* Header */}

      <div className="border-b border-white/10 px-6 py-5">

        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">

          Continue Listening

        </p>

        <h2 className="mt-2 text-3xl font-black tracking-tight">

          Similar Atmospheres

        </h2>

        <p className="mt-3 max-w-[280px] text-sm leading-6 text-zinc-500">

          Tracks that continue the same emotional and cinematic mood.

        </p>

      </div>

      {/* Tracks */}

      <div className="space-y-4 overflow-y-auto p-6">

        {similarTracks.length > 0 ? (

          similarTracks.map(
            (
              similarTrack
            ) => {

              // -----------------------------------
              // Primary Artist
              // -----------------------------------

              const primaryArtist =
                similarTrack
                  ?.primaryArtists?.[0] ||
                null;

              return (

                <button
                  key={
                    similarTrack._id
                  }

                  onClick={() =>
                    navigate(
                      `/app/track/${
                        similarTrack.slug ||
                        similarTrack._id
                      }`
                    )
                  }

                  className="group flex w-full items-center gap-4 rounded-[28px] border border-white/10 bg-white/[0.03] p-4 text-left transition-all hover:border-white/20 hover:bg-white/[0.05]"
                >

                  {/* Artwork */}

                  <img
                    src={getMediaUrl(
                      similarTrack.coverImage
                    )}

                    alt={
                      similarTrack.title
                    }

                    className="h-24 w-24 rounded-[22px] object-cover shadow-xl"
                  />

                  {/* Content */}

                  <div className="min-w-0 flex-1">

                    <p className="text-xl font-bold text-white transition group-hover:text-fuchsia-100">

                      {
                        similarTrack.title
                      }

                    </p>

                    <p className="mt-2 text-sm text-zinc-400">

                      {
                        primaryArtist
                          ?.stageName ||
                        'Unknown Artist'
                      }

                    </p>

                    {/* Mood Tags */}

                    <div className="mt-4 flex flex-wrap gap-2">

                      {similarTrack.genre && (

                        <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-400">

                          {
                            similarTrack.genre
                          }

                        </div>

                      )}

                      {similarTrack.trackLanguage && (

                        <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-400">

                          {
                            similarTrack.trackLanguage
                          }

                        </div>

                      )}

                    </div>

                  </div>

                  {/* Play */}

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-black shadow-xl transition group-hover:scale-105">

                    <Play
                      size={20}
                      fill="black"
                    />

                  </div>

                </button>

              );
            }
          )

        ) : (

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">

            <p className="text-lg font-medium text-white">

              No Similar Tracks Yet

            </p>

            <p className="mt-2 text-sm text-zinc-500">

              More cinematic recommendations will appear here as the catalog grows.

            </p>

          </div>

        )}

      </div>

    </div>

  );
}