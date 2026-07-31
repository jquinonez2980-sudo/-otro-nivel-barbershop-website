"""Cut the web fonts down to the characters this site actually sets.

Google's `latin` subset ships ~230 glyphs per face; between Anton and Archivo's
upright and italic that was 86 KB fetched at high priority before the hero
could paint. This site sets English and Spanish, and the accented characters it
uses are a short list. Keeping a generous Western-European set still removes
roughly two thirds of the bytes with no visible difference.

Sources in scripts/src-*.woff2 are Google's `latin` subsets of Anton and
Archivo, both licensed under the SIL Open Font License 1.1, which permits
subsetting and self-hosting.

Requires `pip install "fonttools[woff]"`. Run when the fonts or the character
set change:

    python scripts/subset-fonts.py
"""

from pathlib import Path

from fontTools.varLib import instancer
from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src/app/fonts"

# Printable ASCII, the full Western-European accented range the shop's names
# and Spanish copy draw on, and the punctuation and symbols used in the UI.
CHARSET = (
    "".join(chr(c) for c in range(0x20, 0x7F))
    + "¡¿·©®™°"
    + "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞß"
    + "àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ"
    + "–—‘’‚“”„†•…‹›€£¥"
    + "←→↔★─"
)

# Archivo ships a 100–900 weight axis. The upright is set from 400 to 700, so
# it keeps that range; italics are only ever set at 400, so that face is pinned
# to a single instance and sheds its variation data entirely. Anton has one
# weight to begin with.
FACES = [
    # (source, output, weight axis: None to leave alone, range, or a single value)
    ("src-anton-latin.woff2", "anton-latin.woff2", None),
    ("src-archivo-latin.woff2", "archivo-latin.woff2", (400, 700)),
    ("src-archivo-italic-latin.woff2", "archivo-italic-latin.woff2", 400),
]


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for source_name, out_name, wght in FACES:
        source = ROOT / "scripts" / source_name
        font = TTFont(source)

        if wght is not None:
            font = instancer.instantiateVariableFont(
                font, {"wght": wght}, updateFontNames=False
            )

        options = Options()
        options.flavor = "woff2"
        # Keep kerning and the default shaping features; drop the rest.
        options.layout_features = ["kern", "liga", "clig", "calt", "ccmp", "locl"]
        options.desubroutinize = False
        options.notdef_outline = True
        # These are variable fonts: keep the weight axis intact.
        options.retain_gids = False

        subsetter = Subsetter(options=options)
        subsetter.populate(text=CHARSET)
        subsetter.subset(font)

        destination = OUT / out_name
        font.flavor = "woff2"
        font.save(destination)

        before = source.stat().st_size
        after = destination.stat().st_size
        print(f"{out_name:30} {before / 1024:6.1f} KB -> {after / 1024:5.1f} KB")


if __name__ == "__main__":
    main()
