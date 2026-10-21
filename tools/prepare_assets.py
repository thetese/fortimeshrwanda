"""Prepare brand and photo assets for the Fortimesh site.

Run once whenever the source logo or photos change:

    python tools/prepare_assets.py

Outputs (committed to src/ so the Node build stays dependency-free):
  src/brand/logo.png          full-colour logo, transparent background, tightly cropped
  src/brand/logo-white.png    single-colour white logo for dark backgrounds
  src/brand/mark.png          shield mark only (transparent)
  src/brand/apple-touch-icon.png, src/favicon.ico
  src/img/<name>-<width>.webp responsive photo renditions
  src/img/manifest.json       intrinsic sizes + available widths, read by build.mjs
"""
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
BRAND = SRC / "brand"
IMG = SRC / "img"
PHOTOS = SRC / "photos"
WIDTHS = (640, 1280, 1920)


def knock_out_white(img: Image.Image, lo: int = 14, hi: int = 120) -> Image.Image:
    """Turn a logo on a white background into RGBA with a soft, unpremultiplied alpha."""
    rgb = img.convert("RGB")
    out = Image.new("RGBA", rgb.size)
    src, dst = rgb.load(), out.load()
    w, h = rgb.size
    for y in range(h):
        for x in range(w):
            r, g, b = src[x, y]
            d = 255 - min(r, g, b)
            a = 0.0 if d <= lo else 1.0 if d >= hi else (d - lo) / (hi - lo)
            if a == 0:
                dst[x, y] = (255, 255, 255, 0)
                continue
            # recover the foreground colour that was blended over white
            un = lambda c: max(0, min(255, round((c - 255 * (1 - a)) / a)))
            dst[x, y] = (un(r), un(g), un(b), round(a * 255))
    return out


def first_gap(img: Image.Image, start: int, run: int = 12) -> int:
    """Return the x coordinate of the first run of fully transparent columns after `start`."""
    alpha = img.getchannel("A")
    w, h = img.size
    px = alpha.load()
    empty = 0
    for x in range(start, w):
        if all(px[x, y] == 0 for y in range(h)):
            empty += 1
            if empty >= run:
                return x - run + 1
        else:
            empty = 0
    return w


def prepare_brand() -> None:
    BRAND.mkdir(exist_ok=True)
    logo = knock_out_white(Image.open(SRC / "logo.png"))
    logo = logo.crop(logo.getbbox())

    # Shield mark = everything left of the first transparent column gap.
    gap = first_gap(logo, start=20)
    mark = logo.crop((0, 0, gap, logo.height))
    mark = mark.crop(mark.getbbox())

    full = logo.copy()
    full.thumbnail((480, 480), Image.LANCZOS)
    full.save(BRAND / "logo.png", optimize=True)

    white = full.copy()
    white.putdata([(255, 255, 255, a) for (_, _, _, a) in full.get_flattened_data()])
    white.save(BRAND / "logo-white.png", optimize=True)

    m = mark.copy()
    m.thumbnail((128, 128), Image.LANCZOS)
    m.save(BRAND / "mark.png", optimize=True)

    # Apple touch icon: mark centred on white with breathing room.
    touch = Image.new("RGBA", (180, 180), (255, 255, 255, 255))
    t = mark.copy()
    t.thumbnail((124, 124), Image.LANCZOS)
    touch.alpha_composite(t, ((180 - t.width) // 2, (180 - t.height) // 2))
    touch.convert("RGB").save(BRAND / "apple-touch-icon.png", optimize=True)

    # Favicon: square transparent canvas so the shield isn't squashed.
    side = max(mark.size)
    sq = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    sq.alpha_composite(mark, ((side - mark.width) // 2, (side - mark.height) // 2))
    sq.save(SRC / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    sq.resize((32, 32), Image.LANCZOS).save(BRAND / "favicon-32.png", optimize=True)
    print(f"brand: logo {full.size}, mark {m.size}")


def prepare_photos() -> None:
    IMG.mkdir(exist_ok=True)
    for old in IMG.glob("*.webp"):
        old.unlink()
    manifest: dict[str, dict] = {}
    sources = sorted(p for p in PHOTOS.iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"})
    for path in sources:
        im = Image.open(path).convert("RGB")
        name = path.stem
        widths = [w for w in WIDTHS if w < im.width] + [min(im.width, WIDTHS[-1])]
        widths = sorted(set(widths))
        for w in widths:
            h = round(im.height * w / im.width)
            im.resize((w, h), Image.LANCZOS).save(IMG / f"{name}-{w}.webp", "WEBP", quality=78, method=6)
        manifest[name] = {"width": im.width, "height": im.height, "widths": widths}
        print(f"photo: {name} {im.size} -> {widths}")
    (IMG / "manifest.json").write_text(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    prepare_brand()
    prepare_photos()
