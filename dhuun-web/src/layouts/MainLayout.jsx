import GlobalPlayer
  from '../player/GlobalPlayer';

import BottomNav
  from '../components/layout/BottomNav';

import PlayerBar
  from '../components/player/PlayerBar';

import FullscreenPlayer
  from '../components/player/FullscreenPlayer';

import QueueDrawer
  from '../components/player/QueueDrawer';

export default function
MainLayout({
  children
}) {
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
        {/* Fullscreen Player */}
        {/* -------------------------------- */}

        <FullscreenPlayer />

        {/* -------------------------------- */}
        {/* Queue Drawer */}
        {/* -------------------------------- */}

        <QueueDrawer />

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