/* =========================================================
   JD OCCASIONS — BEHEERPAGINA
   ========================================================= */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const euro = (n) => "€ " + Math.round(n || 0).toLocaleString("nl-NL");
const num = (n) => (n == null ? "–" : Number(n).toLocaleString("nl-NL"));
const datum = (s) => {
  const d = new Date(String(s).replace(" ", "T") + "Z");
  const vandaag = new Date();
  if (d.toDateString() === vandaag.toDateString()) return "Vandaag " + d.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: d.getFullYear() !== vandaag.getFullYear() ? "numeric" : undefined }) + " " + d.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
};

const ICON = {
  dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>',
  auto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 17H3v-5l2-5h11l3 5h2v5h-2"/><circle cx="7.5" cy="17" r="2"/><circle cx="16.5" cy="17" r="2"/><path d="M9.5 17h5M5 12h14"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/></svg>',
  ster: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>',
  instellingen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  account: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/></svg>',
  extern: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>',
  uit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  pen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
  prullenbak: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>',
  kopie: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  oog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  links: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>',
  rechts: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>',
  kruis: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>',
  upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>',
  menu: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
};
const AUTO_SILHOUET = '<svg viewBox="0 0 600 220"><path d="M30,150 Q30,128 58,122 L150,108 Q200,66 262,58 L372,56 Q418,60 458,100 L528,112 Q568,120 570,146 L570,156 Q570,164 560,164 L505,164 A45,45 0 0 0 415,164 L195,164 A45,45 0 0 0 105,164 L40,164 Q30,164 30,154 Z" fill="currentColor"/><circle cx="150" cy="164" r="34" fill="currentColor"/><circle cx="460" cy="164" r="34" fill="currentColor"/></svg>';

const KEUZES = {
  brandstof: ["Benzine", "Diesel", "Hybride", "Plug-in hybride", "Elektrisch", "LPG"],
  transmissie: ["Automaat", "Handgeschakeld"],
  carrosserie: ["Hatchback", "Sedan", "Stationwagen", "SUV", "MPV", "Coupé", "Cabriolet", "Bedrijfswagen"],
  merken: ["Alfa Romeo", "Audi", "BMW", "BYD", "Citroën", "Cupra", "Dacia", "Fiat", "Ford", "Honda", "Hyundai", "Jaguar", "Jeep", "Kia", "Land Rover", "Lexus", "Mazda", "Mercedes-Benz", "MG", "Mini", "Mitsubishi", "Nissan", "Opel", "Peugeot", "Polestar", "Porsche", "Renault", "Seat", "Skoda", "Smart", "Subaru", "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo"],
};

/* ---------- Server-communicatie ---------- */
async function api(methode, url, body) {
  const opties = { method: methode, headers: { "X-JD-Admin": "1" } };
  if (body !== undefined) { opties.headers["Content-Type"] = "application/json"; opties.body = JSON.stringify(body); }
  let res;
  try { res = await fetch(url, opties); } catch { throw new Error("Geen verbinding met de server."); }
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && !url.endsWith("/login")) { start(); throw new Error("Je bent uitgelogd. Log opnieuw in."); }
  if (!res.ok) throw new Error(data.fout || "Er ging iets mis.");
  return data;
}

function melding(tekst, fout = false) {
  const el = document.createElement("div");
  el.className = "toast" + (fout ? " fout" : "");
  el.textContent = tekst;
  $("#toasts").append(el);
  setTimeout(() => el.remove(), fout ? 6000 : 3000);
}

const staat = { gebruiker: null, ongelezen: 0, wijzigingen: false };

/* =========================================================
   INLOGGEN / EERSTE ACCOUNT
   ========================================================= */
async function start() {
  const s = await fetch("/api/admin/status").then((r) => r.json()).catch(() => null);
  if (!s) { $("#app").innerHTML = '<div class="laden">Kan de server niet bereiken.</div>'; return; }
  if (!s.heeftAccount) return toonSetup();
  if (!s.gebruiker) return toonLogin();
  staat.gebruiker = s.gebruiker;
  toonApp();
}

function authScherm(titel, tekst, velden, knop) {
  $("#app").innerHTML = `
    <div class="auth"><div class="auth-box">
      <img src="/img/logo-groot.png" alt="JD Occasions">
      <h1>${titel}</h1><p>${tekst}</p>
      <form id="authForm">${velden}<div id="authFout"></div><button class="btn btn-primair btn-blok" type="submit">${knop}</button></form>
      <a class="terug" href="/">← Terug naar de website</a>
    </div></div>`;
}

function toonLogin() {
  authScherm("Inloggen", "Log in om de website te beheren.", `
    <div class="veld"><label for="gn">Gebruikersnaam</label><input id="gn" name="gebruikersnaam" autocomplete="username" required autofocus></div>
    <div class="veld"><label for="ww">Wachtwoord</label><input id="ww" name="wachtwoord" type="password" autocomplete="current-password" required></div>`, "Inloggen");
  bindAuth("/api/admin/login");
}

function toonSetup() {
  authScherm("Welkom! Maak je account aan", "Dit doe je maar één keer. Met dit account log je voortaan in op de beheerpagina.", `
    <div class="veld"><label for="code">Installatiecode</label><input id="code" name="code" required autocomplete="off" style="text-transform:uppercase;letter-spacing:.2em" autofocus>
      <div class="hint">Deze code staat in het venster waarin de server draait (na <code>npm start</code>).</div></div>
    <div class="veld"><label for="nm">Je naam</label><input id="nm" name="naam" autocomplete="name"></div>
    <div class="veld"><label for="gn">Gebruikersnaam</label><input id="gn" name="gebruikersnaam" autocomplete="username" required minlength="3"></div>
    <div class="veld"><label for="ww">Wachtwoord <small>(minimaal 8 tekens)</small></label><input id="ww" name="wachtwoord" type="password" autocomplete="new-password" required minlength="8"></div>
    <div class="veld"><label for="ww2">Herhaal wachtwoord</label><input id="ww2" name="wachtwoord2" type="password" autocomplete="new-password" required minlength="8"></div>`, "Account aanmaken");
  bindAuth("/api/admin/setup", true);
}

