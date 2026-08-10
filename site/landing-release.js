const { RELEASE_REPOSITORY, RELEASE_API, RELEASE_PAGE, siteRoot, SNAPSHOT_URL, language, copy } = window.K500_CONFIG;
function isAllowedReleaseUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "github.com" &&
      url.pathname.startsWith(`/${RELEASE_REPOSITORY}/releases/`);
  } catch {
    return false;
  }
}

function normalizedRelease(payload) {
  if (!payload || typeof payload !== "object") return null;
  const releaseUrl = String(payload.html_url || payload.release_url || RELEASE_PAGE);
  if (!isAllowedReleaseUrl(releaseUrl)) return null;
  const assets = Array.isArray(payload.assets) ? payload.assets : [];
  const safeAssets = assets.map((asset) => ({
    name: String(asset?.name || ""),
    url: String(asset?.browser_download_url || asset?.url || ""),
    size: Number(asset?.size || 0),
  })).filter((asset) => asset.name && isAllowedReleaseUrl(asset.url));
  const find = (pattern) => safeAssets.find((asset) => pattern.test(asset.name));
  const setup = find(/^SONKUPIK-STUDIO-.*-Setup\.exe$/i);
  const portable = find(/^SONKUPIK-STUDIO-.*-Portable\.exe$/i);
  const checksums = find(/^SHA256SUMS\.txt$/i);

  // Never advertise an incomplete release. A release is downloadable only when
  // all three official distribution assets exist and belong to this repository.
  if (!setup || !portable || !checksums) return null;

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
  return `${(bytes / 1024 ** index).toFixed(index > 1 ? 1 : 0)} ${units[index]}`;
}

function humanDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-US", {
    day: "numeric", month: "short", year: "numeric",
  }).format(date);
}

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((node) => { node.textContent = value; });
}

function decorateWindowsDownloads() {
  const namespace = "http://www.w3.org/2000/svg";
  const pathData = "M1 2.75 10.2 1.5v9.3H1V2.75Zm10.2-1.4L23 0v10.8H11.2V1.35ZM1 12h9.2v9.3L1 20.05V12Zm10.2 0H23v10.8l-11.8-1.35V12Z";
  document.querySelectorAll('[data-download="setup"], [data-download="portable"]').forEach((link) => {
    if (link.querySelector('[data-platform-icon="windows"]')) return;
    const icon = document.createElementNS(namespace, "svg");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("aria-hidden", "true");
    icon.setAttribute("focusable", "false");
    icon.setAttribute("data-platform-icon", "windows");
    icon.style.cssText = "flex:0 0 1em;width:1em;height:1em;fill:currentColor";
    const path = document.createElementNS(namespace, "path");
    path.setAttribute("d", pathData);
    icon.append(path);
    link.prepend(icon);
  });
}

function bindDownload(kind, asset) {
  document.querySelectorAll(`[data-download="${kind}"]`).forEach((link) => {
    if (!asset) {
      link.href = RELEASE_PAGE;
      link.dataset.fallback = "true";
      link.setAttribute("aria-label", copy[language].openRelease);
      return;
    }
    link.href = asset.url;
    link.removeAttribute("data-fallback");
    link.setAttribute("aria-label", `${link.textContent.trim()} — ${asset.name}`);
  });
  if (asset) setText(`[data-${kind}-size]`, humanSize(asset.size));
}

function updateStructuredData(release) {
  const node = document.getElementById("software-structured-data");
  if (!node) return;
  try {
    const data = JSON.parse(node.textContent);
    const graph = Array.isArray(data?.["@graph"]) ? data["@graph"] : [];
    const app = graph.find((item) => item?.["@type"] === "SoftwareApplication");
    const page = graph.find((item) => item?.["@type"] === "WebPage");
    if (app) {
      app.softwareVersion = release.tag.replace(/^v/i, "");
      app.downloadUrl = release.setup?.url || release.releaseUrl;
      app.releaseNotes = release.releaseUrl;
    }
    if (page && release.publishedAt) page.dateModified = release.publishedAt.slice(0, 10);
    node.textContent = JSON.stringify(data);
  } catch {
    // Keep the reviewed static data if enrichment fails.
  }
}

function applyRelease(release, mode) {
  if (!release) return false;
  setText("[data-release-version]", release.tag);
  setText("[data-release-name]", release.name);
  setText("[data-release-status]", mode === "live" ? copy[language].ready : copy[language].fallback);
  const date = humanDate(release.publishedAt);
  if (date) setText("[data-release-date]", `${copy[language].published} ${date}`);
  document.querySelectorAll("[data-release-link]").forEach((link) => { link.href = release.releaseUrl; });
  bindDownload("setup", release.setup);
  bindDownload("portable", release.portable);
  bindDownload("checksums", release.checksums);
  document.querySelector(".status-dot")?.classList.add("ready");
  document.documentElement.dataset.releaseReady = mode;
  updateStructuredData(release);
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
  setText("[data-release-status]", copy[language].checking);
  try {
    const live = normalizedRelease(await fetchJson(RELEASE_API, true));
    if (applyRelease(live, "live")) return;
  } catch {}
  try {
    const snapshot = normalizedRelease(await fetchJson(SNAPSHOT_URL));
    if (applyRelease(snapshot, "snapshot")) return;
  } catch {}
  setText("[data-release-status]", copy[language].unavailable);
  document.querySelectorAll("[data-release-link], [data-download]").forEach((link) => {
    link.href = RELEASE_PAGE;
    link.dataset.fallback = "true";
  });
}

function closeMobileMenu(event) {
  const link = event.target.closest(".mobile-menu a");
  if (link) link.closest("details")?.removeAttribute("open");
}

let toastTimer;
function showToast(message) {
  const toast = document.querySelector("[data-copy-toast]");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2200);
}

async function copyCommand(event) {
  const button = event.target.closest("[data-copy]");
  if (!button) return;
  try {
    await navigator.clipboard.writeText(button.dataset.copy || "");
    showToast(copy[language].copied);
  } catch {
    showToast(copy[language].copyFailed);
  }
}

document.addEventListener("click", closeMobileMenu);
document.addEventListener("click", copyCommand);
decorateWindowsDownloads();
resolveRelease();
