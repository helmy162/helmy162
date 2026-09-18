#!/usr/bin/env python3
"""Checks that every panel actually draws what it claims to draw.

This exists because of a bug that survived several rounds of looking at the
page: the monogram and the hero rule were animated, the animation never ran in
an <img>-mode SVG, and both elements sat at their hidden start state. The panel
still rendered, the name was there, and nothing looked broken enough to notice.

So rather than trusting a glance, each panel is rasterised through <img> exactly
as a browser loads it, and named regions are asserted to contain ink. A region
that comes back empty is an element that is not being drawn.

    python3 scripts/verify.py
"""
import pathlib, subprocess, sys, tempfile
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# panel -> [(label, x, y, w, h)] in the panel's own coordinates
REGIONS = {
    "career": [
        ("microsoft tile", 148, 28, 58, 58),
        ("siemens tile", 303, 28, 58, 58),
        ("procore tile", 458, 28, 58, 58),
        ("cluely tile", 613, 28, 58, 58),
        ("procore tile (current)", 768, 28, 58, 58),
        ("rule", 60, 134, 700, 9),
        ("names", 100, 98, 700, 26),
        ("dates", 100, 158, 700, 24),
    ],
    # The typing line is the one most likely to break silently: if the loop is
    # built so the cycle opens empty, a frozen timeline renders a bare cursor.
    "hero": [
        ("monogram", 770, 48, 54, 54),
        ("role pill", 56, 52, 330, 40),
        ("name", 56, 156, 600, 46),
        ("typed line", 56, 224, 300, 28),
    ],
    # Each mark gets its own box, so a missing or misnamed slug is caught
    # rather than hidden by the seven that did draw.
    "stack": [
        (slug, 52 + round(((880 - 104 - 44) / 7) * i) - 2, 40, 48, 48)
        for i, slug in enumerate(
            ["typescript", "react", "nextdotjs", "nodedotjs",
             "postgresql", "supabase", "stripe", "tailwindcss"]
        )
    ],
}


def ink(img, box, bg):
    """Pixels differing from the panel background by more than a hair."""
    x, y, w, h = box
    crop = img.crop((x, y, x + w, y + h)).convert("RGB")
    return sum(
        1 for px in list(crop.getdata())
        if abs(px[0] - bg[0]) + abs(px[1] - bg[1]) + abs(px[2] - bg[2]) > 24
    )


def main():
    failures = []
    with tempfile.TemporaryDirectory() as tmp:
        tmp = pathlib.Path(tmp)
        for name, regions in REGIONS.items():
            # Panels keep their own dark surface in both themes.
            for theme, bg in (("dark", (4, 7, 10)), ("light", (4, 7, 10))):
                svg = ASSETS / f"{name}-{theme}.svg"
                if not svg.exists():
                    failures.append(f"{name}-{theme}: missing")
                    continue
                w, h = [
                    int(v) for v in
                    svg.read_text()[:200].split('viewBox="0 0 ')[1].split('"')[0].split()
                ]
                page = tmp / f"{name}-{theme}.html"
                # Loaded via <img>, the same secure animated mode GitHub uses.
                page.write_text(
                    f'<body style="margin:0"><img src="{svg.as_uri()}" '
                    f'width="{w}" height="{h}"></body>'
                )
                shot = tmp / f"{name}-{theme}.png"
                subprocess.run(
                    [CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                     "--force-device-scale-factor=1", f"--window-size={w},{h}",
                     "--virtual-time-budget=3000", f"--screenshot={shot}", page.as_uri()],
                    capture_output=True, check=True,
                )
                img = Image.open(shot)
                for label, *box in regions:
                    n = ink(img, box, bg)
                    ok = n > 40
                    print(f"  {'ok ' if ok else 'MISSING'}  {name}-{theme:5} {label:24} {n:>6} px")
                    if not ok:
                        failures.append(f"{name}-{theme}: {label} drew {n} px")

    if failures:
        print("\nFAILED")
        for f in failures:
            print(f"  {f}")
        sys.exit(1)
    print("\nall regions drew ink")


main()
