"""Assembles docs/*.html from src/pages and src/parts.

Each page file starts with a few header lines (key: value), then a blank line,
then its body. The nav marks the current page by the `nav` key. Run from the
repo root: python build.py
"""
import pathlib, re

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "src"
OUT = ROOT / "docs"

HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; media-src 'self'; font-src 'self'; connect-src 'self'; form-action 'none'; base-uri 'self'; object-src 'none'; upgrade-insecure-requests">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <title>{title}</title>
  <meta name="description" content="{description}">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{description}">
  <meta property="og:image" content="https://kinetic.ong/assets/ak-holo.webp">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">{robots}
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
"""

TAIL = """
<script src="/script.js"></script>
</body>
</html>
"""


def parse(text):
    head, _, body = text.partition("\n\n")
    meta = {}
    for line in head.splitlines():
        k, _, v = line.partition(":")
        meta[k.strip()] = v.strip()
    return meta, body


def main():
    nav = (SRC / "parts" / "nav.html").read_text(encoding="utf-8")
    foot = (SRC / "parts" / "foot.html").read_text(encoding="utf-8")
    for page in SRC.glob("pages/**/*.html"):
        meta, body = parse(page.read_text(encoding="utf-8"))
        rel = page.relative_to(SRC / "pages")
        current = meta.get("nav", "")
        n = nav
        for key in ("HOME", "PRODUCTS", "STATUS", "DISCORD"):
            n = n.replace("{%s}" % key, 'aria-current="page"' if key.lower() == current else "")
        robots = '\n  <meta name="robots" content="noindex">' if meta.get("noindex") == "yes" else ""
        html = HEAD.format(title=meta["title"], description=meta.get("description", ""), robots=robots)
        html += n + "\n" + body.rstrip() + "\n\n" + foot + TAIL
        target = OUT / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(html, encoding="utf-8")
        print("built", rel)


if __name__ == "__main__":
    main()
