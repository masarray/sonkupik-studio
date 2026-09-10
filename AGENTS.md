# AGENTS.md — SONKUPIK STUDIO Public Distribution Contract

These rules apply to every AI/code agent working in this repository. This repository is the public product, website, packaging-orchestration, and binary distribution surface for SONKUPIK STUDIO. The application source lives in `masarray/ktv-studio-mixer-pro`; this repository must preserve exact source provenance, package identity, release integrity, platform truthfulness, and safe public download routing.

## 1. Prime directive

Do not treat this repository as a generic website. A change can alter what users download or believe is officially supported.

Priority order:
1. exact source/release provenance;
2. binary/checksum/download integrity;
3. truthful platform/signing/hardware-validation status;
4. regression-safe release orchestration;
5. security/privacy;
6. usability and maintainability.

Never invent source SHAs, versions, release assets, architectures, checksums, signatures, hardware qualification, or platform support.

## 2. Mandatory workflow

For non-trivial changes:

RECONNAISSANCE -> BASELINE -> AUTHORITATIVE SOURCE -> ROOT CAUSE/REQUIREMENT -> IMPACT MAP -> IMPLEMENT -> REGRESSION VALIDATION -> PACKAGE/PROVENANCE CHECK -> PUBLIC ROUTE CHECK

Before editing, identify whether the authority is `.github/release-source.json`, the source repository commit, QA artifact status, GitHub Release assets, checksum manifest, or reviewed website metadata. Do not create a second source of truth.

If repeated patches fail, stop and reassess assumptions rather than stacking redirects, filename exceptions, release fallbacks, or workflow retries.

## 3. Source provenance is immutable evidence

Every public package must trace to the exact application repository, commit SHA, version, and accepted QA evidence expected by the release workflow.

Do not replace exact-SHA verification with branch names, latest-main assumptions, timestamps, filenames, or mutable tags.

A package built from a different commit must not be published under existing accepted provenance.

Changes to `.github/release-source.json` must be deliberate and reviewed as release-authority changes.

## 4. Platform/package identity

Keep platform + architecture + package-type mapping explicit and deterministic.

Never confuse:
- Windows Setup vs Portable;
- macOS x64 vs arm64;
- Linux x64 vs arm64;
- AppImage vs DEB;
- stable vs preview qualification;
- signed/notarized vs unsigned/unnotarized state.

A public download button must remain unavailable or explicitly unavailable when the exact matching official asset does not exist. Never silently route to a different architecture or package family.

## 5. Checksum and release integrity

`SHA256SUMS.txt` must represent the exact published bytes. Rebuilt binaries require recalculated checksums even if filenames are unchanged.

Do not publish partial or stale checksum manifests as complete. Do not weaken expected-asset checks to make a release workflow pass.

Release publication must fail closed when required provenance, artifact identity, architecture, package content, or checksum evidence is inconsistent.

## 6. QA artifact promotion

QA artifacts are candidates, not automatically public releases.

Promotion must verify the accepted status/evidence against the pinned source SHA and expected version before publication. Never infer acceptance merely because an artifact exists.

Do not bypass platform regression, native-module, packaged-preset, architecture, or source-provenance checks because another platform lane passed.

Keep platform build lanes isolated enough that one failing platform does not silently contaminate another platform's evidence.

## 7. Hardware qualification truthfulness

Automated package integrity is not equivalent to real K500 hardware qualification.

Do not describe macOS/Linux or any future platform as hardware-field-proven unless corresponding real-device evidence exists. Preserve explicit distinction between:
- source/build verification;
- packaged payload verification;
- native module load verification;
- real K500 communication validation;
- critical-event/field readiness.

Never convert an unverified limitation into a stronger marketing claim.

## 8. Signing/notarization truthfulness

Do not claim Developer ID signing, Apple notarization, Windows commercial signing, trusted publisher status, or equivalent unless the published artifact actually has it.

When unsigned/unnotarized packages are intentionally distributed, keep the public warning synchronized with actual release state.

Never expose signing credentials, certificates, private keys, passwords, tokens, or Apple credentials in source, logs, artifacts, issues, or Pages output.

## 9. Public release routing

Official download routing must remain constrained to repository-owned HTTPS release assets and reviewed fallback metadata.

Validate host, repository identity, filename pattern, platform, architecture, package type, and expected version before turning metadata into a user-facing download target.

The fallback `release.json` snapshot must never invent packages that were not present in the reviewed release state.

Do not add arbitrary mirrors or third-party binary hosts without explicit product approval and corresponding security/provenance design.

## 10. Failure handling

Expected validation/release failures must produce explicit machine-readable failure state and actionable diagnostics.

Examples:
- missing or malformed pinned source metadata;
- source SHA mismatch;
- missing QA status artifact;
- stale version;
- wrong architecture;
- native module mismatch;
- missing expected package;
- checksum mismatch;
- release API unavailable;
- invalid public asset URL.

Do not catch broad failures and continue publication as success. Distinguish `unverified` from `verified` and `unavailable` from `missing` where semantics matter.

## 11. Workflow safety

Release workflows are production code.

Rules:
- pin or deliberately version external actions/dependencies;
- use least-required permissions;
- do not print secrets;
- avoid executing untrusted artifact content during metadata validation;
- keep destructive/release mutation steps after validation gates;
- make reruns/idempotency behavior explicit;
- do not use arbitrary sleeps as race fixes;
- do not publish partial success under a complete-release label.

## 12. Website and metadata consistency

Website, README, release notes, platform tables, download labels, and release metadata must agree on version, package family, platform status, and trust/signing state.

When facts are intentionally duplicated for readability, extend validation to detect drift whenever practical.

Do not hand-edit generated snapshots as the primary fix when their generator or authoritative input is wrong.

## 13. Security and privacy

Never commit customer files, presets containing private customer data, activation information, device identifiers, private support records, secrets, signing material, or unpublished vulnerability details.

Treat remote API/release metadata as untrusted input. Validation tooling must verify expected structure and ownership before use.

## 14. Performance and accessibility

Keep Pages lightweight and functional on mobile/desktop. Avoid unnecessary heavy frameworks, blocking third-party scripts, oversized media, layout instability, or decorative effects that obscure download/trust information.

Preserve keyboard navigation, semantic structure, contrast, alt text, responsive layout, and reduced-motion behavior where applicable.

## 15. Regression prevention

Every public-release defect should add or extend deterministic validation when practical. Test the exact failure mode, especially:
- version/source SHA mismatch;
- architecture/package misrouting;
- incomplete checksum set;
- stale fallback metadata;
- wrong repository download URL;
- platform status drift;
- unsigned package incorrectly presented as signed;
- invalid/missing QA promotion evidence.

## 16. Definition of done

A task is not complete because a workflow parses or a page renders.

Validate as applicable:
- `python tools/validate-site.py`;
- workflow syntax/contracts;
- pinned source repository/SHA/version;
- expected package matrix;
- QA artifact provenance;
- architecture/native-module/package checks;
- checksum completeness;
- release asset mapping;
- Pages fallback metadata;
- public platform/signing status;
- mobile/desktop accessibility smoke check for presentation changes.

Never claim a validation that was not executed.

## 17. Completion report

Report: Changed; Root cause/requirement; Authoritative source used; Provenance/package invariants preserved; Regression protection; Exact validation executed; Any hardware/remote check not performed; Remaining genuine limitations.

## Final rule

Think like the maintainer of a multi-platform binary supply chain. The source SHA, package architecture, checksum, signing state, hardware qualification, and download route must remain truthful and mechanically consistent from build evidence to the user's click.