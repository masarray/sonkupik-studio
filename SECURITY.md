# Security Policy

## Supported releases

Security fixes are applied to the latest published SONKUPIK STUDIO release. Older packages may not receive separate fixes.

## Reporting a vulnerability

Do not disclose an unpatched vulnerability through a public GitHub Issue, Discussion, comment, screenshot or video.

Use GitHub's private vulnerability reporting for this repository when available:

`https://github.com/masarray/sonkupik-studio/security/advisories/new`

Include:

- affected SONKUPIK STUDIO version and package type;
- Windows version and connection method;
- concise impact statement;
- exact reproduction steps;
- proof of concept with destructive behavior removed;
- whether device control, preset files, release downloads or local data are affected; and
- practical mitigation ideas, when known.

Do not include real customer data, credentials, private preset libraries, unique device identifiers or harmful payloads that are not necessary to understand the issue.

## Distribution integrity

Official Windows packages are published only through this repository's GitHub Releases and the product website routes downloads back to those release assets. Verify the exact filename against `SHA256SUMS.txt` from the same release.

A matching SHA-256 verifies file identity against the published checksum. It does not replace Windows security, antivirus, endpoint protection, backups, device isolation or operational review.

## Scope

Security reports may cover:

- release or download integrity;
- unsafe handling of preset or configuration files;
- unintended local data exposure;
- device communication behavior that can create a security impact;
- website download-routing weaknesses; and
- dependency or packaging issues affecting the distributed application.

General compatibility problems, tuning questions and non-security bugs belong in normal support after private information is removed.

---

# Kebijakan Keamanan

Perbaikan keamanan diterapkan pada rilis SONKUPIK STUDIO terbaru. Jangan membuka detail kerentanan yang belum diperbaiki melalui Issue, Discussion, komentar, screenshot atau video publik.

Gunakan private vulnerability reporting GitHub pada repository ini. Sertakan versi aplikasi, jenis package, versi Windows, metode koneksi, dampak, langkah reproduksi dan bukti secukupnya tanpa data customer, credential, preset privat, identitas perangkat unik atau payload berbahaya yang tidak diperlukan.

Package Windows resmi hanya diterbitkan melalui GitHub Releases repository ini. Verifikasi nama file yang persis memakai `SHA256SUMS.txt` dari rilis yang sama. Kecocokan SHA-256 memverifikasi identitas file terhadap checksum publik, tetapi tidak menggantikan proteksi keamanan Windows, antivirus, backup, isolasi perangkat dan review operasional.