function bindAuth(url, herhaal = false) {
  $("#authForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    const fout = (t) => ($("#authFout").innerHTML = `<div class="foutmelding">${esc(t)}</div>`);
    if (herhaal && d.wachtwoord !== d.wachtwoord2) return fout("De wachtwoorden zijn niet hetzelfde.");
    const knop = e.target.querySelector("button"); knop.disabled = true;
    try { await api("POST", url, d); await start(); location.hash = "#/"; }
    catch (err) { fout(err.message); knop.disabled = false; }
  });
}

/* =========================================================
   APP-LAYOUT & NAVIGATIE
   ========================================================= */
function toonApp() {
  const items = [["#/", "Dashboard", "dashboard"], ["#/autos", "Auto's", "auto"], ["#/berichten", "Berichten", "mail"],
    ["#/reviews", "Reviews", "ster"], ["#/instellingen", "Bedrijfsgegevens", "instellingen"], ["#/account", "Account", "account"]];
  $("#app").innerHTML = `
    <div class="shell">
      <aside class="sidebar" id="sidebar">
        <a class="brand" href="#/"><img src="/img/logo-header.png" alt="JD Occasions"><span>Beheer</span></a>
        ${items.map(([h, t, i]) => `<a class="nav-item" href="${h}" data-route="${h}">${ICON[i]}${t}${i === "mail" ? '<span class="teller" id="teller" hidden></span>' : ""}</a>`).join("")}
        <div class="onder">
          <div class="wie">Ingelogd als <strong>${esc(staat.gebruiker.naam || staat.gebruiker.gebruikersnaam)}</strong></div>
          <a class="nav-item" href="/" target="_blank">${ICON.extern}Bekijk website</a>
          <a class="nav-item" href="#" id="uitloggen">${ICON.uit}Uitloggen</a>
        </div>
      </aside>
      <div>
        <div class="topbar-mobiel"><button class="btn-icoon" id="menuKnop" aria-label="Menu">${ICON.menu}</button><img src="/img/logo-header.png" alt=""><span style="width:34px"></span></div>
        <main class="main" id="main"></main>
      </div>
    </div>`;
  $("#menuKnop").onclick = (e) => { e.stopPropagation(); $("#sidebar").classList.toggle("open"); };
  document.addEventListener("click", (e) => { if (!e.target.closest("#sidebar")) $("#sidebar")?.classList.remove("open"); });
  $("#uitloggen").onclick = async (e) => { e.preventDefault(); await api("POST", "/api/admin/logout"); staat.gebruiker = null; start(); };
  window.onhashchange = router;
  router();
  telOngelezen();
}

async function telOngelezen() {
  try {
    const b = await api("GET", "/api/admin/berichten");
    staat.ongelezen = b.filter((x) => !x.gelezen).length;
    const t = $("#teller");
    if (t) { t.hidden = !staat.ongelezen; t.textContent = staat.ongelezen; }
  } catch {}
}

