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
      <div className="p-6">
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
    <div className="relative min-h-screen overflow-hidden">
      {/* -------------------------------- */}
      {/* Ambient Background */}
      {/* -------------------------------- */}

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/20 blur-[140px] rounded-full pointer-events-none" />

      {/* -------------------------------- */}
      {/* Content */}
      {/* -------------------------------- */}

      <div className="relative z-10 px-6 pt-10">
        {/* -------------------------------- */}
        {/* Header */}
        {/* -------------------------------- */}

        <div className="mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-white/40 mb-3">
            Welcome Back
          </p>

          <h1 className="text-5xl font-black tracking-tight leading-none">
            Dhuun
          </h1>

          <p className="text-white/60 mt-4 text-base">
            Feel the music.
          </p>
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