import {
  motion,
} from 'framer-motion';

const tabs = [

  {
    id: 'saved',
    label: 'Saved',
  },

  {
    id: 'all',
    label: 'All Tracks',
  },

  {
  id: 'artists',
  label: 'Artists',
  },

];

export default function
LibraryTabs({

  activeTab,

  onChange,

}) {

  return (

    <div className="mt-10 overflow-x-auto scrollbar-hide">

      <div className="flex min-w-max items-center gap-3">

        {tabs.map(
          (tab) => {

            const isActive =

              activeTab ===
              tab.id;

            return (

              <button
                key={tab.id}

                onClick={() =>
                  onChange(
                    tab.id
                  )
                }

                className={`
                  relative overflow-hidden rounded-full border px-6 py-3 text-sm font-semibold transition-all duration-300

                  ${
                    isActive

                      ? `
                        border-white/20
                        bg-white
                        text-black
                        shadow-[0_8px_40px_rgba(255,255,255,0.15)]
                      `

                      : `
                        border-white/10
                        bg-white/[0.04]
                        text-white/60
                        hover:bg-white/[0.08]
                        hover:text-white
                      `
                  }
                `}
              >

                {isActive && (

                  <motion.div

                    layoutId="library-tab-pill"

                    className="absolute inset-0 rounded-full bg-white"

                    transition={{
                      type: 'spring',
                      bounce: 0.2,
                      duration: 0.5,
                    }}
                  />

                )}

                <span className="relative z-10">

                  {tab.label}

                </span>

              </button>
            );
          }
        )}

      </div>

    </div>
  );
}