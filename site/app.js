const RELEASE_REPOSITORY = "masarray/sonkupik-studio";
const RELEASE_API = `https://api.github.com/repos/${RELEASE_REPOSITORY}/releases/latest`;
const RELEASE_PAGE = `https://github.com/${RELEASE_REPOSITORY}/releases/latest`;
const siteRoot = document.documentElement.dataset.siteRoot || "./";
const SNAPSHOT_URL = new URL(`${siteRoot}release.json`, document.baseURI).href;
const language = document.documentElement.lang === "id" ? "id" : "en";

const copy = {
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
};

const landingCopy = {
  id: {
    title: "KTV PRO K500 — Pusat DSP Karaoke Berkelas Panggung",
    description: "Bangun suara karaoke yang lebih mewah, nyaman dan terkendali dengan vocal effect, feedback control, key transpose, parametric EQ, crossover, speaker delay dan loudspeaker management KTV PRO K500.",
    nav: [
      ["#hasil-suara", "Hasil suara"],
      ["#mengapa", "Mengapa K500"],
      ["#fitur", "Fitur utama"],
      ["#speaker", "Sistem speaker"],
      ["#download", "Download"],
    ],
    hero: {
      eyebrow: "INTEGRATED KARAOKE DSP · PROFESSIONAL-STAGE WORKFLOW",
      title: "Bangun suara karaoke berkelas panggung. <span>Satu alat, seluruh pemrosesan.</span>",
      lead: "KTV PRO K500 menyatukan vocal effect, feedback control, noise gate, compressor, key transpose, parametric EQ, crossover, speaker delay dan loudspeaker management ke dalam satu pusat DSP yang siap dipakai untuk karaoke premium.",
      primary: "Dengar manfaatnya lewat fitur",
      secondary: "Sudah punya K500? Download software",
      trust: ["Nada lagu lebih nyaman", "Vokal lebih berkelas", "Feedback lebih terkendali", "Speaker lebih presisi"],
      meta: ["Key transpose ±7", "2 vocal FX engine", "Mic PEQ 10 + 10 band"],
    },
    outcomes: {
      eyebrow: "SUARA YANG ANDA DAMBAKAN",
      title: "Bukan sekadar lebih keras. Lebih enak didengar, lebih mudah dinyanyikan, dan lebih aman dikendalikan.",
      lead: "K500 mengubah kumpulan parameter teknis menjadi enam hasil yang langsung terasa oleh penyanyi, keluarga, tamu dan operator.",
      cards: [
        ["01", "Vokal jernih, berisi dan tidak menusuk", "Masalah umum", "Suara tipis, nasal, terlalu tajam atau tenggelam di balik musik.", "Dengan K500", "PEQ 10-band per grup mic, HPF/LPF dan compressor memberi ruang untuk membentuk body, presence dan clarity secara lebih presisi.", "VOCAL CLARITY"],
        ["02", "Ambience mewah, bukan echo murahan", "Masalah umum", "Echo terdengar menumpuk, jauh atau membuat kata-kata tidak jelas.", "Dengan K500", "Reverb dan echo bekerja sebagai dua engine terpisah—lengkap dengan pre-delay, decay, delay, repeat, filtering dan PEQ efek.", "PREMIUM VOCAL SPACE"],
        ["03", "Nada lagu mengikuti kemampuan penyanyi", "Masalah umum", "Backing track terlalu tinggi atau rendah sehingga penyanyi cepat lelah.", "Dengan K500", "Key transpose -7 sampai +7 semitone memindahkan nada musik pengiring tanpa harus mencari versi lagu lain.", "SINGER COMFORT"],
        ["04", "Feedback lebih terkendali saat volume dinaikkan", "Masalah umum", "Mikrofon mudah mendenging ketika posisi, gain atau akustik ruangan kurang ideal.", "Dengan K500", "FBX depth bekerja bersama gain structure, PEQ, filter, gate dan compressor sebagai satu sistem pengendalian feedback.", "FEEDBACK MANAGEMENT"],
        ["05", "Bass, vokal dan speaker terasa lebih menyatu", "Masalah umum", "Sub terlalu dominan, suara belakang terlambat atau tiap speaker terasa berjalan sendiri.", "Dengan K500", "Crossover, output PEQ, compressor, routing dan delay Surround L/R membantu menata Main, Surround, Center dan Subwoofer.", "ROOM COHERENCE"],
        ["06", "Setting bagus tetap konsisten setiap digunakan", "Masalah umum", "Suara berubah karena operator harus mengingat dan menyetel ulang banyak parameter.", "Dengan K500", "Startup limits, device mode, preset PC, readback, compare dan permanent store membuat hasil tuning dapat diulang.", "REPEATABLE SOUND"],
      ],
    },
    rack: {
      eyebrow: "SATU ALAT, BANYAK FUNGSI RACK",
      title: "Kelengkapan sistem profesional tanpa menumpuk perangkat terpisah.",
      lead: "K500 mengintegrasikan kategori fungsi yang biasanya tersebar pada vocal processor, feedback controller, dynamics rack, key changer, equalizer, crossover dan loudspeaker processor.",
      items: [
        ["VOCAL EFFECT PROCESSOR", "Reverb + echo independen", "Bentuk ruang vokal dengan timing, tonal filter dan PEQ terpisah."],
        ["FEEDBACK & DYNAMICS", "FBX + gate + compressor", "Bersihkan noise, kontrol puncak dan kelola risiko feedback secara sistematis."],
        ["MUSIC PERFORMANCE", "Key transpose + source routing", "Sesuaikan nada lagu dan jaga level antar-sumber tetap konsisten."],
        ["LOUDSPEAKER MANAGEMENT", "Crossover + delay + multi-output", "Tata empat zona speaker dengan processing dan routing masing-masing."],
      ],
    },
    proof: {
      eyebrow: "BUKTI KEDALAMAN DSP",
      title: "Kontrol yang cukup sederhana untuk dipakai, cukup dalam untuk dituning serius.",
      items: [
        ["±7", "semitone key transpose", "Membawa lagu ke jangkauan suara yang lebih nyaman."],
        ["2", "engine vocal effect", "Reverb dan echo dapat dibentuk secara independen."],
        ["10 + 10", "band PEQ Mic A/B", "Koreksi dua grup mikrofon secara presisi."],
        ["4", "zona loudspeaker", "Main, Surround, Center dan Subwoofer."],
        ["7 / 5", "band output PEQ", "Tuning khusus pada Main dan jalur output lainnya."],
      ],
    },
    inventory: {
      headingEyebrow: "SEMUA FITUR, SATU TEMPAT",
      headingTitle: "Kelengkapan profesional tanpa membuat pengguna awam tersesat.",
      headingLead: "Bagian ini adalah referensi teknis lengkap. Buka hanya kelompok yang ingin Anda pelajari; manfaat utama K500 sudah dijelaskan di bagian sebelumnya.",
      groups: [
        ["01", "Musik, media dan kenyamanan penyanyi", "Input 1, Input 2, Bluetooth, U-disk dan digital source; gain per sumber; master music level; key transpose -7 sampai +7; PEQ musik 7-band; HPF/LPF dan tipe filter; quick tone Bass, Mid, Mid Frequency dan Treble pada workflow yang mendukung; serta media transport pada koneksi yang kompatibel."],
        ["02", "Microphone dan vocal processing", "Level Mic A dan Mic B; PEQ 10-band untuk masing-masing grup; EQ link; HPF/LPF; noise gate; compressor threshold, ratio, attack dan release; shared FBX depth; top mic volume; initial mic volume dan maximum mic limit."],
        ["03", "Reverb dan echo engine", "Reverb level, decay, pre-delay, HPF, LPF dan PEQ 5-band. Echo level, repeat, delay, HPF, LPF dan PEQ 5-band. Level kedua efek dapat didistribusikan berbeda ke setiap output."],
        ["04", "Output, crossover dan loudspeaker management", "Main L/R, Surround L/R, Center dan Subwoofer; output level; campuran mic, music, reverb dan echo per jalur; compressor output; HPF/LPF dan tipe filter; PEQ 7-band pada Main serta PEQ 5-band pada Surround, Center dan Sub; delay alignment Surround kiri dan kanan."],
        ["05", "System, safe startup dan recording", "Top music, mic dan effect volume; initial serta maximum startup limits; effect initial level; recording level U-disk dan USB pada hardware yang mendukung; Dance/Mic Trigger pada mapping yang sesuai; checksum preset dan device-state readback."],
        ["06", "Preset, mode perangkat dan deployment", "Sepuluh equipment-mode atau device slots; recall perangkat; preset PC; factory starting points; readback; compare; permanent store ke slot tujuan; mass preset upload; serta library berdasarkan penyanyi, genre, ruangan atau acara."],
        ["07", "Koneksi dan distribusi software", "Live control melalui USB HID dan Bluetooth yang kompatibel; Windows 10/11 64-bit; paket Setup dan Portable; resolver GitHub Releases resmi; serta SHA-256 untuk verifikasi identitas file."],
      ],
    },
    decision: {
      eyebrow: "DARI IMPIAN SUARA KE SISTEM YANG BISA DITUNING",
      title: "Untuk calon pembeli, K500 adalah pusat pemrosesan. Untuk pemiliknya, SONKUPIK STUDIO adalah control room-nya.",
      lead: "Pelajari arsitektur suara K500 terlebih dahulu. Ketika perangkat sudah tersedia, gunakan software Windows untuk membaca, menata, membandingkan dan menyimpan hasil tuning secara lebih visual.",
      primary: "Lihat loudspeaker management",
      secondary: "Download SONKUPIK STUDIO",
    },
    mobile: "Sudah punya K500?",
    mobileButton: "Download software",
    claim: "K500 menyediakan perangkat pemrosesan untuk membangun workflow karaoke bergaya profesional. Hasil akhir tetap dipengaruhi oleh mikrofon, speaker, amplifier, akustik, gain structure, teknik bernyanyi dan kualitas tuning. Ketersediaan live read/write dapat berbeda menurut revisi hardware, firmware dan metode koneksi.",
  },
  en: {
    title: "KTV PRO K500 — Stage-Class Karaoke DSP Center",
    description: "Build more polished, comfortable and controlled karaoke sound with KTV PRO K500 vocal effects, feedback control, key transpose, parametric EQ, crossover, speaker delay and loudspeaker management.",
    nav: [
      ["#sound-results", "Sound results"],
      ["#why", "Why K500"],
      ["#features", "Key features"],
      ["#speakers", "Speaker system"],
      ["#download", "Download"],
    ],
    hero: {
      eyebrow: "INTEGRATED KARAOKE DSP · PROFESSIONAL-STAGE WORKFLOW",
      title: "Build stage-class karaoke sound. <span>One unit, the complete processing chain.</span>",
      lead: "KTV PRO K500 combines vocal effects, feedback control, noise gating, compression, key transpose, parametric EQ, crossover, speaker delay and loudspeaker management into one DSP center for premium karaoke systems.",
      primary: "See what the system improves",
      secondary: "Already own a K500? Download software",
      trust: ["A friendlier song key", "More polished vocals", "Better feedback control", "More precise speakers"],
      meta: ["±7 key transpose", "2 vocal FX engines", "10 + 10 band mic PEQ"],
    },
    outcomes: {
      eyebrow: "THE SOUND YOU ACTUALLY WANT",
      title: "Not merely louder. More enjoyable, easier to sing through and safer to control.",
      lead: "K500 turns technical processing into six outcomes singers, guests and operators can immediately understand.",
      cards: [
        ["01", "Clear, full vocals without harshness", "Common problem", "Thin, nasal or aggressive vocals disappear behind the music.", "With K500", "10-band PEQ per mic group, HPF/LPF and compression provide precise control over body, presence and clarity.", "VOCAL CLARITY"],
        ["02", "Polished ambience instead of cheap echo", "Common problem", "Echo piles up, feels distant or reduces lyric intelligibility.", "With K500", "Reverb and echo operate as separate engines with pre-delay, decay, delay, repeat, filtering and dedicated effect PEQ.", "PREMIUM VOCAL SPACE"],
        ["03", "The song key follows the singer", "Common problem", "Backing tracks sit too high or too low, making the singer work harder.", "With K500", "A -7 to +7 semitone transpose range moves the accompaniment without finding another track.", "SINGER COMFORT"],
        ["04", "Better feedback control at useful volume", "Common problem", "Microphones ring when placement, gain or room acoustics are less than ideal.", "With K500", "FBX depth works with gain structure, PEQ, filters, gating and compression as one feedback-management system.", "FEEDBACK MANAGEMENT"],
        ["05", "Bass, vocals and speakers feel coherent", "Common problem", "Sub bass dominates, rear speakers arrive late or every speaker feels disconnected.", "With K500", "Crossover, output PEQ, compression, routing and separate Surround L/R delay organize Main, Surround, Center and Subwoofer paths.", "ROOM COHERENCE"],
        ["06", "Good tuning remains consistent", "Common problem", "Sound changes because operators must rebuild many settings from memory.", "With K500", "Startup limits, device modes, PC presets, readback, compare and permanent store preserve repeatable results.", "REPEATABLE SOUND"],
      ],
    },
    rack: {
      eyebrow: "ONE UNIT, MULTIPLE RACK FUNCTIONS",
      title: "Professional system completeness without stacking separate processors.",
      lead: "K500 integrates categories normally distributed across vocal effects, feedback, dynamics, key-change, equalization, crossover and loudspeaker processors.",
      items: [
        ["VOCAL EFFECT PROCESSOR", "Independent reverb + echo", "Shape vocal space with separate timing, tonal filters and PEQ."],
        ["FEEDBACK & DYNAMICS", "FBX + gate + compressor", "Reduce idle noise, control peaks and manage feedback risk systematically."],
        ["MUSIC PERFORMANCE", "Key transpose + source routing", "Match the song key and keep multiple playback sources consistent."],
        ["LOUDSPEAKER MANAGEMENT", "Crossover + delay + multi-output", "Tune four speaker zones with their own processing and routing."],
      ],
    },
    proof: {
      eyebrow: "DSP DEPTH AT A GLANCE",
      title: "Approachable enough for daily use, deep enough for serious tuning.",
      items: [
        ["±7", "semitone key transpose", "Moves music into a more comfortable vocal range."],
        ["2", "vocal effect engines", "Reverb and echo can be shaped independently."],
        ["10 + 10", "band Mic A/B PEQ", "Precise tuning for two microphone groups."],
        ["4", "loudspeaker zones", "Main, Surround, Center and Subwoofer."],
        ["7 / 5", "band output PEQ", "Dedicated tuning across primary and secondary outputs."],
      ],
    },
    inventory: {
      headingEyebrow: "EVERY FEATURE, ONE REFERENCE",
      headingTitle: "Professional completeness without making first-time buyers get lost.",
      headingLead: "This is the technical reference. Open only the group you need; the main product benefits have already been explained above.",
      groups: [
        ["01", "Music, media and singer comfort", "Input 1, Input 2, Bluetooth, U-disk and digital sources; source-specific gain; master music level; -7 to +7 key transpose; 7-band music PEQ; HPF/LPF and filter types; Bass, Mid, Mid Frequency and Treble on supported workflows; and compatible media transport controls."],
        ["02", "Microphone and vocal processing", "Mic A and Mic B levels; 10-band PEQ for each group; EQ link; HPF/LPF; noise gate; compressor threshold, ratio, attack and release; shared FBX depth; top mic level; initial level and maximum mic limit."],
        ["03", "Reverb and echo engines", "Reverb level, decay, pre-delay, HPF, LPF and 5-band PEQ. Echo level, repeat, delay, HPF, LPF and 5-band PEQ. Both effects can be distributed differently to every output."],
        ["04", "Outputs, crossover and loudspeaker management", "Main L/R, Surround L/R, Center and Subwoofer; output level; mic, music, reverb and echo mix per path; output compression; HPF/LPF and filter types; 7-band Main PEQ plus 5-band PEQ for Surround, Center and Sub; separate Surround left/right delay alignment."],
        ["05", "System, safe startup and recording", "Top music, mic and effect levels; initial and maximum startup limits; initial effect level; U-disk and USB recording level on supported hardware; Dance/Mic Trigger on matching mappings; preset checksum and device-state readback."],
        ["06", "Presets, device modes and deployment", "Ten equipment-mode or device slots; device recall; PC presets; factory starting points; readback; compare; permanent store to a selected slot; mass preset upload; and libraries organized by singer, genre, room or event."],
        ["07", "Connectivity and software distribution", "Compatible USB HID and Bluetooth live control; Windows 10/11 64-bit; Setup and Portable packages; official GitHub Releases resolution; and SHA-256 file identity verification."],
      ],
    },
    decision: {
      eyebrow: "FROM A SOUND GOAL TO A TUNABLE SYSTEM",
      title: "For buyers, K500 is the processing center. For owners, SONKUPIK STUDIO is its control room.",
      lead: "Understand the K500 sound architecture first. Once the hardware is available, use the Windows software to read, tune, compare and preserve settings visually.",
      primary: "Explore loudspeaker management",
      secondary: "Download SONKUPIK STUDIO",
    },
    mobile: "Already own a K500?",
    mobileButton: "Download software",
    claim: "K500 provides the processing tools for a professional-style karaoke workflow. Final results still depend on microphones, speakers, amplification, acoustics, gain structure, singing technique and tuning quality. Live read/write availability may vary by hardware revision, firmware and connection method.",
  },
};

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

