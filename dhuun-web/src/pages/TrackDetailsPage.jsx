import {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  Check,
  ChevronDown,
  Clock3,
  Globe,
  Music2,
  Play,
  User2,
  X,
} from 'lucide-react';

import getTrackDetails
  from '../api/getTrackDetails';

import convertLyricsScript
  from '../api/convertLyricsScript';

import {
  getMediaUrl,
} from '../utils/media';

import usePlayerStore
  from '../store/playerStore';

import {
  loadPlaybackQueue,
} from '../lib/player';

export default function
TrackDetailsPage() {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    track,
    setTrack,
  ] = useState(null);

  const [
    variants,
    setVariants,
  ] = useState([]);

  const [
  selectedScript,
  setSelectedScript,
  ] = useState(
    'Original Script'
  );

  const [
    isScriptMenuOpen,
    setIsScriptMenuOpen,
  ] = useState(false);

  const [
    convertedLyrics,
    setConvertedLyrics,
  ] = useState('');

  const [
  convertingLyrics,
  setConvertingLyrics,
  ] = useState(false);

  const [
    transliterationCache,
    setTransliterationCache,
  ] = useState({});

  const playTrack =
    usePlayerStore(
      (state) =>
        state.playTrack
    );

  const SCRIPT_OPTIONS = [

  'Original Script',

  'Roman English',

  'Hindi',

  'Marathi',

  'Urdu',

  'Arabic',

  'Bengali',

  'Tamil',

  'Telugu',

  'Malayalam',

  'Gujarati',

  'Punjabi',

  'Japanese',

  'Korean',

  'Russian',

  'Spanish',

  'French',

  ];

  /* ----------------------------------- */
  /* Script Conversion */
  /* ----------------------------------- */

  const handleScriptChange =
    async (script) => {

      setSelectedScript(
        script
      );

      /*
      -----------------------------------
      Original Script
      -----------------------------------
      */

      if (
        script ===
        'Original Script'
      ) {

        setConvertedLyrics(
          ''
        );

        setIsScriptMenuOpen(
          false
        );

        return;
      }

      /*
      -----------------------------------
      Cache Hit
      -----------------------------------
      */

      if (
        transliterationCache[
          script
        ]
      ) {

        setConvertedLyrics(
          transliterationCache[
            script
          ]
        );

        setIsScriptMenuOpen(
          false
        );

        return;
      }

      /*
      -----------------------------------
      Temporary Mock Conversion
      -----------------------------------
      */

      /*
      -----------------------------------
      Persistent Browser Cache
      -----------------------------------
      */

      const trackId =
        track.id || track._id;

      const localCacheKey =
        `dhuun-script-${trackId}-${script}`;

      const localCache =
        localStorage.getItem(
          localCacheKey
        );

      if (localCache) {

        setConvertedLyrics(
          localCache
        );

        setTransliterationCache(
          (prev) => ({
            ...prev,

            [script]:
              localCache,
          })
        );

        setIsScriptMenuOpen(
          false
        );

        return;
      }

      try {

        setConvertingLyrics(
          true
        );

        const response =
        await convertLyricsScript({

          trackId:
            trackId,

          targetScript:
            script,
        });
        const renderedLyrics =
          response.lyrics;

        setConvertedLyrics(
          renderedLyrics
        );

        setTransliterationCache(
          (prev) => ({
            ...prev,

            [script]:
              renderedLyrics,
          })
        );

      /*
      -----------------------------------
      Persistent Browser Cache Save
      -----------------------------------
      */

      localStorage.setItem(

        `dhuun-script-${trackId}-${script}`,

        renderedLyrics
      );

      } catch (error) {

        console.error(error);

      } finally {

        setConvertingLyrics(
          false
        );

        setIsScriptMenuOpen(
          false
        );
      }
    };

  /* ----------------------------------- */
  /* Fetch Track */
  /* ----------------------------------- */

  useEffect(() => {

    /* ----------------------------------- */
    /* Scroll Reset */
    /* ----------------------------------- */

    const container =
    document.getElementById(
        'app-scroll-container'
    );

    if (container) {

    container.scrollTo({
        top: 0,
        behavior: 'instant',
    });
    }

    const fetchTrack =
      async () => {

        try {

          setLoading(true);

          const response =
            await getTrackDetails(
              id
            );

          setTrack(
            response.track
          );

          setVariants(
            response.variants ||
            []
          );

        } catch (error) {

          console.error(error);

        } finally {

          setLoading(false);
        }
      };

    fetchTrack();

  }, [id]);

  /* ----------------------------------- */
  /* Loading */
  /* ----------------------------------- */

  if (loading) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">

        Loading track...

      </div>
    );
  }

  /* ----------------------------------- */
  /* Not Found */
  /* ----------------------------------- */

  if (!track) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">

        Track not found

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-black text-white">

      <div className="mx-auto max-w-7xl px-4 pb-36 pt-6">

        {/* ----------------------------------- */}
        {/* Hero */}
        {/* ----------------------------------- */}

        <div className="flex flex-col gap-8">

          {/* ----------------------------------- */}
          {/* Artwork */}
          {/* ----------------------------------- */}

          <div className="w-full">

            <img
              src={getMediaUrl(
                track.coverImage
              )}
              alt={track.title}
              className="aspect-square w-full rounded-[32px] object-cover shadow-2xl"
            />

          </div>

          {/* ----------------------------------- */}
          {/* Details */}
          {/* ----------------------------------- */}

          <div>

            {/* Language */}

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-300">

              <Globe size={16} />

              {track.language}

            </div>

            {/* Title */}

            <h1 className="text-4xl font-black leading-tight tracking-tight">

              {track.title}

            </h1>

            {/* Artist */}

            <div className="mt-5 flex items-center gap-3">

              {track.primaryArtist
                ?.profileImage && (

                <img
                  src={getMediaUrl(
                    track.primaryArtist
                      .profileImage
                  )}
                  alt={
                    track.primaryArtist
                      .stageName
                  }
                  className="h-12 w-12 rounded-full object-cover"
                />

              )}

              <div>

                <p className="text-lg font-semibold">

                  {
                    track.primaryArtist
                      ?.stageName
                  }

                </p>

                <p className="text-sm text-zinc-500">

                  Artist

                </p>

              </div>

            </div>

            {/* Metadata */}

            <div className="mt-6 flex flex-wrap gap-3">

              <div className="flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">

                <Music2 size={16} />

                {track.genre}

              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">

                <Clock3 size={16} />

                {Math.floor(
                Number(track.duration || 0) / 60
                )}
                :
                {String(
                Math.floor(
                    Number(track.duration || 0) % 60
                )
                ).padStart(2, '0')}

              </div>

              {track.isExplicit && (

                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">

                  Explicit

                </div>

              )}

            </div>

            {/* Play */}

            <div className="mt-8">

              <button
                onClick={async () => {

                try {

                    const response =
                    await loadPlaybackQueue(
                        track.id
                    );

                    const normalizedQueue = [

                    response.currentTrack,

                    ...response.nextTracks,

                    ].map((queueTrack) => ({

                    ...queueTrack,

                    id:
                        queueTrack.id ||
                        queueTrack._id,
                    }));

                    playTrack({
                    track:
                        response.currentTrack,

                    queue:
                        normalizedQueue,

                    startIndex: 0,
                    });

                } catch (error) {

                    console.error(
                    'Failed to load playback queue:',
                    error
                    );

                    playTrack({
                    track: {
                        ...track,

                        artwork:
                        track.coverImage,
                    },

                    queue: [
                        {
                        ...track,

                        artwork:
                            track.coverImage,
                        },
                    ],

                    startIndex: 0,
                    });
                }
                }}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 font-semibold text-black transition hover:scale-[1.02]"
              >

                <Play
                  size={20}
                  fill="black"
                />

                Play Now

              </button>

            </div>

            {/* ----------------------------------- */}
            {/* Variants */}
            {/* ----------------------------------- */}

            {variants.length > 1 && (

              <div className="mt-10">

                <h2 className="text-lg font-semibold">

                  Available Versions

                </h2>

                <p className="mt-1 text-sm text-zinc-500">

                  Listen in other languages and versions.

                </p>

                <div className="mt-5 flex flex-wrap gap-2">

                  {variants.map(
                    (variant) => {

                      const active =
                        variant._id ===
                        track._id;

                      return (

                        <button
                          key={
                            variant._id
                          }

                          onClick={() =>
                            navigate(
                              `/track/${variant._id}`
                            )
                          }

                          className={`rounded-2xl border px-5 py-3 text-sm font-medium transition ${
                            active
                              ? 'border-white bg-white text-black'
                              : 'border-zinc-800 bg-zinc-950 text-white hover:border-zinc-700'
                          }`}
                        >

                          <div className="flex items-center gap-2">

                            <span>

                              {
                                variant.language
                              }

                            </span>

                            {variant.versionType !==
                              'ORIGINAL' && (

                              <span className="text-xs opacity-70">

                                • {
                                  variant.versionType
                                }

                              </span>

                            )}

                          </div>

                        </button>

                      );
                    }
                  )}

                </div>

              </div>

            )}

          </div>

        </div>

        {/* ----------------------------------- */}
        {/* Lyrics */}
        {/* ----------------------------------- */}

        {track.lyrics && (

          <div className="mt-16 rounded-3xl border border-zinc-800 bg-zinc-950 p-8">

            {/* ----------------------------------- */}
            {/* Header */}
            {/* ----------------------------------- */}

            <div className="flex items-center justify-between gap-4">

              <h2 className="text-2xl font-bold">

                Lyrics

              </h2>

              <button
                onClick={() =>
                  setIsScriptMenuOpen(
                    true
                  )
                }
                className="flex items-center gap-2 rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/10 px-4 py-2 text-sm font-medium text-fuchsia-200 backdrop-blur-xl transition hover:border-fuchsia-400/40"
              >

                <Globe size={16} />

                {selectedScript}

                <ChevronDown
                  size={16}
                />

              </button>

            </div>

            {/* ----------------------------------- */}
            {/* Lyrics Content */}
            {/* ----------------------------------- */}

            <div className="mt-6 min-h-[220px]">

              {convertingLyrics ? (

                <div className="space-y-4 animate-pulse">

                  <div className="h-4 w-3/4 rounded-full bg-zinc-800" />

                  <div className="h-4 w-full rounded-full bg-zinc-800" />

                  <div className="h-4 w-5/6 rounded-full bg-zinc-800" />

                  <div className="h-4 w-2/3 rounded-full bg-zinc-800" />

                  <div className="h-4 w-full rounded-full bg-zinc-800" />

                </div>

              ) : (

                <div className="whitespace-pre-wrap text-lg leading-9 text-zinc-300 transition-all duration-300">

                  {convertedLyrics ||
                    track.lyrics}

                </div>

              )}

            </div>

          </div>

        )}

        {/* ----------------------------------- */}
        {/* Script Selector */}
        {/* ----------------------------------- */}

        {isScriptMenuOpen && (

          <div className="fixed inset-0 z-50 flex justify-center bg-black/70 backdrop-blur-sm">

            <div className="absolute bottom-0 w-full max-w-md rounded-t-[36px] border-t border-zinc-800 bg-[#0B0B12] p-6">

              {/* Header */}

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-xl font-bold">

                    Read Lyrics In

                  </h3>

                  <p className="mt-1 text-sm text-zinc-500">

                    Choose your preferred writing system

                  </p>

                </div>

                <button
                  onClick={() =>
                    setIsScriptMenuOpen(
                      false
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950"
                >

                  <X size={18} />

                </button>

              </div>

              {/* Options */}

              <div className="mt-6 max-h-[60vh] space-y-2 overflow-y-auto">

                {SCRIPT_OPTIONS.map(
                  (option) => {

                    const active =
                      selectedScript ===
                      option;

                    return (

                      <button
                        key={option}

                        onClick={() =>
                          handleScriptChange(
                            option
                          )
                        }

                        className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left transition ${
                          active
                            ? 'border-fuchsia-500/30 bg-fuchsia-500/10'
                            : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                        }`}
                      >

                        <div>

                          <p className="font-medium">

                            {option}

                          </p>

                        </div>

                        {active && (

                          <Check
                            size={18}
                            className="text-fuchsia-300"
                          />

                        )}

                      </button>

                    );
                  }
                )}

              </div>

            </div>

          </div>

        )}

        {/* ----------------------------------- */}
        {/* Contributors */}
        {/* ----------------------------------- */}

        {track.contributors
          ?.length > 0 && (

          <div className="mt-16 rounded-3xl border border-zinc-800 bg-zinc-950 p-8">

            <h2 className="text-2xl font-bold">

              Contributors

            </h2>

            <div className="mt-6 grid gap-4">

              {track.contributors.map(
                (
                  contributor,
                  index
                ) => (

                  <div
                    key={index}
                    className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-black p-5"
                  >

                    <div className="flex items-center gap-4">

                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900">

                        <User2
                          size={20}
                        />

                      </div>

                      <div>

                        <p className="font-medium">

                          {
                            contributor.displayName
                          }

                        </p>

                        <p className="mt-1 text-sm text-zinc-500">

                          {
                            contributor.role
                          }

                        </p>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        )}

      </div>

    </div>
  );
}