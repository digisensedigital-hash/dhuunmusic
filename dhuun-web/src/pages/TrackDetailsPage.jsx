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
  Languages,
  Music2,
  Play,
  User2,
  X,
} from 'lucide-react';

import getTrackDetails
  from '../api/getTrackDetails';

import convertLyricsScript
  from '../api/convertLyricsScript';

import translateLyricsMeaning
  from '../api/translateLyricsMeaning';

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
  similarTracks,
  setSimilarTracks,
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
  scriptProgressText,
  setScriptProgressText,
  ] = useState('');

  const [
  meaningEnabled,
  setMeaningEnabled,
] = useState(false);

const [
  translatedMeaning,
  setTranslatedMeaning,
] = useState('');

const [
  meaningLoading,
  setMeaningLoading,
] = useState(false);

const [
  meaningProgressText,
  setMeaningProgressText,
] = useState('');

const [
  meaningCache,
  setMeaningCache,
] = useState({});

  const [
    transliterationCache,
    setTransliterationCache,
  ] = useState({});

  const [
    activeTab,
    setActiveTab,
  ] = useState(
    'Details'
  );

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

      setConvertingLyrics(
        true
      );

      setTimeout(() => {

        setConvertedLyrics(

          transliterationCache[
            script
          ]
        );

        setConvertingLyrics(
          false
        );

        setIsScriptMenuOpen(
          false
        );

      }, 180);

      return;
    }

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

      setConvertingLyrics(
        true
      );

      setTimeout(() => {

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

        setConvertingLyrics(
          false
        );

        setIsScriptMenuOpen(
          false
        );

      }, 180);

      return;
    }

    /*
    -----------------------------------
    API Conversion
    -----------------------------------
    */

    try {

      setConvertingLyrics(
        true
      );

      const response =
        await convertLyricsScript({

          trackId,

          targetScript:
            script,
        });

      console.log(
        '[SCRIPT RESPONSE]',
        response
      );

      const renderedLyrics =

        response.lyrics ||

        response.convertedLyrics ||

        '';

      if (
        !renderedLyrics.trim()
      ) {

        throw new Error(
          'Empty transliteration response'
        );
      }

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

        localCacheKey,

        renderedLyrics
      );

    } catch (error) {

      console.error(

        'Script conversion failed:',

        error?.response?.data ||

        error.message
      );

    } finally {

      setConvertingLyrics(
        false
      );

      setScriptProgressText(
        ''
      );

      setIsScriptMenuOpen(
        false
      );
    }
  };

  /* ----------------------------------- */
/* Meaning Translation */
/* ----------------------------------- */

const handleMeaningToggle =
  async () => {

    const nextState =
      !meaningEnabled;

    setMeaningEnabled(
      nextState
    );

    /* ----------------------------------- */
    /* OFF */
    /* ----------------------------------- */

    if (!nextState) {

      return;
    }

    /* ----------------------------------- */
    /* Cache Hit */
    /* ----------------------------------- */

    if (
      meaningCache[
        'English'
      ]
    ) {

      setTranslatedMeaning(

        meaningCache[
          'English'
        ]
      );

      return;
    }

    try {

      setMeaningLoading(
        true
      );

      const trackId =
        track.id ||
        track._id;

      const response =
        await translateLyricsMeaning({

          trackId,

          targetLanguage:
            'English',
        });

      const translated =
        response.lyrics;

      setTranslatedMeaning(
        translated
      );

      setMeaningCache(
        (prev) => ({
          ...prev,

          English:
            translated,
        })
      );

    } catch (error) {

      console.error(
        error
      );

    } finally {

      setMeaningLoading(
        false
      );

      setMeaningProgressText(
        ''
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

          setMeaningEnabled(
            false
          );

          setTranslatedMeaning(
            ''
          );

          setVariants(
            response.variants ||
            []
          );

          setSimilarTracks(

          (
            response.similarTracks ||

            response.relatedTracks ||

            []
          ).filter(
            (similarTrack) => {

              const currentId =
                String(
                  response.track.id ||
                  response.track._id
                );

              const similarId =
                String(
                  similarTrack.id ||
                  similarTrack._id
                );

              return (
                currentId !==
                similarId
              );
            }
          )
        );

        } catch (error) {

          console.error(error);

        } finally {

          setLoading(false);
        }
      };

    fetchTrack();

  }, [id]);

  useEffect(() => {

  if (!convertingLyrics) {

    return;
  }

  const stages = [

    'Analyzing lyrical structure...',

    'Preserving pronunciation flow...',

    'Converting script intelligently...',

    'Refining poetic readability...',
  ];

  let index = 0;

  setScriptProgressText(
    stages[0]
  );

  const interval =
    setInterval(() => {

      index =
        (index + 1) %
        stages.length;

      setScriptProgressText(
        stages[index]
      );

    }, 2200);

  return () =>
    clearInterval(
      interval
    );

}, [convertingLyrics]);

