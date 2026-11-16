#!/usr/bin/env python3
"""Build responsive images for the site.

Reads the original photos in assets/ and writes AVIF + WebP + JPEG copies at
several widths into assets/img/. Originals are left untouched (ads, flyers and
Open Graph tags link to them).

Run from the repo root:   python3 scripts/build-images.py
Needs Pillow 11.3+ (AVIF built in):   pip install pillow
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets"
OUT = SRC / "img"
WIDTHS = [480, 800, 1200, 1600]          # never upscaled past the source width

# output name -> source file
PHOTOS = {
    "before":     "suburb-before-opt.jpg",
    "thatch-out": "yard-during-opt.jpg",
    "coring":     "yard-coring-opt.jpg",
    "topdress":   "yard-topdress-opt.jpg",
    "after":      "yard-after-green-opt.jpg",
    "at-work":    "action-shot-opt.jpg",
    "gear":       "gear-lineup-opt.jpg",
}

def main():
    OUT.mkdir(exist_ok=True)
    for name, src in PHOTOS.items():
        im = ImageOps.exif_transpose(Image.open(SRC / src)).convert("RGB")
        widths = sorted({min(w, im.width) for w in WIDTHS})
        for w in widths:
            h = round(im.height * w / im.width)
            r = im.resize((w, h), Image.LANCZOS)
            r.save(OUT / f"{name}-{w}.avif", quality=52, speed=4)
            r.save(OUT / f"{name}-{w}.webp", quality=74, method=6)
            r.save(OUT / f"{name}-{w}.jpg", quality=76, optimize=True, progressive=True)
        print(f"{name}: {im.width}x{im.height} -> {widths}")
    # logo (transparent PNG) at 1x / 2x of its 44px slot
    logo = Image.open(SRC / "sprout-transparent.png").convert("RGBA")
    for w in (96, 192):
        r = logo.resize((w, round(logo.height * w / logo.width)), Image.LANCZOS)
        r.save(OUT / f"logo-{w}.webp", quality=90, method=6)
        r.save(OUT / f"logo-{w}.png", optimize=True)
    print("logo done")

if __name__ == "__main__":
    main()
