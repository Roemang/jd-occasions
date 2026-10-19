/* =========================================================
   JD OCCASIONS — WERKING VAN DE WEBSITE
   Je hoeft dit bestand normaal niet aan te passen.
   Alle gegevens (auto's, bedrijfsgegevens, reviews) komen uit de
   database en beheer je via /admin
   ========================================================= */

let SITE = {}, AUTOS = [], REVIEWS = [];
const LOGO = "img/logo-header.png"; // laat leeg ("") voor een tekstlogo

/* ---------- Hulpfuncties ---------- */
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const euro = (n) => "€ " + Math.round(n).toLocaleString("nl-NL");
const num = (n) => Number(n).toLocaleString("nl-NL");
const params = new URLSearchParams(location.search);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const telLink = () => "tel:" + SITE.telefoon.replace(/\s/g, "");
const waLink = (tekst = "") => `https://wa.me/${SITE.whatsapp}${tekst ? "?text=" + encodeURIComponent(tekst) : ""}`;
const titel = (a) => `${a.merk} ${a.model}`;

/* ---------- Iconen ---------- */
const ICON = {
  km: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 14l4-4"/><path d="M3.3 17a9 9 0 1 1 17.4 0"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>',
  fuel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M3 21h13M4 10h11"/><path d="M15 8h2a2 2 0 0 1 2 2v6a1.5 1.5 0 0 0 3 0V9l-3-3"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="6" cy="6" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="12" cy="18" r="2"/><path d="M6 8v8M12 8v8M18 8v4H6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  arrow: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  left: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>',
  right: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  euro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 7a7 7 0 1 0 0 10M4 10h10M4 14h10"/></svg>',
  swap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>',
  filter: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 3H2l8 9.5V19l4 2v-8.5z"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4C2.7 15.6 2.2 13.8 2.2 12 2.2 6.6 6.6 2.2 12 2.2c2.6 0 5.1 1 6.9 2.9 1.8 1.8 2.9 4.3 2.9 6.9 0 5.4-4.4 9.8-9.8 9.8zM20.5 3.5C18.2 1.2 15.2 0 12 0 5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.8 1 3.8 1.5 5.8 1.5 6.6 0 12-5.4 12-12 0-3.2-1.2-6.2-3.5-8.4z"/></svg>',
};

/* ---------- Auto-silhouet (wordt getoond zolang er geen foto's zijn) ---------- */
function carSVG(style = "placeholder") {
  const body = "M30,150 Q30,128 58,122 L150,108 Q200,66 262,58 L372,56 Q418,60 458,100 L528,112 Q568,120 570,146 L570,156 Q570,164 560,164 L505,164 A45,45 0 0 0 415,164 L195,164 A45,45 0 0 0 105,164 L40,164 Q30,164 30,154 Z";
  const w1 = "M176,106 Q214,76 262,70 L308,68 L308,106 Z";
  const w2 = "M320,68 L366,68 Q402,72 434,104 L320,106 Z";
  const wheel = (cx) => `<circle cx="${cx}" cy="164" r="37" fill="#0e0e11"/><circle cx="${cx}" cy="164" r="22" fill="none" stroke="${style === "hero" ? "#4ea8ff" : "#4a4a53"}" stroke-width="3"/><circle cx="${cx}" cy="164" r="6" fill="${style === "hero" ? "#4ea8ff" : "#4a4a53"}"/>`;
  if (style === "hero") {
    return `<svg class="car-svg" viewBox="0 0 600 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="cb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3a42"/><stop offset=".55" stop-color="#1c1c21"/><stop offset="1" stop-color="#0f0f12"/></linearGradient>
        <linearGradient id="cw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5b5b66"/><stop offset="1" stop-color="#202026"/></linearGradient>
        <radialGradient id="sh"><stop offset="0" stop-color="#000" stop-opacity=".7"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
      </defs>
      <ellipse cx="300" cy="200" rx="280" ry="16" fill="url(#sh)"/>
      <path d="${body}" fill="url(#cb)" stroke="#4ea8ff" stroke-opacity=".55" stroke-width="1.4"/>
      <path d="${w1}" fill="url(#cw)"/><path d="${w2}" fill="url(#cw)"/>
      <path d="M60,132 L540,128" stroke="#4ea8ff" stroke-opacity=".35" stroke-width="1.2"/>
      <path d="M538,120 L566,126" stroke="#bfe0ff" stroke-width="4" stroke-linecap="round"/>
      <path d="M34,134 L48,132" stroke="#e5564d" stroke-width="4" stroke-linecap="round"/>
      ${wheel(150)}${wheel(460)}
    </svg>`;
  }
  return `<svg class="car-svg" viewBox="0 0 600 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="${body}" fill="#33333b" stroke="#4a4a54" stroke-width="1.5"/>
    <path d="${w1}" fill="#1d1d22"/><path d="${w2}" fill="#1d1d22"/>
    ${wheel(150)}${wheel(460)}
  </svg>`;
}

