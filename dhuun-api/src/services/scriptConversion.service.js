import Track
  from '../models/Track.js';

import TrackScriptCache
  from '../models/TrackScriptCache.js';

import openai
  from '../lib/openai.js';

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

/* ----------------------------------- */
/* Prompt Builder */
/* ----------------------------------- */

function buildPrompt({

  lyrics,

  targetScript,
}) {

  return `
You are an expert multilingual lyrical transliteration engine.

Your ONLY task is to transliterate lyrics phonetically into ${targetScript} script.

STRICT RULES:

1. NEVER translate meaning.
2. NEVER change language.
3. ONLY convert pronunciation into ${targetScript} script.
4. Preserve ORIGINAL spoken words exactly.
5. Preserve lyrical rhythm and cadence.
6. Preserve emotional singability.
7. Keep ALL line breaks identical.
8. Preserve EMPTY lines.
9. Maintain paragraph spacing.
10. NEVER merge lines.
11. NEVER explain anything.
12. NEVER add quotes.
13. NEVER add titles or labels.
14. Output ONLY transliterated lyrics.
15. EVERY non-empty line MUST be converted into ${targetScript}.
16. NEVER leave ANY line in original script.
17. Convert ALL repeated lines too.
18. If a line remains in original script, the output is INVALID.

IMPORTANT:

Transliteration means:
- preserve pronunciation
- preserve original words
- ONLY change writing system

EXAMPLE:

Original:
दिल ये मेरा

Japanese transliteration:
ディル イェ メラ

NOT:
दिल ये मेरा

AND NOT:
"My heart"

Convert these lyrics:

${lyrics}
`;
}

/* ----------------------------------- */
/* Service */
/* ----------------------------------- */

export async function
convertLyricsScript({

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

      source:
        'original',

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

      source:
        'cache',

      convertedLyrics:
        existingCache.convertedLyrics,
    };
  }

  console.log(
    `[SCRIPT CACHE MISS] Generating track=${trackId} script=${targetScript}`
  );

  /* ----------------------------------- */
  /* Chunk By Stanza */
  /* ----------------------------------- */

  const stanzas =
    track.lyrics
      .replace(/\r/g, '')
      .split('\n\n');

  const convertedStanzas =
    [];

  for (const stanza of stanzas) {

    /* ----------------------------------- */
    /* Preserve Empty Blocks */
    /* ----------------------------------- */

    if (!stanza.trim()) {

      convertedStanzas.push(
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
              'You are a multilingual lyrical transliteration engine.',
          },

          {
            role: 'user',

            content:
              buildPrompt({

                lyrics:
                  stanza,

                targetScript,
              }),
          },
        ],

        temperature: 0.2,

        max_completion_tokens:
          4000,
      });

    const convertedStanza =
  completion
    .choices?.[0]
    ?.message?.content
    ?.trim();

if (!convertedStanza) {

  throw new Error(
    `Failed stanza transliteration for ${targetScript}`
  );
}

/* ----------------------------------- */
/* Validation */
/* ----------------------------------- */

const originalLines =
  stanza
    .split('\n')
    .filter(
      (line) =>
        line.trim()
    );

const convertedLines =
  convertedStanza
    .split('\n')
    .filter(
      (line) =>
        line.trim()
    );

/* ----------------------------------- */
/* Detect Unchanged Lines */
/* ----------------------------------- */

let unchangedCount = 0;

for (
  let i = 0;
  i < Math.min(
    originalLines.length,
    convertedLines.length
  );
  i++
) {

  if (

    originalLines[i]
      .trim() ===

    convertedLines[i]
      .trim()

  ) {

    unchangedCount++;
  }
}

/* ----------------------------------- */
/* Retry Protection */
/* ----------------------------------- */

if (
  unchangedCount >= 2
) {

  console.log(
    `[SCRIPT RETRY] Unchanged lines detected for ${targetScript}`
  );

  /* ----------------------------------- */
  /* Retry Stronger Prompt */
  /* ----------------------------------- */

  const retryCompletion =
    await openai.chat.completions.create({

      model:
        'gpt-4.1-mini',

      messages: [

        {
          role: 'system',

          content:
            `You are a STRICT transliteration engine.

EVERY line MUST be transliterated into ${targetScript}.

Leaving ANY original-script line unchanged is INVALID.`,
        },

        {
          role: 'user',

          content:
            buildPrompt({

              lyrics:
                stanza,

              targetScript,
            }),
        },
      ],

      temperature: 0,

      max_completion_tokens:
        4000,
    });

  const retriedStanza =
    retryCompletion
      .choices?.[0]
      ?.message?.content
      ?.trim();

  if (
    retriedStanza
  ) {

    convertedStanzas.push(
      retriedStanza
    );

    continue;
  }
}

convertedStanzas.push(
  convertedStanza
);
  }

  /* ----------------------------------- */
  /* Final Lyrics */
  /* ----------------------------------- */

  const convertedLyrics =
    convertedStanzas.join(
      '\n\n'
    );

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

    source:
      'openai',

    convertedLyrics,
  };
}