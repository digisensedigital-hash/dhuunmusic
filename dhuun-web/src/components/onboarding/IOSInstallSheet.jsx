import {
  Share,
  PlusSquare,
  Smartphone,
} from 'lucide-react';

export default function
IOSInstallSheet() {

  return (

    <div className="overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-b from-[#16131F] to-[#0D0B12] shadow-[0_0_80px_rgba(168,85,247,0.08)]">

      {/* -------------------------------- */}
      {/* Header */}
      {/* -------------------------------- */}

      <div className="border-b border-white/10 px-6 py-5">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">

            <Smartphone
              size={22}
              className="text-white"
            />

          </div>

          <div>

            <p className="text-xs uppercase tracking-[0.28em] text-white/35">

              iPhone Installation

            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight text-white">

              Install Dhuun

            </h2>

          </div>

        </div>

      </div>

      {/* -------------------------------- */}
      {/* Steps */}
      {/* -------------------------------- */}

      <div className="space-y-5 p-6">

        {/* Step 1 */}

        <div className="flex gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-black shadow-xl">

            <Share size={20} />

          </div>

          <div>

            <p className="text-lg font-bold text-white">

              Tap Share

            </p>

            <p className="mt-2 text-sm leading-6 text-white/55">

              Open Safari’s share menu using the
              Share button at the bottom of the screen.

            </p>

          </div>

        </div>

        {/* Step 2 */}

        <div className="flex gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-black shadow-xl">

            <PlusSquare size={20} />

          </div>

          <div>

            <p className="text-lg font-bold text-white">

              Add to Home Screen

            </p>

            <p className="mt-2 text-sm leading-6 text-white/55">

              Scroll down and tap
              <span className="font-semibold text-white">
                {' '}
                Add to Home Screen
              </span>
              {' '}
              to install Dhuun like a native app.

            </p>

          </div>

        </div>

      </div>

      {/* -------------------------------- */}
      {/* Footer */}
      {/* -------------------------------- */}

      <div className="border-t border-white/10 bg-white/[0.02] px-6 py-5">

        <p className="text-sm leading-6 text-white/45">

          Once installed, Dhuun launches fullscreen
          with immersive playback, faster access,
          and a native streaming experience.

        </p>

      </div>

    </div>
  );
}