function fotoOfPlaceholder(auto, index = 0, tekst = true) {
  const foto = auto.fotos && auto.fotos[index];
  if (foto) return `<img src="${esc(foto)}" alt="${esc(titel(auto) + " " + auto.uitvoering)}" loading="lazy">`;
  return `<div class="placeholder">${carSVG()}${tekst ? "<span>Foto volgt binnenkort</span>" : ""}</div>`;
}

/* ---------- Header & footer (op elke pagina gelijk) ---------- */
function logoHTML() {
  if (LOGO) return `<a href="index.html" class="logo"><img src="${esc(LOGO)}" alt="${esc(SITE.naam)}"></a>`;
  return `<a href="index.html" class="logo" aria-label="${esc(SITE.naam)} home">
      <span class="logo-mark">JD</span>
      <span class="logo-text"><strong>JD</strong><span>Occasions</span></span>
    </a>`;
}

function renderHeader() {
  const page = document.body.dataset.page;
  const link = (href, label, key) => `<li><a href="${href}" class="${page === key ? "active" : ""}">${label}</a></li>`;
  $("#header").outerHTML = `
  <header class="site-header">
    <div class="topbar"><div class="container">
      <div class="topbar-left">${esc(SITE.adres)}, ${esc(SITE.plaats)}</div>
      <div class="topbar-right">
        <a href="${telLink()}">${esc(SITE.telefoon)}</a>
        <a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>
      </div>
    </div></div>
    <div class="container nav">
      ${logoHTML()}
      <ul class="nav-links" id="navLinks">
        ${link("index.html", "Home", "home")}
        ${link("aanbod.html", "Aanbod", "aanbod")}
        ${link("index.html#diensten", "Diensten", "")}
        ${link("index.html#over-ons", "Over ons", "")}
        ${link("contact.html", "Contact", "contact")}
      </ul>
      <div class="nav-cta">
        <a href="${telLink()}" class="btn btn-outline">${ICON.phone} Bel ons</a>
        <a href="aanbod.html" class="btn btn-primary">Bekijk aanbod</a>
        <button class="menu-toggle" id="menuToggle" aria-label="Menu openen"><span></span><span></span><span></span></button>
      </div>
    </div>
  </header>`;
  $("#menuToggle").addEventListener("click", () => $("#navLinks").classList.toggle("open"));
}

