import {
  useEffect,
  useState,
} from 'react';

import {
  getPublicTracks,
} from '../api/tracks';

import AllTracksView
  from '../components/library/AllTracksView';

import ArtistsView
  from '../components/library/ArtistsView';

import {
  Heart,
  Play,
  Pause,
} from 'lucide-react';

import usePlayerStore
  from '../store/playerStore';

import PlaylistTrackRow
  from '../components/playlists/PlaylistTrackRow';

import LibraryTabs
  from '../components/library/LibraryTabs';

export default function
LibraryPage() {
  const {
  savedTracks,
  currentTrack,
  isPlaying,
  togglePlayPause,
  playTrack,
  } = usePlayerStore();

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

  const handlePlayAll =
  (queue = []) => {

    if (
      !queue.length
    ) {
      return;
    }

    if (

      currentTrack?.id ===
      queue[0]?.id &&

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

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* -------------------------------- */}
      {/* Ambient Background */}
      {/* -------------------------------- */}

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-fuchsia-600/20 blur-[160px] rounded-full pointer-events-none" />

      {/* -------------------------------- */}
      {/* Content */}
      {/* -------------------------------- */}

      <div className="relative z-10 flex h-screen flex-col px-6 pt-8">
        
        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs uppercase tracking-[0.35em] text-white/35">

              Dhuun

            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight">

              Library

            </h1>

          </div>

          {((activeTab ===
          'saved' &&

          savedTracks.length >
          0)

          ||

          (activeTab ===
          'all' &&

          allTracks.length >
          0)

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

            className="h-12 px-5 rounded-full bg-white text-black flex items-center gap-2 text-sm font-semibold shadow-xl"

          >

            {isPlaying ? (

              <Pause size={18} />

            ) : (

              <Play
                size={18}
                fill="currentColor"
              />
            )}

            Play All

          </button>
        )}

        </div>

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

        <LibraryTabs

          activeTab={
            activeTab
          }

          onChange={
            setActiveTab
          }
        />

      <div className="mt-6 flex-1 overflow-y-auto scrollbar-hide pb-40">

        {/* -------------------------------- */}
        {/* Empty State */}
        {/* -------------------------------- */}

        {activeTab ===
        'saved' &&

        !savedTracks.length && (
          <div className="mt-14 rounded-[36px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-10 text-center">
            <div className="w-20 h-20 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto">
              <Heart
                size={32}
                className="text-white/40"
              />
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              No Saved Tracks Yet
            </h2>

            <p className="mt-4 text-white/50 leading-relaxed max-w-[280px] mx-auto">
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
          'saved' &&

          savedTracks.length >
          0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">

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
                  <PlaylistTrackRow
                    key={track.id}
                    track={track}
                    index={index}
                    queue={
                      savedTracks
                    }
                  />
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