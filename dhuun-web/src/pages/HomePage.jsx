import useHomeFeed from '../hooks/useHomeFeed';

import HorizontalTrackRail from '../components/discovery/HorizontalTrackRail';

import ContinueListeningStack from '../components/discovery/ContinueListeningStack';

import WideMoodRail from '../components/discovery/WideMoodRail';

import ArtistBubbleRail from '../components/discovery/ArtistBubbleRail';

import LyricsStripCarousel from '../components/discovery/LyricsStripCarousel';

import PlaylistRail from '../components/playlists/PlaylistRail';

import usePlayerStore from '../store/playerStore';

import ImmersiveHeroScene from '../components/discovery/ImmersiveHeroScene';

import selectFeaturedTrack from '../lib/discovery/selectFeaturedTrack';

import { useEffect, useState, } from 'react';

export default function
HomePage() {
  const {
    data,
    loading,
    error,
    refreshFeed,
  } = useHomeFeed();

  const {

  currentTrack,

  recentlyPlayed,

  continueListening,

  enqueueSmartTracks,

  } = usePlayerStore();

  // -----------------------------------
  // Initial Feed Refresh
  // -----------------------------------

  useEffect(() => {

    refreshFeed(true);

  }, []);

  // -----------------------------------
  // Derived Feed Data
  // -----------------------------------

  const trending =

  (
    data?.home
      ?.trending || []
  )

    .filter(
      (item) => item?.track
    );

const recommended =

  (
    data?.home
      ?.recommended || []
  )

    .filter(
      (item) => item?.track
    )

    .map(
      (item) => ({
        track:
          item.track,
      })
    );
  
  const [
  featuredTrack,
  setFeaturedTrack,
  ] = useState(null);  

  // -----------------------------------
  // Smart Queue Injection
  // -----------------------------------

  useEffect(() => {
    if (
      !recommended.length
    ) {
      return;
    }

    enqueueSmartTracks(
      recommended
        .map(
          (item) =>
            item.track
        )
        .filter(Boolean)
    );
  }, [
    recommended,
    enqueueSmartTracks,
  ]);

  /* ----------------------------------- */
  /* Featured Atmosphere */
  /* ----------------------------------- */

  useEffect(() => {

    if (!trending.length) {
      return;
    }

    const selectedTrack =

      selectFeaturedTrack({

        tracks:
          trending,

        recentlyPlayed,

      });

    setFeaturedTrack(
      selectedTrack
    );

  }, [
    trending,
  ]);

  // -----------------------------------
  // Loading
  // -----------------------------------

  if (loading) {
    return (
      <div className="p-6 text-white">
        Loading...
      </div>
    );
  }

  // -----------------------------------
  // Error
  // -----------------------------------

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Failed to load home feed
      </div>
    );
  }

  const newReleases =
  trending.slice(0, 6);

  const moodPicks =
    trending.slice(2, 8);

  const hindiPop =
    trending.slice(1, 7);

  const nightVibes =
    trending.slice(3, 9);

  /* ----------------------------------- */
  /* Featured Artists */
  /* ----------------------------------- */

  const featuredArtists = [

    ...new Map(

      trending
        .filter(
          (item) =>
            item.track
              ?.primaryArtist
        )

        .map(
          (item) => [

            item.track
              .primaryArtist.id,

            item.track
              .primaryArtist,
          ]
        )

    ).values(),

  ].slice(0, 12);

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
        
        <ImmersiveHeroScene
          track={featuredTrack}
          queue={trending}
        />

        <ArtistBubbleRail
          title="Featured Artists"
          artists={featuredArtists}
        />

        <LyricsStripCarousel
          items={trending}
        />

        {/* -------------------------------- */}
        {/* Continue Listening */}
        {/* -------------------------------- */}

        {continueListening.length >
          0 && (

          <ContinueListeningStack

            title="Continue Listening"

            items={continueListening.map(
              (item) => ({
                track:
                  item.track,
              })
            )}

          />

        )}

        {/* -------------------------------- */}
        {/* Recently Played */}
        {/* -------------------------------- */}

        {(
          data?.home
            ?.recentlyPlayed
            ?.filter(
              (item) => item?.track
            )
            ?.length > 0 ||

          recentlyPlayed
            .filter(Boolean)
            .length > 0
        ) && (

          <HorizontalTrackRail
            title="Recently Played"

            items={
              data?.home
                ?.recentlyPlayed
                ?.filter(
                  (item) => item?.track
                )
                ?.length > 0

                ? data.home.recentlyPlayed.filter(
                    (item) => item?.track
                  )

                : recentlyPlayed

                .filter(
                  (track) =>

                    track &&

                    track.streamUrl
                )

                .map(
                  (track) => ({
                    track,
                  })
                )
            }
          />
        )}

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

        {recommended.length >
          0 && (
          <WideMoodRail

            title="Recommended"

            subtitle="Curated For You"

            items={recommended}

          />
        )}

        <HorizontalTrackRail
          title="New Releases"
          items={newReleases}
        />

        <WideMoodRail

          title="Mood Picks"

          subtitle="Immersive Discovery"

          items={moodPicks}

        />

        <HorizontalTrackRail
          title="Hindi Pop"
          items={hindiPop}
        />

        <WideMoodRail

          title="Night Vibes"

          subtitle="After Dark"

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