function renderFooter() {
  const jaar = new Date().getFullYear();
  $("#footer").outerHTML = `
  <footer class="site-footer">
    <div class="container footer-grid">
      <div>
        ${LOGO ? `<a href="index.html" class="logo"><img src="img/logo-groot.png" alt="${esc(SITE.naam)}"></a>` : logoHTML()}
        <p style="margin-top:18px;max-width:300px">${esc(SITE.slogan)}. Zorgvuldig geselecteerde occasions, scherp geprijsd en persoonlijk geleverd.</p>
      </div>
      <div>
        <h4>Navigatie</h4>
        <ul>
          <li><a href="aanbod.html">Ons aanbod</a></li>
          <li><a href="index.html#diensten">Diensten</a></li>
          <li><a href="contact.html?onderwerp=Inruil">Auto inruilen</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4>Openingstijden</h4>
        <ul>${SITE.openingstijden.map(([d, t]) => `<li>${esc(d)}: ${esc(t)}</li>`).join("")}</ul>
      </div>
      <div>
        <h4>Contact</h4>
        <ul>
          <li>${esc(SITE.adres)}<br>${esc(SITE.postcode)} ${esc(SITE.plaats)}</li>
          <li><a href="${telLink()}">${esc(SITE.telefoon)}</a></li>
          <li><a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a></li>
          <li>KvK: ${esc(SITE.kvk)}</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom"><div class="container">
      <span>© ${jaar} ${esc(SITE.naam)}. Alle rechten voorbehouden.</span>
      <span>Prijzen en specificaties onder voorbehoud van typ- en drukfouten.</span>
    </div></div>
  </footer>
  <a class="wa-float" href="${waLink("Hallo " + SITE.naam + ", ik heb een vraag.")}" target="_blank" rel="noopener" aria-label="WhatsApp">${ICON.wa}</a>`;
}

/* ---------- Auto-kaart ---------- */
function carCard(a) {
  const badge = a.status === "verkocht" ? '<span class="badge badge-verkocht">Verkocht</span>'
    : a.status === "gereserveerd" ? '<span class="badge badge-gereserveerd">Gereserveerd</span>' : "";
  return `
  <a class="car-card reveal ${a.status === "verkocht" ? "is-sold" : ""}" href="auto.html?id=${a.id}">
    <div class="media">${fotoOfPlaceholder(a)}${badge}</div>
    <div class="body">
      <h3>${esc(titel(a))}</h3>
      <div class="variant">${esc(a.uitvoering)}</div>
      <div class="specs">
        <span class="spec">${ICON.cal}${a.bouwjaar}</span>
        <span class="spec">${ICON.km}${num(a.km)} km</span>
        <span class="spec">${ICON.fuel}${esc(a.brandstof)}</span>
        <span class="spec">${ICON.gear}${esc(a.transmissie)}</span>
      </div>
      <div class="foot">
        <div class="price">${euro(a.prijs)}<small>${a.btw === "BTW" ? "incl. BTW" : "Marge"}</small></div>
        <span class="arrow">${ICON.arrow}</span>
      </div>
    </div>
  </a>`;
}

/* ---------- Scroll-animatie ---------- */
function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  $$(".reveal:not(.visible)").forEach((el) => io.observe(el));
}

const uniek = (key) => [...new Set(AUTOS.map((a) => a[key]))].sort((a, b) => String(a).localeCompare(String(b)));
const options = (list, eerst) => `<option value="">${eerst}</option>` + list.map((v) => `<option value="${esc(v)}">${esc(v)}</option>`).join("");

/* =========================================================
   HOME
   ========================================================= */
