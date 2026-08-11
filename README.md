# SONKUPIK STUDIO

[![Website](https://img.shields.io/badge/Product%20website-SONKUPIK%20STUDIO-55d8cf)](https://masarray.github.io/sonkupik-studio/)
[![Latest release](https://img.shields.io/github/v/release/masarray/sonkupik-studio?label=Latest%20release)](https://github.com/masarray/sonkupik-studio/releases/latest)
[![Stable platform](https://img.shields.io/badge/Stable-Windows%2010%2F11-7aa2ff)](#downloads)
[![CI targets](https://img.shields.io/badge/CI-Windows%20%7C%20macOS%20%7C%20Linux-55d8cf)](#cross-platform-release-pipeline)
[![Processor](https://img.shields.io/badge/Hardware-K500%20karaoke%20processor-d79dff)](#product-scope)

**SONKUPIK STUDIO** is a desktop control and preset-management application for compatible K500 karaoke processors. It brings live device control, PEQ, crossover, dynamics, mixer controls, device preset recall/save, PC preset libraries and mass upload into one focused workspace.

**SONKUPIK STUDIO** adalah aplikasi desktop untuk kontrol dan manajemen preset prosesor karaoke K500 yang kompatibel. Aplikasi ini menyatukan live device control, PEQ, crossover, dynamics, mixer, recall/save preset perangkat, library preset PC, dan mass upload dalam satu workspace yang fokus.

## Official public surfaces

- [English product website](https://masarray.github.io/sonkupik-studio/)
- [Website Bahasa Indonesia](https://masarray.github.io/sonkupik-studio/id/)
- [Latest official release](https://github.com/masarray/sonkupik-studio/releases/latest)
- [Support guide](SUPPORT.md)
- [Security policy](SECURITY.md)

## Repository architecture

This repository is the **public product, website and binary distribution surface**. It contains:

- the bilingual GitHub Pages website;
- public release metadata and direct-download routing;
- Windows Setup and Portable release assets;
- gated macOS and Linux packaging workflows;
- SHA-256 checksums;
- public support and security guidance; and
- automated validation and Pages deployment workflows.

The application source code remains in [`masarray/ktv-studio-mixer-pro`](https://github.com/masarray/ktv-studio-mixer-pro). Release workflows in this repository check out the exact commit pinned by `.github/release-source.json`; public binaries are built and attached from this distribution repository itself.

## Downloads

The landing page resolves the latest full GitHub Release from this repository and only accepts repository-owned release assets with approved names.

Current stable Windows distribution:

- `SONKUPIK-STUDIO-<version>-Setup.exe` — recommended for fastest daily startup;
- `SONKUPIK-STUDIO-<version>-Portable.exe` — no installation, slower cold start; and
- `SHA256SUMS.txt` — file-integrity verification.

Cross-platform build names are reserved as:

- `SONKUPIK-STUDIO-<version>-macOS-x64.dmg` — Intel Mac;
- `SONKUPIK-STUDIO-<version>-macOS-arm64.dmg` — Apple Silicon;
- `SONKUPIK-STUDIO-<version>-Linux-x64.AppImage` and `.deb`;
- `SONKUPIK-STUDIO-<version>-Linux-arm64.AppImage` and `.deb`.

Download only from this repository or the official website. Avoid mirrors and re-uploaded packages.

## Cross-platform release pipeline

`.github/workflows/release-cross-platform.yml` builds from the same pinned source commit used by the Windows release workflow.

The pipeline deliberately builds each architecture on native GitHub-hosted hardware:

1. macOS Intel (`x64`) runs on an Intel macOS runner.
2. macOS Apple Silicon (`arm64`) runs on an Apple Silicon runner.
3. Linux x64 runs on Ubuntu x64 and Linux ARM64 runs on Ubuntu ARM64.
4. Every lane verifies `node-hid` and `serialport` on the runner, then executes the existing preset, layout, UX, performance, desktop-server and Electron metadata regression gates.
5. macOS outputs DMG packages. Linux outputs AppImage + DEB packages.
6. Packaged executable architecture, native modules, factory preset size and factory preset checksum are verified before an artifact is accepted.
7. Successful builds are always uploaded as GitHub Actions QA artifacts.
8. Public release attachment is manual and opt-in per operating system/architecture.
9. macOS publication is blocked by default unless Developer ID signing and notarization are verified; an unnotarized package requires an explicit override.
10. Public publication regenerates the complete `SHA256SUMS.txt` and requests a GitHub Pages refresh.

### Optional macOS signing secrets

For trusted direct-download macOS distribution, configure these repository Actions secrets:

- `MAC_CSC_LINK`
- `MAC_CSC_KEY_PASSWORD`
- `MAC_APPLE_ID`
- `MAC_APPLE_APP_SPECIFIC_PASSWORD`
- `MAC_APPLE_TEAM_ID`

The workflow can produce unsigned DMGs for QA when signing secrets are absent, but it will not silently present those packages as trusted public Mac builds.

## Release synchronization

Two layers keep the public website current:

1. The website reads GitHub's latest-release API at runtime, validates repository-owned HTTPS URLs and updates release CTAs.
2. The Pages workflow writes a reviewed `release.json` snapshot whenever the site is deployed. This snapshot is the offline/API-rate-limit fallback.

## Local validation

```bash
python tools/validate-site.py
```

## Product scope

Windows is the currently verified stable public platform. macOS and Linux packages must pass the cross-platform workflow and should be validated with real K500 hardware on the target operating system before being presented as fully supported for critical events or permanent installations. Hardware, firmware, USB HID/Bluetooth behavior, OS permissions and driver compatibility can vary by device revision and system configuration.

Copyright (C) 2026 Tutorial Mas Ari / MasArray. Product names, website content and distributed binaries remain subject to their applicable rights and notices.
