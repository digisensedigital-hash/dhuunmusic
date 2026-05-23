from faster_whisper import (
    WhisperModel
)

# -----------------------------------
# Whisper Model
# -----------------------------------

MODEL_SIZE = "base"

DEVICE = "cpu"

model = WhisperModel(
    MODEL_SIZE,
    device=DEVICE,
    compute_type="int8"
)

# -----------------------------------
# Transcribe Audio
# -----------------------------------

def transcribe_audio(
    audio_path
):

    print(
        "\nTranscribing audio...\n"
    )

    segments, info = (
        model.transcribe(

            audio_path,

            beam_size=5,

            word_timestamps=True
        )
    )

    print(
        f"\nDetected language: "
        f"{info.language}\n"
    )

    transcript_segments = []

    for segment in segments:

        words = []

        if segment.words:

            for word in (
                segment.words
            ):

                words.append({

                    "word":
                        word.word.strip(),

                    "start":
                        round(
                            word.start,
                            2
                        ),

                    "end":
                        round(
                            word.end,
                            2
                        )
                })

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
                segment.text.strip(),

            "words":
                words
        })

    return transcript_segments