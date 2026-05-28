import {
  useState,
} from 'react';

import {
  Globe,
  X,
} from 'lucide-react';

import useCapabilities
  from '../../hooks/capabilities/useCapabilities';

export default function ScriptSelectorSheet({

  setIsScriptMenuOpen,

  SCRIPT_OPTIONS,

  selectedScript,

  handleScriptChange,

  convertingLyrics,

  scriptProgressText,

}) {

  const {
    features,
    gating,
  } = useCapabilities();

  /* ----------------------------------- */
  /* Script Intelligence Modal */
  /* ----------------------------------- */

  const [
    showScriptInfo,
    setShowScriptInfo,
  ] = useState(false);

  return (

    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-xl">

      {/* Backdrop */}

      <div
        onClick={() =>
          setIsScriptMenuOpen(
            false
          )
        }
        className="absolute inset-0"
      />

      {/* Sheet */}

      <div className="relative w-full max-w-md overflow-hidden rounded-t-[38px] border-t border-white/10 bg-[#0B0B12] shadow-[0_-10px_80px_rgba(0,0,0,0.65)]">

        {/* Handle */}

        <div className="flex justify-center pb-4 pt-4">

          <div className="h-1.5 w-14 rounded-full bg-white/15" />

        </div>

        {/* Header */}

        <div className="px-6 pb-5">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">

                Lyrics Experience

              </p>

              <h3 className="mt-2 text-3xl font-black tracking-tight text-white">

                Read In

              </h3>

              <p className="mt-2 max-w-[260px] text-sm leading-6 text-zinc-500">

                Experience lyrics in your preferred writing system while preserving pronunciation and lyrical flow.

              </p>

            </div>

            <button
              onClick={() =>
                setIsScriptMenuOpen(
                  false
                )
              }
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
            >

              <X size={18} />

            </button>

          </div>

        </div>

        {/* Current Selection */}

        <div className="mx-6 mb-5 rounded-3xl border border-fuchsia-500/20 bg-gradient-to-r from-fuchsia-500/10 to-purple-500/10 p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-zinc-400">

                Currently Reading In

              </p>

              <h4 className="mt-1 text-xl font-bold text-white">

                {selectedScript}

              </h4>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">

              <Globe
                size={22}
                className="text-fuchsia-200"
              />

            </div>

          </div>

        </div>

        {/* ----------------------------------- */}
        {/* Script Intelligence Upsell */}
        {/* ----------------------------------- */}

        {showScriptInfo && (

          <div className="mx-6 mb-6 overflow-hidden rounded-[28px] border border-amber-500/10 bg-gradient-to-b from-amber-500/[0.08] to-transparent">

            <div className="px-5 py-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs uppercase tracking-[0.28em] text-amber-200/50">

                    Dhuun Linguistics

                  </p>

                  <h3 className="mt-2 text-xl font-bold text-amber-50">

                    Immersive Script Experience

                  </h3>

                </div>

                <button

                  onClick={() =>
                    setShowScriptInfo(
                      false
                    )
                  }

                  className="text-sm text-amber-200/50 transition hover:text-amber-100"

                >

                  Close

                </button>

              </div>

              <p className="mt-5 text-sm leading-7 text-amber-100/75">

                {gating.lyrics
                  .allScripts
                  .requiresRegistration

                  ? `Create your Dhuun account to unlock multilingual lyrical experiences, immersive script rendering, and personalized language exploration.`

                  : `Your trial has ended. Upgrade to Dhuun Premium to continue accessing multilingual lyrical script experiences.`}

              </p>

              <div className="mt-6 flex items-center gap-3">

                {gating.lyrics
                  .allScripts
                  .requiresRegistration ? (

                  <button

                    className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black"

                  >

                    Create Account

                  </button>

                ) : (

                  <button

                    className="rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-black"

                  >

                    Upgrade Premium

                  </button>

                )}

              </div>

            </div>

          </div>

        )}

        {/* Script Options */}

        <div className="max-h-[55vh] overflow-y-auto px-6 pb-[max(2rem,env(safe-area-inset-bottom))]">

          <div className="space-y-3 pb-8">

            {SCRIPT_OPTIONS.map(
              (option) => {

                const active =
                  selectedScript ===
                  option;

                /* ----------------------------------- */
                /* Centralized Capability Access */
                /* ----------------------------------- */

                const hasAccess =

                  features.lyrics
                    .allScripts ||

                  features.lyrics
                    .freeScripts
                    .includes(
                      option
                    );

                const locked =
                  !hasAccess;

                return (

                  <button
                    key={option}

                    onClick={() => {

                      if (locked) {

                        setShowScriptInfo(
                          true
                        );

                        return;
                      }

                      handleScriptChange(
                        option
                      );
                    }}

                    className={`group relative flex w-full items-center justify-between overflow-hidden rounded-3xl border px-5 py-5 text-left transition-all duration-300 ${
                      locked

                        ? 'border-amber-500/20 bg-amber-500/5'

                        : active

                          ? 'border-fuchsia-500/30 bg-gradient-to-r from-fuchsia-500/15 to-purple-500/10'

                          : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]'
                    }`}
                  >

                    {active && (

                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,70,239,0.18),transparent_55%)]" />

                    )}

                    <div className="relative">

                      {/* Script Title */}

                      <div className="flex items-center gap-2">

                        <p className={`text-lg font-semibold transition ${
                          active
                            ? 'text-white'
                            : locked
                              ? 'text-amber-100'
                              : 'text-zinc-200'
                        }`}>

                          {option}

                        </p>

                        {locked && (

                          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-200">

                            Locked

                          </span>

                        )}

                      </div>

                      {/* Subtitle */}

                      <p className="mt-1 text-sm text-zinc-500">

                        {locked

                          ? gating.lyrics
                              .allScripts
                              .requiresRegistration

                              ? 'Register to unlock'

                              : 'Upgrade to Dhuun Premium'

                          : convertingLyrics &&
                            selectedScript === option

                            ? scriptProgressText

                            : 'Script optimized lyrical rendering'}

                      </p>

                    </div>

                    {/* Right Visual */}

                    <div className="relative flex items-center">

                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">

                        {convertingLyrics &&
                        selectedScript === option ? (

                          <div className="relative flex items-center justify-center">

                            <div className="absolute h-10 w-10 rounded-full bg-fuchsia-500/20 blur-xl" />

                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-fuchsia-400 border-t-transparent" />

                          </div>

                        ) : active ? (

                          <Globe
                            size={18}
                            className="text-fuchsia-200"
                          />

                        ) : null}

                      </div>

                    </div>

                  </button>

                );
              }
            )}

          </div>

        </div>

      </div>

    </div>

  );
}