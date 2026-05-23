from faster_whisper import WhisperModel

from utils.load_lyrics import (
    load_lyrics_file
)

from services.build_synced_lyrics import (
    build_synced_lyrics,
    export_synced_lyrics
)

# -----------------------------------
# Config
# -----------------------------------

AUDIO_FILE = "./samples/waadi-ye-kashmir.mp3"

LYRICS_FILE = "./samples/waadi-ye-kashmir.txt"

OUTPUT_FILE = (
    "./output/aligned/"
    "waadi-ye-kashmir.json"
)

MODEL_SIZE = "base"

DEVICE = "cpu"

# -----------------------------------
# Load Whisper Model
# -----------------------------------

print(
    "\nLoading Faster-Whisper model...\n"
)

model = WhisperModel(
    MODEL_SIZE,
    device=DEVICE,
    compute_type="int8"
)

# -----------------------------------
# Transcribe Audio
# -----------------------------------

print(
    "\nTranscribing audio...\n"
)

segments, info = model.transcribe(

    AUDIO_FILE,

    beam_size=5,

    condition_on_previous_text=False,

    word_timestamps=True
)

print(
    f"\nDetected language: "
    f"{info.language}\n"
)

# -----------------------------------
# Convert Segments
# -----------------------------------

transcript_segments = []

for segment in segments:

    segment_text = (
        segment.text.strip()
    )

    if not segment_text:
        continue

    transcript_segments.append({

        "start": round(
            segment.start,
            2
        ),

        "end": round(
            segment.end,
            2
        ),

        "text":
            segment_text,

        "words": [

            {

                "word":
                    word.word,

                "start":
                    round(
                        word.start,
                        2
                    ) if word.start
                    else None,

                "end":
                    round(
                        word.end,
                        2
                    ) if word.end
                    else None

            }

            for word in (
                segment.words or []
            )

        ]

    })

# -----------------------------------
# Print Transcript
# -----------------------------------

print(
    "\nTRANSCRIPTION RESULT:\n"
)

for segment in transcript_segments:

    print(

        f"[{segment['start']}s "
        f"→ {segment['end']}s] "

        f"{segment['text']}"
    )

# -----------------------------------
# Load Original Lyrics
# -----------------------------------

lyrics_text = load_lyrics_file(
    LYRICS_FILE
)

# -----------------------------------
# Build Synced Lyrics
# -----------------------------------

print(
    "\nBuilding synced lyrics...\n"
)

synced_lyrics = build_synced_lyrics(
    transcript_segments,
    lyrics_text
)

# -----------------------------------
# Print Synced Lyrics
# -----------------------------------

print(
    "\nSYNCED LYRICS:\n"
)

for line in synced_lyrics:

    print(
        f"[{line['startTime']}s] "
        f"{line['text']}"
    )

# -----------------------------------
# Export JSON
# -----------------------------------

export_synced_lyrics(
    synced_lyrics,
    OUTPUT_FILE
)