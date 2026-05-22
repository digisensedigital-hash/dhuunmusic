import Track from '../models/Track.js';
import TrackScriptCache from '../models/TrackScriptCache.js';

import openai from '../lib/openai.js';

const SUPPORTED_SCRIPTS = [
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

function buildPrompt({
  lyrics,
  targetScript,
}) {
  return `
You are an expert multilingual lyrical script conversion engine.

Your task is to convert song lyrics into ${targetScript} script.

STRICT RULES:

1. DO NOT translate meaning.
2. Preserve pronunciation exactly.
3. Preserve lyrical rhythm and cadence.
4. Preserve emotional expression and singability.
5. Keep line breaks exactly identical.
6. Maintain paragraph spacing.
7. Output ONLY converted lyrics.
8. Do not explain anything.
9. Do not add quotes.
10. Do not add titles or labels.

Convert the following lyrics:

${lyrics}
`;
}

export async function convertLyricsScript({
  trackId,
  targetScript,
}) {

  /* ----------------------------------- */
  /* Validation */
  /* ----------------------------------- */

  if (!trackId) {
    throw new Error(
      'trackId is required'
    );
  }

  if (!targetScript) {
    throw new Error(
      'targetScript is required'
    );
  }

  if (
    !SUPPORTED_SCRIPTS.includes(
      targetScript
    )
  ) {
    throw new Error(
      'Unsupported target script'
    );
  }

  /* ----------------------------------- */
  /* Track */
  /* ----------------------------------- */

  const track =
    await Track.findById(
      trackId
    );

  if (!track) {
    throw new Error(
      'Track not found'
    );
  }

  if (
    !track.lyrics?.trim()
  ) {
    throw new Error(
      'Track lyrics not available'
    );
  }

  /* ----------------------------------- */
  /* Original Script */
  /* ----------------------------------- */

  if (
    targetScript ===
    'Original Script'
  ) {

    return {
      source: 'original',

      convertedLyrics:
        track.lyrics,
    };
  }

  const lyricsVersion =
    track.lyricsVersion || 1;

  /* ----------------------------------- */
  /* Cache Lookup */
  /* ----------------------------------- */

  const existingCache =
    await TrackScriptCache.findOne({

      trackId,

      targetScript,

      lyricsVersion,
    });

  /* ----------------------------------- */
  /* Cache Hit */
  /* ----------------------------------- */

  if (existingCache) {

    console.log(
      `[SCRIPT CACHE HIT] track=${trackId} script=${targetScript}`
    );

    return {

      source: 'cache',

      convertedLyrics:
        existingCache.convertedLyrics,
    };
  }

  /* ----------------------------------- */
  /* OpenAI Generation */
  /* ----------------------------------- */

  console.log(
    `[SCRIPT CACHE MISS] Generating track=${trackId} script=${targetScript}`
  );

  const completion =
    await openai.chat.completions.create({

      model: 'gpt-4.1-mini',

      messages: [

        {
          role: 'system',

          content:
            'You are a multilingual lyrical transliteration engine.',
        },

        {
          role: 'user',

          content:
            buildPrompt({

              lyrics:
                track.lyrics,

              targetScript,
            }),
        },
      ],

      temperature: 0.2,
    });

  const convertedLyrics =
    completion
      .choices?.[0]
      ?.message?.content
      ?.trim();

  if (!convertedLyrics) {

    throw new Error(
      'Failed to generate converted lyrics'
    );
  }

  /* ----------------------------------- */
  /* Save Cache */
  /* ----------------------------------- */

  try {

    await TrackScriptCache.create({

      trackId,

      targetScript,

      convertedLyrics,

      model:
        'gpt-4.1-mini',

      lyricsVersion,
    });

    console.log(
      `[SCRIPT CACHE SAVED] track=${trackId} script=${targetScript}`
    );

  } catch (error) {

    /* ----------------------------------- */
    /* Duplicate Key Safety */
    /* ----------------------------------- */

    if (error?.code !== 11000) {

      console.error(
        'TrackScriptCache create failed:',
        error
      );
    }
  }

  /* ----------------------------------- */
  /* Response */
  /* ----------------------------------- */

  return {

    source: 'openai',

    convertedLyrics,
  };
}