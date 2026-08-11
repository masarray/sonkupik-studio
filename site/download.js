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
      published: "Dirilis",
      setup: "Download Windows Setup",
      portable: "Download Portable .exe",
      hardwareKicker: "BELUM PUNYA K500?",
      hardwareText: "SONKUPIK STUDIO adalah software kontrol untuk KTV PRO K500. Untuk live control, Anda memerlukan unit K500 yang kompatibel.",
      buy: "Beli KTV PRO K500",
      store: "Tokopedia · Dr Sonkupik",
      deviceText: "Anda dapat mengunduh software sekarang. Untuk live control, diperlukan KTV PRO K500 yang kompatibel. Jika belum punya, perangkat dapat dibeli langsung melalui toko Dr Sonkupik di Tokopedia.",
      detected: "terdeteksi di perangkat ini",
      selected: "dipilih",
      otherOs: "Download untuk sistem operasi lain",
      primaryWindows: "Download Windows Installer",
      primaryMacArm: "Download untuk Apple Silicon",
      primaryMacIntel: "Download untuk Intel Mac",
      primaryLinux: "Download Linux AppImage",
      portableHint: "Butuh versi Portable?",
      debHint: "Pakai Debian / Ubuntu?",
      chooseMac: "Pilih chip Mac Anda",
      chooseLinuxArch: "Pilih arsitektur Linux",
      macHelp: "Mac M-series (M1/M2/M3/M4 dan lebih baru) menggunakan Apple Silicon.",
      linuxHelp: "AppImage adalah pilihan paling sederhana. DEB tersedia untuk Debian/Ubuntu.",
      autoNote: "Kami menampilkan installer yang paling sesuai dengan perangkat Anda.",
      manualNote: "Pilihan download diperbarui sesuai sistem operasi yang Anda pilih.",
      download: "Download"
    },
    en: {
      checking: "Checking official release…",
      ready: "Official release ready to download",
      snapshot: "Official release ready to download",
      unavailable: "Release status is temporarily unavailable",
      published: "Released",
      setup: "Download Windows Setup",
      portable: "Download Portable .exe",
      hardwareKicker: "NEED A K500?",
      hardwareText: "SONKUPIK STUDIO is control software for KTV PRO K500. Live device control requires a compatible K500 unit.",
      buy: "Buy KTV PRO K500",
      store: "Tokopedia · Dr Sonkupik",
      deviceText: "You can download the software now. Live device control requires a compatible KTV PRO K500. If you do not have one yet, you can buy the hardware directly from Dr Sonkupik on Tokopedia.",
      detected: "detected on this device",
      selected: "selected",
      otherOs: "Download for another operating system",
      primaryWindows: "Download Windows Installer",
      primaryMacArm: "Download for Apple Silicon",
      primaryMacIntel: "Download for Intel Mac",
      primaryLinux: "Download Linux AppImage",
      portableHint: "Need the Portable version?",
      debHint: "Using Debian / Ubuntu?",
      chooseMac: "Choose your Mac chip",
      chooseLinuxArch: "Choose Linux architecture",
      macHelp: "M-series Macs (M1/M2/M3/M4 and newer) use Apple Silicon.",
      linuxHelp: "AppImage is the simplest option. DEB is available for Debian/Ubuntu.",
      autoNote: "We show the installer that best matches your device.",
      manualNote: "Downloads now match the operating system you selected.",
      download: "Download"
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

  function isAllowedReleaseUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" && url.hostname === "github.com" && url.pathname.startsWith(`/${REPOSITORY}/releases/`);
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
    return new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-US", { day: "numeric", month: "short", year: "numeric" }).format(date);
  }

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((node) => { node.textContent = value; });
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
    const size = humanSize(asset.size);
    link.setAttribute("aria-label", `${asset.name}${size ? ` — ${size}` : ""}`);
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
    bindVariant("macos-x64", release.macosX64);
    bindVariant("macos-arm64", release.macosArm64);
    bindVariant("linux-x64-appimage", release.linuxX64AppImage);
    bindVariant("linux-x64-deb", release.linuxX64Deb);
    bindVariant("linux-arm64-appimage", release.linuxArm64AppImage);
    bindVariant("linux-arm64-deb", release.linuxArm64Deb);
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
      if (applyRelease(normalizeRelease(await fetchJson(RELEASE_API, true)), "live")) return true;
    } catch {}
    try {
      if (applyRelease(normalizeRelease(await fetchJson(SNAPSHOT_URL)), "snapshot")) return true;
    } catch {}
    setText("[data-release-status]", copy.unavailable);
    return false;
  }

  function osFromText(value) {
    const text = String(value || "").toLowerCase();
    if (/win/.test(text)) return "windows";
    if (/mac|darwin/.test(text)) return "macos";
    if (/linux|x11|ubuntu|debian|fedora/.test(text)) return "linux";
    return "windows";
  }

  function archFromText(value) {
    const text = String(value || "").toLowerCase();
    if (/arm64|aarch64|armv8|\barm\b/.test(text)) return "arm64";
    if (/x86_64|amd64|x64|win64|x86/.test(text)) return "x64";
    return "";
  }

  async function detectEnvironment() {
    const ua = navigator.userAgent || "";
    const platformText = navigator.userAgentData?.platform || navigator.platform || ua;
    const result = { os: osFromText(platformText), arch: archFromText(`${platformText} ${ua}`) };
    try {
      if (navigator.userAgentData?.getHighEntropyValues) {
        const values = await navigator.userAgentData.getHighEntropyValues(["architecture", "bitness"]);
        const highArch = archFromText(`${values.architecture || ""} ${values.bitness || ""}`);
        if (highArch) result.arch = highArch;
      }
    } catch {}
    return result;
  }

  function platformLabel(os) {
    return os === "macos" ? "macOS" : os === "linux" ? "Linux" : "Windows";
  }

  function clearSmartClasses() {
    document.querySelectorAll(".direct-package").forEach((link) => {
      link.classList.remove("is-smart-primary", "is-smart-secondary", "is-smart-choice");
    });
    document.querySelectorAll(".linux-arch-row").forEach((row) => row.classList.remove("is-smart-active-arch"));
  }

  function primaryHref(os, arch) {
    if (os === "windows") return document.querySelector('[data-platform-download="windows"] [data-download="setup"]')?.href || "";
    if (os === "macos") {
      const key = arch === "x64" ? "macos-x64" : arch === "arm64" ? "macos-arm64" : "";
      return key ? document.querySelector(`[data-platform-variant="${key}"]`)?.href || "" : "";
    }
    const key = arch === "arm64" ? "linux-arm64-appimage" : "linux-x64-appimage";
    return document.querySelector(`[data-platform-variant="${key}"]`)?.href || "";
  }

  function setGlobalDownload(os, arch) {
    const href = primaryHref(os, arch);
    const header = document.querySelector(".nav-actions > a.button.primary");
    const finalPrimary = document.querySelector(".final-actions > a.button.primary");
    const finalSecondary = document.querySelector(".final-actions > a.button:not(.primary)");
    const label = os === "windows" ? copy.primaryWindows : os === "macos" ? (arch === "arm64" ? copy.primaryMacArm : arch === "x64" ? copy.primaryMacIntel : copy.download) : copy.primaryLinux;

    [header, finalPrimary].forEach((link) => {
      if (!link) return;
      if (href) link.href = href; else link.href = "#download";
      if (link === finalPrimary) link.textContent = label;
    });

    if (!finalSecondary) return;
    if (os === "windows") {
      const portable = document.querySelector('[data-platform-download="windows"] [data-download="portable"]');
      finalSecondary.hidden = false;
      finalSecondary.href = portable?.href || "#download";
      finalSecondary.textContent = "Portable .exe";
    } else if (os === "linux") {
      const debKey = arch === "arm64" ? "linux-arm64-deb" : "linux-x64-deb";
      const deb = document.querySelector(`[data-platform-variant="${debKey}"]`);
      finalSecondary.hidden = false;
      finalSecondary.href = deb?.href || "#download";
      finalSecondary.textContent = "DEB (Debian / Ubuntu)";
    } else {
      finalSecondary.hidden = true;
    }
  }

  function ensureSmartChrome() {
    const grid = document.querySelector(".direct-download-grid");
    if (!grid || document.querySelector("[data-smart-other]")) return;

    const other = document.createElement("details");
    other.className = "smart-other-downloads";
    other.dataset.smartOther = "true";
    other.innerHTML = `<summary>${copy.otherOs}</summary><div class="smart-os-switch" role="group" aria-label="${copy.otherOs}"><button type="button" data-smart-os="windows">Windows</button><button type="button" data-smart-os="macos">macOS</button><button type="button" data-smart-os="linux">Linux</button></div>`;
    grid.insertAdjacentElement("afterend", other);

    const note = document.querySelector(".availability-note");
    if (note) note.innerHTML = `<strong>${copy.autoNote}</strong>`;
  }

  function ensureCardHint(card) {
    let hint = card.querySelector(".smart-device-hint");
    if (!hint) {
      hint = document.createElement("div");
      hint.className = "smart-device-hint";
      card.querySelector(".download-os-head")?.insertAdjacentElement("afterend", hint);
    }
    return hint;
  }

  function ensureLinuxArchPicker(card, arch) {
    let picker = card.querySelector(".smart-arch-picker");
    if (!picker) {
      picker = document.createElement("div");
      picker.className = "smart-arch-picker";
      picker.innerHTML = `<span>${copy.chooseLinuxArch}</span><button type="button" data-smart-arch="x64">x64</button><button type="button" data-smart-arch="arm64">ARM64</button>`;
      card.querySelector(".smart-device-hint")?.insertAdjacentElement("afterend", picker);
    }
    picker.querySelectorAll("button").forEach((button) => button.classList.toggle("is-active", button.dataset.smartArch === arch));
  }

  function applySmartPlatform(os, arch = "", manual = false) {
    const grid = document.querySelector(".direct-download-grid");
    if (!grid) return;
    const normalizedOs = ["windows", "macos", "linux"].includes(os) ? os : "windows";
    const normalizedArch = arch || (normalizedOs === "linux" ? "x64" : "");
    document.documentElement.dataset.smartDownloadReady = "true";
    document.documentElement.dataset.detectedOs = normalizedOs;
    grid.dataset.activePlatform = normalizedOs;
    clearSmartClasses();

    document.querySelectorAll(".download-os-card").forEach((card) => {
      const active = card.dataset.platformDownload === normalizedOs;
      card.classList.toggle("is-smart-active", active);
      card.setAttribute("aria-hidden", active ? "false" : "true");
    });

    const card = document.querySelector(`[data-platform-download="${normalizedOs}"]`);
    if (!card) return;
    const hint = ensureCardHint(card);
    hint.textContent = `${platformLabel(normalizedOs)} ${manual ? copy.selected : copy.detected}.`;

    if (normalizedOs === "windows") {
      const setup = card.querySelector('[data-download="setup"]');
      const portable = card.querySelector('[data-download="portable"]');
      setup?.classList.add("is-smart-primary");
      portable?.classList.add("is-smart-secondary");
      if (setup) setup.querySelector("strong").textContent = copy.primaryWindows;
      if (portable) {
        portable.querySelector("strong").textContent = copy.portableHint;
        const b = portable.querySelector("b");
        if (b) b.textContent = "Portable .exe";
      }
    } else if (normalizedOs === "macos") {
      const arm = card.querySelector('[data-platform-variant="macos-arm64"]');
      const intel = card.querySelector('[data-platform-variant="macos-x64"]');
      if (arch === "arm64" || arch === "x64") {
        const primary = arch === "arm64" ? arm : intel;
        const secondary = arch === "arm64" ? intel : arm;
        primary?.classList.add("is-smart-primary");
        secondary?.classList.add("is-smart-secondary");
        if (primary) primary.querySelector("strong").textContent = arch === "arm64" ? copy.primaryMacArm : copy.primaryMacIntel;
        if (secondary) {
          const b = secondary.querySelector("b");
          if (b) b.textContent = copy.download;
        }
        hint.textContent += ` ${arch === "arm64" ? "Apple Silicon" : "Intel x64"}.`;
      } else {
        arm?.classList.add("is-smart-choice");
        intel?.classList.add("is-smart-choice");
        hint.textContent = `${copy.chooseMac}. ${copy.macHelp}`;
      }
    } else {
      const linuxArch = normalizedArch === "arm64" ? "arm64" : "x64";
      ensureLinuxArchPicker(card, linuxArch);
      card.querySelectorAll(".linux-arch-row").forEach((row) => {
        const rowArch = row.querySelector(":scope > span")?.textContent?.trim().toLowerCase() === "arm64" ? "arm64" : "x64";
        row.classList.toggle("is-smart-active-arch", rowArch === linuxArch);
      });
      const app = card.querySelector(`[data-platform-variant="linux-${linuxArch}-appimage"]`);
      const deb = card.querySelector(`[data-platform-variant="linux-${linuxArch}-deb"]`);
      app?.classList.add("is-smart-primary");
      deb?.classList.add("is-smart-secondary");
      if (app) app.querySelector("strong").textContent = copy.primaryLinux;
      if (deb) {
        deb.querySelector("strong").textContent = copy.debHint;
        const b = deb.querySelector("b");
        if (b) b.textContent = "DEB";
      }
      hint.textContent += ` ${linuxArch.toUpperCase()}. ${copy.linuxHelp}`;
      arch = linuxArch;
    }

    document.querySelectorAll("[data-smart-os]").forEach((button) => button.classList.toggle("is-active", button.dataset.smartOs === normalizedOs));
    const note = document.querySelector(".availability-note");
    if (note) note.innerHTML = `<strong>${manual ? copy.manualNote : copy.autoNote}</strong>`;
    setGlobalDownload(normalizedOs, arch);

    window.__sonkupikSmartPlatform = { os: normalizedOs, arch };
  }

  async function initSmartDownload() {
    ensureSmartChrome();
    const detected = await detectEnvironment();
    applySmartPlatform(detected.os, detected.arch, false);

    document.addEventListener("click", (event) => {
      const osButton = event.target.closest?.("[data-smart-os]");
      if (osButton) {
        event.preventDefault();
        const nextOs = osButton.dataset.smartOs;
        const current = window.__sonkupikSmartPlatform || {};
        const nextArch = nextOs === detected.os ? detected.arch : nextOs === "linux" ? "x64" : "";
        applySmartPlatform(nextOs, nextArch, true);
        osButton.closest("details")?.removeAttribute("open");
        return;
      }
      const archButton = event.target.closest?.("[data-smart-arch]");
      if (archButton) {
        event.preventDefault();
        applySmartPlatform("linux", archButton.dataset.smartArch, true);
      }
    });
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest?.('[aria-disabled="true"]');
    if (link) event.preventDefault();
  });

  async function init() {
    mountStoreJourney();
    await resolveRelease();
    await initSmartDownload();
  }

  init();
})();