useEffect(() => {

  if (!meaningLoading) {

    return;
  }

  const stages = [

    'Understanding lyrical meaning...',

    'Interpreting poetic emotion...',

    'Preserving emotional context...',

    'Refining expressive translation...',
  ];

  let index = 0;

  setMeaningProgressText(
    stages[0]
  );

  const interval =
    setInterval(() => {

      index =
        (index + 1) %
        stages.length;

      setMeaningProgressText(
        stages[index]
      );

    }, 2200);

  return () =>
    clearInterval(
      interval
    );

}, [meaningLoading]);

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

  <div className="relative min-h-screen overflow-hidden bg-black text-white">

    {/* ----------------------------------- */}
    {/* Ambient Background */}
    {/* ----------------------------------- */}

    <div className="pointer-events-none absolute inset-0 overflow-hidden">

      {/* Main Glow */}

      <div className="absolute left-1/2 top-[-140px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-[120px]" />

      {/* Secondary Purple */}

      <div className="absolute right-[-120px] top-[280px] h-[300px] w-[300px] rounded-full bg-purple-500/10 blur-[120px]" />

      {/* Bottom Ambient */}

      <div className="absolute bottom-[-160px] left-[-100px] h-[320px] w-[320px] rounded-full bg-pink-500/10 blur-[120px]" />

      {/* Noise Overlay */}

      <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light">

        <div className="h-full w-full bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[size:18px_18px]" />

      </div>

    </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-36 pt-6">

        {/* ----------------------------------- */}
        {/* Cinematic Hero */}
        {/* ----------------------------------- */}

        <div className="rounded-[36px] border border-white/10 bg-gradient-to-br from-[#181022] via-[#130B1D] to-[#221133] p-5 shadow-[0_0_80px_rgba(168,85,247,0.08)]">

          {/* ----------------------------------- */}
          {/* Top Bar */}
          {/* ----------------------------------- */}

          <div className="flex items-center justify-between">

            <button
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-xl"
            >

              ←

            </button>

            <div className="text-sm font-medium tracking-wide text-zinc-400">

              Track

            </div>

            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-xl">

              ⋯

            </button>

          </div>

          {/* ----------------------------------- */}
          {/* Hero Content */}
          {/* ----------------------------------- */}

          <div className="mt-8 flex gap-5">

            {/* Artwork */}

            <div className="w-[42%] flex-shrink-0">

              <img
                src={getMediaUrl(
                  track.coverImage
                )}
                alt={track.title}
                className="aspect-square w-full rounded-[28px] object-cover shadow-2xl"
              />

            </div>

            {/* Meta */}

            <div className="flex min-w-0 flex-1 flex-col">

              {/* Label */}

              <div className="text-[11px] uppercase tracking-[0.35em] text-zinc-500">

                Cinematic Single

              </div>

              {/* Title */}

              <h1 className="mt-3 text-[38px] font-black leading-[0.95] tracking-tight text-white">

                {track.title}

              </h1>

              {/* Artist */}

              <div className="mt-4 flex items-center gap-3">

                {track.primaryArtist
                  ?.profileImage && (

                  <img
                    src={getMediaUrl(
                      track.primaryArtist
                        .profileImage
                    )}
                    alt={
                      track.primaryArtist
                        ?.stageName
                    }
                    className="h-10 w-10 rounded-full object-cover"
                  />

                )}

                <div>

                  <p className="font-semibold text-white">

                    {
                      track.primaryArtist
                        ?.stageName
                    }

                  </p>

                  <p className="text-sm text-zinc-500">

                    Dhuun Music

                  </p>

                </div>

              </div>

              {/* Metadata */}

              <div className="mt-5 flex flex-wrap gap-2 text-sm text-zinc-400">

                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">

                  {track.genre}

                </div>

                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">

                  {track.language}

                </div>

                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">

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

              </div>

              {/* Actions */}

              <div className="mt-auto pt-6">

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

                  className="flex w-full items-center justify-center gap-3 rounded-[22px] bg-white px-5 py-4 text-lg font-bold text-black transition hover:scale-[1.01]"
                >

                  <Play
                    size={20}
                    fill="black"
                  />

                  Play Now

                </button>

              </div>

            </div>

          </div>

  {/* ----------------------------------- */}
  {/* Tabs */}
  {/* ----------------------------------- */}

  <div className="mt-8 flex items-center justify-between border-b border-white/10">

    {[
      'Details',
      'Lyrics',
      'Credits',
      'Similar',
    ].map((tab) => {

      const active =
        tab === activeTab;

      return (

        <button
          key={tab}

          onClick={() =>
            setActiveTab(tab)
          }
          className={`relative flex-1 pb-4 pt-2 text-sm font-medium transition ${
            active
              ? 'text-white'
              : 'text-zinc-500'
          }`}
        >

          {tab}{active && (

            <div className="absolute bottom-0 left-1/2 h-[3px] w-12 -translate-x-1/2 rounded-full bg-fuchsia-500" />

          )}

        </button>

      );
    })}

  </div>

