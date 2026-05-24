import {
  Outlet,
} from 'react-router-dom';

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
MainLayout() {

  return (

    <div className="safe-top safe-left safe-right flex min-h-screen justify-center bg-[#07070B] text-white">

      {/* -------------------------------- */}
      {/* Mobile Runtime Shell */}
      {/* -------------------------------- */}

      <div className="relative min-h-screen w-full max-w-md overflow-hidden border-x border-white/5 bg-[#0B0B12]">

        {/* -------------------------------- */}
        {/* Scrollable Runtime */}
        {/* -------------------------------- */}

        <main

          id="app-scroll-container"

          className="scrollbar-hide h-screen overflow-y-auto overscroll-none pb-[220px]"
        >

          <Outlet />

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

        <div className="safe-bottom">

          <BottomNav />

        </div>

      </div>

    </div>
  );
}