#!/usr/bin/env python3
"""Crops the portfolio's project thumbnails into the card band, once.

The output is committed, so the GitHub Action never needs the portfolio repo or
an image library: the TypeScript build only base64-encodes what is already here.
Re-run this only when a source screenshot changes.

    python3 scripts/prep-media.py /path/to/portfolio
"""
import sys, pathlib
from PIL import Image

SRC_ROOT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else
                        "/Users/helmy162/Desktop/Projects/portfolio") / "assets" / "projects"
OUT = pathlib.Path(__file__).resolve().parent.parent / "media"
OUT.mkdir(exist_ok=True)

# 2x the card's 429x150 image band, so it stays crisp on retina.
W, H = 858, 300

# (output name, source file, vertical crop start as a fraction of the resized
# height). Web screenshots put the nav at the very top, so most of these start
# slightly below it to land on the actual product.
JOBS = [
    ("stealthwriter", "stealthwriter/stealthwriter.webp", 0.00),
    ("prop-metrics", "prop-metrics-saas/propmetrics.webp", 0.18),
    ("customgpt-researcher", "customgpt-researcher/customgpt-researcher.webp", 0.00),
    ("lr0-parser", "lr0-parser/lr0-parser.webp", 0.00),
]

for name, rel, top_frac in JOBS:
    src = SRC_ROOT / rel
    im = Image.open(src).convert("RGB")
    scale = W / im.width
    im = im.resize((W, round(im.height * scale)), Image.LANCZOS)
    top = max(0, min(round(im.height * top_frac), im.height - H))
    im = im.crop((0, top, W, top + H))
    dst = OUT / f"{name}.jpg"
    im.save(dst, "JPEG", quality=78, optimize=True, progressive=True)
    print(f"  {dst.name:28} {dst.stat().st_size // 1024:>4} KB   (from {rel})")