let vorigeHash = location.hash;
async function router() {
  if (!$("#main")) return;
  if (staat.wijzigingen && !confirm("Je hebt wijzigingen die nog niet zijn opgeslagen. Weet je zeker dat je weg wilt gaan?")) {
    history.replaceState(null, "", vorigeHash); return;
  }
  staat.wijzigingen = false;
  vorigeHash = location.hash;
  const hash = location.hash || "#/";
  $("#sidebar")?.classList.remove("open");
  telOngelezen();
  $$(".nav-item[data-route]").forEach((a) => {
    const r = a.dataset.route;
    a.classList.toggle("active", r === "#/" ? hash === "#/" : hash.startsWith(r));
  });
  const main = $("#main");
  main.innerHTML = '<div class="laden" style="min-height:40vh">Laden…</div>';
  window.scrollTo(0, 0);
  try {
    let m;
    if (hash === "#/" || hash === "") await viewDashboard(main);
    else if (hash === "#/autos") await viewAutos(main);
    else if (hash === "#/autos/nieuw") await viewAutoForm(main, null);
    else if ((m = hash.match(/^#\/autos\/(\d+)(\/kopie)?$/))) await viewAutoForm(main, +m[1], !!m[2]);
    else if (hash === "#/berichten") await viewBerichten(main);
    else if (hash === "#/reviews") await viewReviews(main);
    else if (hash === "#/instellingen") await viewInstellingen(main);
    else if (hash === "#/account") viewAccount(main);
    else main.innerHTML = '<div class="leeg"><h3>Pagina niet gevonden</h3></div>';
  } catch (err) {
    main.innerHTML = `<div class="foutmelding">${esc(err.message)}</div>`;
  }
}
window.addEventListener("beforeunload", (e) => { if (staat.wijzigingen) { e.preventDefault(); e.returnValue = ""; } });

/* =========================================================
   DASHBOARD
   ========================================================= */
async function viewDashboard(main) {
  const [autos, berichten] = await Promise.all([api("GET", "/api/admin/autos"), api("GET", "/api/admin/berichten")]);
  const tel = (s) => autos.filter((a) => a.status === s).length;
  const ongelezen = berichten.filter((b) => !b.gelezen);
  const zonderFoto = autos.filter((a) => a.status !== "verkocht" && !a.fotos.length);
  const voorraadWaarde = autos.filter((a) => a.status !== "verkocht").reduce((s, a) => s + (a.prijs || 0), 0);
  main.innerHTML = `
    <div class="pagina-kop">
      <div><h1>Welkom${staat.gebruiker.naam ? ", " + esc(staat.gebruiker.naam) : ""}</h1><p>Hier zie je in één oogopslag hoe het ervoor staat.</p></div>
      <a class="btn btn-primair" href="#/autos/nieuw">${ICON.plus} Auto toevoegen</a>
    </div>
    <div class="tegels">
      <a class="tegel" href="#/autos" style="--kleur:var(--green)"><span>Beschikbaar</span><strong>${tel("beschikbaar")}</strong></a>
      <a class="tegel" href="#/autos" style="--kleur:var(--orange)"><span>Gereserveerd</span><strong>${tel("gereserveerd")}</strong></a>
      <a class="tegel" href="#/autos" style="--kleur:var(--red)"><span>Verkocht</span><strong>${tel("verkocht")}</strong></a>
      <a class="tegel" href="#/berichten"><span>Nieuwe berichten</span><strong>${ongelezen.length}</strong></a>
    </div>
    <div class="twee-kol">
      <div class="kaart">
        <h2>Laatste berichten</h2><p class="sub">Vragen via het contactformulier op de website.</p>
        ${berichten.length ? berichten.slice(0, 5).map((b) => `
          <a href="#/berichten" style="display:flex;justify-content:space-between;gap:12px;padding:12px 0;border-top:1px solid var(--line)">
            <div style="min-width:0"><strong style="${b.gelezen ? "font-weight:500;color:#c9c9cf" : ""}">${!b.gelezen ? '<span style="color:var(--accent)">● </span>' : ""}${esc(b.naam)}</strong>
            <div style="color:var(--muted);font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(b.onderwerp)}${b.auto_naam ? " · " + esc(b.auto_naam) : ""}</div></div>
            <span style="color:var(--muted);font-size:13px;white-space:nowrap">${datum(b.aangemaakt)}</span>
          </a>`).join("") : '<p style="color:var(--muted)">Nog geen berichten.</p>'}
      </div>
      <div class="kaart">
        <h2>Overzicht</h2><p class="sub">Waarde van de voorraad (beschikbaar + gereserveerd)</p>
        <div style="font-family:var(--font-head);font-size:30px;font-weight:600;margin-bottom:18px">${euro(voorraadWaarde)}</div>
        ${zonderFoto.length ? `<div class="foutmelding" style="background:rgba(232,163,61,.1);border-color:rgba(232,163,61,.35);color:#f2c98a">
          ${zonderFoto.length} ${zonderFoto.length === 1 ? "auto heeft" : "auto's hebben"} nog geen foto's:
          ${zonderFoto.slice(0, 5).map((a) => `<a href="#/autos/${a.id}" style="text-decoration:underline">${esc(a.merk + " " + a.model)}</a>`).join(", ")}${zonderFoto.length > 5 ? "…" : ""}</div>` : '<p style="color:var(--green)">✓ Alle auto\'s hebben foto\'s.</p>'}
      </div>
    </div>`;
}

/* =========================================================
   AUTO'S — LIJST
   ========================================================= */
async function viewAutos(main) {
  let autos = await api("GET", "/api/admin/autos");
  main.innerHTML = `
    <div class="pagina-kop">
      <div><h1>Auto's</h1><p>${autos.length} auto's in totaal</p></div>
      <a class="btn btn-primair" href="#/autos/nieuw">${ICON.plus} Auto toevoegen</a>
    </div>
    <div class="filterbalk">
      <div class="veld"><input id="zoek" type="search" placeholder="Zoek op merk, model of uitvoering…"></div>
      <div class="veld"><select id="statusFilter"><option value="">Alle statussen</option><option value="beschikbaar">Beschikbaar</option><option value="gereserveerd">Gereserveerd</option><option value="verkocht">Verkocht</option></select></div>
    </div>
    <div class="lijst" id="lijst"></div>`;

  const teken = () => {
    const q = $("#zoek").value.toLowerCase().trim(), st = $("#statusFilter").value;
    const lijst = autos.filter((a) => (!st || a.status === st) && (!q || `${a.merk} ${a.model} ${a.uitvoering}`.toLowerCase().includes(q)));
    $("#lijst").innerHTML = lijst.length ? lijst.map((a) => `
      <div class="auto-rij" data-id="${a.id}">
        <a class="thumb" href="#/autos/${a.id}">${a.fotos[0] ? `<img src="${esc(a.fotos[0])}" alt="">` : AUTO_SILHOUET}</a>
        <div style="min-width:0">
          <a href="#/autos/${a.id}"><h3>${esc(a.merk)} ${esc(a.model)}</h3></a>
          <div class="meta">${esc(a.uitvoering)}</div>
          <div class="meta">${a.bouwjaar || "–"} · ${num(a.km)} km · ${esc(a.brandstof)} · ${a.fotos.length} foto's</div>
        </div>
        <div class="prijs prijs-kol">${euro(a.prijs)}</div>
        <div class="veld status-kol"><select class="status-select ${a.status}" data-actie="status" aria-label="Status">
          ${["beschikbaar", "gereserveerd", "verkocht"].map((s) => `<option value="${s}" ${a.status === s ? "selected" : ""}>${s[0].toUpperCase() + s.slice(1)}</option>`).join("")}
        </select></div>
        <div class="acties">
          <button class="ster ${a.uitgelicht ? "aan" : ""}" data-actie="uitgelicht" title="${a.uitgelicht ? "Uitgelicht op homepage (klik om uit te zetten)" : "Uitlichten op homepage"}">★</button>
          <a class="btn-icoon" href="/auto.html?id=${a.id}" target="_blank" title="Bekijk op website">${ICON.oog}</a>
          <a class="btn-icoon" href="#/autos/${a.id}" title="Bewerken">${ICON.pen}</a>
          <a class="btn-icoon" href="#/autos/${a.id}/kopie" title="Kopiëren als nieuwe auto">${ICON.kopie}</a>
          <button class="btn-icoon gevaar" data-actie="verwijder" title="Verwijderen">${ICON.prullenbak}</button>
        </div>
      </div>`).join("")
      : `<div class="leeg"><h3>${autos.length ? "Geen auto's gevonden" : "Nog geen auto's"}</h3><p>${autos.length ? "Pas je zoekopdracht aan." : "Voeg je eerste auto toe."}</p></div>`;
  };
  $("#zoek").oninput = teken;
  $("#statusFilter").onchange = teken;

  $("#lijst").addEventListener("change", async (e) => {
    if (e.target.dataset.actie !== "status") return;
    const id = +e.target.closest(".auto-rij").dataset.id;
    try {
      const a = await api("PATCH", `/api/admin/autos/${id}`, { status: e.target.value });
      autos = autos.map((x) => (x.id === id ? a : x));
      e.target.className = "status-select " + a.status;
      melding(`Status gewijzigd naar "${a.status}".`);
    } catch (err) { melding(err.message, true); }
  });
  $("#lijst").addEventListener("click", async (e) => {
    const knop = e.target.closest("[data-actie]");
    if (!knop || knop.tagName === "SELECT") return;
    const id = +knop.closest(".auto-rij").dataset.id;
    const auto = autos.find((a) => a.id === id);
    try {
      if (knop.dataset.actie === "uitgelicht") {
        const a = await api("PATCH", `/api/admin/autos/${id}`, { uitgelicht: !auto.uitgelicht });
        autos = autos.map((x) => (x.id === id ? a : x));
        teken();
        melding(a.uitgelicht ? "Auto staat nu op de homepage." : "Auto staat niet meer op de homepage.");
      }
      if (knop.dataset.actie === "verwijder") {
        if (!confirm(`Weet je zeker dat je de ${auto.merk} ${auto.model} wilt verwijderen? Dit kan niet ongedaan worden gemaakt.\n\nTip: zet hem liever op "Verkocht" als hij verkocht is.`)) return;
        await api("DELETE", `/api/admin/autos/${id}`);
        autos = autos.filter((a) => a.id !== id);
        teken();
        melding("Auto verwijderd.");
      }
    } catch (err) { melding(err.message, true); }
  });
  teken();
}

/* =========================================================
   AUTO — TOEVOEGEN / BEWERKEN
   ========================================================= */
async function viewAutoForm(main, id, kopie = false) {
  let auto = { merk: "", model: "", uitvoering: "", prijs: "", bouwjaar: "", km: "", brandstof: "Benzine", transmissie: "Automaat",
    vermogen: "", kleur: "", carrosserie: "Hatchback", deuren: 5, zitplaatsen: 5, btw: "Marge", status: "beschikbaar", uitgelicht: false, fotos: [], opties: [], omschrijving: "" };
  if (id) {
    const alle = await api("GET", "/api/admin/autos");
    const gevonden = alle.find((a) => a.id === id);
    if (!gevonden) throw new Error("Deze auto bestaat niet (meer).");
    auto = { ...gevonden };
    if (kopie) { auto.fotos = []; auto.status = "beschikbaar"; auto.km = ""; }
  }
  const bewerken = id && !kopie;
  let fotos = [...auto.fotos];

  const sel = (naam, lijst, waarde) => `<select name="${naam}" id="f-${naam}">${[...new Set([...lijst, waarde].filter(Boolean))].map((o) => `<option ${o === waarde ? "selected" : ""}>${esc(o)}</option>`).join("")}</select>`;
  const inp = (naam, label, type = "text", extra = "") => `<div class="veld"><label for="f-${naam}">${label}</label><input id="f-${naam}" name="${naam}" type="${type}" value="${esc(auto[naam] ?? "")}" ${extra}></div>`;

  main.innerHTML = `
    <a class="terug-link" href="#/autos">${ICON.links.replace("<svg", '<svg width="16" height="16"')} Terug naar auto's</a>
    <div class="pagina-kop">
      <div><h1>${bewerken ? `${esc(auto.merk)} ${esc(auto.model)} bewerken` : kopie ? "Kopie van " + esc(auto.merk + " " + auto.model) : "Nieuwe auto"}</h1>
      <p>${bewerken ? "Wijzigingen staan direct online na het opslaan." : "Vul de gegevens in en voeg foto's toe."}</p></div>
      ${bewerken ? `<a class="btn btn-lijn" href="/auto.html?id=${id}" target="_blank">${ICON.oog} Bekijk op website</a>` : ""}
    </div>
    <form id="autoForm" novalidate>
      <div class="kaart">
        <h2>Foto's</h2><p class="sub">De eerste foto is de hoofdfoto. Sleep foto's om de volgorde te veranderen. Grote foto's worden automatisch verkleind.</p>
        <label class="dropzone" id="dropzone">
          ${ICON.upload}<strong>Klik om foto's te kiezen</strong> of sleep ze hierheen<br><small>JPG of PNG · meerdere tegelijk mogelijk</small>
          <input type="file" id="fotoInput" accept="image/jpeg,image/png,image/webp" multiple hidden>
        </label>
        <div class="fotos" id="fotos"></div>
      </div>

      <div class="kaart">
        <h2>Basisgegevens</h2><p class="sub">Velden met * zijn verplicht.</p>
        <div class="raster">
          <div class="veld"><label for="f-merk">Merk *</label><input id="f-merk" name="merk" list="merkenlijst" value="${esc(auto.merk)}" required>
            <datalist id="merkenlijst">${KEUZES.merken.map((m) => `<option value="${m}">`).join("")}</datalist></div>
          ${inp("model", "Model *", "text", "required")}
          ${inp("uitvoering", "Uitvoering", "text", 'placeholder="Bijv. 1.5 TSI Style"')}
          <div class="veld"><label for="f-prijs">Prijs (€) *</label><input id="f-prijs" name="prijs" type="number" min="0" step="1" inputmode="numeric" value="${esc(auto.prijs)}" required></div>
          <div class="veld"><label for="f-btw">BTW / Marge</label><select id="f-btw" name="btw"><option value="Marge" ${auto.btw !== "BTW" ? "selected" : ""}>Marge</option><option value="BTW" ${auto.btw === "BTW" ? "selected" : ""}>BTW (prijs incl. BTW)</option></select></div>
          <div class="veld"><label for="f-status">Status</label><select id="f-status" name="status">${["beschikbaar", "gereserveerd", "verkocht"].map((s) => `<option value="${s}" ${auto.status === s ? "selected" : ""}>${s[0].toUpperCase() + s.slice(1)}</option>`).join("")}</select></div>
          ${inp("bouwjaar", "Bouwjaar", "number", `min="1950" max="${new Date().getFullYear() + 1}" inputmode="numeric"`)}
          ${inp("km", "Kilometerstand", "number", 'min="0" inputmode="numeric"')}
          ${inp("vermogen", "Vermogen (pk)", "number", 'min="0" inputmode="numeric"')}
          <div class="veld"><label for="f-brandstof">Brandstof</label>${sel("brandstof", KEUZES.brandstof, auto.brandstof)}</div>
          <div class="veld"><label for="f-transmissie">Transmissie</label>${sel("transmissie", KEUZES.transmissie, auto.transmissie)}</div>
          <div class="veld"><label for="f-carrosserie">Type</label>${sel("carrosserie", KEUZES.carrosserie, auto.carrosserie)}</div>
          ${inp("kleur", "Kleur")}
          ${inp("deuren", "Deuren", "number", 'min="1" max="7"')}
          ${inp("zitplaatsen", "Zitplaatsen", "number", 'min="1" max="9"')}
          <label class="vinkje breed"><input type="checkbox" name="uitgelicht" ${auto.uitgelicht ? "checked" : ""}> Uitlichten op de homepage (bij "Nieuw binnen")</label>
        </div>
      </div>

      <div class="kaart">
        <h2>Omschrijving & opties</h2><p class="sub">Wat moet een koper weten over deze auto?</p>
        <div class="raster-2">
          <div class="veld"><label for="f-omschrijving">Omschrijving</label><textarea id="f-omschrijving" name="omschrijving" rows="8" placeholder="Bijv. eerste eigenaar, dealeronderhouden, nieuwe APK…">${esc(auto.omschrijving)}</textarea></div>
          <div class="veld"><label for="f-opties">Opties & accessoires <small>(één per regel)</small></label><textarea id="f-opties" name="opties" rows="8" placeholder="Navigatie&#10;Cruise control&#10;Trekhaak">${esc(auto.opties.join("\n"))}</textarea></div>
        </div>
      </div>

      <div id="formFout"></div>
      <div class="formulier-acties">
        <a class="btn btn-lijn" href="#/autos">Annuleren</a>
        <button class="btn btn-primair" type="submit" id="opslaan">${bewerken ? "Wijzigingen opslaan" : "Auto toevoegen"}</button>
      </div>
    </form>`;

  const form = $("#autoForm");
  form.addEventListener("input", () => (staat.wijzigingen = true));

  /* --- Foto's --- */
  let bezig = 0, sleepIndex = null;
  const tekenFotos = () => {
    $("#fotos").innerHTML = fotos.map((f, i) => `
      <div class="foto ${i === 0 ? "hoofd" : ""}" draggable="true" data-i="${i}">
        <img src="${esc(f)}" alt="">${i === 0 ? '<span class="tag">Hoofdfoto</span>' : ""}
        <div class="knoppen">
          <span style="display:flex;gap:4px">
            <button type="button" data-f="links" title="Naar voren" ${i === 0 ? "hidden" : ""}>${ICON.links}</button>
            <button type="button" data-f="rechts" title="Naar achteren" ${i === fotos.length - 1 ? "hidden" : ""}>${ICON.rechts}</button>
          </span>
          <button type="button" class="weg" data-f="weg" title="Verwijderen">${ICON.kruis}</button>
        </div>
      </div>`).join("") + Array.from({ length: bezig }, () => '<div class="foto bezig">Uploaden…</div>').join("");
  };
  const verplaats = (van, naar) => { const [f] = fotos.splice(van, 1); fotos.splice(naar, 0, f); staat.wijzigingen = true; tekenFotos(); };
  $("#fotos").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-f]"); if (!b) return;
    const i = +b.closest(".foto").dataset.i;
    if (b.dataset.f === "links") verplaats(i, i - 1);
    if (b.dataset.f === "rechts") verplaats(i, i + 1);
    if (b.dataset.f === "weg") { fotos.splice(i, 1); staat.wijzigingen = true; tekenFotos(); }
  });
  $("#fotos").addEventListener("dragstart", (e) => { const f = e.target.closest(".foto"); if (!f) return; sleepIndex = +f.dataset.i; f.classList.add("sleept"); });
  $("#fotos").addEventListener("dragend", () => { sleepIndex = null; tekenFotos(); });
  $("#fotos").addEventListener("dragover", (e) => { if (sleepIndex !== null) e.preventDefault(); });
  $("#fotos").addEventListener("drop", (e) => {
    e.preventDefault(); e.stopPropagation();
    const doel = e.target.closest(".foto");
    if (sleepIndex !== null && doel) verplaats(sleepIndex, +doel.dataset.i);
  });

  const uploaden = async (bestanden) => {
    const lijst = [...bestanden].filter((f) => f.type.startsWith("image/"));
    if (!lijst.length) return;
    bezig += lijst.length; tekenFotos();
    for (const bestand of lijst) {
      try {
        const data = await verkleinFoto(bestand);
        const { pad } = await api("POST", "/api/admin/fotos", { data });
        fotos.push(pad); staat.wijzigingen = true;
      } catch (err) { melding(`${bestand.name}: ${err.message}`, true); }
      bezig--; tekenFotos();
    }
  };
  $("#fotoInput").onchange = (e) => { uploaden(e.target.files); e.target.value = ""; };
  const dz = $("#dropzone");
  dz.addEventListener("dragover", (e) => { if (sleepIndex === null) { e.preventDefault(); dz.classList.add("over"); } });
  dz.addEventListener("dragleave", () => dz.classList.remove("over"));
  dz.addEventListener("drop", (e) => { e.preventDefault(); dz.classList.remove("over"); uploaden(e.dataTransfer.files); });
  tekenFotos();

  /* --- Opslaan --- */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (bezig) return melding("Wacht even tot alle foto's zijn geüpload.", true);
    const d = Object.fromEntries(new FormData(form));
    const fout = (t) => { $("#formFout").innerHTML = `<div class="foutmelding" style="margin-top:20px">${esc(t)}</div>`; };
    if (!d.merk.trim() || !d.model.trim()) return fout("Vul het merk en het model in.");
    if (d.prijs === "" || +d.prijs < 0) return fout("Vul een geldige prijs in.");
    const data = { ...d, uitgelicht: !!d.uitgelicht, fotos, opties: d.opties.split("\n").map((o) => o.trim()).filter(Boolean) };
    const knop = $("#opslaan"); knop.disabled = true;
    try {
      const a = await api(bewerken ? "PUT" : "POST", bewerken ? `/api/admin/autos/${id}` : "/api/admin/autos", data);
      staat.wijzigingen = false;
      melding(bewerken ? "Wijzigingen opgeslagen." : `${a.merk} ${a.model} is toegevoegd en staat online.`);
      location.hash = "#/autos";
    } catch (err) { fout(err.message); knop.disabled = false; }
  });
}