function loadMaturityStyles() {
  if (document.querySelector('link[data-conversion-style]')) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(`${siteRoot}conversion.css`, document.baseURI).href;
  link.dataset.conversionStyle = "true";
  document.head.append(link);
}

function updateMetadata(c) {
  document.title = c.title;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = c.description;
}

function rewriteNavigation(c) {
  const nav = document.querySelector(".desktop-nav");
  if (!nav) return;
  nav.innerHTML = c.nav.map(([href, label]) => `<a href="${href}">${label}</a>`).join("");
}

function rewriteHero(c) {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const eyebrow = hero.querySelector(".hero-copy > .eyebrow");
  const title = hero.querySelector(".hero-copy > h1");
  const lead = hero.querySelector(".hero-copy > .hero-lead");
  const actions = hero.querySelectorAll(".hero-actions .button");
  const trust = hero.querySelectorAll(".micro-trust span");
  const meta = hero.querySelectorAll(".release-meta span:not([data-release-date])");
  if (eyebrow) eyebrow.textContent = c.hero.eyebrow;
  if (title) title.innerHTML = c.hero.title;
  if (lead) lead.textContent = c.hero.lead;
  if (actions[0]) {
    actions[0].removeAttribute("data-download");
    actions[0].href = language === "id" ? "#hasil-suara" : "#sound-results";
    actions[0].textContent = c.hero.primary;
  }
  if (actions[1]) {
    actions[1].href = "#download";
    actions[1].textContent = c.hero.secondary;
  }
  trust.forEach((node, index) => { if (c.hero.trust[index]) node.textContent = c.hero.trust[index]; });
  meta.forEach((node, index) => { if (c.hero.meta[index]) node.textContent = c.hero.meta[index]; });
}

