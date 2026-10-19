/* =========================================================
   JD OCCASIONS — SERVER
   Start met:  npm start   (of: node server.js)
   Website:    http://localhost:3000
   Beheer:     http://localhost:3000/admin
   Gebruikt alleen ingebouwde onderdelen van Node.js (versie 22.13 of nieuwer).
   ========================================================= */
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { db, autos, instellingen, UPLOAD_DIR } = require("./server/db");

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");
const SESSIE_DUUR = 1000 * 60 * 60 * 24 * 7; // 7 dagen ingelogd blijven
const COOKIE = "jd_sessie";
// Code die nodig is om het allereerste account aan te maken (staat in het terminalvenster)
const SETUP_CODE = process.env.SETUP_CODE || crypto.randomBytes(3).toString("hex").toUpperCase();
const geenAccount = () => db.prepare("SELECT COUNT(*) n FROM gebruikers").get().n === 0;

/* ---------- Kleine hulpfuncties ---------- */
const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".svg": "image/svg+xml", ".ico": "image/x-icon", ".txt": "text/plain; charset=utf-8", ".gif": "image/gif",
};

class Fout extends Error { constructor(status, bericht) { super(bericht); this.status = status; } }

function stuurJson(res, status, data, extraHeaders = {}) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...extraHeaders });
  res.end(JSON.stringify(data));
}

function leesBody(req, maxBytes = 1_000_000) {
  return new Promise((resolve, reject) => {
    let grootte = 0; const delen = [];
    req.on("data", (d) => {
      grootte += d.length;
      if (grootte > maxBytes) { reject(new Fout(413, "Bestand of bericht is te groot.")); req.destroy(); return; }
      delen.push(d);
    });
    req.on("end", () => {
      if (!grootte) return resolve({});
      try { resolve(JSON.parse(Buffer.concat(delen).toString("utf8"))); } catch { reject(new Fout(400, "Ongeldige gegevens.")); }
    });
    req.on("error", reject);
  });
}

function cookies(req) {
  return Object.fromEntries((req.headers.cookie || "").split(";").map((c) => c.trim().split("=")).filter((p) => p.length === 2));
}