// Verklein een foto in de browser (max. 1600 px breed, JPG) zodat de site snel blijft
async function verkleinFoto(bestand, max = 1600) {
  let bron;
  try { bron = await createImageBitmap(bestand); }
  catch { throw new Error("Deze foto kan niet gelezen worden. Gebruik JPG of PNG."); }
  const schaal = Math.min(1, max / Math.max(bron.width, bron.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bron.width * schaal);
  canvas.height = Math.round(bron.height * schaal);
  canvas.getContext("2d").drawImage(bron, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.82);
}

/* =========================================================
   BERICHTEN
   ========================================================= */
async function viewBerichten(main) {
  let berichten = await api("GET", "/api/admin/berichten");
  main.innerHTML = `
    <div class="pagina-kop"><div><h1>Berichten</h1><p>Berichten die via het contactformulier zijn verstuurd.</p></div></div>
    <div id="berichtenLijst"></div>`;
  const teken = () => {
    $("#berichtenLijst").innerHTML = berichten.length ? berichten.map((b) => {
      const tel = (b.telefoon || "").replace(/[^\d+]/g, "");
      const wa = tel.replace(/^\+/, "").replace(/^0(?=6)/, "31");
      return `
      <div class="bericht ${b.gelezen ? "gelezen" : ""}" data-id="${b.id}">
        <div class="bericht-kop">
          <span class="stip"></span>
          <div style="min-width:0"><span class="naam">${esc(b.naam)}</span><span class="onderwerp-tag">${esc(b.onderwerp || "Vraag")}</span>
            <div class="voorbeeld">${b.auto_naam ? esc(b.auto_naam) + " — " : ""}${esc(b.bericht)}</div></div>
          <span class="datum">${datum(b.aangemaakt)}</span>
        </div>
        <div class="bericht-inhoud">
          <dl class="bericht-gegevens">
            <dt>E-mail</dt><dd><a href="mailto:${esc(b.email)}" style="color:var(--accent)">${esc(b.email)}</a></dd>
            ${b.telefoon ? `<dt>Telefoon</dt><dd><a href="tel:${esc(tel)}" style="color:var(--accent)">${esc(b.telefoon)}</a></dd>` : ""}
            ${b.auto_naam ? `<dt>Auto</dt><dd>${b.auto_id ? `<a href="#/autos/${b.auto_id}" style="color:var(--accent)">${esc(b.auto_naam)}</a>` : esc(b.auto_naam)}</dd>` : ""}
            ${b.kenteken || b.inruil_km ? `<dt>Inruilauto</dt><dd>${esc(b.kenteken || "–")} · ${esc(b.inruil_km || "–")} km</dd>` : ""}
          </dl>
          <div class="bericht-tekst">${esc(b.bericht)}</div>
          <div class="bericht-acties">
            <a class="btn btn-primair btn-klein" href="mailto:${esc(b.email)}?subject=${encodeURIComponent("Re: " + (b.onderwerp || "je vraag") + (b.auto_naam ? " – " + b.auto_naam : ""))}">${ICON.mail} Beantwoorden</a>
            ${tel ? `<a class="btn btn-lijn btn-klein" href="tel:${esc(tel)}">Bellen</a><a class="btn btn-lijn btn-klein" href="https://wa.me/${esc(wa)}" target="_blank" rel="noopener" style="color:#25d366">WhatsApp</a>` : ""}
            <button class="btn btn-lijn btn-klein" data-actie="ongelezen">Markeer als ongelezen</button>
            <button class="btn btn-gevaar btn-klein" data-actie="verwijder">${ICON.prullenbak} Verwijderen</button>
          </div>
        </div>
      </div>`;
    }).join("") : '<div class="leeg"><h3>Nog geen berichten</h3><p>Zodra iemand het contactformulier invult, verschijnt het hier.</p></div>';
  };
  $("#berichtenLijst").addEventListener("click", async (e) => {
    const el = e.target.closest(".bericht"); if (!el) return;
    const id = +el.dataset.id, b = berichten.find((x) => x.id === id);
    const actie = e.target.closest("[data-actie]")?.dataset.actie;
    try {
      if (actie === "verwijder") {
        if (!confirm(`Bericht van ${b.naam} verwijderen?`)) return;
        await api("DELETE", `/api/admin/berichten/${id}`);
        berichten = berichten.filter((x) => x.id !== id); teken(); telOngelezen(); melding("Bericht verwijderd.");
      } else if (actie === "ongelezen") {
        await api("PATCH", `/api/admin/berichten/${id}`, { gelezen: false });
        b.gelezen = 0; el.classList.remove("open"); el.classList.remove("gelezen"); telOngelezen();
      } else if (e.target.closest(".bericht-kop")) {
        el.classList.toggle("open");
        if (!b.gelezen) { b.gelezen = 1; el.classList.add("gelezen"); await api("PATCH", `/api/admin/berichten/${id}`, { gelezen: true }); telOngelezen(); }
      }
    } catch (err) { melding(err.message, true); }
  });
  teken();
}

/* =========================================================
   REVIEWS
   ========================================================= */
async function viewReviews(main) {
  let reviews = await api("GET", "/api/admin/reviews");
  main.innerHTML = `
    <div class="pagina-kop">
      <div><h1>Reviews</h1><p>Ervaringen van klanten die op de homepage staan. Zonder zichtbare reviews wordt dat blok verborgen.</p></div>
      <button class="btn btn-primair" id="nieuweReview">${ICON.plus} Review toevoegen</button>
    </div>
    <div id="reviewLijst"></div>
    <dialog id="reviewDialoog"></dialog>`;
  const teken = () => {
    $("#reviewLijst").innerHTML = reviews.length ? reviews.map((r) => `
      <div class="kaart review-rij" data-id="${r.id}">
        <div>
          <div class="sterren">${"★".repeat(r.sterren)}<span style="color:#44444c">${"★".repeat(5 - r.sterren)}</span>${r.zichtbaar ? "" : '<span class="verborgen-tag">Verborgen</span>'}</div>
          <p>"${esc(r.tekst)}"</p>
          <div class="wie"><strong style="color:var(--text)">${esc(r.naam)}</strong>${r.auto ? " · " + esc(r.auto) : ""}</div>
        </div>
        <div style="display:flex;gap:6px">
          <button class="btn-icoon" data-actie="bewerk" title="Bewerken">${ICON.pen}</button>
          <button class="btn-icoon gevaar" data-actie="verwijder" title="Verwijderen">${ICON.prullenbak}</button>
        </div>
      </div>`).join("") : '<div class="leeg"><h3>Nog geen reviews</h3><p>Vraag tevreden klanten om een korte ervaring en zet die hier.</p></div>';
  };
  const herlaad = async () => { reviews = await api("GET", "/api/admin/reviews"); teken(); };

  const openDialoog = (r = { naam: "", auto: "", tekst: "", sterren: 5, zichtbaar: 1 }) => {
    const dlg = $("#reviewDialoog");
    let sterren = r.sterren;
    dlg.innerHTML = `
      <h2>${r.id ? "Review bewerken" : "Review toevoegen"}</h2>
      <form id="reviewForm" style="display:grid;gap:14px">
        <div class="veld"><label>Beoordeling</label><div class="sterren-kiezer">${[1, 2, 3, 4, 5].map((n) => `<button type="button" data-n="${n}">★</button>`).join("")}</div></div>
        <div class="raster-2">
          <div class="veld"><label for="r-naam">Naam klant *</label><input id="r-naam" name="naam" value="${esc(r.naam)}" required></div>
          <div class="veld"><label for="r-auto">Gekochte auto</label><input id="r-auto" name="auto" value="${esc(r.auto)}" placeholder="Bijv. Volkswagen Golf"></div>
        </div>
        <div class="veld"><label for="r-tekst">Review *</label><textarea id="r-tekst" name="tekst" required>${esc(r.tekst)}</textarea></div>
        <label class="vinkje"><input type="checkbox" name="zichtbaar" ${r.zichtbaar ? "checked" : ""}> Tonen op de website</label>
        <div id="reviewFout"></div>
        <div style="display:flex;gap:10px;justify-content:flex-end"><button type="button" class="btn btn-lijn" id="annuleer">Annuleren</button><button class="btn btn-primair" type="submit">Opslaan</button></div>
      </form>`;
    const tekenSterren = () => $$(".sterren-kiezer button", dlg).forEach((b) => b.classList.toggle("aan", +b.dataset.n <= sterren));
    $$(".sterren-kiezer button", dlg).forEach((b) => (b.onclick = () => { sterren = +b.dataset.n; tekenSterren(); }));
    tekenSterren();
    $("#annuleer", dlg).onclick = () => dlg.close();
    $("#reviewForm", dlg).onsubmit = async (e) => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(e.target));
      try {
        await api(r.id ? "PUT" : "POST", r.id ? `/api/admin/reviews/${r.id}` : "/api/admin/reviews", { ...d, sterren, zichtbaar: !!d.zichtbaar });
        dlg.close(); melding("Review opgeslagen."); herlaad();
      } catch (err) { $("#reviewFout", dlg).innerHTML = `<div class="foutmelding">${esc(err.message)}</div>`; }
    };
    dlg.showModal();
  };
  $("#nieuweReview").onclick = () => openDialoog();
  $("#reviewLijst").addEventListener("click", async (e) => {
    const knop = e.target.closest("[data-actie]"); if (!knop) return;
    const r = reviews.find((x) => x.id === +knop.closest("[data-id]").dataset.id);
    if (knop.dataset.actie === "bewerk") openDialoog(r);
    if (knop.dataset.actie === "verwijder" && confirm(`Review van ${r.naam} verwijderen?`)) {
      try { await api("DELETE", `/api/admin/reviews/${r.id}`); melding("Review verwijderd."); herlaad(); } catch (err) { melding(err.message, true); }
    }
  });
  teken();
}

