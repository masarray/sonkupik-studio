# SONKUPIK STUDIO

[![Website](https://img.shields.io/badge/Product%20website-SONKUPIK%20STUDIO-55d8cf)](https://masarray.github.io/sonkupik-studio/)
[![Latest release](https://img.shields.io/github/v/release/masarray/sonkupik-studio?label=Latest%20release)](https://github.com/masarray/sonkupik-studio/releases/latest)
[![Stable platform](https://img.shields.io/badge/Stable-Windows%2010%2F11-7aa2ff)](#downloads)
[![CI targets](https://img.shields.io/badge/CI-Windows%20%7C%20macOS%20%7C%20Linux-55d8cf)](#platform-status)
[![Processor](https://img.shields.io/badge/Hardware-K500%20karaoke%20processor-d79dff)](#product-scope)

**SONKUPIK STUDIO** is a desktop control and preset-management application for compatible K500 karaoke processors. It brings live device control, PEQ, crossover, dynamics, mixer controls, device preset recall/save, PC preset libraries and mass upload into one focused workspace.

**SONKUPIK STUDIO** adalah aplikasi desktop untuk kontrol dan manajemen preset prosesor karaoke K500 yang kompatibel. Aplikasi ini menyatukan live device control, PEQ, crossover, dynamics, mixer, recall/save preset perangkat, library preset PC, dan mass upload dalam satu workspace yang fokus.

## Official public surfaces

- [English product website](https://masarray.github.io/sonkupik-studio/en/)
- [Website Bahasa Indonesia](https://masarray.github.io/sonkupik-studio/)
- [Latest official release](https://github.com/masarray/sonkupik-studio/releases/latest)
- [Support guide](SUPPORT.md)
- [Security policy](SECURITY.md)

## Repository architecture

This repository is the **public product, website and binary distribution surface**. It contains:

- the bilingual GitHub Pages website;
- public release metadata and direct-download routing;
- Windows Setup and Portable release assets;
- independent gated macOS and Linux packaging workflows;
- architecture-aware download selection for future macOS/Linux public assets;
- SHA-256 checksums;
- public support and security guidance; and
- automated validation and Pages deployment workflows.

The application source code remains in [`masarray/ktv-studio-mixer-pro`](https://github.com/masarray/ktv-studio-mixer-pro). Release workflows in this repository check out the exact commit pinned by `.github/release-source.json`; public binaries are built and attached from this distribution repository itself.

## Platform status

| Platform | Architecture | Package | Current status |
| --- | --- | --- | --- |
| Windows 10/11 | x64 | Setup + Portable | **Stable public release** |
| macOS | Apple Silicon / ARM64 | DMG | **CI build + packaged payload verified; public release gated** |
| macOS | Intel / x64 | DMG | **CI build + packaged payload verified; public release gated** |
| Linux | x64 | AppImage + DEB | **CI build + packaged payload verified; public release gated** |
| Linux | ARM64 | AppImage + DEB | **CI build + packaged payload verified; public release gated** |

macOS and Linux are no longer merely planned targets: their native CI lanes successfully build and verify the current pinned application. They are intentionally **not presented as stable public downloads yet**. Real K500 hardware validation on each target OS remains part of the public-release gate, and macOS additionally has a Developer ID signing/notarization trust gate.

The landing page follows the same status model. Before cross-platform assets are attached to the latest official GitHub Release, it shows them as **CI verified / public release pending**. Once published, architecture-specific links become available so users do not accidentally download an Intel build for Apple Silicon or an x64 Linux build for ARM64.

## Downloads

The landing page resolves the latest full GitHub Release from this repository and only accepts repository-owned release assets with approved names.

Current stable Windows distribution:

- `SONKUPIK-STUDIO-<version>-Setup.exe` — recommended for fastest daily startup;
- `SONKUPIK-STUDIO-<version>-Portable.exe` — no installation, slower cold start; and
- `SHA256SUMS.txt` — file-integrity verification.

Reserved cross-platform public asset names:

- `SONKUPIK-STUDIO-<version>-macOS-x64.dmg` — Intel Mac;
- `SONKUPIK-STUDIO-<version>-macOS-arm64.dmg` — Apple Silicon;
- `SONKUPIK-STUDIO-<version>-Linux-x64.AppImage` and `.deb`;
- `SONKUPIK-STUDIO-<version>-Linux-arm64.AppImage` and `.deb`.

Download only from this repository or the official website. Avoid mirrors and re-uploaded packages.

## Release workflows

Platform packaging is deliberately separated into three independent workflows:

- `.github/workflows/release-windows.yml` — Windows Setup + Portable;
- `.github/workflows/release-macos.yml` — native Intel and Apple Silicon DMGs;
- `.github/workflows/release-linux.yml` — native x64 and ARM64 AppImage + DEB packages.

All three workflows build from the same source commit pinned by `.github/release-source.json`. The macOS and Linux workflows deliberately build each architecture on native GitHub-hosted hardware.

Each macOS/Linux lane performs the following release gates before its artifact is accepted:

1. Validate the pinned source repository, commit SHA, application version and release notes.
2. Install the exact lockfile dependency graph with `npm ci`.
3. Load `node-hid` and `serialport` on the native runner.
4. Execute built-in preset, preset-catalog, layout, UX, hardware-hardening, performance, desktop-server and Electron metadata regression checks.
5. Build the production application and native package format.
6. Verify packaged executable architecture and packaged native `.node` modules.
7. Verify the factory preset size and K500 checksum inside the packaged application.
8. Upload successful builds as GitHub Actions QA artifacts.

Public release attachment is **manual and opt-in per operating system/architecture**. QA builds therefore never silently become public downloads. When selected assets are published, the workflow regenerates the complete `SHA256SUMS.txt` and requests a GitHub Pages refresh.

### macOS trust gate

For trusted direct-download macOS distribution, configure these repository Actions secrets:

- `MAC_CSC_LINK`
- `MAC_CSC_KEY_PASSWORD`
- `MAC_APPLE_ID`
- `MAC_APPLE_APP_SPECIFIC_PASSWORD`
- `MAC_APPLE_TEAM_ID`

The macOS workflow can produce unsigned DMGs for QA when signing secrets are absent, but normal publication is blocked unless Developer ID signing and notarization are verified. An unnotarized build can only be published through an explicit manual override.

## Release synchronization

Three layers keep public distribution consistent:

1. `.github/release-source.json` pins the source version and exact application commit used by every platform workflow.
2. The website reads GitHub's latest-release API at runtime, validates repository-owned HTTPS asset URLs and maps assets by **platform + architecture + package type**.
3. The Pages workflow writes a reviewed `release.json` snapshot whenever the site is deployed, providing an offline/API-rate-limit fallback without inventing unavailable packages.

This means CI availability and public availability remain intentionally separate: a successful QA artifact does not become a landing-page download until it is attached to the official release.

## Local validation

```bash
python tools/validate-site.py
```

## Product scope

Windows is the currently verified stable public platform. macOS and Linux packages have passed automated native-build and packaged-payload verification, but should also be validated with real K500 hardware on the target operating system before being presented as fully supported for critical events or permanent installations. Hardware, firmware, USB HID/Bluetooth behavior, OS permissions and driver compatibility can vary by device revision and system configuration.

Copyright (C) 2026 Tutorial Mas Ari / MasArray. Product names, website content and distributed binaries remain subject to their applicable rights and notices.
