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

import TrackHero
  from '../components/track/TrackHero';

import TrackTabs
  from '../components/track/TrackTabs';

import DetailsTab
  from '../components/track/DetailsTab';

import LyricsPanel
  from '../components/track/LyricsPanel';

import ScriptSelectorSheet
  from '../components/track/ScriptSelectorSheet';

import CreditsTab
  from '../components/track/CreditsTab';

import SimilarTracksTab
  from '../components/track/SimilarTracksTab';

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

  const { identifier } =
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

    if (
    !track?.allowMeaningGeneration
    ) {

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

      const message =
        error?.response?.data?.message;

      if (
        message ===
        'Meaning generation disabled for this track'
      ) {

        return;
      }

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
              identifier
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

  }, [identifier]);

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

      <TrackHero
      track={track}
      navigate={navigate}
      playTrack={playTrack}
      loadPlaybackQueue={
        loadPlaybackQueue
      }
      />

      <TrackTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* ----------------------------------- */}
      {/* Details Tab */}

      {activeTab === 'Details' && (

        <DetailsTab
          track={track}
          variants={variants}
          navigate={navigate}
          SCRIPT_OPTIONS={SCRIPT_OPTIONS}
        />

      )}

        {/* ----------------------------------- */}
        {/* Lyrics Experience */}
        {/* ----------------------------------- */}

        {activeTab === 'Lyrics' && (

        <LyricsPanel
          track={track}
          selectedScript={selectedScript}
          setIsScriptMenuOpen={
            setIsScriptMenuOpen
          }
          handleMeaningToggle={
            handleMeaningToggle
          }
          meaningEnabled={
            track?.allowMeaningGeneration &&
            meaningEnabled
          }
          convertingLyrics={
            convertingLyrics
          }
          scriptProgressText={
            scriptProgressText
          }
          convertedLyrics={
            convertedLyrics
          }
          translatedMeaning={
            translatedMeaning
          }
          meaningLoading={
            meaningLoading
          }
          meaningProgressText={
            meaningProgressText
          }
        />

      )}

        {/* ----------------------------------- */}
        {/* Cinematic Script Selector */}
        {/* ----------------------------------- */}

        {isScriptMenuOpen && (

        <ScriptSelectorSheet
          setIsScriptMenuOpen={
            setIsScriptMenuOpen
          }
          SCRIPT_OPTIONS={
            SCRIPT_OPTIONS
          }
          selectedScript={
            selectedScript
          }
          handleScriptChange={
            handleScriptChange
          }
          convertingLyrics={
            convertingLyrics
          }
          scriptProgressText={
            scriptProgressText
          }
        />

        )}
        

        {/* ----------------------------------- */}
        {/* Credits Tab */}
        {/* ----------------------------------- */}

        {activeTab === 'Credits' && (
          <CreditsTab
            track={track}
          />
        )}

        {/* ----------------------------------- */}
        {/* Similar Tab */}
        {/* ----------------------------------- */}

        {activeTab === 'Similar' && (
          <SimilarTracksTab
            similarTracks={similarTracks}
            navigate={navigate}
            getMediaUrl={getMediaUrl}
          />
        )}

      </div>

    </div>
  );
}