function initHome() {
  $("#heroCar").innerHTML = `<img class="hero-logo" src="img/logo-groot.png" alt="${esc(SITE.naam)} logo">`;
  $("#aboutCar").innerHTML = carSVG("hero");

  const beschikbaar = AUTOS.filter((a) => a.status !== "verkocht");
  $("#statVoorraad").textContent = beschikbaar.length;

  // Snel zoeken
  $("#qsMerk").innerHTML = options(uniek("merk"), "Alle merken");
  $("#qsBrandstof").innerHTML = options(uniek("brandstof"), "Alle brandstoffen");
  $("#qsCarrosserie").innerHTML = options(uniek("carrosserie"), "Alle typen");
  $("#qsForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    ["merk", "brandstof", "carrosserie", "prijsMax"].forEach((k) => {
      const v = e.target.elements[k].value;
      if (v) p.set(k, v);
    });
    location.href = "aanbod.html" + (p.toString() ? "?" + p : "");
  });

  // Uitgelichte auto's
  let featured = AUTOS.filter((a) => a.uitgelicht && a.status !== "verkocht");
  if (featured.length < 3) featured = beschikbaar;
  $("#featured").innerHTML = featured.slice(0, 6).map(carCard).join("");

  // Reviews (alleen tonen als er reviews zijn)
  if (REVIEWS.length) {
    $("#reviews").innerHTML = REVIEWS.slice(0, 6).map((r) => `
      <div class="review reveal">
        <div class="stars">${"★".repeat(r.sterren)}${"☆".repeat(5 - r.sterren)}</div>
        <p>"${esc(r.tekst)}"</p>
        <div class="who">${esc(r.naam)}${r.auto ? `<span>${esc(r.auto)}</span>` : ""}</div>
      </div>`).join("");
  } else {
    $("#reviewSection").remove();
  }
}

/* =========================================================
   AANBOD
   ========================================================= */
function initAanbod() {
  const f = $("#filterForm");
  f.elements.merk.innerHTML = options(uniek("merk"), "Alle merken");
  const jaren = uniek("bouwjaar").reverse();
  f.elements.jaarMin.innerHTML = options(jaren, "Vanaf bouwjaar");

  // Chips (brandstof, transmissie, carrosserie)
  const chipGroups = { brandstof: new Set(), transmissie: new Set(), carrosserie: new Set() };
  Object.keys(chipGroups).forEach((key) => {
    const box = $(`#chips-${key}`);
    box.innerHTML = uniek(key).map((v) => `<button type="button" class="chip" data-key="${key}" data-val="${esc(v)}">${esc(v)}</button>`).join("");
  });
  $$(".chip").forEach((chip) => chip.addEventListener("click", () => {
    const set = chipGroups[chip.dataset.key];
    set.has(chip.dataset.val) ? set.delete(chip.dataset.val) : set.add(chip.dataset.val);
    chip.classList.toggle("active");
    render();
  }));

  // Waarden uit de URL overnemen (vanaf "snel zoeken" op de homepage)
  ["merk", "prijsMax", "q"].forEach((k) => { if (params.get(k) && f.elements[k]) f.elements[k].value = params.get(k); });
  ["brandstof", "carrosserie"].forEach((k) => {
    const v = params.get(k);
    if (v) { chipGroups[k].add(v); $$(`.chip[data-key="${k}"]`).forEach((c) => c.dataset.val === v && c.classList.add("active")); }
  });

  function render() {
    const v = Object.fromEntries(new FormData(f));
    const q = (v.q || "").toLowerCase().trim();
    let list = AUTOS.filter((a) => {
      if (!v.toonVerkocht && a.status === "verkocht") return false;
      if (q && !`${a.merk} ${a.model} ${a.uitvoering} ${a.kleur}`.toLowerCase().includes(q)) return false;
      if (v.merk && a.merk !== v.merk) return false;
      if (v.prijsMin && a.prijs < +v.prijsMin) return false;
      if (v.prijsMax && a.prijs > +v.prijsMax) return false;
      if (v.jaarMin && a.bouwjaar < +v.jaarMin) return false;
      if (v.kmMax && a.km > +v.kmMax) return false;
      for (const key in chipGroups) if (chipGroups[key].size && !chipGroups[key].has(a[key])) return false;
      return true;
    });
    const sorts = {
      nieuw: (a, b) => b.id - a.id,
      prijsOp: (a, b) => a.prijs - b.prijs,
      prijsAf: (a, b) => b.prijs - a.prijs,
      kmOp: (a, b) => a.km - b.km,
      jaarAf: (a, b) => b.bouwjaar - a.bouwjaar,
    };
    list.sort(sorts[$("#sort").value]);
    // Verkochte auto's altijd onderaan
    list.sort((a, b) => (a.status === "verkocht") - (b.status === "verkocht"));

    $("#resultCount").innerHTML = `<strong>${list.length}</strong> ${list.length === 1 ? "auto" : "auto's"} gevonden`;
    $("#results").innerHTML = list.length ? list.map(carCard).join("")
      : `<div class="empty" style="grid-column:1/-1"><h3>Geen auto's gevonden</h3><p>Pas je filters aan, of laat ons weten waar je naar zoekt — we gaan graag voor je op zoek.</p><a href="contact.html?onderwerp=Zoekopdracht" class="btn btn-outline" style="margin-top:20px">Zoekopdracht plaatsen</a></div>`;
    initReveal();
  }

  f.addEventListener("input", render);
  f.addEventListener("submit", (e) => e.preventDefault());
  $("#sort").addEventListener("change", render);
  $("#resetFilters").addEventListener("click", () => {
    f.reset();
    Object.values(chipGroups).forEach((s) => s.clear());
    $$(".chip").forEach((c) => c.classList.remove("active"));
    $("#q").value = "";
    history.replaceState(null, "", "aanbod.html");
    render();
  });
  $("#filterToggle").addEventListener("click", () => $(".filters").classList.toggle("open"));
  render();
}