function rewriteTrustBand(c) {
  const items = document.querySelectorAll(".trust-band .trust-item");
  const cards = c.outcomes.cards.slice(0, 4);
  items.forEach((item, index) => {
    const card = cards[index];
    if (!card) return;
    const strong = item.querySelector("strong");
    const span = item.querySelector("span");
    if (strong) strong.textContent = card[1];
    if (span) span.textContent = card[5];
  });
}

function createOutcomesSection(c) {
  const section = document.createElement("section");
  section.className = "section alt conversion-layer sound-outcomes";
  section.id = language === "id" ? "hasil-suara" : "sound-results";
  section.innerHTML = `
    <div class="container">
      <div class="conversion-head">
        <span class="eyebrow">${c.outcomes.eyebrow}</span>
        <h2>${c.outcomes.title}</h2>
        <p>${c.outcomes.lead}</p>
      </div>
      <div class="outcome-grid">
        ${c.outcomes.cards.map(([number,title,problemLabel,problem,resultLabel,result,tag]) => `
          <article class="outcome-card">
            <div class="outcome-card-top"><span>${number}</span><em>${tag}</em></div>
            <h3>${title}</h3>
            <dl>
              <div><dt>${problemLabel}</dt><dd>${problem}</dd></div>
              <div class="outcome-result"><dt>${resultLabel}</dt><dd>${result}</dd></div>
            </dl>
          </article>`).join("")}
      </div>
    </div>`;
  return section;
}

