# SONKUPIK STUDIO

[![Website](https://img.shields.io/badge/Product%20website-SONKUPIK%20STUDIO-55d8cf)](https://masarray.github.io/sonkupik-studio/)
[![Latest release](https://img.shields.io/github/v/release/masarray/sonkupik-studio?label=Latest%20release)](https://github.com/masarray/sonkupik-studio/releases/latest)
[![Public platforms](https://img.shields.io/badge/Public-Windows%20%7C%20macOS%20%7C%20Linux-55d8cf)](#platform-status)
[![Processor](https://img.shields.io/badge/Hardware-K500%20karaoke%20processor-d79dff)](#product-scope)

**SONKUPIK STUDIO** is a desktop control and preset-management application for compatible K500 karaoke processors. It brings live device control, PEQ, crossover, dynamics, mixer controls, device preset recall/save, PC preset libraries and mass upload into one focused workspace.

**SONKUPIK STUDIO** adalah aplikasi desktop untuk kontrol dan manajemen preset prosesor karaoke K500 yang kompatibel. Aplikasi ini menyatukan live device control, PEQ, crossover, dynamics, mixer, recall/save preset perangkat, library preset PC, dan mass upload dalam satu workspace yang fokus.

## Official public surfaces

- [Website Bahasa Indonesia](https://masarray.github.io/sonkupik-studio/)
- [English product website](https://masarray.github.io/sonkupik-studio/en/)
- [Latest official release](https://github.com/masarray/sonkupik-studio/releases/latest)
- [Support guide](SUPPORT.md)
- [Security policy](SECURITY.md)

## Repository architecture

This repository is the **public product, website and binary distribution surface**. It contains:

- the bilingual GitHub Pages website;
- public release metadata and direct-download routing;
- Windows, macOS and Linux public release assets;
- architecture-specific links for Intel/Apple Silicon and x64/ARM64;
- independent platform packaging workflows plus an all-platform release orchestrator;
- SHA-256 checksums;
- public support and security guidance; and
- automated validation and Pages deployment workflows.

The application source code remains in [`masarray/ktv-studio-mixer-pro`](https://github.com/masarray/ktv-studio-mixer-pro). Release workflows in this repository check out or verify the exact commit pinned by `.github/release-source.json` before accepting public binaries.

## Platform status

| Platform | Architecture | Package | Current status |
| --- | --- | --- | --- |
| Windows 10/11 | x64 | Setup + Portable | **Stable public release** |
| macOS | Apple Silicon / ARM64 | DMG | **Public preview · CI build + packaged payload verified · unsigned/unnotarized** |
| macOS | Intel / x64 | DMG | **Public preview · CI build + packaged payload verified · unsigned/unnotarized** |
| Linux | x64 | AppImage + DEB | **Public preview · CI build + packaged payload verified** |
| Linux | ARM64 | AppImage + DEB | **Public preview · CI build + packaged payload verified** |

SONKUPIK STUDIO v0.8.44 is now publicly downloadable for all of the platform/architecture combinations above. Windows remains the mature stable target. macOS and Linux packages have passed native CI build, application regression, architecture, native-module and packaged-preset verification, but real K500 hardware validation on each target operating system is still recommended before critical events or permanent installations.

### macOS Gatekeeper notice

The current v0.8.44 macOS DMGs are **not Developer ID signed and are not Apple-notarized** because Apple Developer credentials are not configured in this repository yet. Gatekeeper may therefore warn or block the first launch. Verify the DMG against the official `SHA256SUMS.txt`. This trust-status warning is separate from the CI package-integrity verification.

## Downloads

The landing page resolves the latest GitHub Release from this repository, validates repository-owned HTTPS URLs and maps packages by **platform + architecture + package type**.

Current public package families:

- `SONKUPIK-STUDIO-<version>-Setup.exe` — Windows x64 installer, recommended for everyday use;
- `SONKUPIK-STUDIO-<version>-Portable.exe` — Windows x64 portable build;
- `SONKUPIK-STUDIO-<version>-macOS-x64.dmg` — Intel Mac;
- `SONKUPIK-STUDIO-<version>-macOS-arm64.dmg` — Apple Silicon;
- `SONKUPIK-STUDIO-<version>-Linux-x64.AppImage` — Linux x64 portable package;
- `SONKUPIK-STUDIO-<version>-Linux-x64.deb` — Debian/Ubuntu x64 package;
- `SONKUPIK-STUDIO-<version>-Linux-arm64.AppImage` — Linux ARM64 portable package;
- `SONKUPIK-STUDIO-<version>-Linux-arm64.deb` — Debian/Ubuntu ARM64 package; and
- `SHA256SUMS.txt` — integrity manifest for all eight application packages.

Download only from this repository or the official website. Avoid mirrors and re-uploaded packages.

## Release workflows

Platform packaging remains separated so one operating system cannot block another:

- `.github/workflows/release-windows.yml` — Windows Setup + Portable;
- `.github/workflows/release-macos.yml` — native Intel and Apple Silicon DMGs;
- `.github/workflows/release-linux.yml` — native x64 and ARM64 AppImage + DEB packages;
- `.github/workflows/release-all-platforms.yml` — verifies accepted QA provenance, publishes all platform assets, regenerates the complete checksum manifest, updates release notes and refreshes GitHub Pages.

All release paths are anchored to the source version and exact source commit pinned by `.github/release-source.json`.

Each macOS/Linux build lane verifies:

1. pinned source repository, commit SHA, application version and release notes;
2. exact dependency installation with `npm ci`;
3. `node-hid` and `serialport` loading on the native runner;
4. built-in preset, preset-catalog, layout, UX, hardware-hardening, performance, desktop-server and Electron metadata regression checks;
5. production application and native package creation;
6. packaged executable architecture and packaged native `.node` modules; and
7. factory preset size and K500 checksum inside the packaged application.

Successful packages are first uploaded as GitHub Actions QA artifacts. The all-platform publication workflow verifies those artifact status files against the pinned source SHA before attaching the packages to the public release. It then regenerates one complete `SHA256SUMS.txt`, verifies every expected asset family, and requests a Pages refresh.

### Optional macOS signing/notarization

For trusted Developer ID distribution, configure these repository Actions secrets:

- `MAC_CSC_LINK`
- `MAC_CSC_KEY_PASSWORD`
- `MAC_APPLE_ID`
- `MAC_APPLE_APP_SPECIFIC_PASSWORD`
- `MAC_APPLE_TEAM_ID`

The normal macOS workflow keeps signing/notarization as a release trust gate. v0.8.44 was intentionally published as an **unsigned/unnotarized public preview** after its package and provenance checks passed; the release notes and landing page disclose that state.

## Release synchronization

Three layers keep public distribution consistent:

1. `.github/release-source.json` pins the source version and exact application commit.
2. The website reads GitHub's latest-release API, validates repository-owned asset URLs and maps architecture-specific links by package filename.
3. The Pages workflow writes a reviewed `release.json` snapshot whenever the site is deployed, providing an API-rate-limit/offline fallback without inventing packages.

A platform button only becomes a real download route when the matching official release asset exists. This prevents Intel/Apple Silicon or x64/ARM64 package mix-ups.

## Local validation

```bash
python tools/validate-site.py
```

## Product scope

Windows is the current stable public platform. macOS and Linux are public preview platforms whose packages passed automated native-build and packaged-payload verification. Hardware, firmware, USB HID/Bluetooth behavior, OS permissions and driver compatibility can vary by K500 revision and system configuration, so real-device validation on each target OS remains recommended before critical use.

Copyright (C) 2026 Tutorial Mas Ari / MasArray. Product names, website content and distributed binaries remain subject to their applicable rights and notices.