/* =========================================================
   DETAILPAGINA
   ========================================================= */
function initDetail() {
  const auto = AUTOS.find((a) => a.id === Number(params.get("id")));
  const root = $("#detail");
  if (!auto) {
    root.innerHTML = `<div class="empty" style="margin:80px 0"><h3>Deze auto is niet gevonden</h3><p>Mogelijk is hij al verkocht of verwijderd.</p><a href="aanbod.html" class="btn btn-primary" style="margin-top:20px">Naar het aanbod</a></div>`;
    return;
  }
  document.title = `${titel(auto)} ${auto.uitvoering} | ${SITE.naam}`;
  $("#crumbName").textContent = titel(auto);

  const statusTekst = { beschikbaar: "Direct beschikbaar", gereserveerd: "Gereserveerd", verkocht: "Verkocht" }[auto.status];
  const fotos = auto.fotos.length ? auto.fotos : [null];
  const specRows = [
    ["Merk", auto.merk], ["Model", auto.model], ["Uitvoering", auto.uitvoering], ["Bouwjaar", auto.bouwjaar],
    ["Kilometerstand", num(auto.km) + " km"], ["Brandstof", auto.brandstof], ["Transmissie", auto.transmissie],
    ["Vermogen", auto.vermogen + " pk"], ["Carrosserie", auto.carrosserie], ["Kleur", auto.kleur],
    ["Deuren", auto.deuren], ["Zitplaatsen", auto.zitplaatsen], ["BTW / Marge", auto.btw === "BTW" ? "BTW-auto" : "Marge-auto"],
  ];
  const half = Math.ceil(specRows.length / 2);
  const table = (rows) => `<table class="spec-table">${rows.map(([k, v]) => `<tr><td>${k}</td><td>${esc(v)}</td></tr>`).join("")}</table>`;
  const waTekst = `Hallo ${SITE.naam}, ik heb interesse in de ${titel(auto)} ${auto.uitvoering} (${euro(auto.prijs)}). ${location.href}`;

  root.innerHTML = `
  <div class="detail">
    <div>
      <div class="gallery-main" id="galleryMain">
        <div id="galleryImg">${fotoOfPlaceholder(auto, 0)}</div>
        ${fotos.length > 1 ? `<button class="gallery-nav prev" id="gPrev" aria-label="Vorige foto">${ICON.left}</button><button class="gallery-nav next" id="gNext" aria-label="Volgende foto">${ICON.right}</button><span class="gallery-count" id="gCount">1 / ${fotos.length}</span>` : ""}
      </div>
      ${fotos.length > 1 ? `<div class="thumbs">${fotos.map((_, i) => `<button data-i="${i}" class="${i === 0 ? "active" : ""}">${fotoOfPlaceholder(auto, i, false)}</button>`).join("")}</div>` : ""}

      <div class="key-specs">
        <div class="key-spec"><span>Bouwjaar</span><strong>${auto.bouwjaar}</strong></div>
        <div class="key-spec"><span>Kilometers</span><strong>${num(auto.km)}</strong></div>
        <div class="key-spec"><span>Brandstof</span><strong>${esc(auto.brandstof)}</strong></div>
        <div class="key-spec"><span>Vermogen</span><strong>${auto.vermogen} pk</strong></div>
      </div>

      <div class="detail-block"><h2>Omschrijving</h2><p style="color:#c9c9cf">${esc(auto.omschrijving)}</p></div>
      <div class="detail-block"><h2>Specificaties</h2><div class="spec-cols">${table(specRows.slice(0, half))}${table(specRows.slice(half))}</div></div>
      ${auto.opties.length ? `<div class="detail-block"><h2>Opties & accessoires</h2><ul class="options-list">${auto.opties.map((o) => `<li>${esc(o)}</li>`).join("")}</ul></div>` : ""}

    </div>

    <aside class="detail-side">
      <div class="panel">
        <span class="status-pill ${auto.status}">${statusTekst}</span>
        <h1>${esc(titel(auto))}</h1>
        <div class="variant">${esc(auto.uitvoering)}</div>
        <div class="detail-price" style="margin-bottom:24px">${euro(auto.prijs)}<small>${auto.btw === "BTW" ? "incl. BTW" : "rijklaar, marge"}</small></div>
        <div class="side-actions">
          ${auto.status !== "verkocht" ? `
          <a href="contact.html?auto=${auto.id}&onderwerp=Proefrit" class="btn btn-primary btn-block">Plan een proefrit</a>
          <a href="${waLink(waTekst)}" target="_blank" rel="noopener" class="btn btn-ghost btn-block" style="color:#25d366">${ICON.wa} WhatsApp ons</a>
          <a href="${telLink()}" class="btn btn-outline btn-block">${ICON.phone} ${esc(SITE.telefoon)}</a>
          <a href="contact.html?auto=${auto.id}&onderwerp=Inruil" class="btn btn-outline btn-block">${ICON.swap} Inruilwaarde opvragen</a>`
          : `<a href="aanbod.html" class="btn btn-primary btn-block">Bekijk vergelijkbare auto's</a>
             <a href="contact.html?onderwerp=Zoekopdracht" class="btn btn-outline btn-block">Zoekopdracht plaatsen</a>`}
        </div>
      </div>
      <div class="panel" style="display:grid;gap:14px">
        <div class="info-item"><div class="icon">${ICON.shield}</div><div><strong>Garantie</strong><span>Altijd met garantie en NAP-logische kilometerstand</span></div></div>
        <div class="info-item"><div class="icon">${ICON.check}</div><div><strong>Rijklaar afgeleverd</strong><span>Inclusief APK, onderhoudsbeurt en tenaamstelling</span></div></div>
        <div class="info-item"><div class="icon">${ICON.swap}</div><div><strong>Inruil mogelijk</strong><span>Eerlijke inruilprijs voor je huidige auto</span></div></div>
      </div>
    </aside>
  </div>
  <section style="padding-bottom:96px">
    <div class="section-head"><div><span class="eyebrow">Misschien ook interessant</span><h2>Vergelijkbare auto's</h2></div></div>
    <div class="car-grid">${AUTOS.filter((a) => a.id !== auto.id && a.status !== "verkocht")
      .sort((a, b) => Math.abs(a.prijs - auto.prijs) - Math.abs(b.prijs - auto.prijs)).slice(0, 3).map(carCard).join("")}</div>
  </section>`;

  // Galerij
  if (fotos.length > 1) {
    let i = 0;
    const show = (n) => {
      i = (n + fotos.length) % fotos.length;
      $("#galleryImg").innerHTML = fotoOfPlaceholder(auto, i);
      $("#gCount").textContent = `${i + 1} / ${fotos.length}`;
      $$(".thumbs button").forEach((b, j) => b.classList.toggle("active", j === i));
    };
    $("#gPrev").onclick = () => show(i - 1);
    $("#gNext").onclick = () => show(i + 1);
    $$(".thumbs button").forEach((b) => (b.onclick = () => show(+b.dataset.i)));
    document.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") show(i - 1); if (e.key === "ArrowRight") show(i + 1); });
  }

}

