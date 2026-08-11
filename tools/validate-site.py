#!/usr/bin/env python3
"""Validate the SONKUPIK STUDIO download-first public website using stdlib only."""

from __future__ import annotations

import json
import pathlib
import re
import sys
from html.parser import HTMLParser

ROOT = pathlib.Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
REPOSITORY = "masarray/sonkupik-studio"
SITE_URL = "https://masarray.github.io/sonkupik-studio/"
EN_URL = SITE_URL + "en/"
RELEASE_PREFIX = f"https://github.com/{REPOSITORY}/releases/"
TOKOPEDIA_PREFIX = "https://www.tokopedia.com/dr-sonkupik/"


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.html_lang = ""
        self.title = ""
        self._in_title = False
        self.meta: dict[tuple[str, str], str] = {}
        self.links: list[dict[str, str]] = []
        self.scripts: list[dict[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {key: value or "" for key, value in attrs}
        if tag == "html":
            self.html_lang = values.get("lang", "")
        elif tag == "title":
            self._in_title = True
        elif tag == "meta":
            if values.get("name"):
                self.meta[("name", values["name"])] = values.get("content", "")
            if values.get("property"):
                self.meta[("property", values["property"])] = values.get("content", "")
        elif tag == "link":
            self.links.append(values)
        elif tag == "script":
            self.scripts.append(values)

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self._in_title = False

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self.title += data


def fail(message: str, errors: list[str]) -> None:
    errors.append(message)


def validate_page(path: pathlib.Path, expected_lang: str, canonical: str, errors: list[str]) -> None:
    content = path.read_text(encoding="utf-8")
    parser = PageParser()
    parser.feed(content)

    if parser.html_lang != expected_lang:
        fail(f"{path}: expected lang={expected_lang!r}, found {parser.html_lang!r}", errors)
    if not (35 <= len(parser.title.strip()) <= 75):
        fail(f"{path}: title should be 35-75 characters", errors)

    description = parser.meta.get(("name", "description"), "")
    if not (120 <= len(description) <= 190):
        fail(f"{path}: meta description should be 120-190 characters", errors)

    robots = parser.meta.get(("name", "robots"), "")
    if "index" not in robots or "follow" not in robots:
        fail(f"{path}: robots must allow index and follow", errors)

    canonical_links = [link.get("href") for link in parser.links if link.get("rel") == "canonical"]
    if canonical_links != [canonical]:
        fail(f"{path}: canonical mismatch: {canonical_links}", errors)

    alternates = {
        link.get("hreflang"): link.get("href")
        for link in parser.links
        if link.get("rel") == "alternate" and link.get("hreflang")
    }
    expected_alternates = {"id": SITE_URL, "en": EN_URL, "x-default": SITE_URL}
    if alternates != expected_alternates:
        fail(f"{path}: incomplete hreflang set: {alternates}", errors)

    for property_name in ("og:title", "og:description", "og:url", "og:image"):
        if not parser.meta.get(("property", property_name), ""):
            fail(f"{path}: missing {property_name}", errors)

    script_ids = {script.get("id") for script in parser.scripts}
    if "software-structured-data" not in script_ids:
        fail(f"{path}: missing SoftwareApplication structured data", errors)
    if "faq-structured-data" not in script_ids:
        fail(f"{path}: missing FAQPage structured data", errors)

    required_html = (
        'id="download"',
        'id="faq"',
        'data-platform-download="windows"',
        'data-platform-download="macos"',
        'data-platform-download="linux"',
        'data-download="setup"',
        'data-download="portable"',
        'data-k500-store',
        'data-k500-store-nav',
        'polish.css',
        "SONKUPIK STUDIO",
    )
    for fragment in required_html:
        if fragment not in content:
            fail(f"{path}: missing download-first fragment {fragment!r}", errors)

    if content.count('class="faq-item"') < 10:
        fail(f"{path}: beginner FAQ must contain at least 10 native accordion items", errors)

    if TOKOPEDIA_PREFIX not in content:
        fail(f"{path}: static K500 purchase route must point to Dr Sonkupik on Tokopedia", errors)

    ambiguous_claims = (
        "Aplikasi resmi untuk KTV PRO K500",
        "Official app for KTV PRO K500",
    )
    for claim in ambiguous_claims:
        if claim in content:
            fail(f"{path}: ambiguous manufacturer-official claim must not return: {claim!r}", errors)

    if "KTV PRO K500 — Prosesor Karaoke Lengkap" in content or "Satu alat menggantikan" in content:
        fail(f"{path}: legacy hardware-first hero copy must not return", errors)

    if len(content.encode("utf-8")) > 42_000:
        fail(f"{path}: HTML exceeds lightweight 42 KB limit", errors)


def validate_redirect(path: pathlib.Path, errors: list[str]) -> None:
    content = path.read_text(encoding="utf-8")
    has_meta_redirect = 'content="0;url=../"' in content
    has_script_redirect = "location.replace('../' + location.hash)" in content or 'location.replace("../" + location.hash)' in content
    if not has_meta_redirect or not has_script_redirect:
        fail(f"{path}: legacy /id/ route must redirect to Indonesian root while preserving fragments", errors)
    if 'content="noindex,follow"' not in content:
        fail(f"{path}: legacy route must be noindex,follow", errors)


def validate_release(path: pathlib.Path, errors: list[str]) -> None:
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"{path}: invalid release JSON: {exc}", errors)
        return

    release_url = payload.get("html_url") or payload.get("release_url")
    if not isinstance(release_url, str) or not release_url.startswith(RELEASE_PREFIX):
        fail(f"{path}: release URL must belong to {REPOSITORY}", errors)

    required = {"setup": False, "portable": False, "checksums": False}
    allowed_patterns = (
        re.compile(r"^SONKUPIK-STUDIO-.+-Setup\.exe$", re.I),
        re.compile(r"^SONKUPIK-STUDIO-.+-Portable\.exe$", re.I),
        re.compile(r"^SONKUPIK-STUDIO-.+\.(dmg|pkg)$", re.I),
        re.compile(r"^SONKUPIK-STUDIO-.+\.(AppImage|deb|rpm)$", re.I),
        re.compile(r"^SHA256SUMS\.txt$", re.I),
    )

    assets = payload.get("assets", [])
    if not isinstance(assets, list):
        fail(f"{path}: assets must be a list", errors)
        assets = []

    for asset in assets:
        name = str(asset.get("name", ""))
        url = str(asset.get("browser_download_url") or asset.get("url") or "")
        if not any(pattern.fullmatch(name) for pattern in allowed_patterns):
            fail(f"{path}: unsupported public asset name {name!r}", errors)
            continue
        if not url.startswith(RELEASE_PREFIX):
            fail(f"{path}: asset URL does not belong to release repository", errors)
        if re.fullmatch(r"SONKUPIK-STUDIO-.+-Setup\.exe", name, re.I):
            required["setup"] = True
        elif re.fullmatch(r"SONKUPIK-STUDIO-.+-Portable\.exe", name, re.I):
            required["portable"] = True
        elif name.lower() == "sha256sums.txt":
            required["checksums"] = True

    missing = [name for name, present in required.items() if not present]
    if missing:
        fail(f"{path}: missing required Windows release assets: {', '.join(missing)}", errors)


def main() -> int:
    errors: list[str] = []
    required_files = [
        SITE / "index.html",
        SITE / "en" / "index.html",
        SITE / "id" / "index.html",
        SITE / "download.css",
        SITE / "polish.css",
        SITE / "download.js",
        SITE / "release.json",
        SITE / "robots.txt",
        SITE / "sitemap.xml",
        SITE / "site.webmanifest",
        SITE / "assets" / "sonkupik-mark.svg",
    ]
    for path in required_files:
        if not path.is_file():
            fail(f"Missing required file: {path.relative_to(ROOT)}", errors)

    if not errors:
        validate_page(SITE / "index.html", "id", SITE_URL, errors)
        validate_page(SITE / "en" / "index.html", "en", EN_URL, errors)
        validate_redirect(SITE / "id" / "index.html", errors)
        validate_release(SITE / "release.json", errors)

    runtime = (SITE / "download.js").read_text(encoding="utf-8") if (SITE / "download.js").is_file() else ""
    for fragment in (
        'REPOSITORY = "masarray/sonkupik-studio"',
        "isAllowedReleaseUrl",
        "-Setup\\.exe",
        "-Portable\\.exe",
        "\\.dmg",
        "\\.pkg",
        "\\.AppImage",
        "\\.deb",
        "\\.rpm",
        "if (!setup || !portable || !checksums) return null",
    ):
        if fragment not in runtime:
            fail(f"site/download.js: missing release hardening fragment {fragment!r}", errors)

    css_path = SITE / "download.css"
    polish_path = SITE / "polish.css"
    js_path = SITE / "download.js"
    if css_path.is_file() and css_path.stat().st_size > 30_000:
        fail("site/download.css exceeds 30 KB lightweight budget", errors)
    if polish_path.is_file() and polish_path.stat().st_size > 12_000:
        fail("site/polish.css exceeds 12 KB lightweight budget", errors)
    if js_path.is_file() and js_path.stat().st_size > 15_000:
        fail("site/download.js exceeds 15 KB lightweight budget", errors)

    sitemap = (SITE / "sitemap.xml").read_text(encoding="utf-8") if (SITE / "sitemap.xml").is_file() else ""
    for required_url in (SITE_URL, EN_URL):
        if f"<loc>{required_url}</loc>" not in sitemap:
            fail(f"site/sitemap.xml: missing {required_url}", errors)
    if SITE_URL + "id/" in sitemap:
        fail("site/sitemap.xml: legacy /id/ redirect must not be indexed", errors)

    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1

    print("SONKUPIK STUDIO download landing validation passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
