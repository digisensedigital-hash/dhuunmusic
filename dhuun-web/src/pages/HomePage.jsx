import useHomeFeed
  from '../hooks/useHomeFeed';

import HorizontalTrackRail
  from '../components/discovery/HorizontalTrackRail';

export default function
HomePage() {
  const {
    data,
    loading,
    error,
  } = useHomeFeed();

  if (loading) {
    return (
      <div className="p-6 text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Failed to load home feed
      </div>
    );
  }

  const trending =
    data?.home?.trending || [];

  const recommended =
    data?.home?.recommended || [];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07010F] text-white">
      {/* -------------------------------- */}
      {/* Ambient Background */}
      {/* -------------------------------- */}

      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-purple-600/20 blur-[140px] rounded-full pointer-events-none" />

      <div className="absolute bottom-[-180px] right-[-100px] w-[420px] h-[420px] bg-fuchsia-500/10 blur-[140px] rounded-full pointer-events-none" />

      {/* -------------------------------- */}
      {/* Content */}
      {/* -------------------------------- */}

      <div className="relative z-10 px-6 pt-[max(56px,env(safe-area-inset-top))] pb-40">
        {/* -------------------------------- */}
        {/* Header */}
        {/* -------------------------------- */}

        <div className="flex items-center gap-4 mb-12">
          {/* Logo */}

          <img
            src="/Dhuun.png"
            alt="Dhuun Music"
            className="w-16 h-16 object-contain drop-shadow-2xl"
          />

          {/* Title */}

          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/40 mb-2">
              Welcome Back
            </p>

            <h1 className="text-4xl font-black tracking-tight leading-none">
              Dhuun Music
            </h1>

            <p className="text-white/60 mt-2 text-sm">
              Feel the music.
            </p>
          </div>
        </div>

        {/* -------------------------------- */}
        {/* Trending */}
        {/* -------------------------------- */}

        <HorizontalTrackRail
          title="Trending"
          items={trending}
        />

        {/* -------------------------------- */}
        {/* Recommended */}
        {/* -------------------------------- */}

        <HorizontalTrackRail
          title="Recommended"
          items={recommended}
        />
      </div>
    </div>
  );
}