function createRackSection(c) {
  const section = document.createElement("section");
  section.className = "section conversion-layer rack-convergence";
  section.id = language === "id" ? "satu-rack" : "one-rack";
  section.innerHTML = `
    <div class="container">
      <div class="rack-value">
        <div class="rack-value-copy">
          <small>${c.rack.eyebrow}</small>
          <h3>${c.rack.title}</h3>
          <p>${c.rack.lead}</p>
        </div>
        <div class="rack-value-stack">
          ${c.rack.items.map(([tag,title,text]) => `<article><span>${tag}</span><strong>${title}</strong><p>${text}</p></article>`).join("")}
        </div>
      </div>
    </div>`;
  return section;
}

function createProofSection(c) {
  const section = document.createElement("section");
  section.className = "section conversion-layer proof-section";
  section.id = language === "id" ? "bukti-dsp" : "dsp-proof";
  section.innerHTML = `
    <div class="container">
      <div class="proof-heading">
        <span class="eyebrow">${c.proof.eyebrow}</span>
        <h2>${c.proof.title}</h2>
      </div>
      <div class="proof-metrics">
        ${c.proof.items.map(([value,label,text]) => `<article><b>${value}</b><strong>${label}</strong><p>${text}</p></article>`).join("")}
      </div>
    </div>`;
  return section;
}