const isHttps = (req) => req.socket.encrypted || req.headers["x-forwarded-proto"] === "https";
const ip = (req) => (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket.remoteAddress;

/* ---------- Wachtwoorden & sessies ---------- */
function hashWachtwoord(wachtwoord) {
  const zout = crypto.randomBytes(16).toString("hex");
  return zout + ":" + crypto.scryptSync(wachtwoord, zout, 64).toString("hex");
}
function controleerWachtwoord(wachtwoord, opgeslagen) {
  const [zout, hash] = String(opgeslagen).split(":");
  if (!zout || !hash) return false;
  const test = crypto.scryptSync(wachtwoord, zout, 64);
  return crypto.timingSafeEqual(test, Buffer.from(hash, "hex"));
}
const tokenHash = (t) => crypto.createHash("sha256").update(t).digest("hex");

function maakSessie(res, req, gebruikerId) {
  const token = crypto.randomBytes(32).toString("hex");
  db.prepare("INSERT INTO sessies (token, gebruiker_id, verloopt) VALUES (?, ?, ?)").run(tokenHash(token), gebruikerId, Date.now() + SESSIE_DUUR);
  db.prepare("DELETE FROM sessies WHERE verloopt < ?").run(Date.now());
  res.setHeader("Set-Cookie", `${COOKIE}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSIE_DUUR / 1000}${isHttps(req) ? "; Secure" : ""}`);
}

function huidigeGebruiker(req) {
  const token = cookies(req)[COOKIE];
  if (!token) return null;
  return db.prepare(`SELECT g.id, g.gebruikersnaam, g.naam FROM sessies s JOIN gebruikers g ON g.id = s.gebruiker_id
                     WHERE s.token = ? AND s.verloopt > ?`).get(tokenHash(token), Date.now()) || null;
}

// Simpele bescherming tegen te veel pogingen (inloggen / contactformulier)
const pogingen = new Map();
function beperk(sleutel, max, minuten) {
  const nu = Date.now();
  const lijst = (pogingen.get(sleutel) || []).filter((t) => nu - t < minuten * 60_000);
  if (lijst.length >= max) throw new Fout(429, `Te veel pogingen. Probeer het over ${minuten} minuten opnieuw.`);
  lijst.push(nu); pogingen.set(sleutel, lijst);
}

function controleerWachtwoordEisen(w) {
  if (typeof w !== "string" || w.length < 8) throw new Fout(400, "Het wachtwoord moet minimaal 8 tekens lang zijn.");
}

/* ---------- Foto's ---------- */
function slaFotoOp(dataUrl) {
  const m = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/.exec(String(dataUrl || ""));
  if (!m) throw new Fout(400, "Alleen JPG-, PNG- of WebP-foto's zijn toegestaan.");
  const buf = Buffer.from(m[2], "base64");
  const naam = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${m[1] === "jpeg" ? "jpg" : m[1]}`;
  fs.writeFileSync(path.join(UPLOAD_DIR, naam), buf);
  return "/uploads/" + naam;
}

// Verwijder specifieke foto's direct (als geen andere auto ze gebruikt)
function verwijderFotos(lijst) {
  const inGebruik = new Set(autos.alle().flatMap((a) => a.fotos));
  for (const f of lijst) {
    if (inGebruik.has(f)) continue;
    try { fs.unlinkSync(path.join(UPLOAD_DIR, path.basename(f))); } catch {}
  }
}

// Verwijder foto's die door geen enkele auto meer gebruikt worden
function ruimFotosOp(minLeeftijdMs = 0) {
  const inGebruik = new Set(autos.alle().flatMap((a) => a.fotos.map((f) => path.basename(f))));
  for (const bestand of fs.readdirSync(UPLOAD_DIR)) {
    if (inGebruik.has(bestand)) continue;
    const vol = path.join(UPLOAD_DIR, bestand);
    if (Date.now() - fs.statSync(vol).mtimeMs >= minLeeftijdMs) fs.unlinkSync(vol);
  }
}

/* ---------- API-routes ---------- */
const routes = [];
const route = (methode, patroon, handler, opties = {}) => {
  const keys = [];
  const regex = new RegExp("^" + patroon.replace(/:(\w+)/g, (_, k) => (keys.push(k), "(\\d+)")) + "$");
  routes.push({ methode, regex, keys, handler, ...opties });
};

const tekst = (v, max = 500) => String(v ?? "").trim().slice(0, max);

// --- Openbaar ---
route("GET", "/api/site", () => ({
  instellingen: instellingen.alle(),
  autos: autos.alle(),
  reviews: db.prepare("SELECT id, naam, auto, tekst, sterren FROM reviews WHERE zichtbaar = 1 ORDER BY id DESC").all(),
}));

route("POST", "/api/berichten", async (req) => {
  const b = await leesBody(req);
  if (b.website) return { ok: true }; // honeypot: spam-robot
  beperk("bericht:" + ip(req), 5, 10);
  const naam = tekst(b.naam, 100), email = tekst(b.email, 150), bericht = tekst(b.bericht, 5000);
  if (!naam || !bericht || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Fout(400, "Vul je naam, een geldig e-mailadres en een bericht in.");
  const auto = b.auto ? autos.een(Number(b.auto)) : null;
  db.prepare(`INSERT INTO berichten (naam, email, telefoon, onderwerp, auto_id, auto_naam, kenteken, inruil_km, bericht)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    naam, email, tekst(b.telefoon, 40), tekst(b.onderwerp, 60), auto ? auto.id : null,
    auto ? `${auto.merk} ${auto.model} ${auto.uitvoering}`.trim() : null, tekst(b.kenteken, 20).toUpperCase(), tekst(b.inruilKm, 20), bericht);
  return { ok: true };
});

