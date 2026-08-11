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
      choose: "Pilih arsitektur di bawah",
      verifiedPending: "Build CI terverifikasi · rilis publik pending",
      published: "Dirilis",
      setup: "Download Windows Setup",
      portable: "Download Portable .exe",
      hardwareKicker: "BELUM PUNYA K500?",
      hardwareText: "SONKUPIK STUDIO adalah software kontrol untuk KTV PRO K500. Untuk live control, Anda memerlukan unit K500 yang kompatibel.",
      buy: "Beli KTV PRO K500",
      store: "Tokopedia · Dr Sonkupik",
      deviceText: "Anda dapat mengunduh software sekarang. Untuk live control, diperlukan KTV PRO K500 yang kompatibel. Jika belum punya, perangkat dapat dibeli langsung melalui toko Dr Sonkupik di Tokopedia.",
      availability: "v0.8.44 tersedia publik untuk Windows x64, macOS Intel/Apple Silicon, dan Linux x64/ARM64. macOS belum signed/notarized, jadi Gatekeeper dapat memberi peringatan. Verifikasi dengan SHA-256.",
      faq: "v0.8.44 tersedia untuk Windows 10/11 x64, macOS Intel/Apple Silicon, dan Linux x64/ARM64. macOS belum signed/notarized dan dapat memicu Gatekeeper. Build Mac/Linux lulus CI; uji K500 nyata tetap disarankan sebelum penggunaan kritis.",
      macTitle: "macOS",
      linuxTitle: "Linux",
      apple: "Apple Silicon",
      intel: "Intel Mac",
      appImage: "AppImage",
      deb: "DEB"
    },
    en: {
      checking: "Checking official release…",
      ready: "Official release ready to download",
      snapshot: "Official release ready to download",
      unavailable: "Release status is temporarily unavailable",
      choose: "Choose architecture below",
      verifiedPending: "CI build verified · public release pending",
      published: "Released",
      setup: "Download Windows Setup",
      portable: "Download Portable .exe",
      hardwareKicker: "NEED A K500?",
      hardwareText: "SONKUPIK STUDIO is control software for KTV PRO K500. Live device control requires a compatible K500 unit.",
      buy: "Buy KTV PRO K500",
      store: "Tokopedia · Dr Sonkupik",
      deviceText: "You can download the software now. Live device control requires a compatible KTV PRO K500. If you do not have one yet, you can buy the hardware directly from Dr Sonkupik on Tokopedia.",
      availability: "v0.8.44 is public for Windows x64, macOS Intel/Apple Silicon, and Linux x64/ARM64. macOS is not signed/notarized yet, so Gatekeeper may warn. Verify with SHA-256.",
      faq: "v0.8.44 supports public downloads for Windows 10/11 x64, macOS Intel/Apple Silicon, and Linux x64/ARM64. macOS is not signed/notarized and may trigger Gatekeeper. Mac/Linux passed CI; real K500 testing is still recommended before critical use.",
      macTitle: "macOS",
      linuxTitle: "Linux",
      apple: "Apple Silicon",
      intel: "Intel Mac",
      appImage: "AppImage",
      deb: "DEB"
    }
  }[language];

  const bagIcon = `<svg class="lucide-store-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;

  function mountStoreJourney() {
    if (document.querySelector("[data-k500-store]")) return;
    const heroCopy = document.querySelector(".hero-grid > div:first-child");
    const heroPoints = heroCopy?.querySelector(".hero-points");
    if (heroCopy && heroPoints) {
      const bridge = document.createElement("div");
      bridge.className = "hardware-bridge";
      bridge.innerHTML = `<div class="hardware-bridge-copy"><span class="hardware-bridge-kicker">${copy.hardwareKicker}</span><p>${copy.hardwareText}</p></div><a class="store-button" data-k500-store href="${STORE_URL}" target="_blank" rel="noopener noreferrer" aria-label="${copy.buy} — ${copy.store}">${bagIcon}<span class="store-button-copy"><strong>${copy.buy}</strong><small>${copy.store}</small></span></a>`;
      heroPoints.insertAdjacentElement("afterend", bridge);
    }
    const deviceNote = document.querySelector(".device-note");
    if (deviceNote) {
      const paragraph = deviceNote.querySelector("p");
      if (paragraph) paragraph.textContent = copy.deviceText;
    }
  }

  function mountPlatformMatrix() {
    const list = document.querySelector(".platform-list");
    if (!list || document.querySelector("[data-platform-matrix]")) return;
    const matrix = document.createElement("div");
    matrix.className = "platform-matrix";
    matrix.dataset.platformMatrix = "true";
    matrix.innerHTML = `
      <div class="platform-variant-group" data-platform-group="macos">
        <div class="platform-variant-head"><strong>${copy.macTitle}</strong><span data-group-status="macos">${copy.verifiedPending}</span></div>
        <div class="platform-variant-links">
          <a data-platform-variant="macos-arm64" aria-disabled="true">${copy.apple}<small>DMG · ARM64</small></a>
          <a data-platform-variant="macos-x64" aria-disabled="true">${copy.intel}<small>DMG · x64</small></a>
        </div>
      </div>
      <div class="platform-variant-group" data-platform-group="linux">
        <div class="platform-variant-head"><strong>${copy.linuxTitle}</strong><span data-group-status="linux">${copy.verifiedPending}</span></div>
        <div class="platform-variant-architectures">
          <div><b>x64</b><a data-platform-variant="linux-x64-appimage" aria-disabled="true">${copy.appImage}</a><a data-platform-variant="linux-x64-deb" aria-disabled="true">${copy.deb}</a></div>
          <div><b>ARM64</b><a data-platform-variant="linux-arm64-appimage" aria-disabled="true">${copy.appImage}</a><a data-platform-variant="linux-arm64-deb" aria-disabled="true">${copy.deb}</a></div>
        </div>
      </div>`;
    list.insertAdjacentElement("afterend", matrix);

    const availability = document.querySelector(".availability-note");
    if (availability) {
      const label = language === "en" ? "Cross-platform status:" : "Status lintas platform:";
      availability.innerHTML = `<strong>${label}</strong> ${copy.availability}`;
    }

    document.querySelectorAll(".faq-item").forEach((item) => {
      const summary = item.querySelector("summary");
      if (!summary || !/macOS.*Linux|Linux.*macOS/i.test(summary.textContent || "")) return;
      const paragraph = item.querySelector(".faq-answer p");
      if (paragraph) paragraph.textContent = copy.faq;
    });
  }

  function isAllowedReleaseUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" &&
        url.hostname === "github.com" &&
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
    const checksums = firstMatch(assets, [/^SHA256SUMS\.txt$/i]);
    if (!setup || !portable || !checksums) return null;
    return {
      tag: String(payload.tag_name || payload.version || "Latest"),
      releaseUrl,
      publishedAt: String(payload.published_at || payload.publishedAt || ""),
      setup,
      portable,
      checksums,
      macosX64: firstMatch(assets, [/^SONKUPIK-STUDIO-.*-macOS-x64\.dmg$/i, /^SONKUPIK-STUDIO-.*-macOS-x64\.pkg$/i]),
      macosArm64: firstMatch(assets, [/^SONKUPIK-STUDIO-.*-macOS-arm64\.dmg$/i, /^SONKUPIK-STUDIO-.*-macOS-arm64\.pkg$/i]),
      linuxX64AppImage: firstMatch(assets, [/^SONKUPIK-STUDIO-.*-Linux-x64\.AppImage$/i]),
      linuxX64Deb: firstMatch(assets, [/^SONKUPIK-STUDIO-.*-Linux-x64\.deb$/i]),
      linuxArm64AppImage: firstMatch(assets, [/^SONKUPIK-STUDIO-.*-Linux-arm64\.AppImage$/i]),
      linuxArm64Deb: firstMatch(assets, [/^SONKUPIK-STUDIO-.*-Linux-arm64\.deb$/i])
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
      day: "numeric",
      month: "short",
      year: "numeric"
    }).format(date);
  }

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((node) => {
      node.textContent = value;
    });
  }

  function bindDirect(selector, asset, label) {
    document.querySelectorAll(selector).forEach((link) => {
      if (!asset) return;
      link.href = asset.url;
      link.removeAttribute("aria-disabled");
      link.classList.add("is-available");
      if (label) link.setAttribute("aria-label", `${label} — ${asset.name}`);
    });
  }

  function setPlatformSummary(platform, hasPublicAssets) {
    document.querySelectorAll(`[data-platform-download="${platform}"]`).forEach((link) => {
      const status = link.querySelector("[data-platform-status]");
      link.removeAttribute("href");
      link.setAttribute("aria-disabled", "true");
      link.classList.add("is-cross-platform-status");
      link.classList.toggle("has-public-assets", hasPublicAssets);
      if (status) status.textContent = hasPublicAssets ? copy.choose : copy.verifiedPending;
    });
    const groupStatus = document.querySelector(`[data-group-status="${platform}"]`);
    if (groupStatus) groupStatus.textContent = hasPublicAssets ? copy.choose : copy.verifiedPending;
  }

  function bindVariant(key, asset) {
    const link = document.querySelector(`[data-platform-variant="${key}"]`);
    if (!link) return;
    if (!asset) {
      link.removeAttribute("href");
      link.setAttribute("aria-disabled", "true");
      link.classList.remove("is-available");
      return;
    }
    link.href = asset.url;
    link.removeAttribute("aria-disabled");
    link.classList.add("is-available");
    const base = link.childNodes[0]?.textContent?.trim() || link.textContent.trim();
    const size = humanSize(asset.size);
    link.setAttribute("aria-label", `${base} — ${asset.name}${size ? ` — ${size}` : ""}`);
    const small = link.querySelector("small");
    if (small && size) {
      const format = small.textContent.split(" · ")[0];
      small.textContent = `${format} · ${size}`;
    }
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
    bindDirect('[data-platform-download="windows"]', release.setup, copy.setup);

    bindVariant("macos-x64", release.macosX64);
    bindVariant("macos-arm64", release.macosArm64);
    bindVariant("linux-x64-appimage", release.linuxX64AppImage);
    bindVariant("linux-x64-deb", release.linuxX64Deb);
    bindVariant("linux-arm64-appimage", release.linuxArm64AppImage);
    bindVariant("linux-arm64-deb", release.linuxArm64Deb);

    setPlatformSummary("macos", Boolean(release.macosX64 || release.macosArm64));
    setPlatformSummary("linux", Boolean(
      release.linuxX64AppImage ||
      release.linuxX64Deb ||
      release.linuxArm64AppImage ||
      release.linuxArm64Deb
    ));

    document.querySelectorAll("[data-release-link]").forEach((link) => {
      link.href = release.releaseUrl;
    });
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
    setPlatformSummary("macos", false);
    setPlatformSummary("linux", false);
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest?.('[aria-disabled="true"]');
    if (link) event.preventDefault();
  });

  mountStoreJourney();
  mountPlatformMatrix();
  setPlatformSummary("macos", false);
  setPlatformSummary("linux", false);
  resolveRelease();
})();