/* =========================================================
   BEDRIJFSGEGEVENS
   ========================================================= */
async function viewInstellingen(main) {
  const s = await api("GET", "/api/admin/instellingen");
  let tijden = (s.openingstijden || []).map((r) => [...r]);
  const inp = (naam, label, hint = "", type = "text") => `<div class="veld"><label for="s-${naam}">${label}</label><input id="s-${naam}" name="${naam}" type="${type}" value="${esc(s[naam] || "")}">${hint ? `<div class="hint">${hint}</div>` : ""}</div>`;
  main.innerHTML = `
    <div class="pagina-kop"><div><h1>Bedrijfsgegevens</h1><p>Deze gegevens staan op de hele website (menubalk, footer, contactpagina).</p></div></div>
    <form id="instForm">
      <div class="kaart">
        <h2>Algemeen</h2><p class="sub">Naam en contactgegevens.</p>
        <div class="raster-2">
          ${inp("naam", "Bedrijfsnaam")}
          ${inp("slogan", "Slogan", "Staat onderaan de website.")}
          ${inp("telefoon", "Telefoonnummer", "Zoals het op de site moet staan, bijv. 06 12 34 56 78", "tel")}
          ${inp("whatsapp", "WhatsApp-nummer", "Bijv. 0612345678 — wordt automatisch omgezet.", "tel")}
          ${inp("email", "E-mailadres", "", "email")}
          ${inp("kvk", "KvK-nummer")}
        </div>
      </div>
      <div class="kaart">
        <h2>Adres</h2><p class="sub">Wordt ook gebruikt voor de kaart op de contactpagina.</p>
        <div class="raster">${inp("adres", "Straat en huisnummer")}${inp("postcode", "Postcode")}${inp("plaats", "Plaats")}</div>
      </div>
      <div class="kaart">
        <h2>Openingstijden</h2><p class="sub">Vrij in te vullen, bijv. "Dinsdag – vrijdag" en "10:00 – 18:00".</p>
        <div id="tijden"></div>
        <button type="button" class="btn btn-lijn btn-klein" id="tijdErbij">${ICON.plus} Regel toevoegen</button>
      </div>
      <div class="formulier-acties"><button class="btn btn-primair" type="submit">Opslaan</button></div>
    </form>`;
  const tekenTijden = () => {
    $("#tijden").innerHTML = tijden.map(([d, t], i) => `
      <div class="tijden-rij" data-i="${i}">
        <div class="veld"><input value="${esc(d)}" data-k="0" placeholder="Dag(en)" aria-label="Dag"></div>
        <div class="veld"><input value="${esc(t)}" data-k="1" placeholder="Tijden" aria-label="Tijden"></div>
        <button type="button" class="btn-icoon gevaar" title="Regel verwijderen">${ICON.prullenbak}</button>
      </div>`).join("");
  };
  $("#tijden").addEventListener("input", (e) => { const rij = e.target.closest(".tijden-rij"); tijden[+rij.dataset.i][+e.target.dataset.k] = e.target.value; });
  $("#tijden").addEventListener("click", (e) => { if (e.target.closest("button")) { tijden.splice(+e.target.closest(".tijden-rij").dataset.i, 1); staat.wijzigingen = true; tekenTijden(); } });
  $("#tijdErbij").onclick = () => { tijden.push(["", ""]); tekenTijden(); };
  $("#instForm").addEventListener("input", () => (staat.wijzigingen = true));
  $("#instForm").onsubmit = async (e) => {
    e.preventDefault();
    try {
      const d = Object.fromEntries(new FormData(e.target));
      await api("PUT", "/api/admin/instellingen", { ...d, openingstijden: tijden.filter(([dag]) => dag.trim()) });
      staat.wijzigingen = false;
      melding("Bedrijfsgegevens opgeslagen.");
      viewInstellingen(main);
    } catch (err) { melding(err.message, true); }
  };
  tekenTijden();
}

