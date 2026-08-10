(() => {
  const REPOSITORY = "masarray/sonkupik-studio";
  const RELEASE_API = `https://api.github.com/repos/${REPOSITORY}/releases/latest`;
  const RELEASE_PAGE = `https://github.com/${REPOSITORY}/releases/latest`;
  const STORE_URL = "https://www.tokopedia.com/dr-sonkupik/recording-tech-ktv-pro-k500-karaoke-effect-processor-4-input-6-output-digital-mixer-dengan-equalizer-compressor-anti-feedback-crossover-ktv-pro-k500";
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
      linux: "Download untuk Linux",
      hardwareKicker: "BELUM PUNYA K500?",
      hardwareText: "SONKUPIK STUDIO adalah software kontrol untuk KTV PRO K500. Untuk live control, Anda memerlukan unit K500 yang kompatibel.",
      buy: "Beli KTV PRO K500",
      store: "Tokopedia · Dr Sonkupik",
      deviceText: "Anda dapat mengunduh software sekarang. Untuk live control, diperlukan KTV PRO K500 yang kompatibel. Jika belum punya, perangkat dapat dibeli langsung melalui toko Dr Sonkupik di Tokopedia."
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
      linux: "Download for Linux",
      hardwareKicker: "NEED A K500?",
      hardwareText: "SONKUPIK STUDIO is control software for KTV PRO K500. Live device control requires a compatible K500 unit.",
      buy: "Buy KTV PRO K500",
      store: "Tokopedia · Dr Sonkupik",
      deviceText: "You can download the software now. Live device control requires a compatible KTV PRO K500. If you do not have one yet, you can buy the hardware directly from Dr Sonkupik on Tokopedia."
    }
  }[language];

  const bagIcon = `
    <svg class="lucide-store-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
      <path d="M3 6h18"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>`;

  function mountStoreJourney() {
    if (document.querySelector("[data-k500-store]")) return;

    const style = document.createElement("style");
    style.dataset.storeStyles = "true";
    style.textContent = `
      .hardware-bridge{margin-top:24px;max-width:590px;display:flex;align-items:center;justify-content:space-between;gap:18px;padding:14px 15px;border:1px solid rgba(105,223,209,.16);border-radius:14px;background:linear-gradient(135deg,rgba(105,223,209,.045),rgba(129,168,255,.025));box-shadow:inset 0 1px rgba(255,255,255,.025)}
      .hardware-bridge-copy{min-width:0}.hardware-bridge-kicker{display:block;margin-bottom:4px;color:#80d9cf;font-size:.61rem;font-weight:760;letter-spacing:.105em}.hardware-bridge p{margin:0;color:#92a5b2;font-size:.73rem;line-height:1.5}
      .store-button{flex:0 0 auto;min-height:43px;display:inline-flex;align-items:center;gap:9px;padding:8px 13px;border:1px solid rgba(105,223,209,.28);border-radius:10px;background:rgba(105,223,209,.065);color:#dffaf6;text-decoration:none;box-shadow:0 9px 22px rgba(0,0,0,.16);transition:transform .16s ease,border-color .16s ease,background .16s ease,box-shadow .16s ease}
      .store-button:hover{transform:translateY(-1px);border-color:rgba(105,223,209,.52);background:rgba(105,223,209,.105);box-shadow:0 12px 27px rgba(0,0,0,.22)}
      .store-button:focus-visible{outline:2px solid #69dfd1;outline-offset:3px}.lucide-store-icon{width:18px;height:18px;flex:0 0 auto}.store-button-copy{display:grid;line-height:1.08}.store-button-copy strong{font-size:.75rem;font-weight:720}.store-button-copy small{margin-top:4px;color:#8fb8b2;font-size:.59rem;font-weight:520}
      .device-note .store-button{margin-top:13px;width:100%;justify-content:center;background:rgba(105,223,209,.075)}
      @media(max-width:700px){.hardware-bridge{align-items:stretch;flex-direction:column;gap:12px}.hardware-bridge .store-button{width:100%;justify-content:center}}
    `;
    document.head.append(style);

    const heroCopy = document.querySelector(".hero-grid > div:first-child");
    const heroPoints = heroCopy?.querySelector(".hero-points");
    if (heroCopy && heroPoints) {
      const bridge = document.createElement("div");
      bridge.className = "hardware-bridge";
      bridge.innerHTML = `
        <div class="hardware-bridge-copy">
          <span class="hardware-bridge-kicker">${copy.hardwareKicker}</span>
          <p>${copy.hardwareText}</p>
        </div>
        <a class="store-button" data-k500-store href="${STORE_URL}" target="_blank" rel="noopener noreferrer" aria-label="${copy.buy} — ${copy.store}">
          ${bagIcon}
          <span class="store-button-copy"><strong>${copy.buy}</strong><small>${copy.store}</small></span>
        </a>`;
      heroPoints.insertAdjacentElement("afterend", bridge);
    }

    const deviceNote = document.querySelector(".device-note");
    if (deviceNote) {
      const paragraph = deviceNote.querySelector("p");
      if (paragraph) paragraph.textContent = copy.deviceText;
      const button = document.createElement("a");
      button.className = "store-button";
      button.dataset.k500StoreSecondary = "true";
      button.href = STORE_URL;
      button.target = "_blank";
      button.rel = "noopener noreferrer";
      button.setAttribute("aria-label", `${copy.buy} — ${copy.store}`);
      button.innerHTML = `${bagIcon}<span class="store-button-copy"><strong>${copy.buy}</strong><small>${copy.store}</small></span>`;
      deviceNote.append(button);
    }
  }

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

  mountStoreJourney();
  resolveRelease();
})();