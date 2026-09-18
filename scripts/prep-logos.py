#!/usr/bin/env python3
"""Vendors every logo the panels need, once. Output is committed.

Two sources, because they need different treatment:

  Company marks come from the portfolio's own assets/icons/*.webp. They are
  full colour and stay that way, because the whole point of this row is that a
  reader recognises Microsoft or Procore without reading the label. Only
  Siemens exists in Simple Icons, so his files are the source for the rest.
  Saved as PNG and embedded later as data: URIs, since an <img>-mode SVG cannot
  fetch anything.

  Stack marks come from Simple Icons (CC0) as single-path SVGs. Only the path
  data is kept, so the panel can fill them with the theme's ink colour.

    python3 scripts/prep-logos.py [/path/to/portfolio]
"""
import json, pathlib, re, subprocess, sys
from PIL import Image

PORTFOLIO = pathlib.Path(sys.argv[1] if len(sys.argv) > 1
                         else "/Users/helmy162/Desktop/Projects/portfolio")
OUT = pathlib.Path(__file__).resolve().parent.parent / "logos"
OUT.mkdir(exist_ok=True)

BOX = 96  # 2x the ~44px the companies row draws them at

COMPANIES = ["microsoft", "siemens", "procore", "cluely"]

# Slug, and the display name the stack row does NOT print (logo only, by rule).
STACK = [
    "typescript", "react", "nextdotjs", "nodedotjs",
    "postgresql", "supabase", "stripe", "tailwindcss",
]
SIMPLE_ICONS = "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/{}.svg"

print("company marks")
for name in COMPANIES:
    src = PORTFOLIO / "assets" / "icons" / f"{name}.webp"
    im = Image.open(src).convert("RGBA")
    # Trim transparent padding so every mark is optically the same size. A mark
    # with no alpha (Siemens is a solid tile) has nothing to trim.
    bbox = im.split()[3].getbbox()
    if bbox and im.split()[3].getextrema()[0] < 255:
        im = im.crop(bbox)
    scale = BOX / max(im.width, im.height)
    im = im.resize((max(1, round(im.width * scale)), max(1, round(im.height * scale))), Image.LANCZOS)
    canvas = Image.new("RGBA", (BOX, BOX), (0, 0, 0, 0))
    canvas.paste(im, ((BOX - im.width) // 2, (BOX - im.height) // 2), im)
    dst = OUT / f"{name}.png"
    canvas.save(dst, "PNG", optimize=True)
    print(f"  {name:12} {dst.stat().st_size // 1024:>3} KB")

print("\nstack marks")
paths = {}
for slug in STACK:
    # curl rather than urllib: this Python's SSL store has no CA bundle.
    svg = subprocess.run(
        ["curl", "-sSfL", "--max-time", "30", SIMPLE_ICONS.format(slug)],
        capture_output=True, text=True, check=True,
    ).stdout
    d = re.search(r'<path\s+d="([^"]+)"', svg)
    if not d:
        raise SystemExit(f"no path found in simple-icons/{slug}")
    paths[slug] = d.group(1)
    print(f"  {slug:14} {len(d.group(1)):>5} chars")

dst = OUT / "stack.json"
dst.write_text(json.dumps({"viewBox": 24, "paths": paths}, indent=2) + "\n")
print(f"\nwrote {dst.name}")