// --- Inloggen ---
route("GET", "/api/admin/status", (req) => ({
  heeftAccount: db.prepare("SELECT COUNT(*) n FROM gebruikers").get().n > 0,
  gebruiker: huidigeGebruiker(req),
}));

route("POST", "/api/admin/setup", async (req, res) => {
  if (!geenAccount()) throw new Fout(403, "Er bestaat al een account.");
  beperk("setup:" + ip(req), 10, 15);
  const b = await leesBody(req);
  if (String(b.code || "").trim().toUpperCase() !== SETUP_CODE) throw new Fout(400, "De installatiecode klopt niet. Je vindt hem in het venster waarin de server draait.");
  const gebruikersnaam = tekst(b.gebruikersnaam, 50).toLowerCase();
  if (!/^[a-z0-9._-]{3,}$/.test(gebruikersnaam)) throw new Fout(400, "Gebruikersnaam: minimaal 3 tekens, alleen letters, cijfers, punt, streepje.");
  controleerWachtwoordEisen(b.wachtwoord);
  const r = db.prepare("INSERT INTO gebruikers (gebruikersnaam, naam, wachtwoord) VALUES (?, ?, ?)").run(gebruikersnaam, tekst(b.naam, 80), hashWachtwoord(b.wachtwoord));
  maakSessie(res, req, Number(r.lastInsertRowid));
  return { ok: true };
});

route("POST", "/api/admin/login", async (req, res) => {
  beperk("login:" + ip(req), 10, 15);
  const b = await leesBody(req);
  const g = db.prepare("SELECT * FROM gebruikers WHERE gebruikersnaam = ?").get(tekst(b.gebruikersnaam, 50).toLowerCase());
  if (!g || !controleerWachtwoord(String(b.wachtwoord || ""), g.wachtwoord)) throw new Fout(401, "Gebruikersnaam of wachtwoord klopt niet.");
  maakSessie(res, req, g.id);
  return { ok: true };
});

route("POST", "/api/admin/logout", (req, res) => {
  const token = cookies(req)[COOKIE];
  if (token) db.prepare("DELETE FROM sessies WHERE token = ?").run(tokenHash(token));
  res.setHeader("Set-Cookie", `${COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`);
  return { ok: true };
});

// --- Beheer (alleen ingelogd) ---
const beheer = { beveiligd: true };

route("GET", "/api/admin/autos", () => autos.alle(), beheer);
route("POST", "/api/admin/autos", async (req) => {
  try { return autos.een(autos.opslaan(await leesBody(req))); } catch (e) { throw e instanceof Fout ? e : new Fout(400, e.message); }
}, beheer);
route("PUT", "/api/admin/autos/:id", async (req, res, p) => {
  const oud = autos.een(p.id);
  if (!oud) throw new Fout(404, "Auto niet gevonden.");
  try { autos.opslaan(await leesBody(req), p.id); } catch (e) { throw e instanceof Fout ? e : new Fout(400, e.message); }
  const nieuw = autos.een(p.id);
  verwijderFotos(oud.fotos.filter((f) => !nieuw.fotos.includes(f)));
  return nieuw;
}, beheer);
route("PATCH", "/api/admin/autos/:id", async (req, res, p) => {
  const b = await leesBody(req);
  const velden = {};
  if ("status" in b) velden.status = b.status;
  if ("uitgelicht" in b) velden.uitgelicht = b.uitgelicht;
  const a = autos.deel(p.id, velden);
  if (!a) throw new Fout(404, "Auto niet gevonden.");
  return a;
}, beheer);
route("DELETE", "/api/admin/autos/:id", (req, res, p) => {
  const oud = autos.een(p.id);
  autos.verwijder(p.id);
  if (oud) verwijderFotos(oud.fotos);
  return { ok: true };
}, beheer);

