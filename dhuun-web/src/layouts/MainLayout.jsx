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

    <div className="flex min-h-screen justify-center bg-[#07070B] text-white">

      {/* -------------------------------- */}
      {/* Mobile Runtime Shell */}
      {/* -------------------------------- */}

      <div className="relative min-h-screen w-full max-w-md overflow-x-hidden border-x border-white/5 bg-[#0B0B12]">

        {/* -------------------------------- */}
        {/* Scrollable Content */}
        {/* -------------------------------- */}

        <main
          id="app-scroll-container"
          className="h-screen overflow-y-auto pb-52"
        >
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