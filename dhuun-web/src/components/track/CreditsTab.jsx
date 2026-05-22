import {
  User2,
} from 'lucide-react';

export default function CreditsTab({
  track,
}) {

  return (

    <div className="mt-8 flex h-[78vh] flex-col overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-b from-[#111018] to-[#0A0A10] shadow-[0_0_80px_rgba(168,85,247,0.05)]">

      {/* Header */}

      <div className="border-b border-white/10 px-6 py-5">

        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">

          Track Credits

        </p>

        <h2 className="mt-2 text-3xl font-black tracking-tight">

          Contributors

        </h2>

      </div>

      {/* Contributors */}

      <div className="space-y-4 p-6">

        {track.contributors?.map(
          (
            contributor,
            index
          ) => (

            <div
              key={index}
              className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-5"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04]">

                  <User2
                    size={22}
                    className="text-zinc-400"
                  />

                </div>

                <div>

                  <p className="text-lg font-semibold text-white">

                    {
                      contributor.displayName
                    }

                  </p>

                  <p className="mt-1 text-sm text-zinc-500">

                    {
                      contributor.role
                    }

                  </p>

                </div>

              </div>

            </div>

          )
        )}

      </div>

    </div>

  );
}