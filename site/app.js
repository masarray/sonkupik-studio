const RELEASE_REPOSITORY = "masarray/sonkupik-studio";
const RELEASE_API = `https://api.github.com/repos/${RELEASE_REPOSITORY}/releases/latest`;
const RELEASE_PAGE = `https://github.com/${RELEASE_REPOSITORY}/releases/latest`;
const SNAPSHOT_URL = new URL("release.json", document.baseURI).href;

const state = {
  language: document.documentElement.lang === "id" ? "id" : "en",
};

const copy = {
  en: {
    checking: "Checking the official distribution…",
    ready: "Official release verified",
    fallback: "Using reviewed release information",
    unavailable: "Open the official release page",
    published: "Published",
  },
  id: {
    checking: "Memeriksa distribusi resmi…",
    ready: "Rilis resmi terverifikasi",
    fallback: "Menggunakan informasi rilis yang telah direview",
    unavailable: "Buka halaman rilis resmi",
    published: "Terbit",
  },
};

function isAllowedReleaseUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    if (url.hostname !== "github.com") return false;
    return url.pathname.startsWith(`/${RELEASE_REPOSITORY}/releases/`);
  } catch {
    return false;
  }
}

function normalizedRelease(payload) {
  if (!payload || typeof payload !== "object") return null;

  const releaseUrl = payload.html_url || payload.release_url || RELEASE_PAGE;
  if (!isAllowedReleaseUrl(releaseUrl)) return null;

  const assets = Array.isArray(payload.assets) ? payload.assets : [];
  const safeAssets = assets
    .map((asset) => ({
      name: String(asset?.name || ""),
      url: String(asset?.browser_download_url || asset?.url || ""),
      size: Number(asset?.size || 0),
    }))
    .filter((asset) => asset.name && isAllowedReleaseUrl(asset.url));

  const find = (pattern) => safeAssets.find((asset) => pattern.test(asset.name));
  const setup = find(/^SONKUPIK-STUDIO-.*-Setup\.exe$/i);
  const portable = find(/^SONKUPIK-STUDIO-.*-Portable\.exe$/i);
  const checksums = find(/^SHA256SUMS\.txt$/i);

  return {
    tag: String(payload.tag_name || payload.version || "Latest"),
    name: String(payload.name || payload.tag_name || "SONKUPIK STUDIO"),
    releaseUrl,
    publishedAt: payload.published_at || payload.publishedAt || "",
    setup,
    portable,
    checksums,
  };
}

function humanSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;
  return `${value.toFixed(index > 1 ? 1 : 0)} ${units[index]}`;
}

function humanDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(state.language === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((node) => {
    node.textContent = value;
  });
}

function bindDownload(kind, asset) {
  document.querySelectorAll(`[data-download="${kind}"]`).forEach((link) => {
    if (!asset) {
      link.href = RELEASE_PAGE;
      link.dataset.fallback = "true";
      return;
    }
    link.href = asset.url;
    link.removeAttribute("data-fallback");
    const size = humanSize(asset.size);
    if (size) link.setAttribute("data-size", size);
  });
  if (asset) setText(`[data-${kind}-size]`, humanSize(asset.size));
}

function applyRelease(release, mode) {
  if (!release) return false;

  setText("[data-release-version]", release.tag);
  setText("[data-release-name]", release.name);
  setText("[data-release-status]", mode === "live" ? copy[state.language].ready : copy[state.language].fallback);

  const date = humanDate(release.publishedAt);
  if (date) setText("[data-release-date]", `${copy[state.language].published} ${date}`);

  document.querySelectorAll("[data-release-link]").forEach((link) => {
    link.href = release.releaseUrl;
  });

  bindDownload("setup", release.setup);
  bindDownload("portable", release.portable);
  bindDownload("checksums", release.checksums);

  const dot = document.querySelector(".status-dot");
  if (dot) dot.classList.add("ready");

  const structuredData = document.getElementById("software-structured-data");
  if (structuredData) {
    try {
      const data = JSON.parse(structuredData.textContent);
      const app = data?.["@graph"]?.find((item) => item?.["@type"] === "SoftwareApplication");
      if (app) {
        app.softwareVersion = release.tag.replace(/^v/i, "");
        app.downloadUrl = release.setup?.url || release.releaseUrl;
        app.releaseNotes = release.releaseUrl;
        structuredData.textContent = JSON.stringify(data);
      }
    } catch {
      // Keep the reviewed static structured data when dynamic enrichment fails.
    }
  }

  return true;
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function resolveRelease() {
  setText("[data-release-status]", copy[state.language].checking);

  try {
    const live = normalizedRelease(await fetchJson(RELEASE_API));
    if (applyRelease(live, "live")) return;
  } catch {
    // Continue to the reviewed snapshot.
  }

  try {
    const snapshot = normalizedRelease(await fetchJson(SNAPSHOT_URL));
    if (applyRelease(snapshot, "snapshot")) return;
  } catch {
    // Continue to the permanent release-page fallback.
  }

  setText("[data-release-status]", copy[state.language].unavailable);
  document.querySelectorAll("[data-release-link], [data-download]").forEach((link) => {
    link.href = RELEASE_PAGE;
  });
}

resolveRelease();
