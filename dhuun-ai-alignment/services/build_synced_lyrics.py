import difflib

from utils.normalize_text import (
    normalize_text
)

# -----------------------------------
# Similarity Matcher
# -----------------------------------

def similarity(a, b):

    return difflib.SequenceMatcher(
        None,
        normalize_text(a),
        normalize_text(b)
    ).ratio()

# -----------------------------------
# Normalize Word
# -----------------------------------

def normalize_word(word):

    return normalize_text(
        word.strip()
    )

# -----------------------------------
# Build Real Word Timings
# -----------------------------------

def build_real_word_timings(
    lyric_line,
    aligned_words
):

    lyric_words = (
        lyric_line.split()
    )

    timed_words = []

    # -----------------------------------
    # Safety
    # -----------------------------------

    if not aligned_words:

        return timed_words

    # -----------------------------------
    # Timing Window
    # -----------------------------------

    line_start = float(
        aligned_words[0]["start"]
    )

    line_end = float(
        aligned_words[-1]["end"]
    ) - 0.35

    # -----------------------------------
    # Safety Clamp
    # -----------------------------------

    if line_end <= line_start:

        line_end = (
            line_start + 1
        )

    line_duration = (
        line_end - line_start
    )

    # -----------------------------------
    # Fallback Safety
    # -----------------------------------

    if line_duration <= 0:

        line_duration = (
            len(lyric_words) * 0.4
        )

    duration_per_word = (

        line_duration /

        max(
            len(lyric_words),
            1
        )
    )

    # -----------------------------------
    # Word Distribution
    # -----------------------------------

    for index, lyric_word in enumerate(
        lyric_words
    ):

        start_time = (

            line_start +

            (
                index *
                duration_per_word
            )
        )

        end_time = (
            start_time +
            duration_per_word
        )

        timed_words.append({

            "word":
                lyric_word,

            "startTime":
                round(
                    float(start_time),
                    2
                ),

            "endTime":
                round(
                    float(end_time),
                    2
                )
        })

    return timed_words

# -----------------------------------
# Build Synced Lyrics
# -----------------------------------

def build_synced_lyrics(
    transcript_segments,
    lyrics_text
):

    synced_lyrics = []

    # -----------------------------------
    # Normalize Lyrics
    # -----------------------------------

    lyric_lines = [

        line.strip()

        for line in
        lyrics_text.splitlines()

        if line.strip()
    ]

    # -----------------------------------
    # Clean Transcript Segments
    # -----------------------------------

    cleaned_segments = []

    for segment in (
        transcript_segments
    ):

        text = (
            segment.get(
                "text",
                ""
            ).strip()
        )

        words = (
            segment.get(
                "words",
                []
            )
        )

        segment_duration = (

            float(
                segment.get(
                    "end",
                    0
                )
            ) -

            float(
                segment.get(
                    "start",
                    0
                )
            )
        )

        # -----------------------------------
        # Ignore Noise
        # -----------------------------------

        if (
            not text or
            len(text) < 4
        ):
            continue

        if (
            segment_duration < 1.2
        ):
            continue

        if not words:
            continue

        cleaned_segments.append(
            segment
        )

    # -----------------------------------
    # Sequential Mapping
    # -----------------------------------

    total_lines = min(

        len(lyric_lines),

        len(cleaned_segments)
    )

    for index in range(
        total_lines
    ):

        segment_text = (
            segment.get(
                "text",
                ""
            )
        )

        best_match = ""

        best_score = 0

        for lyric in lyric_lines:

            score = similarity(
                segment_text,
                lyric
            )

            if score > best_score:

                best_score = score

                best_match = lyric

        lyric_line = (

            best_match

            if best_match

            else segment_text
        )

        segment = (
            cleaned_segments[index]
        )

        words = (
            segment.get(
                "words",
                []
            )
        )

        # -----------------------------------
        # Word Timings
        # -----------------------------------

        synced_words = (
            build_real_word_timings(
                lyric_line,
                words
            )
        )

        # -----------------------------------
        # Line Timing
        # -----------------------------------

        line_start = float(
            segment["start"]
        )

        line_end = float(
            segment["end"]
        ) - 0.35

        if line_end <= line_start:

            line_end = (
                line_start + 1
            )

        # -----------------------------------
        # Append
        # -----------------------------------

        synced_lyrics.append({

            "startTime":
                round(
                    line_start,
                    2
                ),

            "endTime":
                round(
                    line_end,
                    2
                ),

            "text":
                lyric_line,

            "words":
                synced_words
        })

    # -----------------------------------
    # Debug
    # -----------------------------------

    print(
        f"\nFINAL SYNCED LYRICS COUNT: "
        f"{len(synced_lyrics)}"
    )

    return synced_lyrics