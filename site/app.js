const RELEASE_REPOSITORY = "masarray/sonkupik-studio";
const RELEASE_API = `https://api.github.com/repos/${RELEASE_REPOSITORY}/releases/latest`;
const RELEASE_PAGE = `https://github.com/${RELEASE_REPOSITORY}/releases/latest`;
const siteRoot = document.documentElement.dataset.siteRoot || "./";
const SNAPSHOT_URL = new URL(`${siteRoot}release.json`, document.baseURI).href;

const language = document.documentElement.lang === "id" ? "id" : "en";
const copy = {
  en: {
    checking: "Checking the official distribution…",
    ready: "Official release verified",
    fallback: "Reviewed release snapshot",
    unavailable: "Open the official release page",
    published: "Published",
    copied: "Command copied",
    copyFailed: "Copy the command manually",
    openRelease: "Open release",
  },
  id: {
    checking: "Memeriksa distribusi resmi…",
    ready: "Rilis resmi terverifikasi",
    fallback: "Snapshot rilis telah direview",
    unavailable: "Buka halaman rilis resmi",
    published: "Terbit",
    copied: "Perintah disalin",
    copyFailed: "Salin perintah secara manual",
    openRelease: "Buka rilis",
  },
};

const conversionCopy = {
  id: {
    rackEyebrow: "SATU ALAT, BANYAK FUNGSI RACK",
    rackTitle: "Bukan membeli fitur satu per satu. K500 menyatukannya menjadi satu sistem karaoke.",
    rackLead: "Vocal effect, feedback control, dynamics, key transpose, equalizer, crossover, speaker delay dan loudspeaker management bekerja dalam satu jalur sinyal yang dapat disimpan sebagai preset.",
    rackItems: [
      ["VOCAL EFFECT PROCESSOR", "Reverb dan echo terpisah", "Atur pre-delay, decay, delay, repeat, filter serta PEQ efek untuk membangun ruang vokal yang lebih matang."],
      ["FEEDBACK + DYNAMICS", "FBX, noise gate dan compressor", "Bersihkan noise saat diam, kendalikan puncak vokal dan bantu mengurangi risiko feedback melalui tuning yang benar."],
      ["MUSIC PERFORMANCE", "Key transpose dan source control", "Naik-turunkan nada musik ±7 semitone serta atur gain untuk Input 1, Input 2, Bluetooth, U-disk dan digital."],
      ["LOUDSPEAKER MANAGEMENT", "Crossover, delay dan multi-output", "Tata Main, Surround, Center dan Subwoofer dengan level, routing, EQ, dynamics dan alignment masing-masing."],
    ],
    inventoryEyebrow: "FEATURE INVENTORY K500",
    inventoryTitle: "Tidak ada fitur penting yang disembunyikan di balik istilah “digital mixer”.",
    inventoryLead: "Buka setiap kelompok untuk melihat fungsi lengkap K500. Detail ini ditampilkan setelah manfaat utama agar pengguna awam tetap mudah memahami produknya.",
    families: [
      {
        number: "01",
        title: "Musik dan kenyamanan penyanyi",
        subtitle: "Membuat lagu lebih cocok dengan penyanyi dan sumber audio lebih konsisten.",
        open: true,
        items: [
          ["Key transpose -7 sampai +7 semitone", "Memindahkan nada musik pengiring agar lebih nyaman dinyanyikan tanpa mengganti backing track.", "MUSIC KEY"],
          ["Lima jalur sumber musik", "Input 1, Input 2, Bluetooth, U-disk dan digital dapat dipilih sesuai sumber yang digunakan.", "SOURCE ROUTER"],
          ["Gain terpisah per sumber", "Setiap jalur musik mempunyai trim/gain sendiri agar perpindahan sumber tidak membuat level melonjak.", "GAIN STAGING"],
          ["Music PEQ 7-band", "Membentuk bass, body, presence dan clarity musik tanpa harus mengorbankan ruang vokal.", "PARAMETRIC EQ"],
          ["HPF, LPF dan tipe filter", "Membatasi frekuensi yang tidak dibutuhkan serta mengatur kemiringan filter sesuai sistem.", "CROSSOVER"],
          ["Bass, Mid, Mid Frequency, Treble", "Kontrol cepat untuk koreksi tonal harian pada workflow dan firmware yang mendukung.", "QUICK TONE"],
        ],
      },
      {
        number: "02",
        title: "Vokal, efek dan pengendalian feedback",
        subtitle: "Fungsi yang biasanya tersebar pada vocal processor, dynamics rack dan feedback controller.",
        open: true,
        items: [
          ["Mic A dan Mic B", "Dua kelompok pemrosesan mikrofon dengan level dan jalur tuning yang jelas.", "MIC GROUPS"],
          ["PEQ 10-band per kelompok mic", "Koreksi resonansi, ketebalan, nasal, presence dan air secara presisi pada Mic A dan Mic B.", "10-BAND PEQ"],
          ["Mic HPF dan LPF", "Mengurangi getaran rendah, rumble dan frekuensi tinggi yang tidak diperlukan oleh mikrofon.", "BAND LIMITS"],
          ["Noise gate", "Mengurangi noise latar ketika mikrofon tidak sedang digunakan.", "CLEANER SILENCE"],
          ["Compressor lengkap", "Threshold, ratio, attack dan release membantu menjaga level vokal lebih stabil dan terkendali.", "VOCAL DYNAMICS"],
          ["FBX feedback-control depth", "Mengatur kedalaman fungsi pengendalian feedback sebagai bagian dari sistem tuning, bukan tombol ajaib tunggal.", "FEEDBACK CONTROL"],
          ["Reverb terpisah", "Level, decay, pre-delay, HPF, LPF dan PEQ 5-band untuk membangun ruang vokal.", "ROOM ENGINE"],
          ["Echo terpisah", "Level, repeat, delay, HPF, LPF dan PEQ 5-band untuk karakter echo yang lebih terarah.", "DELAY ENGINE"],
        ],
      },
      {
        number: "03",
        title: "Loudspeaker management dan tuning ruangan",
        subtitle: "Mengelola empat zona output, bukan hanya satu master stereo.",
        open: true,
        items: [
          ["Main L/R", "Level kiri/kanan, campuran mic, music, reverb, echo, compressor dan PEQ 7-band.", "PRIMARY OUTPUT"],
          ["Surround L/R", "Level dan routing sendiri, compressor, PEQ 5-band serta delay kiri dan kanan terpisah.", "ROOM DEPTH"],
          ["Center", "Output fokus dengan level, campuran sumber, compressor dan PEQ 5-band.", "VOCAL SUPPORT"],
          ["Subwoofer", "Level dan routing khusus, compressor, PEQ 5-band serta HPF/LPF crossover.", "LOW FREQUENCY"],
          ["Mix per output", "Jumlah mic direct, music, reverb dan echo dapat disusun berbeda pada setiap jalur output.", "MATRIX MIX"],
          ["Output dynamics", "Compressor pada jalur output membantu menjaga headroom dan perilaku sistem lebih konsisten.", "SYSTEM CONTROL"],
          ["Speaker delay alignment", "Delay surround kiri/kanan membantu menyelaraskan waktu tiba suara pada posisi speaker berbeda.", "TIME ALIGNMENT"],
          ["PEQ lintas jalur", "Main, surround, center, sub, reverb dan echo mempunyai section EQ masing-masing.", "ROOM TUNING"],
        ],
      },
      {
        number: "04",
        title: "Operasional, preset dan software",
        subtitle: "Membuat hasil tuning dapat dipakai ulang, dibandingkan dan disebarkan dengan aman.",
        open: false,
        items: [
          ["Startup level dan maximum limits", "Atur level awal dan batas maksimum music, microphone serta effect agar startup lebih dapat diprediksi.", "SAFE BOOT"],
          ["Mode dan slot perangkat", "Simpan beberapa karakter sistem untuk penyanyi, genre, ruangan atau kebutuhan acara berbeda.", "DEVICE MEMORY"],
          ["Preset PC", "Arsipkan setting di komputer tanpa langsung menimpa slot perangkat.", "LOCAL LIBRARY"],
          ["Readback dan compare", "Mulai dari nilai aktual perangkat dan bandingkan sebelum melakukan write.", "CONTROLLED CHANGE"],
          ["Mass preset upload", "Siapkan satu set preset dan deploy ke slot yang dituju secara lebih efisien.", "BULK DEPLOYMENT"],
          ["USB HID dan Bluetooth", "Gunakan jalur koneksi yang didukung oleh perangkat, revisi hardware dan firmware terkait.", "LIVE CONTROL"],
          ["Level recording U-disk dan USB", "Kelola field level perekaman pada workflow hardware yang mendukung.", "RECORDING"],
          ["Dance / Mic Trigger", "Kontrol trigger berbasis microphone tersedia pada model UI tertentu dan bergantung pada dukungan mapping firmware.", "DEVICE DEPENDENT"],
          ["Installer, Portable dan SHA-256", "Pilih paket Windows resmi dan verifikasi identitas file sebelum digunakan.", "VERIFIED RELEASE"],
        ],
      },
    ],
    decisionEyebrow: "SUDAH PUNYA ATAU SEDANG MEMPERTIMBANGKAN K500?",
    decisionTitle: "Lihat kemampuan perangkatnya secara utuh—lalu gunakan SONKUPIK STUDIO untuk membuka kontrol yang lebih visual.",
    decisionLead: "Landing page ini menjelaskan nilai K500 untuk calon pembeli sekaligus menyediakan software resmi bagi pemilik perangkat yang kompatibel.",
    primary: "Download untuk Windows",
    secondary: "Lihat fitur utama",
    note: "Catatan teknis: ketersediaan live read/write dapat berbeda menurut revisi K500, firmware dan metode koneksi. Istilah “seperti rack profesional” menjelaskan integrasi fungsi, bukan klaim bahwa algoritmanya identik dengan merek efek tertentu.",
    mobile: "Kontrol K500 lebih lengkap dari Windows",
  },
  en: {
    rackEyebrow: "ONE UNIT, MULTIPLE RACK FUNCTIONS",
    rackTitle: "Instead of buying every function separately, K500 integrates them into one karaoke system.",
    rackLead: "Vocal effects, feedback control, dynamics, key transpose, equalization, crossover, speaker delay and loudspeaker management operate inside one signal path that can be preserved as a preset.",
    rackItems: [
      ["VOCAL EFFECT PROCESSOR", "Independent reverb and echo", "Shape pre-delay, decay, delay, repeat, filtering and effect PEQ for a more deliberate vocal space."],
      ["FEEDBACK + DYNAMICS", "FBX, noise gate and compressor", "Reduce idle noise, control vocal peaks and lower feedback risk through correct system tuning."],
      ["MUSIC PERFORMANCE", "Key transpose and source control", "Move the accompaniment ±7 semitones and trim Input 1, Input 2, Bluetooth, U-disk and digital sources."],
      ["LOUDSPEAKER MANAGEMENT", "Crossover, delay and multi-output", "Tune Main, Surround, Center and Subwoofer with their own level, routing, EQ, dynamics and alignment."],
    ],
    inventoryEyebrow: "COMPLETE K500 FEATURE INVENTORY",
    inventoryTitle: "No important capability is hidden behind the phrase “digital mixer.”",
    inventoryLead: "Open each group to review the complete K500 function set. Technical detail appears after the main benefits so first-time visitors can still understand the product quickly.",
    families: [
      {
        number: "01", title: "Music and singer comfort", subtitle: "Match songs to the singer and keep sources consistent.", open: true,
        items: [
          ["-7 to +7 semitone key transpose", "Moves the accompaniment into a more comfortable range without replacing the backing track.", "MUSIC KEY"],
          ["Five music source paths", "Input 1, Input 2, Bluetooth, U-disk and digital can be selected for different playback systems.", "SOURCE ROUTER"],
          ["Source-specific gain", "Each music path has its own trim so switching sources does not create sudden level jumps.", "GAIN STAGING"],
          ["7-band music PEQ", "Shapes weight, body, presence and clarity while preserving space for the singer.", "PARAMETRIC EQ"],
          ["HPF, LPF and filter types", "Limits unnecessary frequencies and selects filter behavior for the system.", "CROSSOVER"],
          ["Bass, Mid, Mid Frequency and Treble", "Fast tonal correction on supported workflows and firmware revisions.", "QUICK TONE"],
        ],
      },
      {
        number: "02", title: "Vocals, effects and feedback control", subtitle: "Functions normally spread across vocal, dynamics and feedback processors.", open: true,
        items: [
          ["Mic A and Mic B groups", "Two microphone processing groups with clear level and tuning paths.", "MIC GROUPS"],
          ["10-band PEQ per mic group", "Targets resonance, body, nasal tone, presence and air on Mic A and Mic B.", "10-BAND PEQ"],
          ["Microphone HPF and LPF", "Reduces low-frequency rumble and unnecessary high-frequency energy.", "BAND LIMITS"],
          ["Noise gate", "Reduces background noise while microphones are idle.", "CLEANER SILENCE"],
          ["Full compressor controls", "Threshold, ratio, attack and release stabilize vocal level and peaks.", "VOCAL DYNAMICS"],
          ["FBX feedback-control depth", "Adjusts feedback-control intensity as part of correct system tuning, not as a magic single button.", "FEEDBACK CONTROL"],
          ["Independent reverb", "Level, decay, pre-delay, HPF, LPF and 5-band PEQ for vocal ambience.", "ROOM ENGINE"],
          ["Independent echo", "Level, repeat, delay, HPF, LPF and 5-band PEQ for controlled echo character.", "DELAY ENGINE"],
        ],
      },
      {
        number: "03", title: "Loudspeaker management and room tuning", subtitle: "Four output zones rather than one stereo master.", open: true,
        items: [
          ["Main L/R", "Independent left/right level, mic, music, reverb, echo, compressor and 7-band PEQ.", "PRIMARY OUTPUT"],
          ["Surround L/R", "Independent mix and level, compressor, 5-band PEQ and separate left/right delay.", "ROOM DEPTH"],
          ["Center", "Focused output with its own level, source mix, compressor and 5-band PEQ.", "VOCAL SUPPORT"],
          ["Subwoofer", "Dedicated level and routing, compressor, 5-band PEQ plus HPF/LPF crossover.", "LOW FREQUENCY"],
          ["Per-output source mix", "Mic direct, music, reverb and echo can be balanced differently for every output path.", "MATRIX MIX"],
          ["Output dynamics", "Output compressors help preserve headroom and consistent system behavior.", "SYSTEM CONTROL"],
          ["Speaker delay alignment", "Separate surround delays help align arrival time across speaker positions.", "TIME ALIGNMENT"],
          ["PEQ across the system", "Main, surround, center, sub, reverb and echo expose their own equalization sections.", "ROOM TUNING"],
        ],
      },
      {
        number: "04", title: "Operation, presets and software", subtitle: "Make tuning repeatable, comparable and safer to deploy.", open: false,
        items: [
          ["Startup and maximum limits", "Control initial and maximum music, microphone and effect levels for more predictable startup.", "SAFE BOOT"],
          ["Device modes and slots", "Store different system characters for singers, genres, rooms or events.", "DEVICE MEMORY"],
          ["PC preset library", "Archive settings locally without immediately overwriting device memory.", "LOCAL LIBRARY"],
          ["Readback and compare", "Start from actual device values and review changes before writing.", "CONTROLLED CHANGE"],
          ["Mass preset upload", "Prepare and deploy a full preset set more efficiently.", "BULK DEPLOYMENT"],
          ["USB HID and Bluetooth", "Use connection paths supported by the relevant hardware and firmware revision.", "LIVE CONTROL"],
          ["U-disk and USB recording level", "Manage recording-level fields on supported hardware workflows.", "RECORDING"],
          ["Dance / Mic Trigger", "Microphone-trigger controls appear in selected UI models and depend on confirmed firmware mapping.", "DEVICE DEPENDENT"],
          ["Installer, Portable and SHA-256", "Choose an official Windows package and verify file identity before use.", "VERIFIED RELEASE"],
        ],
      },
    ],
    decisionEyebrow: "OWNING OR CONSIDERING A K500?",
    decisionTitle: "Understand the complete processor first—then use SONKUPIK STUDIO to reveal its controls visually.",
    decisionLead: "This page explains K500 value to prospective buyers while providing official software for owners of compatible units.",
    primary: "Download for Windows",
    secondary: "Review key features",
    note: "Technical note: live read/write availability can vary by K500 revision, firmware and connection method. “Professional rack-style” describes functional integration and does not claim identical algorithms to any named effects brand.",
    mobile: "Unlock deeper K500 control on Windows",
  },
};

function isAllowedReleaseUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      url.hostname === "github.com" &&
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
  return {
    tag: String(payload.tag_name || payload.version || "Latest"),
    name: String(payload.name || payload.tag_name || "SONKUPIK STUDIO"),
    releaseUrl,
    publishedAt: payload.published_at || payload.publishedAt || "",
    setup: find(/^SONKUPIK-STUDIO-.*-Setup\.exe$/i),
    portable: find(/^SONKUPIK-STUDIO-.*-Portable\.exe$/i),
    checksums: find(/^SHA256SUMS\.txt$/i),
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

function loadConversionStyles() {
  if (document.querySelector('link[data-conversion-style]')) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(`${siteRoot}conversion.css`, document.baseURI).href;
  link.dataset.conversionStyle = "true";
  document.head.append(link);
}

function createRackValueSection(c) {
  const section = document.createElement("section");
  section.className = "section conversion-layer";
  section.id = language === "id" ? "satu-rack" : "one-rack";
  section.innerHTML = `
    <div class="container">
      <div class="rack-value">
        <div class="rack-value-copy">
          <small>${c.rackEyebrow}</small>
          <h3>${c.rackTitle}</h3>
          <p>${c.rackLead}</p>
        </div>
        <div class="rack-value-stack">
          ${c.rackItems.map(([tag,title,text]) => `<article><span>${tag}</span><strong>${title}</strong><p>${text}</p></article>`).join("")}
        </div>
      </div>
    </div>`;
  return section;
}

function createInventorySection(c) {
  const section = document.createElement("section");
  section.className = "section alt conversion-layer";
  section.id = language === "id" ? "inventaris-fitur" : "feature-inventory";
  section.innerHTML = `
    <div class="container">
      <div class="conversion-head">
        <span class="eyebrow">${c.inventoryEyebrow}</span>
        <h2>${c.inventoryTitle}</h2>
        <p>${c.inventoryLead}</p>
      </div>
      <div class="feature-inventory">
        ${c.families.map((family) => `
          <details class="feature-family" ${family.open ? "open" : ""}>
            <summary>
              <span class="family-number">${family.number}</span>
              <span class="family-title"><strong>${family.title}</strong><span>${family.subtitle}</span></span>
            </summary>
            <div class="feature-family-body">
              ${family.items.map(([title,text,tag]) => `<article class="feature-proof"><b>${title}</b><p>${text}</p><em>${tag}</em></article>`).join("")}
            </div>
          </details>`).join("")}
      </div>
      <div class="decision-band">
        <div>
          <small>${c.decisionEyebrow}</small>
          <h3>${c.decisionTitle}</h3>
          <p>${c.decisionLead}</p>
        </div>
        <div class="decision-actions">
          <a class="button primary" data-download="setup" href="${RELEASE_PAGE}">${c.primary}</a>
          <a class="button secondary" href="${language === "id" ? "#fitur" : "#features"}">${c.secondary}</a>
        </div>
      </div>
      <p class="claim-note">${c.note}</p>
    </div>`;
  return section;
}

function createMobileCta(c) {
  if (document.querySelector(".mobile-conversion-cta")) return;
  const bar = document.createElement("div");
  bar.className = "mobile-conversion-cta";
  bar.innerHTML = `<span>${c.mobile}</span><a class="button primary" data-download="setup" href="${RELEASE_PAGE}">${language === "id" ? "Download" : "Download"}</a>`;
  document.body.append(bar);
}

function installConversionLayer() {
  const c = conversionCopy[language];
  loadConversionStyles();
  const main = document.querySelector("main");
  if (!main || document.getElementById(language === "id" ? "inventaris-fitur" : "feature-inventory")) return;
  const intro = document.getElementById(language === "id" ? "mengapa" : "why");
  const featureSection = document.getElementById(language === "id" ? "fitur" : "features");
  if (intro) intro.before(createRackValueSection(c));
  if (featureSection) featureSection.after(createInventorySection(c));
  else main.append(createInventorySection(c));
  createMobileCta(c);
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
    // Keep reviewed static structured data when dynamic enrichment fails.
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
installConversionLayer();
decorateWindowsDownloads();
resolveRelease();