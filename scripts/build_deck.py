#!/usr/bin/env python3
"""Assemble the editable section fragments into index.html."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / "deck-order.json"
SECTIONS = ROOT / "sections"
TEMPLATE = ROOT / "index.template.html"
OUTPUT = ROOT / "index.html"


def main() -> None:
    config = json.loads(CONFIG.read_text(encoding="utf-8"))
    fragments: list[str] = []
    for name in config["sections"]:
        path = SECTIONS / f"{name}.html"
        if not path.exists():
            raise SystemExit(f"Missing section: {path}")
        fragments.append(f"<!-- SECTION: {name} -->\n" + path.read_text(encoding="utf-8").strip())

    html = TEMPLATE.read_text(encoding="utf-8")
    html = html.replace("{{TITLE}}", config["title"])
    marker = "<!-- SECTION_CONTENT -->"
    if marker not in html:
        raise SystemExit(f"Template marker not found: {marker}")
    html = html.replace(marker, "\n\n".join(fragments))
    OUTPUT.write_text(html.rstrip() + "\n", encoding="utf-8")
    print(f"Built {OUTPUT.name}: {len(fragments)} sections")


if __name__ == "__main__":
    main()
