import GlobalPlayer
  from '../player/GlobalPlayer';

import BottomNav
  from '../components/layout/BottomNav';

import PlayerBar
  from '../components/player/PlayerBar';

import ExpandedPlayer
  from '../components/player/ExpandedPlayer';

import usePlayerStore
  from '../store/playerStore';

export default function
MainLayout({
  children
}) {
  const {
    isExpandedPlayerOpen,
    setExpandedPlayerOpen,
  } = usePlayerStore();

  return (
    <div className="bg-[#07070B] text-white min-h-screen flex justify-center">
      {/* -------------------------------- */}
      {/* Mobile Runtime Shell */}
      {/* -------------------------------- */}

      <div className="w-full max-w-md min-h-screen bg-[#0B0B12] relative overflow-hidden border-x border-white/5">
        {/* -------------------------------- */}
        {/* Scrollable Content */}
        {/* -------------------------------- */}

        <main className="pb-52">
          {children}
        </main>

        {/* -------------------------------- */}
        {/* Persistent Audio Runtime */}
        {/* -------------------------------- */}

        <GlobalPlayer />

        {/* -------------------------------- */}
        {/* Expanded Player */}
        {/* -------------------------------- */}

        <ExpandedPlayer
          open={
            isExpandedPlayerOpen
          }
          onClose={() =>
            setExpandedPlayerOpen(
              false
            )
          }
        />

        {/* -------------------------------- */}
        {/* Mini Player */}
        {/* -------------------------------- */}

        <PlayerBar />

        {/* -------------------------------- */}
        {/* Bottom Navigation */}
        {/* -------------------------------- */}

        <BottomNav />
      </div>
    </div>
  );
}