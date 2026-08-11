#!/usr/bin/env python3
"""Guard the cross-platform direct-download panel against visual/UX regressions."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"

errors = []
for rel in (Path("index.html"), Path("en/index.html")):
    path = SITE / rel
    text = path.read_text(encoding="utf-8")
    css_href = "download-ui.css" if rel == Path("index.html") else "../download-ui.css"
    required = (
        f'href="{css_href}"',
        'class="os-icon-shell is-windows"',
        'class="os-icon-shell is-apple"',
        'class="os-icon-shell is-linux"',
        'data-platform-download="windows"',
        'data-platform-download="macos"',
        'data-platform-download="linux"',
        'data-platform-variant="macos-arm64"',
        'data-platform-variant="macos-x64"',
        'data-platform-variant="linux-x64-appimage"',
        'data-platform-variant="linux-x64-deb"',
        'data-platform-variant="linux-arm64-appimage"',
        'data-platform-variant="linux-arm64-deb"',
    )
    for fragment in required:
        if fragment not in text:
            errors.append(f"{rel}: missing {fragment}")
    if "🐧" in text:
        errors.append(f"{rel}: emoji Linux icon must not return")
    if "stable release" in text.lower() or "rilis stabil terbaru" in text.lower():
        errors.append(f"{rel}: panel must say public release, not stable release, while preview platforms exist")

css = (SITE / "download-ui.css").read_text(encoding="utf-8")
for fragment in (".os-icon-shell{width:32px;height:32px", ".is-windows", ".is-apple", ".is-linux", ".release-state"):
    if fragment not in css:
        errors.append(f"download-ui.css: missing optical-normalization fragment {fragment}")

if errors:
    print("Download UI validation failed:")
    for error in errors:
        print(f" - {error}")
    raise SystemExit(1)

print("Download UI validation passed: OS marks, direct package routes, status semantics and optical sizing are normalized.")