route("POST", "/api/admin/fotos", async (req) => ({ pad: slaFotoOp((await leesBody(req, 15_000_000)).data) }), beheer);

route("GET", "/api/admin/berichten", () => db.prepare("SELECT * FROM berichten ORDER BY id DESC").all(), beheer);
route("PATCH", "/api/admin/berichten/:id", async (req, res, p) => {
  const b = await leesBody(req);
  db.prepare("UPDATE berichten SET gelezen = ? WHERE id = ?").run(b.gelezen ? 1 : 0, p.id);
  return { ok: true };
}, beheer);
route("DELETE", "/api/admin/berichten/:id", (req, res, p) => (db.prepare("DELETE FROM berichten WHERE id = ?").run(p.id), { ok: true }), beheer);

const schoonReview = (b) => {
  const r = { naam: tekst(b.naam, 80), auto: tekst(b.auto, 100), tekst: tekst(b.tekst, 1500), sterren: Math.min(5, Math.max(1, Math.round(+b.sterren || 5))), zichtbaar: b.zichtbaar ? 1 : 0 };
  if (!r.naam || !r.tekst) throw new Fout(400, "Naam en tekst zijn verplicht.");
  return r;
};
route("GET", "/api/admin/reviews", () => db.prepare("SELECT * FROM reviews ORDER BY id DESC").all(), beheer);
route("POST", "/api/admin/reviews", async (req) => {
  const r = schoonReview(await leesBody(req));
  db.prepare("INSERT INTO reviews (naam, auto, tekst, sterren, zichtbaar) VALUES (?, ?, ?, ?, ?)").run(r.naam, r.auto, r.tekst, r.sterren, r.zichtbaar);
  return { ok: true };
}, beheer);
route("PUT", "/api/admin/reviews/:id", async (req, res, p) => {
  const r = schoonReview(await leesBody(req));
  db.prepare("UPDATE reviews SET naam = ?, auto = ?, tekst = ?, sterren = ?, zichtbaar = ? WHERE id = ?").run(r.naam, r.auto, r.tekst, r.sterren, r.zichtbaar, p.id);
  return { ok: true };
}, beheer);
route("DELETE", "/api/admin/reviews/:id", (req, res, p) => (db.prepare("DELETE FROM reviews WHERE id = ?").run(p.id), { ok: true }), beheer);

route("GET", "/api/admin/instellingen", () => instellingen.alle(), beheer);
route("PUT", "/api/admin/instellingen", async (req) => {
  const b = await leesBody(req);
  const velden = ["naam", "slogan", "telefoon", "whatsapp", "email", "adres", "postcode", "plaats", "kvk"];
  const nieuw = Object.fromEntries(velden.map((v) => [v, tekst(b[v], 200)]));
  nieuw.whatsapp = nieuw.whatsapp.replace(/\D/g, "").replace(/^0(?=6)/, "31");
  if (Array.isArray(b.openingstijden)) {
    nieuw.openingstijden = b.openingstijden.filter((r) => Array.isArray(r) && r[0]).slice(0, 14).map(([d, t]) => [tekst(d, 40), tekst(t, 60)]);
  }
  instellingen.opslaan(nieuw);
  return instellingen.alle();
}, beheer);

route("PUT", "/api/admin/wachtwoord", async (req, res, p, gebruiker) => {
  const b = await leesBody(req);
  const g = db.prepare("SELECT * FROM gebruikers WHERE id = ?").get(gebruiker.id);
  if (!controleerWachtwoord(String(b.huidig || ""), g.wachtwoord)) throw new Fout(400, "Je huidige wachtwoord klopt niet.");
  controleerWachtwoordEisen(b.nieuw);
  db.prepare("UPDATE gebruikers SET wachtwoord = ? WHERE id = ?").run(hashWachtwoord(b.nieuw), g.id);
  db.prepare("DELETE FROM sessies WHERE gebruiker_id = ?").run(g.id);
  maakSessie(res, req, g.id);
  return { ok: true };
}, beheer);

