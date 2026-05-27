import {
  useEffect,
  useState,
  useRef,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  Heart,
  Play,
  Pause,
  LogOut,
  Crown,
  UserPlus,
  Trash2,
} from 'lucide-react';

import {
  getPublicTracks,
} from '../api/tracks';

import AllTracksView
  from '../components/library/AllTracksView';

import ArtistsView
  from '../components/library/ArtistsView';

import PlaylistTrackRow
  from '../components/playlists/PlaylistTrackRow';

import LibraryTabs
  from '../components/library/LibraryTabs';

import usePlayerStore
  from '../store/playerStore';

import authStore
  from '../store/auth/authStore';

export default function
LibraryPage() {

  const {
  savedTracks,
  currentTrack,
  isPlaying,
  togglePlayPause,
  playTrack,
  toggleSaveTrack,
  } = usePlayerStore();

  const {
    logout,
    user,
  } = authStore();

  const navigate =
    useNavigate();

  const scrollContainerRef =
  useRef(null);

  const [
    activeTab,
    setActiveTab,
  ] = useState(
    'saved'
  );

  const [
    allTracks,
    setAllTracks,
  ] = useState([]);

  const [
    loadingTracks,
    setLoadingTracks,
  ] = useState(false);

  useEffect(() => {

    if (

      activeTab !==
      'all'

      &&

      activeTab !==
      'artists'

    ) {

      return;

    }

    const loadTracks =
      async () => {

        try {

          setLoadingTracks(
            true
          );

          const data =
            await getPublicTracks();

          setAllTracks(
            data.tracks || []
          );

        } catch (error) {

          console.error(error);

        } finally {

          setLoadingTracks(
            false
          );

        }

      };

    loadTracks();

  }, [activeTab]);

  useEffect(() => {

  if (
    scrollContainerRef.current
  ) {

    scrollContainerRef.current
      .scrollTop = 0;
  }

  }, []);

  const handlePlayAll =
    (queue = []) => {

      if (
        !queue.length
      ) {

        return;

      }

      if (

        currentTrack?.id ===
        queue[0]?.id

        &&

        isPlaying

      ) {

        togglePlayPause();

        return;

      }

      playTrack({

        track:
          queue[0],

        queue,

        startIndex: 0,

      });

    };

  const handleLogout =
    () => {

      logout();

      navigate(
        '/app/login',
        {
          replace: true,
        }
      );

    };

  return (

    <div className="relative min-h-screen overflow-hidden">

      {/* -------------------------------- */}
      {/* Ambient Background */}
      {/* -------------------------------- */}

      <div className="absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-fuchsia-600/20 blur-[160px] pointer-events-none" />

      {/* -------------------------------- */}
      {/* Content */}
      {/* -------------------------------- */}

      <div className="relative z-10 flex h-screen flex-col px-6 pt-8">

        {/* -------------------------------- */}
        {/* Header */}
        {/* -------------------------------- */}

        <div className="flex items-start justify-between gap-4">

          <div>

            <p className="text-xs uppercase tracking-[0.35em] text-white/35">

              Dhuun

            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight">

              Library

            </h1>

            {user && (

            <div className="mt-3 max-w-[220px]">

            <p className="text-sm text-white/45">

              {user
                ? 'Logged in as'
                : 'Exploring as'}

            </p>

            <div className="mt-1 flex items-center gap-2">

              <p className="break-words text-sm text-white/70">

                {user
                  ? user.email
                  : 'Guest Listener'}

              </p>

              {user && [
                'PRO',
                'BUSINESS',
                'ENTERPRISE',
              ].includes(
                user.subscriptionStatus
              ) && (

                <div className="relative flex items-center justify-center">

                  <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-md" />

                  <Crown
                    size={15}
                    className="
                      relative
                      fill-yellow-400
                      text-yellow-200
                      drop-shadow-[0_2px_10px_rgba(251,191,36,0.7)]
                      rotate-[-10deg]
                    "
                  />

                </div>

              )}

            </div>

          </div>

          )}

          </div>

          <div className="flex items-center gap-3">

            {(
              (
                activeTab ===
                'saved'

                &&

                savedTracks.length >
                0
              )

              ||

              (
                activeTab ===
                'all'

                &&

                allTracks.length >
                0
              )
            ) && (

              <button

                onClick={() =>

                  handlePlayAll(

                    activeTab ===
                    'saved'

                      ? savedTracks

                      : allTracks

                  )
                }

                className="flex h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-black shadow-xl"
              >

                {isPlaying ? (

                  <Pause size={15} />

                ) : (

                  <Play
                    size={15}
                    fill="currentColor"
                  />

                )}

                All

              </button>

            )}

            {user ? (

              <button

                onClick={handleLogout}

                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 backdrop-blur-xl transition-all duration-200 hover:bg-white/[0.08] hover:text-white"

              >

                <LogOut size={15} />

              </button>

            ) : (

              <button

                onClick={() =>
                  navigate('/app/register')
                }

                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 backdrop-blur-xl transition-all duration-200 hover:bg-white/[0.08] hover:text-white"

              >

                <UserPlus size={15} />

              </button>

            )}

          </div>

        </div>

        {/* -------------------------------- */}
        {/* Stats */}
        {/* -------------------------------- */}

        <div className="mt-6 flex items-center gap-6 text-sm text-white/45">

          <div>

            {savedTracks.length}
            {' '}
            Saved

          </div>

          <div>

            {allTracks.length}
            {' '}
            Tracks

          </div>

        </div>

        {/* -------------------------------- */}
        {/* Tabs */}
        {/* -------------------------------- */}

        <LibraryTabs

          activeTab={
            activeTab
          }

          onChange={
            setActiveTab
          }

        />

        {/* -------------------------------- */}
        {/* Content */}
        {/* -------------------------------- */}

        <div
          ref={scrollContainerRef}
          className="scrollbar-hide mt-6 flex-1 overflow-y-auto pb-40"
        >

          {/* -------------------------------- */}
          {/* Empty State */}
          {/* -------------------------------- */}

          {activeTab ===
            'saved'

            &&

            !savedTracks.length && (

            <div className="mt-14 rounded-[36px] border border-white/10 bg-white/[0.03] p-10 text-center backdrop-blur-xl">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">

                <Heart
                  size={32}
                  className="text-white/40"
                />

              </div>

              <h2 className="mt-6 text-2xl font-bold">

                No Saved Tracks Yet

              </h2>

              <p className="mx-auto mt-4 max-w-[280px] leading-relaxed text-white/50">

                Save tracks you love
                to build your personal
                music collection.

              </p>

            </div>

          )}

          {/* -------------------------------- */}
          {/* Saved Tracks */}
          {/* -------------------------------- */}

          {activeTab ===
            'saved'

            &&

            savedTracks.length >
            0 && (

            <div className="mt-12">

              <div className="mb-6 flex items-center justify-between">

                <div>

                  <p className="text-xs uppercase tracking-[0.3em] text-white/40">

                    Favourites

                  </p>

                  <h2 className="mt-2 text-3xl font-black tracking-tight text-white">

                    Your Tracks

                  </h2>

                </div>

                <button className="text-sm text-white/40">

                  Recently Added

                </button>

              </div>

              <div className="mb-6 border-t border-white/10" />

              <div className="flex flex-col gap-2">

                {savedTracks.map(
                  (
                    track,
                    index
                  ) => (

                    <div
                      key={track.id}
                      className="group flex items-center gap-3"
                    >

                      <div className="min-w-0 flex-1">

                        <PlaylistTrackRow
                          track={track}
                          index={index}
                          queue={savedTracks}
                        />

                      </div>

                      <button

                        onClick={() =>
                          toggleSaveTrack(track)
                        }

                        className="
                          mr-2
                          flex
                          h-10
                          w-10
                          flex-shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-white/10
                          bg-white/[0.04]
                          text-white/45
                          transition-all
                          hover:border-red-500/20
                          hover:bg-red-500/10
                          hover:text-red-400
                        "

                      >

                        <Trash2 size={15} />

                      </button>

                    </div>

                  )
                )}

              </div>

            </div>

          )}

          {activeTab ===
            'all' && (

            <AllTracksView
              tracks={allTracks}
            />

          )}

          {activeTab ===
            'artists' && (

            <ArtistsView
              tracks={allTracks}
            />

          )}

        </div>

      </div>

    </div>

  );

}