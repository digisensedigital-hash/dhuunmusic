export default function DetailsTab({
  track,
  variants,
  navigate,
  SCRIPT_OPTIONS,
}) {

  return (

          <div className="mt-8 space-y-6">

            {/* ----------------------------------- */}
            {/* Variants */}
            {/* ----------------------------------- */}

            {variants.length > 1 && (

              <div className="overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-b from-[#111018] to-[#0A0A10] shadow-[0_0_80px_rgba(168,85,247,0.05)]">

                {/* Header */}

                <div className="border-b border-white/10 px-6 py-5">

                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">

                    Alternate Versions

                  </p>

                  <h2 className="mt-2 text-3xl font-black tracking-tight">

                    Available Versions

                  </h2>

                </div>

                {/* Variants */}

                <div className="space-y-3 p-6">

                  {variants
                  .filter((variant) => {

                    const variantId =
                      String(
                        variant.id ||
                        variant._id
                      );

                    const currentTrackId =
                      String(
                        track.id ||
                        track._id
                      );

                    return (
                      variantId !==
                      currentTrackId
                    );
                  })
                    .map(
                    (variant) => {

                      return (

                        <button
                          key={
                            variant._id
                          }

                          onClick={() =>
                            navigate(
                              `/app/track/${variant._id}`
                            )
                          }

                          className="flex w-full items-center justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-left transition-all hover:border-white/20 hover:bg-white/[0.05]"
                        >

                          <div>

                            <p className="text-lg font-semibold text-white">

                              {
                                variant.language
                              }

                            </p>

                            <p className="mt-1 text-sm text-zinc-500">

                              {variant.versionType ===
                              'ORIGINAL'

                                ? 'Original Version'

                                : `${variant.versionType} Version`}
                            </p>

                          </div>

                        </button>

                      );
                    }
                  )}

                </div>

              </div>

            )}

            {/* ----------------------------------- */}
            {/* Experience Info */}
            {/* ----------------------------------- */}

            <div className="overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-b from-[#111018] to-[#0A0A10] shadow-[0_0_80px_rgba(168,85,247,0.05)]">

              {/* Header */}

              <div className="border-b border-white/10 px-6 py-5">

                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">

                  Experience Information

                </p>

                <h2 className="mt-2 text-3xl font-black tracking-tight">

                  About This Track

                </h2>

              </div>

              {/* Content */}

              <div className="space-y-5 p-6">

                <div className="flex items-center justify-between">

                  <span className="text-zinc-500">

                    Lyrics Available

                  </span>

                  <span className="font-medium text-white">

                    {track.lyrics
                      ? 'Yes'
                      : 'No'}

                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <span className="text-zinc-500">

                    Multilingual Scripts

                  </span>

                  <span className="font-medium text-white">

                    {SCRIPT_OPTIONS.length}

                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <span className="text-zinc-500">

                    Audio Experience

                  </span>

                  <span className="font-medium text-white">

                    Adaptive Streaming

                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <span className="text-zinc-500">

                    Version Type

                  </span>

                  <span className="font-medium text-white">

                    {track.versionType ||
                      'ORIGINAL'}

                  </span>

                </div>

              </div>

            </div>

          </div>

        
        );
    }