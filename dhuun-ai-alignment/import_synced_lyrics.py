import json
from pymongo import MongoClient
from bson import ObjectId

# -----------------------------------
# MongoDB Config
# -----------------------------------

MONGO_URI = (
    "mongodb://127.0.0.1:27017"
)

DATABASE_NAME = "dhuun"

TRACK_ID = (
    "6a0a02b0a520bfb193beab0f"
)

SYNCED_LYRICS_FILE = (
    "./output/aligned/"
    "waadi-ye-kashmir.json"
)

# -----------------------------------
# Load Synced Lyrics JSON
# -----------------------------------

with open(
    SYNCED_LYRICS_FILE,
    "r",
    encoding="utf-8"
) as file:

    synced_lyrics = json.load(
        file
    )

# -----------------------------------
# MongoDB Connection
# -----------------------------------

client = MongoClient(
    MONGO_URI
)

db = client[
    DATABASE_NAME
]

tracks = db.tracks

# -----------------------------------
# Update Track
# -----------------------------------

result = tracks.update_one(

    {
        "_id": ObjectId(
            TRACK_ID
        )
    },

    {
        "$set": {

            "syncedLyrics":
                synced_lyrics
        }
    }
)

# -----------------------------------
# Output
# -----------------------------------

print(
    "\nSynced lyrics imported.\n"
)

print(
    f"Matched: "
    f"{result.matched_count}"
)

print(
    f"Modified: "
    f"{result.modified_count}\n"
)