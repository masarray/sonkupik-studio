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

The application source code remains in [`masarray/ktv-studio-mixer-pro`](https://github.com/masarray/ktv-studio-mixer-pro). Release workflows in this repository check out the exact commit pinned by `.github/release-source.json`; no cross-repository publish token is required because public binaries are built and attached from this distribution repository itself.

## Downloads

The landing page resolves the latest full GitHub Release from this repository and only accepts repository-owned release assets with approved names.

Current Windows distribution:

- `SONKUPIK-STUDIO-<version>-Setup.exe` — recommended for fastest daily startup;
- `SONKUPIK-STUDIO-<version>-Portable.exe` — no installation, slower cold start; and
- `SHA256SUMS.txt` — file-integrity verification.

Cross-platform build names are reserved as:

- `SONKUPIK-STUDIO-<version>-macOS-universal.dmg`;
- `SONKUPIK-STUDIO-<version>-Linux-x64.AppImage`;
- `SONKUPIK-STUDIO-<version>-Linux-x64.deb`;
- optional Linux ARM64 AppImage and DEB packages.

Download only from this repository or the official website. Avoid mirrors and re-uploaded packages.

## Cross-platform release pipeline

`.github/workflows/release-macos-linux.yml` builds from the same pinned source commit used by the Windows release workflow.

The pipeline intentionally separates **build verification** from **public publication**:

1. macOS builds a universal DMG and verifies both Intel (`x86_64`) and Apple Silicon (`arm64`) executable/native-module coverage.
2. Linux builds natively on x64 and ARM64 GitHub-hosted runners and produces AppImage + DEB packages.
3. Every lane runs the existing preset, layout, UX, performance, desktop-server and Electron metadata regression gates before packaging.
4. Factory preset size/checksum and packaged `node-hid` / `serialport` native modules are verified inside the produced application.
5. Workflow artifacts are always available for QA after a successful build.
6. Linux publication is an explicit `workflow_dispatch` choice.
7. macOS publication is blocked by default unless Developer ID signing and notarization are verified. An unnotarized package can only be published through the explicit override input.
8. When selected packages are attached to the release, the workflow regenerates `SHA256SUMS.txt` across the complete release asset set and triggers a Pages refresh so the landing-page OS buttons can see the new packages.

### Optional macOS signing secrets

For trusted direct-download macOS distribution, configure these repository Actions secrets:

- `MAC_CSC_LINK`
- `MAC_CSC_KEY_PASSWORD`
- `MAC_APPLE_ID`
- `MAC_APP_SPECIFIC_PASSWORD`
- `MAC_APPLE_TEAM_ID`

The workflow can still produce an unsigned DMG for internal QA when these secrets are absent, but it will not silently publish that package as a trusted public Mac release.

## Release synchronization

Two layers keep the public website current:

1. The website reads GitHub's latest-release API at runtime, validates repository-owned HTTPS URLs and updates all release CTAs.
2. The Pages workflow writes a reviewed `release.json` snapshot whenever the site is deployed. This snapshot is the offline/API-rate-limit fallback.

## Local validation

```bash
python tools/validate-site.py
```

## Product scope

Windows is the currently verified stable public platform. macOS and Linux packages must pass the cross-platform workflow and should be validated with real K500 hardware on the target operating system before being presented as fully supported for critical events or permanent installations. Hardware, firmware, USB HID/Bluetooth behavior, OS permissions and driver compatibility can vary by device revision and system configuration.

Copyright (C) 2026 Tutorial Mas Ari / MasArray. Product names, website content and distributed binaries remain subject to their applicable rights and notices.