function findStaticInventory() {
  const candidates = [...document.querySelectorAll(".feature-inventory")];
  return candidates.find((node) => !node.closest(".conversion-layer")) || candidates[0] || null;
}

function upgradeInventory(c) {
  const inventory = findStaticInventory();
  if (!inventory) return;
  const section = inventory.closest("section");
  const heading = section?.querySelector(".section-heading");
  if (heading) {
    const eyebrow = heading.querySelector(".eyebrow");
    const title = heading.querySelector("h2");
    const lead = heading.querySelector(".section-lead");
    if (eyebrow) eyebrow.textContent = c.inventory.headingEyebrow;
    if (title) title.textContent = c.inventory.headingTitle;
    if (lead) lead.textContent = c.inventory.headingLead;
  }
  inventory.innerHTML = c.inventory.groups.map(([number,title,text], index) => `
    <details ${index === 0 ? "open" : ""}>
      <summary><span>${number}</span>${title}</summary>
      <div><p>${text}</p></div>
    </details>`).join("");
}

function createDecisionSection(c) {
  const section = document.createElement("section");
  section.className = "section alt conversion-layer buyer-decision";
  section.id = language === "id" ? "langkah-berikutnya" : "next-step";
  section.innerHTML = `
    <div class="container">
      <div class="decision-band">
        <div>
          <small>${c.decision.eyebrow}</small>
          <h3>${c.decision.title}</h3>
          <p>${c.decision.lead}</p>
        </div>
        <div class="decision-actions">
          <a class="button secondary" href="${language === "id" ? "#speaker" : "#speakers"}">${c.decision.primary}</a>
          <a class="button primary" data-download="setup" href="${RELEASE_PAGE}">${c.decision.secondary}</a>
        </div>
      </div>
      <p class="claim-note">${c.claim}</p>
    </div>`;
  return section;
}