/* =========================================================
   CONTACT
   ========================================================= */
function initContact() {
  $("#cTel").innerHTML = `<a href="${telLink()}">${esc(SITE.telefoon)}</a>`;
  $("#cMail").innerHTML = `<a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>`;
  $("#cAdres").innerHTML = `${esc(SITE.adres)}, ${esc(SITE.postcode)} ${esc(SITE.plaats)}`;
  $("#cWa").href = waLink("Hallo " + SITE.naam + ", ik heb een vraag.");
  const vandaag = (new Date().getDay() + 6) % 7; // 0 = maandag
  const rijIndex = vandaag === 0 ? 0 : vandaag <= 4 ? 1 : vandaag === 5 ? 2 : 3;
  $("#hours").innerHTML = SITE.openingstijden.map(([d, t], i) => `<tr class="${i === rijIndex ? "today" : ""}"><td>${esc(d)}</td><td>${esc(t)}</td></tr>`).join("");
  $("#mapFrame").src = "https://maps.google.com/maps?q=" + encodeURIComponent(`${SITE.adres}, ${SITE.postcode} ${SITE.plaats}`) + "&z=15&output=embed";

  const f = $("#contactForm");
  const autoSel = f.elements.auto;
  autoSel.innerHTML = '<option value="">Geen specifieke auto</option>' +
    AUTOS.filter((a) => a.status !== "verkocht").map((a) => `<option value="${a.id}">${esc(titel(a) + " " + a.uitvoering)} – ${euro(a.prijs)}</option>`).join("");
  if (params.get("auto")) autoSel.value = params.get("auto");
  if (params.get("onderwerp")) f.elements.onderwerp.value = params.get("onderwerp");

  const toggleInruil = () => $("#inruilFields").style.display = f.elements.onderwerp.value === "Inruil" ? "contents" : "none";
  f.elements.onderwerp.addEventListener("change", toggleInruil);
  toggleInruil();

  f.addEventListener("submit", async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f));
    const knop = f.querySelector("button[type=submit]");
    knop.disabled = true;
    try {
      const res = await fetch("/api/berichten", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) });
      const uit = await res.json();
      if (!res.ok) throw new Error(uit.fout);
      f.reset();
      $("#formSuccess").textContent = "Bedankt! Je bericht is verzonden. We nemen zo snel mogelijk contact met je op.";
      $("#formSuccess").classList.remove("fout");
    } catch (err) {
      $("#formSuccess").textContent = (err.message || "Er ging iets mis bij het versturen.") + " Je kunt ons ook bellen of WhatsAppen.";
      $("#formSuccess").classList.add("fout");
    }
    knop.disabled = false;
    $("#formSuccess").classList.add("show");
  });
}

/* ---------- Start ---------- */
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/api/site");
    const data = await res.json();
    SITE = data.instellingen; AUTOS = data.autos; REVIEWS = data.reviews;
  } catch {
    document.body.insertAdjacentHTML("afterbegin", '<p style="padding:16px;background:#e5564d;color:#fff;text-align:center">De gegevens konden niet geladen worden. Draait de server? (npm start)</p>');
    return;
  }
  renderHeader();
  renderFooter();
  const page = document.body.dataset.page;
  if (page === "home") initHome();
  if (page === "aanbod") initAanbod();
  if (page === "auto") initDetail();
  if (page === "contact") initContact();
  initReveal();
});
