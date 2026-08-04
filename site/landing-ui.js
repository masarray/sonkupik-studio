const { STORE_URL, siteRoot, language } = window.K500_CONFIG;
const landingCopy = { [language]: window.K500_LANDING_COPY };
function setMeta(selector, value) {
  const node = document.querySelector(selector);
  if (node) node.setAttribute("content", value);
}

function loadStylesheet(path, marker) {
  if (document.querySelector(`link[${marker}]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(`${siteRoot}${path}`, document.baseURI).href;
  link.setAttribute(marker, "true");
  document.head.append(link);
}

function updateMetadata(c) {
  document.title = c.title;
  setMeta('meta[name="description"]', c.description);
  setMeta('meta[property="og:title"]', c.socialTitle);
  setMeta('meta[property="og:description"]', c.socialDescription);
  setMeta('meta[name="twitter:title"]', c.socialTitle);
  setMeta('meta[name="twitter:description"]', c.socialDescription);
}

function externalStoreLink(label, className = "button primary") {
  return `<a class="${className}" data-store-link href="${STORE_URL}" target="_blank" rel="noopener noreferrer">${label}</a>`;
}

function rewriteNavigation(c) {
  const nav = document.querySelector(".desktop-nav");
  if (nav) nav.innerHTML = c.nav.map(([href, label]) => `<a href="${href}">${label}</a>`).join("");

  const compact = document.querySelector(".nav-actions > .button");
  if (compact) {
    compact.removeAttribute("data-download");
    compact.href = STORE_URL;
    compact.target = "_blank";
    compact.rel = "noopener noreferrer";
    compact.dataset.storeLink = "true";
    compact.textContent = c.headerBuy;
  }
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
    actions[0].href = STORE_URL;
    actions[0].target = "_blank";
    actions[0].rel = "noopener noreferrer";
    actions[0].dataset.storeLink = "true";
    actions[0].textContent = c.hero.primary;
  }
  if (actions[1]) {
    actions[1].href = language === "id" ? "#hasil-suara" : "#sound-results";
    actions[1].textContent = c.hero.secondary;
  }
  const actionBox = hero.querySelector(".hero-actions");
  if (actionBox && !hero.querySelector(".owner-software-link")) {
    actionBox.insertAdjacentHTML("afterend", `<a class="owner-software-link" href="#download">${c.hero.owner}</a>`);
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

function createBuyerSection(c) {
  const section = document.createElement("section");
  section.className = "section alt conversion-layer buyer-guide";
  section.id = language === "id" ? "beli-k500" : "buy-k500";
  section.innerHTML = `
    <div class="container">
      <div class="conversion-head">
        <span class="eyebrow">${c.buyer.eyebrow}</span>
        <h2>${c.buyer.title}</h2>
        <p>${c.buyer.lead}</p>
      </div>
      <div class="purchase-grid">
        <article class="store-card">
          <span>${c.buyer.storeKicker}</span>
          <h3>${c.buyer.storeTitle}</h3>
          <p>${c.buyer.storeText}</p>
          ${externalStoreLink(c.buyer.storeButton, "button primary store-button")}
          <small>tokopedia.com/dr-sonkupik</small>
        </article>
        <div class="connection-card" aria-label="${language === "id" ? "Diagram koneksi dasar K500" : "Basic K500 connection diagram"}">
          <div class="connection-flow">
            <div class="signal-source"><b>${c.buyer.diagram[0]}</b><span>${c.buyer.diagramMic}</span></div>
            <i aria-hidden="true">→</i>
            <div class="signal-core"><small>INTEGRATED DSP</small><strong>${c.buyer.diagram[1]}</strong></div>
            <i aria-hidden="true">→</i>
            <div class="signal-output"><b>${c.buyer.diagram[2]}</b></div>
          </div>
          <p>${language === "id" ? "K500 bekerja pada jalur line-level. Speaker pasif tetap memerlukan power amplifier." : "K500 operates at line level. Passive speakers still require a power amplifier."}</p>
        </div>
      </div>
      <div class="needs-panel">
        <div><span class="eyebrow">${c.buyer.checklistTitle}</span><h3>${language === "id" ? "Sistem lengkap tidak harus rumit." : "A complete system does not have to be complicated."}</h3></div>
        <div class="needs-grid">
          ${c.buyer.checklist.map(([title,text], index) => `<article><span>${String(index + 1).padStart(2, "0")}</span><div><strong>${title}</strong><p>${text}</p></div></article>`).join("")}
        </div>
      </div>
      <aside class="relationship-note"><strong>${c.buyer.relationTitle}</strong><p>${c.buyer.relationText}</p></aside>
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
  section.className = "section conversion-layer buyer-decision";
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
          ${externalStoreLink(c.decision.buy, "button primary")}
          <a class="button secondary" data-download="setup" href="${window.K500_CONFIG.RELEASE_PAGE}">${c.decision.download}</a>
        </div>
      </div>
      <p class="claim-note">${c.claim}</p>
    </div>`;
  return section;
}

function upgradeFaq(c) {
  const faq = document.querySelector(".faq");
  if (!faq || faq.querySelector("[data-purchase-faq]")) return;
  faq.insertAdjacentHTML("afterbegin", `
    <details data-purchase-faq><summary>${c.faqBuyQ}</summary><p>${c.faqBuyA}</p></details>
    <details data-purchase-faq><summary>${c.faqNeedQ}</summary><p>${c.faqNeedA}</p></details>`);
}

function createMobileCta(c) {
  if (document.querySelector(".mobile-conversion-cta")) return;
  const bar = document.createElement("div");
  bar.className = "mobile-conversion-cta purchase-mobile-cta";
  bar.innerHTML = `
    <span><b>${c.mobile}</b><a href="#download">${c.mobileOwner}</a></span>
    ${externalStoreLink(c.mobileButton, "button primary")}`;
  document.body.append(bar);
  const buyer = document.getElementById(language === "id" ? "beli-k500" : "buy-k500");
  if (buyer && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      bar.classList.toggle("is-hidden", entry.isIntersecting);
    }, { threshold: 0.08 });
    observer.observe(buyer);
  }
}

function updateStructuredProductLink() {
  const node = document.getElementById("software-structured-data");
  if (!node) return;
  try {
    const data = JSON.parse(node.textContent);
    const graph = Array.isArray(data?.["@graph"]) ? data["@graph"] : [];
    const product = graph.find((item) => item?.["@type"] === "Product");
    if (product) {
      product.url = STORE_URL;
      product.offers = { "@type": "Offer", url: STORE_URL };
    }
    node.textContent = JSON.stringify(data);
  } catch {
    // Keep reviewed structured data when it cannot be parsed.
  }
}

function installLandingLayer() {
  const c = landingCopy[language];
  loadStylesheet("conversion.css", "data-conversion-style");
  loadStylesheet("purchase.css", "data-purchase-style");
  updateMetadata(c);
  rewriteNavigation(c);
  rewriteHero(c);
  rewriteTrustBand(c);
  upgradeInventory(c);
  upgradeFaq(c);
  updateStructuredProductLink();

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
  if (download) {
    download.before(createBuyerSection(c));
    download.before(createDecisionSection(c));
  }
  createMobileCta(c);
}

installLandingLayer();