function createMobileCta(c) {
  if (document.querySelector(".mobile-conversion-cta")) return;
  const bar = document.createElement("div");
  bar.className = "mobile-conversion-cta";
  bar.innerHTML = `<span><b>${c.mobile}</b><small>${language === "id" ? "Gunakan control room Windows resmi" : "Use the official Windows control room"}</small></span><a class="button primary" data-download="setup" href="${RELEASE_PAGE}">${c.mobileButton}</a>`;
  document.body.append(bar);
  const download = document.getElementById("download");
  if (download && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      bar.classList.toggle("is-hidden", entry.isIntersecting);
    }, { threshold: 0.08 });
    observer.observe(download);
  }
}

function installLandingMaturityLayer() {
  const c = landingCopy[language];
  loadMaturityStyles();
  updateMetadata(c);
  rewriteNavigation(c);
  rewriteHero(c);
  rewriteTrustBand(c);
  upgradeInventory(c);

  const main = document.querySelector("main");
  if (!main || document.querySelector(".sound-outcomes")) return;
  const intro = document.getElementById(language === "id" ? "mengapa" : "why");
  if (intro) {
    intro.before(createOutcomesSection(c));
    intro.before(createRackSection(c));
  }
  const features = document.getElementById(language === "id" ? "fitur" : "features");
  if (features) features.after(createProofSection(c));
  const download = document.getElementById("download");
  if (download) download.before(createDecisionSection(c));
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
installLandingMaturityLayer();
decorateWindowsDownloads();
resolveRelease();
