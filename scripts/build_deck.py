#!/usr/bin/env python3
"""Build the public slide deck and the speaker-notes copy."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / "deck-order.json"
SECTIONS = ROOT / "sections"
TEMPLATE = ROOT / "index.template.html"
OUTPUT_PUBLIC = ROOT / "index.html"
OUTPUT_NOTES = ROOT / "index_note.html"


def remove_elements_by_class(html: str, tag: str, class_name: str) -> str:
    """Remove balanced HTML elements whose class list contains class_name."""
    open_pattern = re.compile(
        rf'<{tag}\b(?=[^>]*\bclass=["\'][^"\']*\b{re.escape(class_name)}\b[^"\']*["\'])[^>]*>',
        re.IGNORECASE,
    )
    token_pattern = re.compile(rf'</?{tag}\b[^>]*>', re.IGNORECASE)

    while True:
        match = open_pattern.search(html)
        if not match:
            return html

        depth = 1
        end = None
        for token in token_pattern.finditer(html, match.end()):
            text = token.group(0)
            if text.startswith('</'):
                depth -= 1
                if depth == 0:
                    end = token.end()
                    break
            elif not text.rstrip().endswith('/>'):
                depth += 1

        if end is None:
            raise SystemExit(f"Unclosed <{tag}> element for class {class_name!r}")
        html = html[:match.start()] + html[end:]


def build_html() -> tuple[str, int]:
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
    return html.rstrip() + "\n", len(fragments)


def build_public_copy(notes_html: str) -> str:
    html = remove_elements_by_class(notes_html, "div", "slide-notes")
    html = remove_elements_by_class(html, "aside", "panel--notes")
    html = re.sub(
        r'\s*<button\b(?=[^>]*\bid=["\']btnNotes["\'])[^>]*>.*?</button>',
        "",
        html,
        flags=re.IGNORECASE | re.DOTALL,
    )
    html = html.replace(
        '<div><dt><kbd>N</kbd></dt><dd>講者備註</dd></div>',
        "",
    )
    return html


def clean_trailing_whitespace(html: str) -> str:
    return "\n".join(line.rstrip() for line in html.splitlines()).rstrip() + "\n"


def main() -> None:
    notes_html, section_count = build_html()
    notes_html = clean_trailing_whitespace(notes_html)
    OUTPUT_NOTES.write_text(notes_html, encoding="utf-8")
    OUTPUT_PUBLIC.write_text(clean_trailing_whitespace(build_public_copy(notes_html)), encoding="utf-8")
    print(f"Built {OUTPUT_PUBLIC.name} (no notes) and {OUTPUT_NOTES.name} (with notes): {section_count} sections")


if __name__ == "__main__":
    main()
