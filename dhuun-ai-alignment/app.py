from fastapi import FastAPI
from pydantic import BaseModel

from services.transcribe import (
    transcribe_audio
)

from services.build_synced_lyrics import (
    build_synced_lyrics
)

app = FastAPI()

# -----------------------------------
# Request Schema
# -----------------------------------

class AlignRequest(
    BaseModel
):

    audioPath: str

    lyrics: str

# -----------------------------------
# Health Check
# -----------------------------------

@app.get("/")

def health_check():

    return {
        "success": True,
        "message":
            "Dhuun AI Alignment Running"
    }

# -----------------------------------
# Align Endpoint
# -----------------------------------

@app.post("/align")

def align_lyrics(
    payload: AlignRequest
):

    # -----------------------------------
    # Transcribe Audio
    # -----------------------------------

    transcript_segments = (
        transcribe_audio(
            payload.audioPath
        )
    )

    # -----------------------------------
    # Build Synced Lyrics
    # -----------------------------------

    synced_lyrics = (
        build_synced_lyrics(
            transcript_segments,
            payload.lyrics
        )
    )

    # -----------------------------------
    # Response
    # -----------------------------------

    return {

        "success": True,

        "syncedLyrics":
            synced_lyrics
    }