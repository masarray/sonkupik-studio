# SONKUPIK STUDIO Deployment Setup

The repository files and workflows are already configured. Complete these two one-time GitHub settings before the first public release.

## 1. Enable GitHub Pages

In `masarray/sonkupik-studio`:

1. Open **Settings**.
2. Open **Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Open the **Actions** tab and run **Deploy product website** if the workflow did not start automatically.

Expected public URLs:

- `https://masarray.github.io/sonkupik-studio/`
- `https://masarray.github.io/sonkupik-studio/id/`

## 2. Add the restricted release token

Create a fine-grained personal access token with:

- Resource owner: `masarray`
- Repository access: **Only select repositories** → `sonkupik-studio`
- Repository permission: **Contents — Read and write**
- No access to unrelated repositories

In `masarray/ktv-studio-mixer-pro`:

1. Open **Settings** → **Secrets and variables** → **Actions**.
2. Create a repository secret named exactly:

   `SONKUPIK_STUDIO_RELEASE_TOKEN`

3. Paste the fine-grained token value.

Never commit the token to either repository, logs, documentation, issues or screenshots.

## 3. Publish the first separated release

In `masarray/ktv-studio-mixer-pro`:

1. Open **Actions**.
2. Select **Build Windows and publish distribution release**.
3. Choose **Run workflow**.
4. Enter the intended version, for example `v0.8.44` for the current package or the next approved version.

The workflow will:

1. build and validate the application from the source repository;
2. create Setup, Portable and `SHA256SUMS.txt`;
3. publish the release in `masarray/sonkupik-studio`;
4. include source commit and workflow provenance in the release notes; and
5. trigger the product website to refresh its reviewed latest-release snapshot.

## Release architecture

```text
masarray/ktv-studio-mixer-pro
  source code + Windows build workflow
                │
                │ restricted token
                ▼
masarray/sonkupik-studio
  GitHub Release assets + public bilingual website
                │
                ▼
https://masarray.github.io/sonkupik-studio/
```

The live website also queries the target repository's latest-release API in the browser. If that API is unavailable or rate-limited, it uses the reviewed `release.json` snapshot produced during the last Pages deployment.
