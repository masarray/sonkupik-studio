#!/usr/bin/env python3
"""Apply optical and copy polish to the generated cross-platform download panel."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"

WINDOWS_ICON = '''<span class="os-icon-shell is-windows"><svg class="platform-icon os-icon is-windows" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M2 3.5 10.5 2v9H2v-7.5Zm9.5-1.7L22 0v11h-10.5V1.8ZM2 12h8.5v9L2 19.5V12Zm9.5 0H22v11l-10.5-1.8V12Z"/></svg></span>'''
APPLE_ICON = '''<span class="os-icon-shell is-apple"><svg class="platform-icon os-icon is-apple" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.2 12.4c0-2.7 2.2-4 2.3-4.1-1.2-1.8-3.2-2-3.9-2-1.7-.2-3.2 1-4 1s-2.1-1-3.5-.9c-1.8 0-3.5 1.1-4.4 2.7-1.9 3.2-.5 8 1.3 10.6.9 1.3 2 2.7 3.4 2.6 1.4-.1 1.9-.9 3.6-.9s2.2.9 3.7.9c1.5 0 2.5-1.3 3.4-2.6 1-1.5 1.5-3 1.5-3.1-.1 0-3.4-1.3-3.4-4.2ZM14.5 4.6c.8-1 1.3-2.3 1.2-3.6-1.1 0-2.4.8-3.2 1.7-.7.8-1.3 2.2-1.2 3.4 1.2.1 2.4-.6 3.2-1.5Z"/></svg></span>'''
LINUX_ICON = '''<span class="os-icon-shell is-linux"><svg class="platform-icon os-icon is-linux" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><path d="M8.4 9.1c0-4.2 1.3-6.6 3.6-6.6s3.6 2.4 3.6 6.6c0 1.6.6 2.9 1.5 4.4.8 1.4 1.2 2.8.7 3.8-.4.8-1.5.5-2.6-.1-.7 2.4-1.8 4-3.2 4s-2.5-1.6-3.2-4c-1.1.6-2.2.9-2.6.1-.5-1 .1-2.6.8-3.8.8-1.5 1.4-2.8 1.4-4.4Z"/><circle cx="10.6" cy="7.1" r=".45" fill="currentColor" stroke="none"/><circle cx="13.4" cy="7.1" r=".45" fill="currentColor" stroke="none"/><path d="m11.2 8.5.8.6.8-.6"/><path d="M9.8 14c.6.9 1.3 1.4 2.2 1.4s1.6-.5 2.2-1.4"/></svg></span>'''


def replace_head_icon(text: str, platform: str, icon: str) -> str:
    pattern = rf'(<article[^>]*data-platform-download="{platform}"[^>]*>\s*<div class="download-os-head">).*?(<div><strong>)'
    updated, count = re.subn(pattern, rf'\1{icon}\2', text, count=1, flags=re.S)
    if count != 1:
        raise SystemExit(f"Could not normalize {platform} icon")
    return updated


def polish(path: Path, lang: str) -> None:
    text = path.read_text(encoding="utf-8")

    text = replace_head_icon(text, "windows", WINDOWS_ICON)
    text = replace_head_icon(text, "macos", APPLE_ICON)
    text = replace_head_icon(text, "linux", LINUX_ICON)

    if lang == "id":
        pairs = [
            ("Rilis stabil terbaru", "Rilis publik terbaru"),
            (">2 download langsung<", ">2 pilihan<"),
            (">4 download langsung<", ">4 paket<"),
            ("M1 / M2 / M3 / M4 · DMG", "M-series · ARM64 · DMG"),
            ("<strong>AppImage</strong><b>Download</b>", "<span><strong>AppImage</strong><small>Portable</small></span><b>Download</b>"),
            ("<strong>DEB</strong><b>Download</b>", "<span><strong>DEB</strong><small>Debian / Ubuntu</small></span><b>Download</b>"),
        ]
        css_href = "download-ui.css"
        cta_href = "primary-cta.css"
        polish_href = "polish.css"
    else:
        pairs = [
            ("Latest stable release", "Latest public release"),
            (">2 direct downloads<", ">2 choices<"),
            (">4 direct downloads<", ">4 packages<"),
            ("M1 / M2 / M3 / M4 · DMG", "M-series · ARM64 · DMG"),
            ("<strong>AppImage</strong><b>Download</b>", "<span><strong>AppImage</strong><small>Portable</small></span><b>Download</b>"),
            ("<strong>DEB</strong><b>Download</b>", "<span><strong>DEB</strong><small>Debian / Ubuntu</small></span><b>Download</b>"),
        ]
        css_href = "../download-ui.css"
        cta_href = "../primary-cta.css"
        polish_href = "../polish.css"

    for old, new in pairs:
        text = text.replace(old, new)

    css_marker = f'href="{css_href}"'
    if css_marker not in text:
        marker = f'<link rel="stylesheet" href="{polish_href}">'
        if marker not in text:
            raise SystemExit(f"Missing stylesheet marker in {path}")
        text = text.replace(marker, marker + f'\n  <link rel="stylesheet" href="{css_href}">', 1)

    cta_marker = f'href="{cta_href}"'
    if cta_marker not in text:
        marker = f'<link rel="stylesheet" href="{css_href}">'
        if marker not in text:
            raise SystemExit(f"Missing download UI stylesheet marker in {path}")
        text = text.replace(marker, marker + f'\n  <link rel="stylesheet" href="{cta_href}">', 1)

    if "🐧" in text:
        raise SystemExit(f"Emoji Linux icon survived polish in {path}")

    path.write_text(text, encoding="utf-8")


polish(SITE / "index.html", "id")
polish(SITE / "en" / "index.html", "en")
