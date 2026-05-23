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
# Build Word Timings
# -----------------------------------

def build_word_timings(
    line,
    start_time,
    line_duration
):

    words = line.split()

    if not words:
        return []

    word_duration = (
        line_duration /
        len(words)
    )

    timed_words = []

    accumulated_time = (
        start_time
    )

    for word in words:

        word_start = round(
            accumulated_time,
            2
        )

        word_end = round(
            accumulated_time +
            word_duration,
            2
        )

        timed_words.append({

            "word":
                word,

            "startTime":
                word_start,

            "endTime":
                word_end

        })

        accumulated_time += (
            word_duration
        )

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
    # Split Lyrics Into Lines
    # -----------------------------------

    lyric_lines = [

        line.strip()

        for line in (
            lyrics_text.splitlines()
        )

        if line.strip()
    ]

    # -----------------------------------
    # Sequential Cursor
    # -----------------------------------

    current_lyric_index = 0

    # -----------------------------------
    # Process Transcript Segments
    # -----------------------------------

    for segment in transcript_segments:

        if (
            current_lyric_index >=
            len(lyric_lines)
        ):
            break

        matched_lines = []

        segment_text = (
            segment["text"]
        )

        # -----------------------------------
        # Sequential Search Window
        # -----------------------------------

        search_window = lyric_lines[
            current_lyric_index:
            current_lyric_index + 6
        ]

        for lyric_line in (
            search_window
        ):

            score = similarity(
                lyric_line,
                segment_text
            )

            if score > 0.22:

                matched_lines.append(
                    lyric_line
                )

        # -----------------------------------
        # Skip Empty Segments
        # -----------------------------------

        if not matched_lines:
            continue

        # -----------------------------------
        # Segment Timing
        # -----------------------------------

        segment_start = (
            segment["start"]
        )

        segment_end = (
            segment["end"]
        )

        segment_duration = max(
            1,
            segment_end -
            segment_start
        )

        # -----------------------------------
        # Total Word Count
        # -----------------------------------

        total_words = sum(

            len(line.split())

            for line in matched_lines
        )

        accumulated_time = (
            segment_start
        )

        # -----------------------------------
        # Generate Synced Lines
        # -----------------------------------

        for line in matched_lines:

            line_word_count = max(
                1,
                len(line.split())
            )

            line_duration = (

                segment_duration *

                (
                    line_word_count /
                    total_words
                )
            )

            line_start_time = round(
                accumulated_time,
                2
            )

            synced_lyrics.append({

                "startTime":
                    line_start_time,

                "text":
                    line,

                "words":
                    build_word_timings(

                        line,

                        line_start_time,

                        line_duration
                    )

            })

            accumulated_time += (
                line_duration
            )

        # -----------------------------------
        # Advance Cursor
        # -----------------------------------

        current_lyric_index += len(
            matched_lines
        )

    # -----------------------------------
    # Remove Duplicate Lines
    # -----------------------------------

    unique_synced = []

    used_lines = set()

    for line in synced_lyrics:

        normalized_line = (
            normalize_text(
                line["text"]
            )
        )

        if normalized_line in used_lines:
            continue

        used_lines.add(
            normalized_line
        )

        unique_synced.append(
            line
        )

    # -----------------------------------
    # Sort Final Output
    # -----------------------------------

    unique_synced.sort(
        key=lambda x:
            x["startTime"]
    )

    return unique_synced