</div>

      {/* ----------------------------------- */}
        {/* Details Tab */}
        {/* ----------------------------------- */}

        {activeTab ===
          'Details' && (

          <div className="mt-8 space-y-6">

            {/* ----------------------------------- */}
            {/* Variants */}
            {/* ----------------------------------- */}

            {variants.length > 1 && (

              <div className="overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-b from-[#111018] to-[#0A0A10] shadow-[0_0_80px_rgba(168,85,247,0.05)]">

                {/* Header */}

                <div className="border-b border-white/10 px-6 py-5">

                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">

                    Alternate Versions

                  </p>

                  <h2 className="mt-2 text-3xl font-black tracking-tight">

                    Available Versions

                  </h2>

                </div>

                {/* Variants */}

                <div className="space-y-3 p-6">

                  {variants
                  .filter((variant) => {

                    const variantId =
                      String(
                        variant.id ||
                        variant._id
                      );

                    const currentTrackId =
                      String(
                        track.id ||
                        track._id
                      );

                    return (
                      variantId !==
                      currentTrackId
                    );
                  })
                    .map(
                    (variant) => {

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

                          className="flex w-full items-center justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-left transition-all hover:border-white/20 hover:bg-white/[0.05]"
                        >

                          <div>

                            <p className="text-lg font-semibold text-white">

                              {
                                variant.language
                              }

                            </p>

                            <p className="mt-1 text-sm text-zinc-500">

                              {variant.versionType ===
                              'ORIGINAL'

                                ? 'Original Version'

                                : `${variant.versionType} Version`}
                            </p>

                          </div>

                        </button>

                      );
                    }
                  )}

                </div>

              </div>

            )}

            {/* ----------------------------------- */}
            {/* Experience Info */}
            {/* ----------------------------------- */}

            <div className="overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-b from-[#111018] to-[#0A0A10] shadow-[0_0_80px_rgba(168,85,247,0.05)]">

              {/* Header */}

              <div className="border-b border-white/10 px-6 py-5">

                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">

                  Experience Information

                </p>

                <h2 className="mt-2 text-3xl font-black tracking-tight">

                  About This Track

                </h2>

              </div>

              {/* Content */}

              <div className="space-y-5 p-6">

                <div className="flex items-center justify-between">

                  <span className="text-zinc-500">

                    Lyrics Available

                  </span>

                  <span className="font-medium text-white">

                    {track.lyrics
                      ? 'Yes'
                      : 'No'}

                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <span className="text-zinc-500">

                    Multilingual Scripts

                  </span>

                  <span className="font-medium text-white">

                    {SCRIPT_OPTIONS.length}

                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <span className="text-zinc-500">

                    Audio Experience

                  </span>

                  <span className="font-medium text-white">

                    Adaptive Streaming

                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <span className="text-zinc-500">

                    Version Type

                  </span>

                  <span className="font-medium text-white">

                    {track.versionType ||
                      'ORIGINAL'}

                  </span>

                </div>

              </div>

            </div>

          </div>

        )}

        {/* ----------------------------------- */}
        {/* Lyrics Experience */}
        {/* ----------------------------------- */}

        {activeTab ===
          'Lyrics' &&

        track.lyrics && (

          <div className="mt-8 overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-b from-[#111018] to-[#0A0A10] shadow-[0_0_80px_rgba(168,85,247,0.05)]">

            {/* ----------------------------------- */}
            {/* Floating Lyrics Toolbar */}
            {/* ----------------------------------- */}

            <div className="sticky top-20 z-20 flex items-center justify-between gap-4 border-b border-white/5 bg-[#0A0A10]/90 px-5 py-4 backdrop-blur-2xl">

              {/* Left */}

              <div className="min-w-0 flex-1">

                <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">

                  Immersive Lyrics

                </p>

                <h2 className="mt-1 text-xl font-black tracking-tight text-white">

                  Feel Every Line

                </h2>

              </div>

              {/* Controls */}

              <div className="flex items-center gap-3">

                {/* Script */}

                <button
                  onClick={() =>
                    setIsScriptMenuOpen(
                      true
                    )
                  }

                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.06]"
                >

                  <Globe size={15} />

                  {selectedScript}

                  <ChevronDown
                    size={15}
                  />

                </button>

                {/* Meaning Toggle */}

                <button
                  onClick={
                    handleMeaningToggle
                  }

                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                    meaningEnabled
                      ? 'border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-100'
                      : 'border-white/10 bg-white/[0.04] text-zinc-400'
                  }`}
                >

                  <Languages
                    size={15}
                  />

                  {meaningEnabled
                    ? 'Meaning On'
                    : 'Meaning'}
                </button>

              </div>

            </div>

            {/* ----------------------------------- */}
            {/* Lyrics Body */}
            {/* ----------------------------------- */}

            <div className="lyrics-scroll flex-1 overflow-y-auto px-6 py-4 [scrollbar-width:none] [-ms-overflow-style:none]">

              {convertingLyrics ? (

                  <div className="flex flex-col items-center justify-center py-24">

                    {/* Orb */}

                    <div className="relative">

                      <div className="h-20 w-20 rounded-full bg-fuchsia-500/20 blur-2xl" />

                      <div className="absolute inset-0 flex items-center justify-center">

                        <div className="h-10 w-10 animate-spin rounded-full border-2 border-fuchsia-400 border-t-transparent" />

                      </div>

                    </div>

                    {/* Text */}

                    <p className="mt-8 text-lg font-medium text-zinc-200">

                      {scriptProgressText}

                    </p>

                    <p className="mt-3 max-w-[260px] text-center text-sm leading-6 text-zinc-500">

                      Preserving lyrical pronunciation and emotional flow.

                    </p>

                  </div>

                ) : (

                <div className="space-y-5 px-1 pb-16 pt-24">

                  {(
  convertedLyrics ||
  track.lyrics
)
  .split('\n')
  .map(

    (
      line,
      index
    ) => {

      const meaningLines =

        translatedMeaning
        ? translatedMeaning
            .replace(/\r/g, '')
            .split('\n')
        : [];

      return (

        <div
          key={index}
          className="group"
        >

          {/* Original / Transliterated */}

          <p className="font-['Noto_Sans'] text-[18px] font-medium leading-[1.75] tracking-[-0.01em] text-zinc-100 transition duration-300 group-hover:text-white">

            {line.trim()
            ? line
            : '\u00A0'}

          </p>

          {/* Meaning Translation */}

          {meaningEnabled && (

            <div className="mt-1.5 pl-1">

              {meaningLoading ? (

              <div className="flex items-center gap-3 pt-1">

                <div className="h-2 w-2 animate-pulse rounded-full bg-fuchsia-400" />

                <p className="text-sm italic text-zinc-500">

                  {meaningProgressText}

                </p>

              </div>

            ) : (

                meaningLines[
                  index
                ] && (

                  <p className="animate-in fade-in duration-500 text-[15px] italic leading-7 text-zinc-300/90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.45)]">

                    {
                      meaningLines[
                        index
                      ]
                    }

                  </p>

                )

              )}

            </div>

          )}

        </div>

      );
    }
  )}

                </div>

              )}

            </div>

          </div>

        )}

        {/* ----------------------------------- */}
{/* Cinematic Script Selector */}
{/* ----------------------------------- */}

{isScriptMenuOpen && (

  <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-xl">

    {/* Backdrop */}

    <div
      onClick={() =>
        setIsScriptMenuOpen(
          false
        )
      }
      className="absolute inset-0"
    />

    {/* Sheet */}

    <div className="relative w-full max-w-md overflow-hidden rounded-t-[38px] border-t border-white/10 bg-[#0B0B12] shadow-[0_-10px_80px_rgba(0,0,0,0.65)]">

      {/* ----------------------------------- */}
      {/* Handle */}
      {/* ----------------------------------- */}

      <div className="flex justify-center pb-4 pt-4">

        <div className="h-1.5 w-14 rounded-full bg-white/15" />

      </div>

      {/* ----------------------------------- */}
      {/* Header */}
      {/* ----------------------------------- */}

      <div className="px-6 pb-5">

        <div className="flex items-start justify-between">

          <div>

            <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">

              Lyrics Experience

            </p>

            <h3 className="mt-2 text-3xl font-black tracking-tight text-white">

              Read In

            </h3>

            <p className="mt-2 max-w-[260px] text-sm leading-6 text-zinc-500">

              Experience lyrics in your preferred writing system while preserving pronunciation and lyrical flow.

            </p>

          </div>

          <button
            onClick={() =>
              setIsScriptMenuOpen(
                false
              )
            }
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
          >

            <X size={18} />

          </button>

        </div>

      </div>

      {/* ----------------------------------- */}
      {/* Current Selection */}
      {/* ----------------------------------- */}

      <div className="mx-6 mb-5 rounded-3xl border border-fuchsia-500/20 bg-gradient-to-r from-fuchsia-500/10 to-purple-500/10 p-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-zinc-400">

              Currently Reading In

            </p>

            <h4 className="mt-1 text-xl font-bold text-white">

              {selectedScript}

            </h4>

          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">

            <Globe
              size={22}
              className="text-fuchsia-200"
            />

          </div>

        </div>

      </div>

      {/* ----------------------------------- */}
      {/* Script Options */}
      {/* ----------------------------------- */}

      <div className="max-h-[55vh] overflow-y-auto px-6 pb-[max(2rem,env(safe-area-inset-bottom))]">

        <div className="space-y-3 pb-8">

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

                  className={`group relative flex w-full items-center justify-between overflow-hidden rounded-3xl border px-5 py-5 text-left transition-all duration-300 ${
                    active
                      ? 'border-fuchsia-500/30 bg-gradient-to-r from-fuchsia-500/15 to-purple-500/10'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >

                  {/* Glow */}

                  {active && (

                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,70,239,0.18),transparent_55%)]" />

                  )}

                  {/* Content */}

                  <div className="relative">

                    <p className={`text-lg font-semibold transition ${
                      active
                        ? 'text-white'
                        : 'text-zinc-200'
                    }`}>

                      {option}

                    </p>

                    <p className="mt-1 text-sm text-zinc-500">

                      {convertingLyrics &&
                      selectedScript === option

                        ? scriptProgressText

                        : 'Script optimized lyrical rendering'}

                    </p>

                  </div>

                  {/* Active Indicator */}

                <div className="relative flex items-center">

                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">

                    {convertingLyrics &&
                    selectedScript === option ? (

                      <div className="relative flex items-center justify-center">

                        {/* Glow */}

                        <div className="absolute h-10 w-10 rounded-full bg-fuchsia-500/20 blur-xl" />

                        {/* Spinner */}

                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-fuchsia-400 border-t-transparent" />

                      </div>

                    ) : active ? (

                      <Globe
                        size={18}
                        className="text-fuchsia-200"
                      />

                    ) : null}

                  </div>

                </div>

                </button>

              );
            }
          )}

        </div>

      </div>

    </div>

  </div>

)}
{/* ----------------------------------- */}
{/* Credits Tab */}
{/* ----------------------------------- */}

