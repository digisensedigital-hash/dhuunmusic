import useHomeFeed from '../hooks/useHomeFeed';

import HorizontalTrackRail from '../components/discovery/HorizontalTrackRail';

import HeroFeaturedCard from '../components/discovery/HeroFeaturedCard';

import PlaylistRail from '../components/playlists/PlaylistRail';

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
  
  const featuredTrack =
    trending[0] || null;
    
  const newReleases =
  trending.slice(0, 6);

  const moodPicks =
    trending.slice(2, 8);

  const hindiPop =
    trending.slice(1, 7);

  const nightVibes =
    trending.slice(3, 9);

  const playlists = [
  {
    id: '1',

    title:
      'Late Night Vibes',

    description:
      'Moody tracks for deep nights and cinematic drives.',

    trackCount: 18,

    images:
      trending
        .slice(0, 4)
        .map(
          (
            item
          ) =>
            item.track
              ?.coverImage
        ),
  },

  {
    id: '2',

    title:
      'Hindi Pop Essentials',

    description:
      'Trending Hindi pop hits and immersive melodies.',

    trackCount: 24,

    images:
      trending
        .slice(2, 6)
        .map(
          (
            item
          ) =>
            item.track
              ?.coverImage
        ),
  },

  {
    id: '3',

    title:
      'Soulful Sufi',

    description:
      'Spiritual vocals, deep poetry, and emotional journeys.',

    trackCount: 14,

    images:
      trending
        .slice(4, 8)
        .map(
          (
            item
          ) =>
            item.track
              ?.coverImage
        ),
  },
  ];

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

          <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6">
            {/* -------------------------------- */}
            {/* Ambient Layers */}
            {/* -------------------------------- */}

            <div className="absolute -top-24 -right-16 w-[220px] h-[220px] bg-fuchsia-500/20 blur-[100px] rounded-full" />

            <div className="absolute bottom-[-80px] left-[-40px] w-[200px] h-[200px] bg-purple-500/20 blur-[100px] rounded-full" />

            {/* -------------------------------- */}
            {/* Content */}
            {/* -------------------------------- */}

            <div className="relative z-10">
              <p className="text-xs uppercase tracking-[0.35em] text-white/40 mb-4">
                Welcome Back
              </p>

              <h1 className="text-5xl font-black tracking-tight leading-none">
                Dhuun
              </h1>

              <p className="text-white/60 mt-5 text-sm leading-relaxed max-w-[260px]">
                Discover immersive music,
                cinematic playback,
                and curated vibes.
              </p>

              {/* -------------------------------- */}
              {/* Stats */}
              {/* -------------------------------- */}

              <div className="flex items-center gap-6 mt-8">
                <div>
                  <div className="text-2xl font-black">
                    HD
                  </div>

                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-1">
                    Audio
                  </div>
                </div>

                <div>
                  <div className="text-2xl font-black">
                    ∞
                  </div>

                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-1">
                    Vibes
                  </div>
                </div>

                <div>
                  <div className="text-2xl font-black">
                    New
                  </div>

                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-1">
                    Daily
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* -------------------------------- */}
        {/* Hero Featured */}
        {/* -------------------------------- */}

        <div className="mb-12">
          <HeroFeaturedCard
            track={featuredTrack}
            queue={trending}
          />
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

        <HorizontalTrackRail
          title="New Releases"
          items={newReleases}
        />

        <HorizontalTrackRail
          title="Mood Picks"
          items={moodPicks}
        />

        <HorizontalTrackRail
          title="Hindi Pop"
          items={hindiPop}
        />

        <HorizontalTrackRail
          title="Night Vibes"
          items={nightVibes}
        />

        <PlaylistRail
          title="Curated Playlists"
          items={playlists}
        />
        
      </div>
    </div>
  );
}