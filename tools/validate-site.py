#!/usr/bin/env python3
"""Validate the public SONKUPIK STUDIO distribution website using stdlib only."""

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
RELEASE_PREFIX = f"https://github.com/{REPOSITORY}/releases/"


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
    expected_alternates = {
        "en": SITE_URL,
        "id": SITE_URL + "id/",
        "x-default": SITE_URL,
    }
    if alternates != expected_alternates:
        fail(f"{path}: incomplete hreflang set: {alternates}", errors)

    for property_name in ("og:title", "og:description", "og:url", "og:image"):
        if not parser.meta.get(("property", property_name), ""):
            fail(f"{path}: missing {property_name}", errors)

    if not any(script.get("id") == "software-structured-data" for script in parser.scripts):
        fail(f"{path}: missing SoftwareApplication structured data", errors)

    if "api.github.com/repos/masarray/sonkupik-studio/releases/latest" in content:
        fail(f"{path}: release API logic must stay in shared app.js", errors)

    if len(content.encode("utf-8")) > 90_000:
        fail(f"{path}: HTML exceeds lightweight 90 KB limit", errors)


def validate_release(path: pathlib.Path, errors: list[str]) -> None:
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"{path}: invalid release JSON: {exc}", errors)
        return

    release_url = payload.get("html_url") or payload.get("release_url")
    if not isinstance(release_url, str) or not release_url.startswith(RELEASE_PREFIX):
        fail(f"{path}: release URL must belong to {REPOSITORY}", errors)

    for asset in payload.get("assets", []):
        name = str(asset.get("name", ""))
        url = str(asset.get("browser_download_url") or asset.get("url") or "")
        allowed_name = bool(
            re.fullmatch(r"SONKUPIK-STUDIO-.+-Setup\.exe", name, re.IGNORECASE)
            or re.fullmatch(r"SONKUPIK-STUDIO-.+-Portable\.exe", name, re.IGNORECASE)
            or name == "SHA256SUMS.txt"
        )
        if not allowed_name:
            fail(f"{path}: unsupported public asset name {name!r}", errors)
        if not url.startswith(RELEASE_PREFIX):
            fail(f"{path}: asset URL does not belong to the release repository", errors)


def main() -> int:
    errors: list[str] = []
    required = [
        SITE / "index.html",
        SITE / "id" / "index.html",
        SITE / "styles.css",
        SITE / "app.js",
        SITE / "release.json",
        SITE / "id" / "release.json",
        SITE / "robots.txt",
        SITE / "sitemap.xml",
        SITE / "site.webmanifest",
        SITE / "assets" / "sonkupik-mark.svg",
        SITE / "assets" / "sonkupik-studio-preview.svg",
    ]
    for path in required:
        if not path.is_file():
            fail(f"Missing required file: {path.relative_to(ROOT)}", errors)

    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1

    validate_page(SITE / "index.html", "en", SITE_URL, errors)
    validate_page(SITE / "id" / "index.html", "id", SITE_URL + "id/", errors)
    validate_release(SITE / "release.json", errors)
    validate_release(SITE / "id" / "release.json", errors)

    app = (SITE / "app.js").read_text(encoding="utf-8")
    for required_fragment in (
        'RELEASE_REPOSITORY = "masarray/sonkupik-studio"',
        "isAllowedReleaseUrl",
        "SHA256SUMS",
        "Setup\\.exe",
        "Portable\\.exe",
    ):
        if required_fragment not in app:
            fail(f"site/app.js: missing release hardening fragment {required_fragment!r}", errors)

    css_size = (SITE / "styles.css").stat().st_size
    js_size = (SITE / "app.js").stat().st_size
    if css_size > 45_000:
        fail(f"site/styles.css exceeds 45 KB lightweight budget ({css_size} bytes)", errors)
    if js_size > 18_000:
        fail(f"site/app.js exceeds 18 KB lightweight budget ({js_size} bytes)", errors)

    source_like = [
        path.relative_to(ROOT)
        for path in SITE.rglob("*")
        if path.is_file() and path.suffix.lower() in {".ts", ".tsx", ".jsx", ".cpp", ".h", ".mjs", ".node"}
    ]
    if source_like:
        fail(f"Application-source-like files found in public site: {source_like}", errors)

    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1

    print("SONKUPIK STUDIO public site validation passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