{activeTab ===
  'Credits' &&

track.contributors
  ?.length > 0 && (

  <div className="mt-8 flex h-[78vh] flex-col overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-b from-[#111018] to-[#0A0A10] shadow-[0_0_80px_rgba(168,85,247,0.05)]">

    {/* Header */}

    <div className="border-b border-white/10 px-6 py-5">

      <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">

        Track Credits

      </p>

      <h2 className="mt-2 text-3xl font-black tracking-tight">

        Contributors

      </h2>

    </div>

    {/* Contributors */}

    <div className="space-y-4 p-6">

      {track.contributors.map(
        (
          contributor,
          index
        ) => (

          <div
            key={index}
            className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-5"
          >

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04]">

                <User2
                  size={22}
                  className="text-zinc-400"
                />

              </div>

              <div>

                <p className="text-lg font-semibold text-white">

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
{/* ----------------------------------- */}
{/* Similar Tab */}
{/* ----------------------------------- */}

{activeTab ===
  'Similar' && (

  <div className="mt-8 flex h-[78vh] flex-col overflow-hidden rounded-[36px]border border-white/10 bg-gradient-to-b from-[#111018] to-[#0A0A10] shadow-[0_0_80px_rgba(168,85,247,0.05)]">

    {/* Header */}

    <div className="border-b border-white/10 px-6 py-5">

      <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">

        Continue Listening

      </p>

      <h2 className="mt-2 text-3xl font-black tracking-tight">

        Similar Atmospheres

      </h2>

      <p className="mt-3 max-w-[280px] text-sm leading-6 text-zinc-500">

        Tracks that continue the same emotional and cinematic mood.

      </p>

    </div>

    {/* Tracks */}

    <div className="space-y-4 p-6">

      {similarTracks.length >
      0 ? (

        similarTracks.map(
          (
            similarTrack
          ) => (

            <button
              key={
                similarTrack._id
              }

              onClick={() =>
                navigate(
                  `/track/${similarTrack._id}`
                )
              }

              className="group flex w-full items-center gap-4 rounded-[28px] border border-white/10 bg-white/[0.03] p-4 text-left transition-all hover:border-white/20 hover:bg-white/[0.05]"
            >

              {/* Artwork */}

              <img
                src={getMediaUrl(
                  similarTrack.coverImage
                )}
                alt={
                  similarTrack.title
                }
                className="h-24 w-24 rounded-[22px] object-cover shadow-xl"
              />

              {/* Content */}

              <div className="min-w-0 flex-1">

                <p className="text-xl font-bold text-white transition group-hover:text-fuchsia-100">

                  {
                    similarTrack.title
                  }

                </p>

                <p className="mt-2 text-sm text-zinc-400">

                  {
                    similarTrack
                      .primaryArtist
                      ?.stageName
                  }

                </p>

                {/* Mood Tags */}

                <div className="mt-4 flex flex-wrap gap-2">

                  {similarTrack.genre && (

                    <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-400">

                      {
                        similarTrack.genre
                      }

                    </div>

                  )}

                  {similarTrack.language && (

                    <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-400">

                      {
                        similarTrack.language
                      }

                    </div>

                  )}

                </div>

              </div>

              {/* Play */}

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-black shadow-xl transition group-hover:scale-105">

                <Play
                  size={20}
                  fill="black"
                />

              </div>

            </button>

          )
        )

      ) : (

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">

          <p className="text-lg font-medium text-white">

            No Similar Tracks Yet

          </p>

          <p className="mt-2 text-sm text-zinc-500">

            More cinematic recommendations will appear here as the catalog grows.

          </p>

        </div>

      )}

    </div>

  </div>

)}
      </div>

    </div>
  );
}