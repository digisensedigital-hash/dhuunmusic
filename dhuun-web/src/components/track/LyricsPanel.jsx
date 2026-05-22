import {
  ChevronDown,
  Globe,
  Languages,
} from 'lucide-react';

export default function LyricsPanel({

  track,

  selectedScript,

  setIsScriptMenuOpen,

  handleMeaningToggle,

  meaningEnabled,

  convertingLyrics,

  scriptProgressText,

  convertedLyrics,

  translatedMeaning,

  meaningLoading,

  meaningProgressText,

}) {

  return (

    <div className="mt-8 overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-b from-[#111018] to-[#0A0A10] shadow-[0_0_80px_rgba(168,85,247,0.05)]">

      {/* ----------------------------------- */}
      {/* Floating Lyrics Toolbar */}
      {/* ----------------------------------- */}

      <div className="sticky top-20 z-20 flex items-center justify-between gap-4 border-b border-white/5 bg-[#0A0A10]/90 px-5 py-4 backdrop-blur-2xl">

        {/* Left */}

        <div className="min-w-0 flex-1">

          <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">

            Immersive Lyrics

          </p>

          <h2 className="mt-1 text-xl font-black tracking-tight text-white">

            Feel Every Line

          </h2>

        </div>

        {/* Controls */}

        <div className="flex items-center gap-3">

          {/* Script */}

          <button
            onClick={() =>
              setIsScriptMenuOpen(
                true
              )
            }

            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.06]"
          >

            <Globe size={15} />

            {selectedScript}

            <ChevronDown
              size={15}
            />

          </button>

          {/* Meaning Toggle */}

          <button
            onClick={
              handleMeaningToggle
            }

            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
              meaningEnabled
                ? 'border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-100'
                : 'border-white/10 bg-white/[0.04] text-zinc-400'
            }`}
          >

            <Languages
              size={15}
            />

            {meaningEnabled
              ? 'Meaning On'
              : 'Meaning'}

          </button>

        </div>

      </div>

      {/* ----------------------------------- */}
      {/* Lyrics Body */}
      {/* ----------------------------------- */}

      <div className="lyrics-scroll flex-1 overflow-y-auto px-6 py-4 [scrollbar-width:none] [-ms-overflow-style:none]">

        {convertingLyrics ? (

          <div className="flex flex-col items-center justify-center py-24">

            {/* Orb */}

            <div className="relative">

              <div className="h-20 w-20 rounded-full bg-fuchsia-500/20 blur-2xl" />

              <div className="absolute inset-0 flex items-center justify-center">

                <div className="h-10 w-10 animate-spin rounded-full border-2 border-fuchsia-400 border-t-transparent" />

              </div>

            </div>

            {/* Text */}

            <p className="mt-8 text-lg font-medium text-zinc-200">

              {scriptProgressText}

            </p>

            <p className="mt-3 max-w-[260px] text-center text-sm leading-6 text-zinc-500">

              Preserving lyrical pronunciation and emotional flow.

            </p>

          </div>

        ) : (

          <div className="space-y-5 px-1 pb-16 pt-24">

            {(
              convertedLyrics ||
              track.lyrics
            )
            .split('\n')
            .map(

              (
                line,
                index
              ) => {

                const meaningLines =

                  translatedMeaning
                    ? translatedMeaning
                        .replace(/\r/g, '')
                        .split('\n')
                    : [];

                return (

                  <div
                    key={index}
                    className="group"
                  >

                    {/* Original / Transliterated */}

                    <p className="font-['Noto_Sans'] text-[18px] font-medium leading-[1.75] tracking-[-0.01em] text-zinc-100 transition duration-300 group-hover:text-white">

                      {line.trim()
                        ? line
                        : '\u00A0'}

                    </p>

                    {/* Meaning Translation */}

                    {meaningEnabled && (

                      <div className="mt-1.5 pl-1">

                        {meaningLoading ? (

                          <div className="flex items-center gap-3 pt-1">

                            <div className="h-2 w-2 animate-pulse rounded-full bg-fuchsia-400" />

                            <p className="text-sm italic text-zinc-500">

                              {meaningProgressText}

                            </p>

                          </div>

                        ) : (

                          meaningLines[
                            index
                          ] && (

                            <p className="animate-in fade-in duration-500 text-[15px] italic leading-7 text-zinc-300/90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.45)]">

                              {
                                meaningLines[
                                  index
                                ]
                              }

                            </p>

                          )

                        )}

                      </div>

                    )}

                  </div>

                );
              }

            )}

          </div>

        )}

      </div>

    </div>

  );
}