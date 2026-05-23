from indic_transliteration import sanscript
from indic_transliteration.sanscript import transliterate

# -----------------------------------
# Normalize Text
# -----------------------------------

def normalize_text(text):

    text = text.lower()

    text = (
        text.replace(",", "")
        .replace("।", "")
        .replace(".", "")
        .replace("'", "")
        .strip()
    )

    # -----------------------------------
    # Hindi → Roman Transliteration
    # -----------------------------------

    try:

        text = transliterate(
            text,
            sanscript.DEVANAGARI,
            sanscript.ITRANS
        )

    except Exception:
        pass

    return text