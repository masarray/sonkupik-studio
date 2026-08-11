#!/usr/bin/env python3
"""Synchronize landing-page direct downloads from site/release.json."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
SNAPSHOT = json.loads((SITE / "release.json").read_text(encoding="utf-8"))
TAG = str(SNAPSHOT.get("tag_name", "")).strip()
VERSION = TAG.removeprefix("v")
ASSETS = {str(a.get("name")): a for a in SNAPSHOT.get("assets", [])}


def asset(name: str) -> dict:
    item = ASSETS.get(name)
    if not item:
        raise SystemExit(f"Missing required release asset: {name}")
    url = str(item.get("browser_download_url", ""))
    if not url.startswith("https://github.com/masarray/sonkupik-studio/releases/download/"):
        raise SystemExit(f"Unsafe release URL for {name}: {url}")
    return item


def mb(item: dict) -> str:
    size = int(item.get("size", 0) or 0)
    return f"{size / 1024 / 1024:.0f} MB" if size else ""


setup = asset(f"SONKUPIK-STUDIO-{VERSION}-Setup.exe")
portable = asset(f"SONKUPIK-STUDIO-{VERSION}-Portable.exe")
mac_arm = asset(f"SONKUPIK-STUDIO-{VERSION}-macOS-arm64.dmg")
mac_x64 = asset(f"SONKUPIK-STUDIO-{VERSION}-macOS-x64.dmg")
linux_x64_app = asset(f"SONKUPIK-STUDIO-{VERSION}-Linux-x64.AppImage")
linux_x64_deb = asset(f"SONKUPIK-STUDIO-{VERSION}-Linux-x64.deb")
linux_arm_app = asset(f"SONKUPIK-STUDIO-{VERSION}-Linux-arm64.AppImage")
linux_arm_deb = asset(f"SONKUPIK-STUDIO-{VERSION}-Linux-arm64.deb")

WINDOWS_ICON = '<svg class="platform-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M2 3.5 10.5 2v9H2v-7.5Zm9.5-1.7L22 0v11h-10.5V1.8ZM2 12h8.5v9L2 19.5V12Zm9.5 0H22v11l-10.5-1.8V12Z"/></svg>'
APPLE_ICON = '<svg class="platform-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.2 12.4c0-2.7 2.2-4 2.3-4.1-1.2-1.8-3.2-2-3.9-2-1.7-.2-3.2 1-4 1s-2.1-1-3.5-.9c-1.8 0-3.5 1.1-4.4 2.7-1.9 3.2-.5 8 1.3 10.6.9 1.3 2 2.7 3.4 2.6 1.4-.1 1.9-.9 3.6-.9s2.2.9 3.7.9c1.5 0 2.5-1.3 3.4-2.6 1-1.5 1.5-3 1.5-3.1-.1 0-3.4-1.3-3.4-4.2ZM14.5 4.6c.8-1 1.3-2.3 1.2-3.6-1.1 0-2.4.8-3.2 1.7-.7.8-1.3 2.2-1.2 3.4 1.2.1 2.4-.6 3.2-1.5Z"/></svg>'


def direct_block(lang: str) -> str:
    if lang == "id":
        return f'''      <div class="direct-download-grid" data-platform-matrix aria-label="Download langsung berdasarkan sistem operasi">
        <article class="download-os-card is-recommended" data-platform-download="windows">
          <div class="download-os-head">{WINDOWS_ICON}<div><strong>Windows</strong><span>Windows 10/11 · x64</span></div><small data-group-status="windows">Recommended</small></div>
          <a class="direct-package primary-package" data-download="setup" href="{setup['browser_download_url']}"><span><strong>Windows Setup</strong><small>Installer · <span data-setup-size>{mb(setup)}</span></small></span><b>Download</b></a>
          <a class="direct-package" data-download="portable" href="{portable['browser_download_url']}"><span><strong>Portable .exe</strong><small>Tanpa instalasi · <span data-portable-size>{mb(portable)}</span></small></span><b>Download</b></a>
        </article>
        <article class="download-os-card" data-platform-download="macos">
          <div class="download-os-head">{APPLE_ICON}<div><strong>macOS</strong><span>Pilih chip Mac Anda</span></div><small data-group-status="macos">2 download langsung</small></div>
          <a class="direct-package" data-platform-variant="macos-arm64" href="{mac_arm['browser_download_url']}"><span><strong>Apple Silicon</strong><small>M1 / M2 / M3 / M4 · DMG · {mb(mac_arm)}</small></span><b>Download</b></a>
          <a class="direct-package" data-platform-variant="macos-x64" href="{mac_x64['browser_download_url']}"><span><strong>Intel Mac</strong><small>x64 · DMG · {mb(mac_x64)}</small></span><b>Download</b></a>
          <p class="package-warning">Belum Developer ID signed/notarized. macOS Gatekeeper dapat memberi peringatan saat pertama dibuka.</p>
        </article>
        <article class="download-os-card" data-platform-download="linux">
          <div class="download-os-head"><span class="os-linux" aria-hidden="true">🐧</span><div><strong>Linux</strong><span>x64 atau ARM64</span></div><small data-group-status="linux">4 download langsung</small></div>
          <div class="linux-arch-row"><span>x64</span><a class="direct-package compact-package" data-platform-variant="linux-x64-appimage" href="{linux_x64_app['browser_download_url']}"><strong>AppImage</strong><b>Download</b></a><a class="direct-package compact-package" data-platform-variant="linux-x64-deb" href="{linux_x64_deb['browser_download_url']}"><strong>DEB</strong><b>Download</b></a></div>
          <div class="linux-arch-row"><span>ARM64</span><a class="direct-package compact-package" data-platform-variant="linux-arm64-appimage" href="{linux_arm_app['browser_download_url']}"><strong>AppImage</strong><b>Download</b></a><a class="direct-package compact-package" data-platform-variant="linux-arm64-deb" href="{linux_arm_deb['browser_download_url']}"><strong>DEB</strong><b>Download</b></a></div>
        </article>
      </div>
      <p class="availability-note"><strong>Semua tombol di atas adalah download langsung.</strong> Anda tidak perlu membuka halaman GitHub Release untuk mencari file installer.</p>
'''
    return f'''      <div class="direct-download-grid" data-platform-matrix aria-label="Direct downloads by operating system">
        <article class="download-os-card is-recommended" data-platform-download="windows">
          <div class="download-os-head">{WINDOWS_ICON}<div><strong>Windows</strong><span>Windows 10/11 · x64</span></div><small data-group-status="windows">Recommended</small></div>
          <a class="direct-package primary-package" data-download="setup" href="{setup['browser_download_url']}"><span><strong>Windows Setup</strong><small>Installer · <span data-setup-size>{mb(setup)}</span></small></span><b>Download</b></a>
          <a class="direct-package" data-download="portable" href="{portable['browser_download_url']}"><span><strong>Portable .exe</strong><small>No installation · <span data-portable-size>{mb(portable)}</span></small></span><b>Download</b></a>
        </article>
        <article class="download-os-card" data-platform-download="macos">
          <div class="download-os-head">{APPLE_ICON}<div><strong>macOS</strong><span>Choose your Mac chip</span></div><small data-group-status="macos">2 direct downloads</small></div>
          <a class="direct-package" data-platform-variant="macos-arm64" href="{mac_arm['browser_download_url']}"><span><strong>Apple Silicon</strong><small>M1 / M2 / M3 / M4 · DMG · {mb(mac_arm)}</small></span><b>Download</b></a>
          <a class="direct-package" data-platform-variant="macos-x64" href="{mac_x64['browser_download_url']}"><span><strong>Intel Mac</strong><small>x64 · DMG · {mb(mac_x64)}</small></span><b>Download</b></a>
          <p class="package-warning">Not Developer ID signed/notarized yet. macOS Gatekeeper may warn on first launch.</p>
        </article>
        <article class="download-os-card" data-platform-download="linux">
          <div class="download-os-head"><span class="os-linux" aria-hidden="true">🐧</span><div><strong>Linux</strong><span>x64 or ARM64</span></div><small data-group-status="linux">4 direct downloads</small></div>
          <div class="linux-arch-row"><span>x64</span><a class="direct-package compact-package" data-platform-variant="linux-x64-appimage" href="{linux_x64_app['browser_download_url']}"><strong>AppImage</strong><b>Download</b></a><a class="direct-package compact-package" data-platform-variant="linux-x64-deb" href="{linux_x64_deb['browser_download_url']}"><strong>DEB</strong><b>Download</b></a></div>
          <div class="linux-arch-row"><span>ARM64</span><a class="direct-package compact-package" data-platform-variant="linux-arm64-appimage" href="{linux_arm_app['browser_download_url']}"><strong>AppImage</strong><b>Download</b></a><a class="direct-package compact-package" data-platform-variant="linux-arm64-deb" href="{linux_arm_deb['browser_download_url']}"><strong>DEB</strong><b>Download</b></a></div>
        </article>
      </div>
      <p class="availability-note"><strong>Every button above is a direct download.</strong> You never need to browse the GitHub Release page to find an installer.</p>
'''


def replace_panel(path: Path, lang: str) -> None:
    text = path.read_text(encoding="utf-8")
    start_candidates = [text.find('      <div class="platform-list"'), text.find('      <div class="direct-download-grid"')]
    start = min(x for x in start_candidates if x >= 0)
    end = text.index('      <div class="release-links">', start)
    text = text[:start] + direct_block(lang) + text[end:]

    pairs = [
        (
            '<div class="trust-item"><strong>Rilis terverifikasi</strong><span>Setup, Portable dan SHA-256 dipublikasikan bersama.</span></div>',
            '<div class="trust-item"><strong>Rilis terverifikasi</strong><span>Paket Windows, macOS, Linux dan SHA-256 dipublikasikan bersama.</span></div>',
        ),
        (
            '<article class="step"><span class="step-num">01</span><h3>Install SONKUPIK STUDIO</h3><p>Klik Windows Setup di atas. Installer adalah pilihan yang direkomendasikan karena startup lebih cepat daripada Portable.</p></article>',
            '<article class="step"><span class="step-num">01</span><h3>Download SONKUPIK STUDIO</h3><p>Pilih Windows, macOS atau Linux di panel atas, lalu klik paket yang sesuai dengan arsitektur komputer Anda.</p></article>',
        ),
        (
            'Ya. Paket publik SONKUPIK STUDIO dapat diunduh gratis dari halaman ini. Tombol utama mengarah langsung ke installer Windows release terbaru.',
            'Ya. Paket publik SONKUPIK STUDIO dapat diunduh gratis dari halaman ini. Semua tombol Windows, macOS dan Linux mengarah langsung ke file paket resmi.',
        ),
        (
            'Tidak. Tombol Windows Setup dan Portable diarahkan langsung ke file rilis. GitHub dipakai di belakang layar sebagai host distribusi, checksums, release notes, source dan support teknis.',
            'Tidak. Semua tombol Windows, macOS dan Linux diarahkan langsung ke file paket rilis. GitHub hanya dipakai di belakang layar sebagai host distribusi, checksums, release notes, source dan support teknis.',
        ),
        (
            '<div class="trust-item"><strong>Verified release set</strong><span>Setup, Portable and SHA-256 are published together.</span></div>',
            '<div class="trust-item"><strong>Verified release set</strong><span>Windows, macOS, Linux packages and SHA-256 are published together.</span></div>',
        ),
        (
            '<article class="step"><span class="step-num">01</span><h3>Install SONKUPIK STUDIO</h3><p>Click Windows Setup above. The installed build is recommended for faster startup than the Portable package.</p></article>',
            '<article class="step"><span class="step-num">01</span><h3>Download SONKUPIK STUDIO</h3><p>Choose Windows, macOS or Linux in the panel above, then click the package that matches your computer architecture.</p></article>',
        ),
        (
            'Yes. Public SONKUPIK STUDIO packages can be downloaded for free from this page. The main button links directly to the latest Windows release installer.',
            'Yes. Public SONKUPIK STUDIO packages can be downloaded for free from this page. Every Windows, macOS and Linux button links directly to an official package file.',
        ),
        (
            'No. Windows Setup and Portable buttons link directly to release files. GitHub is used behind the scenes for distribution hosting, checksums, release notes, source and technical support.',
            'No. Every Windows, macOS and Linux download button links directly to a release package file. GitHub is only used behind the scenes for hosting, checksums, release notes, source and technical support.',
        ),
    ]
    for old, new in pairs:
        text = text.replace(old, new)
    path.write_text(text, encoding="utf-8")


replace_panel(SITE / "index.html", "id")
replace_panel(SITE / "en" / "index.html", "en")

# Runtime only refreshes already-working direct links to the latest release.
js_path = SITE / "download.js"
js = js_path.read_text(encoding="utf-8")
js = re.sub(
    r"  function mountPlatformMatrix\(\) \{.*?\n  \}\n\n  function isAllowedReleaseUrl",
    '''  function mountPlatformMatrix() {\n    const availability = document.querySelector(".availability-note");\n    if (availability) {\n      const label = language === "en" ? "Every button above is a direct download." : "Semua tombol di atas adalah download langsung.";\n      const detail = language === "en" ? " Package URLs refresh automatically from the latest official release." : " URL paket diperbarui otomatis dari rilis resmi terbaru.";\n      availability.innerHTML = `<strong>${label}</strong>${detail}`;\n    }\n  }\n\n  function isAllowedReleaseUrl''',
    js,
    count=1,
    flags=re.S,
)
js = re.sub(
    r"  function setPlatformSummary\(platform, hasPublicAssets\) \{.*?\n  \}\n\n  function bindVariant",
    '''  function setPlatformSummary(platform, hasPublicAssets) {\n    document.querySelectorAll(`[data-platform-download="${platform}"]`).forEach((card) => {\n      card.classList.toggle("is-unavailable", !hasPublicAssets);\n    });\n  }\n\n  function bindVariant''',
    js,
    count=1,
    flags=re.S,
)
js = js.replace('    bindDirect(\'[data-platform-download="windows"]\', release.setup, copy.setup);\n', '')
js = js.replace('    setPlatformSummary("macos", false);\n    setPlatformSummary("linux", false);\n', '')
js = js.replace('  setPlatformSummary("macos", false);\n  setPlatformSummary("linux", false);\n', '')
# Keep human-readable format text intact; size is already present in static HTML and aria-label.
js = re.sub(r"    const small = link\.querySelector\(\"small\"\);\n    if \(small && size\) \{.*?\n    \}\n", "", js, count=1, flags=re.S)
js_path.write_text(js, encoding="utf-8")

css_path = SITE / "polish.css"
css = css_path.read_text(encoding="utf-8")
marker = "/* Direct-download all-platform panel */"
if marker not in css:
    css += r'''

/* Direct-download all-platform panel */
.direct-download-grid{display:grid;gap:9px;padding:16px 18px 10px}.download-os-card{padding:12px;border:1px solid rgba(160,190,214,.14);border-radius:11px;background:rgba(255,255,255,.012)}.download-os-card.is-recommended{border-color:rgba(120,223,214,.3);background:rgba(120,223,214,.032)}.download-os-head{display:grid;grid-template-columns:27px minmax(0,1fr) auto;align-items:center;gap:10px;margin-bottom:9px}.download-os-head>div{display:grid;line-height:1.15}.download-os-head strong{font-size:.78rem;font-weight:690}.download-os-head span{margin-top:3px;color:#8295a2;font-size:.58rem}.download-os-head>small{padding:3px 6px;border:1px solid rgba(120,223,214,.18);border-radius:999px;color:#89bdb7;font-size:.52rem;font-weight:650}.direct-package{min-height:44px;display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:6px;padding:8px 10px;border:1px solid var(--line);border-radius:9px;background:rgba(255,255,255,.014);transition:.16s ease}.direct-package:hover{transform:translateY(-1px);border-color:rgba(120,223,214,.45);background:rgba(120,223,214,.045)}.direct-package>span{display:grid;line-height:1.15}.direct-package strong{font-size:.68rem;font-weight:680}.direct-package small{margin-top:3px;color:#788b98;font-size:.54rem;font-weight:520}.direct-package>b{flex:0 0 auto;color:var(--accent);font-size:.59rem;font-weight:720;letter-spacing:.025em}.primary-package{border-color:rgba(120,223,214,.32);background:linear-gradient(135deg,rgba(120,223,214,.09),rgba(121,169,232,.05))}.package-warning{margin:8px 1px 0;color:#9a8d70;font-size:.54rem;line-height:1.45}.linux-arch-row{display:grid;grid-template-columns:42px 1fr 1fr;align-items:center;gap:6px;margin-top:6px}.linux-arch-row>span{color:#8295a2;font-size:.56rem;font-weight:680}.compact-package{min-height:37px;margin-top:0;padding:6px 8px}.compact-package strong{font-size:.61rem}.compact-package>b{font-size:.52rem}.download-os-card.is-unavailable{opacity:.72}.direct-download-grid+.availability-note{margin-top:4px}.release-links a[data-release-link]{opacity:.78}
@media(max-width:620px){.direct-download-grid{padding-inline:14px}.download-os-head{grid-template-columns:27px minmax(0,1fr)}.download-os-head>small{grid-column:2;justify-self:start}.linux-arch-row{grid-template-columns:42px 1fr 1fr}.direct-package{min-height:46px}}
'''
    css_path.write_text(css, encoding="utf-8")

# Verify all eight public packages are present as direct static URLs in both languages.
for page in (SITE / "index.html", SITE / "en" / "index.html"):
    content = page.read_text(encoding="utf-8")
    for item in (setup, portable, mac_arm, mac_x64, linux_x64_app, linux_x64_deb, linux_arm_app, linux_arm_deb):
        url = str(item["browser_download_url"])
        if url not in content:
            raise SystemExit(f"{page}: direct release URL missing: {url}")
    if "direct-download-grid" not in content:
        raise SystemExit(f"{page}: direct-download panel missing")

print(f"Synced direct-download landing for {TAG}: 8 application packages")
