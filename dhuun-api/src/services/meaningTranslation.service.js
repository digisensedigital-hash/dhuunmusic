import Track from '../models/Track.js';

import TrackMeaningCache
  from '../models/TrackMeaningCache.js';

import openai
  from '../lib/openai.js';

/* ----------------------------------- */
/* Meaning Translation */
/* ----------------------------------- */

export async function
translateLyricsMeaning({

  trackId,

  targetLanguage =
    'English',
}) {

  /* ----------------------------------- */
  /* Validation */
  /* ----------------------------------- */

  if (!trackId) {

    throw new Error(
      'trackId is required'
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

  const lyricsVersion =
    track.lyricsVersion || 1;

  /* ----------------------------------- */
  /* Cache Lookup */
  /* ----------------------------------- */

  const existingCache =
    await TrackMeaningCache.findOne({

      trackId,

      targetLanguage,

      lyricsVersion,
    });

  /* ----------------------------------- */
  /* Cache Hit */
  /* ----------------------------------- */

  if (existingCache) {

    console.log(
      `[MEANING CACHE HIT] track=${trackId}`
    );

    return {

      source: 'cache',

      translatedLyrics:
        existingCache.translatedLyrics,
    };
  }

  console.log(
    `[MEANING CACHE MISS] Translating track=${trackId}`
  );

  /* ----------------------------------- */
  /* Line-by-Line Translation */
  /* ----------------------------------- */

  const lyricLines =
    track.lyrics
      .replace(/\r/g, '')
      .split('\n');

  const translatedLines =
    [];

  for (const line of lyricLines) {

    /* ----------------------------------- */
    /* Preserve Empty Lines */
    /* ----------------------------------- */

    if (!line.trim()) {

      translatedLines.push(
        ''
      );

      continue;
    }

    /* ----------------------------------- */
    /* OpenAI */
    /* ----------------------------------- */

    const completion =
      await openai.chat.completions.create({

        model:
          'gpt-4.1-mini',

        messages: [

          {
            role: 'system',

            content:
              'You are an expert poetic lyrical translation engine.',
          },

          {
            role: 'user',

            content: `
Translate this lyrical line into emotionally expressive ${targetLanguage}.

STRICT RULES:

1. Preserve poetic beauty.
2. Preserve emotional meaning.
3. Keep the translation concise.
4. Keep the translation lyrical and cinematic.
5. Output ONLY the translated line.
6. Do NOT explain anything.
7. Do NOT add quotes.

Line:
${line}
`,
          },
        ],

        temperature: 0.4,
      });

    const translatedLine =
      completion
        .choices?.[0]
        ?.message?.content
        ?.trim() || '';

    translatedLines.push(
      translatedLine
    );
  }

  /* ----------------------------------- */
  /* Final Lyrics */
  /* ----------------------------------- */

  const translatedLyrics =
    translatedLines.join(
      '\n'
    );

  if (!translatedLyrics) {

    throw new Error(
      'Failed to translate lyrics meaning'
    );
  }

  /* ----------------------------------- */
  /* Save Cache */
  /* ----------------------------------- */

  try {

    await TrackMeaningCache.create({

      trackId,

      targetLanguage,

      translatedLyrics,

      model:
        'gpt-4.1-mini',

      lyricsVersion,
    });

    console.log(
      `[MEANING CACHE SAVED] track=${trackId}`
    );

  } catch (error) {

    if (error?.code !== 11000) {

      console.error(
        'TrackMeaningCache create failed:',
        error
      );
    }
  }

  /* ----------------------------------- */
  /* Response */
  /* ----------------------------------- */

  return {

    source: 'openai',

    translatedLyrics,
  };
}