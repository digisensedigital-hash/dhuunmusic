export default function TrackTabs({
  activeTab,
  setActiveTab,
}) {

  return (  
  
<div className="mt-8 flex items-center justify-between border-b border-white/10">

    {[
      'Details',
      'Lyrics',
      'Credits',
      'Similar',
    ].map((tab) => {

      const active =
        tab === activeTab;

      return (

        <button
          key={tab}

          onClick={() =>
            setActiveTab(tab)
          }
          className={`relative flex-1 pb-4 pt-2 text-sm font-medium transition ${
            active
              ? 'text-white'
              : 'text-zinc-500'
          }`}
        >

          {tab}{active && (

            <div className="absolute bottom-0 left-1/2 h-[3px] w-12 -translate-x-1/2 rounded-full bg-fuchsia-500" />

          )}

        </button>

      );
    })}

    </div>

  );
}