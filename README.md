# SONKUPIK STUDIO

[![Website](https://img.shields.io/badge/Product%20website-SONKUPIK%20STUDIO-55d8cf)](https://masarray.github.io/sonkupik-studio/)
[![Latest release](https://img.shields.io/github/v/release/masarray/sonkupik-studio?label=Latest%20release)](https://github.com/masarray/sonkupik-studio/releases/latest)
[![Platform](https://img.shields.io/badge/Platform-Windows%2010%2F11-7aa2ff)](#downloads)
[![Processor](https://img.shields.io/badge/Hardware-K500%20karaoke%20processor-d79dff)](#product-scope)

**SONKUPIK STUDIO** is a professional Windows control and preset-management application for compatible K500 karaoke processors. It brings live device control, PEQ, crossover, dynamics, mixer controls, device preset recall/save, PC preset libraries and mass upload into one focused engineering workspace.

**SONKUPIK STUDIO** adalah aplikasi Windows profesional untuk kontrol dan manajemen preset prosesor karaoke K500 yang kompatibel. Aplikasi ini menyatukan live device control, PEQ, crossover, dynamics, mixer, recall/save preset perangkat, library preset PC, dan mass upload dalam satu workspace engineering yang fokus.

## Official public surfaces

- [English product website](https://masarray.github.io/sonkupik-studio/)
- [Website Bahasa Indonesia](https://masarray.github.io/sonkupik-studio/id/)
- [Latest official release](https://github.com/masarray/sonkupik-studio/releases/latest)
- [Support guide](SUPPORT.md)
- [Security policy](SECURITY.md)

## Repository architecture

This repository is the **public product, website and binary distribution surface**. It intentionally contains:

- the bilingual GitHub Pages website;
- public release metadata and download routing;
- Windows Setup and Portable release assets;
- SHA-256 checksums;
- public support and security guidance; and
- automated validation and Pages deployment workflows.

The application source code remains in [`masarray/ktv-studio-mixer-pro`](https://github.com/masarray/ktv-studio-mixer-pro). Release builds are produced from that source repository and published here through a restricted cross-repository release token.

## Downloads

The landing page resolves the latest full GitHub Release from this repository and selects only official assets that match the supported distribution names:

- `SONKUPIK-STUDIO-<version>-Setup.exe` — recommended for fastest daily startup;
- `SONKUPIK-STUDIO-<version>-Portable.exe` — no installation, slower cold start; and
- `SHA256SUMS.txt` — file-integrity verification.

Download only from this repository or the official website. Avoid mirrors and re-uploaded packages.

## Release synchronization

Two layers keep the public website current:

1. The website reads GitHub's latest-release API at runtime, validates repository-owned HTTPS URLs and updates all release CTAs.
2. The Pages workflow writes a reviewed `release.json` snapshot whenever the site is deployed, including when a release is published or edited. This snapshot is the offline/API-rate-limit fallback.

## Local validation

```bash
python tools/validate-site.py
```

## Product scope

SONKUPIK STUDIO is intended for compatible K500-family karaoke processors and supported Windows workflows. Hardware, firmware, USB HID/Bluetooth behavior and driver compatibility can vary by device revision and system configuration. Validate the current release with the actual target device before a critical event or permanent installation.

Copyright (C) 2026 Tutorial Mas Ari / MasArray. Product names, website content and distributed binaries remain subject to their applicable rights and notices.
