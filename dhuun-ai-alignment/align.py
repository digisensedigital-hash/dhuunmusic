from rapidfuzz import fuzz

# -----------------------------------
# Normalize Lyrics
# -----------------------------------

def normalize_lyrics(
    lyrics_text
):

    if not lyrics_text:
        return []

    return [

        line.strip()

        for line in (
            lyrics_text
                .replace('\r', '')
                .splitlines()
        )

        if line.strip()
    ]

# -----------------------------------
# Build Synced Lyrics
# -----------------------------------

def build_synced_lyrics(

    transcript_segments,

    lyrics_text
):

    # -----------------------------------
    # Normalize Lyrics
    # -----------------------------------

    lyric_lines = normalize_lyrics(
        lyrics_text
    )

    # -----------------------------------
    # Defensive Guard
    # -----------------------------------

    if not lyric_lines:
        return []

    if not transcript_segments:
        return []

    # -----------------------------------
    # Normalize Transcript
    # -----------------------------------

    cleaned_segments = []

    for segment in transcript_segments:

        text = (
            segment.get(
                'text',
                ''
            )
            .strip()
        )

        if not text:
            continue

        cleaned_segments.append({

            "start":
                segment.get(
                    "start",
                    0
                ),

            "end":
                segment.get(
                    "end",
                    0
                ),

            "text":
                text,
        })

    if not cleaned_segments:
        return []

    # -----------------------------------
    # Sequential Alignment
    # -----------------------------------

    synced_lyrics = []

    segment_index = 0

    for lyric_line in lyric_lines:

        best_match = None

        best_score = 0

        best_index = None

        # -----------------------------------
        # Forward Search Window
        # -----------------------------------

        search_window = cleaned_segments[
            segment_index:
            segment_index + 8
        ]

        for idx, segment in enumerate(
            search_window
        ):

            score = fuzz.partial_ratio(

                lyric_line.lower(),

                segment["text"]
                    .lower()
            )

            if score > best_score:

                best_score = score

                best_match = segment

                best_index = (
                    segment_index + idx
                )

        # -----------------------------------
        # Strong Match
        # -----------------------------------

        if (
            best_match and
            best_score >= 45
        ):

            synced_lyrics.append({

                "text":
                    lyric_line,

                "startTime":
                    round(
                        best_match[
                            "start"
                        ],
                        2
                    ),

                "endTime":
                    round(
                        best_match[
                            "end"
                        ],
                        2
                    ),
            })

            # -----------------------------------
            # Move Forward
            # Prevent Random Jumping
            # -----------------------------------

            segment_index = (
                best_index + 1
            )

        # -----------------------------------
        # Fallback Approximation
        # -----------------------------------

        else:

            fallback_start = 0

            fallback_end = 0

            if synced_lyrics:

                fallback_start = (
                    synced_lyrics[-1]
                    ["endTime"]
                )

                fallback_end = (
                    fallback_start + 3
                )

            synced_lyrics.append({

                "text":
                    lyric_line,

                "startTime":
                    round(
                        fallback_start,
                        2
                    ),

                "endTime":
                    round(
                        fallback_end,
                        2
                    ),
            })

    # -----------------------------------
    # Final Sort Safety
    # -----------------------------------

    synced_lyrics.sort(
        key=lambda x:
            x["startTime"]
    )

    return synced_lyrics

# -----------------------------------
# Export Synced Lyrics
# -----------------------------------

def export_synced_lyrics(
    synced_lyrics,
    output_path
):

    import os
    import json

    os.makedirs(

        os.path.dirname(
            output_path
        ),

        exist_ok=True
    )

    with open(
        output_path,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(

            synced_lyrics,

            file,

            ensure_ascii=False,

            indent=2
        )

    print(
        f"\n✅ Synced lyrics exported: "
        f"{output_path}\n"
    )