/* =========================================================
   ACCOUNT
   ========================================================= */
function viewAccount(main) {
  main.innerHTML = `
    <div class="pagina-kop"><div><h1>Account</h1><p>Ingelogd als <strong>${esc(staat.gebruiker.gebruikersnaam)}</strong></p></div></div>
    <div class="twee-kol">
      <div class="kaart">
        <h2>Wachtwoord wijzigen</h2><p class="sub">Gebruik een sterk wachtwoord van minimaal 8 tekens.</p>
        <form id="wwForm" style="display:grid;gap:14px">
          <div class="veld"><label for="a-huidig">Huidig wachtwoord</label><input id="a-huidig" name="huidig" type="password" autocomplete="current-password" required></div>
          <div class="veld"><label for="a-nieuw">Nieuw wachtwoord</label><input id="a-nieuw" name="nieuw" type="password" autocomplete="new-password" minlength="8" required></div>
          <div class="veld"><label for="a-nieuw2">Herhaal nieuw wachtwoord</label><input id="a-nieuw2" name="nieuw2" type="password" autocomplete="new-password" minlength="8" required></div>
          <div id="wwFout"></div>
          <div><button class="btn btn-primair" type="submit">Wachtwoord wijzigen</button></div>
        </form>
      </div>
      <div class="kaart">
        <h2>Back-up</h2><p class="sub">Download alle gegevens (auto's, berichten, reviews, bedrijfsgegevens) als bestand. Doe dit af en toe en bewaar het op een veilige plek.</p>
        <a class="btn btn-lijn" href="/api/admin/backup">${ICON.download} Back-up downloaden</a>
        <p class="sub" style="margin:16px 0 0;font-size:13px">Let op: de foto's zelf zitten niet in dit bestand. Die staan in de map <code>data/uploads</code> op de server.</p>
      </div>
    </div>`;
  $("#wwForm").onsubmit = async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    const fout = (t) => ($("#wwFout").innerHTML = `<div class="foutmelding">${esc(t)}</div>`);
    if (d.nieuw !== d.nieuw2) return fout("De nieuwe wachtwoorden zijn niet hetzelfde.");
    try { await api("PUT", "/api/admin/wachtwoord", d); e.target.reset(); $("#wwFout").innerHTML = ""; melding("Wachtwoord gewijzigd."); }
    catch (err) { fout(err.message); }
  };
}

start();