route("GET", "/api/admin/backup", (req, res) => {
  const backup = {
    gemaakt: new Date().toISOString(),
    instellingen: instellingen.alle(), autos: autos.alle(),
    reviews: db.prepare("SELECT * FROM reviews").all(), berichten: db.prepare("SELECT * FROM berichten").all(),
  };
  const datum = new Date().toISOString().slice(0, 10);
  res.writeHead(200, { "Content-Type": "application/json", "Content-Disposition": `attachment; filename="jd-occasions-backup-${datum}.json"` });
  res.end(JSON.stringify(backup, null, 2));
  return undefined;
}, beheer);

/* ---------- Bestanden serveren ---------- */
function stuurBestand(req, res, map, relPad, cache = "no-cache") {
  const vol = path.normalize(path.join(map, relPad));
  if (!vol.startsWith(map + path.sep) && vol !== map) return false;
  let stat;
  try { stat = fs.statSync(vol); } catch { return false; }
  if (stat.isDirectory()) return stuurBestand(req, res, map, path.join(relPad, "index.html"), cache);
  res.writeHead(200, { "Content-Type": MIME[path.extname(vol).toLowerCase()] || "application/octet-stream", "Content-Length": stat.size, "Cache-Control": cache });
  if (req.method === "HEAD") return res.end(), true;
  fs.createReadStream(vol).pipe(res);
  return true;
}

/* ---------- Server ---------- */
const server = http.createServer(async (req, res) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  const url = new URL(req.url, "http://localhost");
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); } catch { res.writeHead(400); return res.end(); }

  if (pathname.startsWith("/api/")) {
    const r = routes.find((r) => r.methode === req.method && r.regex.test(pathname));
    if (!r) return stuurJson(res, 404, { fout: "Niet gevonden." });
    try {
      let gebruiker = null;
      if (r.beveiligd) {
        gebruiker = huidigeGebruiker(req);
        if (!gebruiker) throw new Fout(401, "Je bent niet ingelogd.");
        // Extra bescherming: wijzigingen alleen vanuit de beheerpagina zelf
        if (req.method !== "GET" && req.headers["x-jd-admin"] !== "1") throw new Fout(403, "Niet toegestaan.");
      }
      const m = r.regex.exec(pathname);
      const params = Object.fromEntries(r.keys.map((k, i) => [k, Number(m[i + 1])]));
      const uitkomst = await r.handler(req, res, params, gebruiker);
      if (uitkomst !== undefined) stuurJson(res, 200, uitkomst);
    } catch (e) {
      if (!(e instanceof Fout)) console.error(e);
      if (!res.headersSent) stuurJson(res, e.status || 500, { fout: e instanceof Fout ? e.message : "Er ging iets mis op de server." });
    }
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") { res.writeHead(405); return res.end(); }
  if (pathname.startsWith("/uploads/") && stuurBestand(req, res, UPLOAD_DIR, pathname.slice(9), "public, max-age=31536000, immutable")) return;
  if (pathname === "/admin") { res.writeHead(301, { Location: "/admin/" }); return res.end(); }
  if (stuurBestand(req, res, PUBLIC_DIR, pathname)) return;
  if (!stuurBestand(req, res, PUBLIC_DIR, "404.html")) { res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }); res.end("Pagina niet gevonden"); }
});

ruimFotosOp(24 * 60 * 60_000); // oude, ongebruikte uploads opruimen
server.listen(PORT, () => {
  console.log(`\n  JD Occasions draait!\n  Website: http://localhost:${PORT}\n  Beheer:  http://localhost:${PORT}/admin\n`);
  if (geenAccount()) console.log(`  Nog geen beheeraccount. Installatiecode om het aan te maken: ${SETUP_CODE}\n`);
});
