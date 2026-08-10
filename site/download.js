(() => {
  const REPOSITORY = "masarray/sonkupik-studio";
  const RELEASE_API = `https://api.github.com/repos/${REPOSITORY}/releases/latest`;
  const RELEASE_PAGE = `https://github.com/${REPOSITORY}/releases/latest`;
  const root = document.documentElement.dataset.siteRoot || "./";
  const SNAPSHOT_URL = new URL(`${root}release.json`, window.location.href).href;
  const language = document.documentElement.lang === "en" ? "en" : "id";

  const copy = {
    id: {
      checking: "Memeriksa rilis resmi…",
      ready: "Rilis resmi siap diunduh",
      snapshot: "Rilis resmi siap diunduh",
      unavailable: "Rilis tidak dapat diperiksa saat ini",
      download: "Download langsung",
      soon: "Belum tersedia",
      published: "Dirilis",
      setup: "Download Windows Setup",
      portable: "Download Portable .exe",
      mac: "Download untuk macOS",
      linux: "Download untuk Linux"
    },
    en: {
      checking: "Checking official release…",
      ready: "Official release ready to download",
      snapshot: "Official release ready to download",
      unavailable: "Release status is temporarily unavailable",
      download: "Direct download",
      soon: "Not available yet",
      published: "Released",
      setup: "Download Windows Setup",
      portable: "Download Portable .exe",
      mac: "Download for macOS",
      linux: "Download for Linux"
    }
  }[language];

  function isAllowedReleaseUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" && url.hostname === "github.com" &&
        url.pathname.startsWith(`/${REPOSITORY}/releases/`);
    } catch {
      return false;
    }
  }

  function safeAssets(payload) {
    return (Array.isArray(payload?.assets) ? payload.assets : [])
      .map((asset) => ({
        name: String(asset?.name || ""),
        url: String(asset?.browser_download_url || asset?.url || ""),
        size: Number(asset?.size || 0)
      }))
      .filter((asset) => asset.name && isAllowedReleaseUrl(asset.url));
  }

  function firstMatch(assets, patterns) {
    for (const pattern of patterns) {
      const asset = assets.find((item) => pattern.test(item.name));
      if (asset) return asset;
    }
    return null;
  }

  function normalizeRelease(payload) {
    if (!payload || typeof payload !== "object") return null;
    const releaseUrl = String(payload.html_url || payload.release_url || RELEASE_PAGE);
    if (!isAllowedReleaseUrl(releaseUrl)) return null;
    const assets = safeAssets(payload);
    const setup = firstMatch(assets, [/^SONKUPIK-STUDIO-.*-Setup\.exe$/i]);
    const portable = firstMatch(assets, [/^SONKUPIK-STUDIO-.*-Portable\.exe$/i]);
    const macos = firstMatch(assets, [/^SONKUPIK-STUDIO-.*\.dmg$/i, /^SONKUPIK-STUDIO-.*\.pkg$/i]);
    const linux = firstMatch(assets, [/^SONKUPIK-STUDIO-.*\.AppImage$/i, /^SONKUPIK-STUDIO-.*\.deb$/i, /^SONKUPIK-STUDIO-.*\.rpm$/i]);
    const checksums = firstMatch(assets, [/^SHA256SUMS\.txt$/i]);
    if (!setup || !portable || !checksums) return null;
    return {
      tag: String(payload.tag_name || payload.version || "Latest"),
      name: String(payload.name || payload.tag_name || "SONKUPIK STUDIO"),
      releaseUrl,
      publishedAt: String(payload.published_at || payload.publishedAt || ""),
      setup, portable, macos, linux, checksums
    };
  }

  function humanSize(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return "";
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(mb >= 100 ? 0 : 1)} MB`;
  }

  function humanDate(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-US", {
      day: "numeric", month: "short", year: "numeric"
    }).format(date);
  }

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((node) => { node.textContent = value; });
  }

  function bindDirect(selector, asset, fallbackLabel) {
    document.querySelectorAll(selector).forEach((link) => {
      if (!asset) return;
      link.href = asset.url;
      link.removeAttribute("aria-disabled");
      link.classList.remove("is-unavailable");
      link.classList.add("is-available");
      if (fallbackLabel) link.setAttribute("aria-label", `${fallbackLabel} — ${asset.name}`);
    });
  }

  function bindPlatform(selector, asset, label) {
    document.querySelectorAll(selector).forEach((link) => {
      const status = link.querySelector("[data-platform-status]");
      if (!asset) {
        link.removeAttribute("href");
        link.setAttribute("aria-disabled", "true");
        link.classList.add("is-unavailable");
        if (status) status.textContent = copy.soon;
        return;
      }
      link.href = asset.url;
      link.removeAttribute("aria-disabled");
      link.classList.remove("is-unavailable");
      link.classList.add("is-available");
      link.setAttribute("aria-label", `${label} — ${asset.name}`);
      if (status) status.textContent = `${copy.download}${humanSize(asset.size) ? ` · ${humanSize(asset.size)}` : ""}`;
    });
  }

  function applyRelease(release, mode) {
    if (!release) return false;
    document.documentElement.dataset.releaseReady = "true";
    setText("[data-release-version]", release.tag);
    setText("[data-release-status]", mode === "live" ? copy.ready : copy.snapshot);
    const date = humanDate(release.publishedAt);
    if (date) setText("[data-release-date]", `${copy.published} ${date}`);
    setText("[data-setup-size]", humanSize(release.setup.size));
    setText("[data-portable-size]", humanSize(release.portable.size));

    bindDirect('[data-download="setup"]', release.setup, copy.setup);
    bindDirect('[data-download="portable"]', release.portable, copy.portable);
    bindDirect('[data-download="checksums"]', release.checksums, "SHA256SUMS.txt");
    bindPlatform('[data-platform-download="windows"]', release.setup, copy.setup);
    bindPlatform('[data-platform-download="macos"]', release.macos, copy.mac);
    bindPlatform('[data-platform-download="linux"]', release.linux, copy.linux);

    document.querySelectorAll("[data-release-link]").forEach((link) => { link.href = release.releaseUrl; });
    return true;
  }

  async function fetchJson(url, githubApi = false) {
    const options = { cache: "no-store", headers: { Accept: "application/json" } };
    if (githubApi) {
      options.headers.Accept = "application/vnd.github+json";
      options.headers["X-GitHub-Api-Version"] = "2022-11-28";
    }
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  async function resolveRelease() {
    setText("[data-release-status]", copy.checking);
    try {
      if (applyRelease(normalizeRelease(await fetchJson(RELEASE_API, true)), "live")) return;
    } catch {}
    try {
      if (applyRelease(normalizeRelease(await fetchJson(SNAPSHOT_URL)), "snapshot")) return;
    } catch {}
    setText("[data-release-status]", copy.unavailable);
  }

  document.querySelectorAll('[aria-disabled="true"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      if (link.getAttribute("aria-disabled") === "true") event.preventDefault();
    });
  });

  resolveRelease();
})();