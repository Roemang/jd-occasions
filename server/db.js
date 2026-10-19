// Database (SQLite, ingebouwd in Node.js). Alle gegevens staan in één bestand: data/jd-occasions.db
const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");
const voorbeeld = require("./voorbeelddata");

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "..", "data");
const UPLOAD_DIR = path.join(DATA_DIR, "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const db = new DatabaseSync(path.join(DATA_DIR, "jd-occasions.db"));
db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");

db.exec(`
  CREATE TABLE IF NOT EXISTS autos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    merk TEXT NOT NULL, model TEXT NOT NULL, uitvoering TEXT DEFAULT '',
    prijs INTEGER NOT NULL DEFAULT 0, bouwjaar INTEGER, km INTEGER DEFAULT 0,
    brandstof TEXT DEFAULT '', transmissie TEXT DEFAULT '', vermogen INTEGER,
    kleur TEXT DEFAULT '', carrosserie TEXT DEFAULT '', deuren INTEGER, zitplaatsen INTEGER,
    btw TEXT DEFAULT 'Marge', status TEXT DEFAULT 'beschikbaar', uitgelicht INTEGER DEFAULT 0,
    fotos TEXT DEFAULT '[]', opties TEXT DEFAULT '[]', omschrijving TEXT DEFAULT '',
    aangemaakt TEXT DEFAULT (datetime('now')), bijgewerkt TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    naam TEXT NOT NULL, auto TEXT DEFAULT '', tekst TEXT NOT NULL,
    sterren INTEGER DEFAULT 5, zichtbaar INTEGER DEFAULT 1,
    aangemaakt TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS berichten (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    naam TEXT, email TEXT, telefoon TEXT, onderwerp TEXT, auto_id INTEGER, auto_naam TEXT,
    kenteken TEXT, inruil_km TEXT, bericht TEXT, gelezen INTEGER DEFAULT 0,
    aangemaakt TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS instellingen (sleutel TEXT PRIMARY KEY, waarde TEXT);
  CREATE TABLE IF NOT EXISTS gebruikers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    gebruikersnaam TEXT UNIQUE NOT NULL, naam TEXT, wachtwoord TEXT NOT NULL,
    aangemaakt TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS sessies (
    token TEXT PRIMARY KEY, gebruiker_id INTEGER NOT NULL REFERENCES gebruikers(id) ON DELETE CASCADE,
    verloopt INTEGER NOT NULL
  );
`);

/* ---------- Auto's ---------- */
const AUTO_VELDEN = ["merk", "model", "uitvoering", "prijs", "bouwjaar", "km", "brandstof", "transmissie", "vermogen",
  "kleur", "carrosserie", "deuren", "zitplaatsen", "btw", "status", "uitgelicht", "fotos", "opties", "omschrijving"];
const GETALLEN = ["prijs", "bouwjaar", "km", "vermogen", "deuren", "zitplaatsen"];

function naarAuto(r) {
  if (!r) return null;
  return { ...r, uitgelicht: !!r.uitgelicht, fotos: JSON.parse(r.fotos || "[]"), opties: JSON.parse(r.opties || "[]") };
}

function schoonAuto(a) {
  const tekst = (v, max = 200) => String(v ?? "").trim().slice(0, max);
  const getal = (v) => (v === "" || v == null || isNaN(+v) ? null : Math.round(+v));
  const fotos = Array.isArray(a.fotos) ? a.fotos.filter((f) => typeof f === "string" && /^\/uploads\/[\w.-]+$/.test(f)).slice(0, 40) : [];
  const opties = Array.isArray(a.opties) ? a.opties.map((o) => tekst(o, 120)).filter(Boolean).slice(0, 80) : [];
  const out = {
    merk: tekst(a.merk, 60), model: tekst(a.model, 60), uitvoering: tekst(a.uitvoering, 120),
    brandstof: tekst(a.brandstof, 40), transmissie: tekst(a.transmissie, 40), kleur: tekst(a.kleur, 60),
    carrosserie: tekst(a.carrosserie, 40), omschrijving: tekst(a.omschrijving, 5000),
    btw: a.btw === "BTW" ? "BTW" : "Marge",
    status: ["beschikbaar", "gereserveerd", "verkocht"].includes(a.status) ? a.status : "beschikbaar",
    uitgelicht: a.uitgelicht ? 1 : 0,
    fotos: JSON.stringify(fotos), opties: JSON.stringify(opties),
  };
  for (const g of GETALLEN) out[g] = getal(a[g]);
  if (!out.merk || !out.model) throw new Error("Merk en model zijn verplicht.");
  if (out.prijs == null || out.prijs < 0) throw new Error("Vul een geldige prijs in.");
  return out;
}

function opslaanAuto(invoer, id = null) {
  const a = schoonAuto(invoer);
  const waarden = AUTO_VELDEN.map((v) => a[v]);
  if (id) {
    db.prepare(`UPDATE autos SET ${AUTO_VELDEN.map((v) => v + " = ?").join(", ")}, bijgewerkt = datetime('now') WHERE id = ?`).run(...waarden, id);
    return id;
  }
  const r = db.prepare(`INSERT INTO autos (${AUTO_VELDEN.join(", ")}) VALUES (${AUTO_VELDEN.map(() => "?").join(", ")})`).run(...waarden);
  return Number(r.lastInsertRowid);
}

const autos = {
  alle: () => db.prepare("SELECT * FROM autos ORDER BY id DESC").all().map(naarAuto),
  een: (id) => naarAuto(db.prepare("SELECT * FROM autos WHERE id = ?").get(id)),
  opslaan: opslaanAuto,
  verwijder: (id) => db.prepare("DELETE FROM autos WHERE id = ?").run(id),
  deel: (id, velden) => {
    const huidig = autos.een(id);
    if (!huidig) return null;
    opslaanAuto({ ...huidig, ...velden }, id);
    return autos.een(id);
  },
};

/* ---------- Overig ---------- */
const instellingen = {
  alle: () => Object.fromEntries(db.prepare("SELECT sleutel, waarde FROM instellingen").all().map((r) => [r.sleutel, JSON.parse(r.waarde)])),
  opslaan: (obj) => {
    const stmt = db.prepare("INSERT INTO instellingen (sleutel, waarde) VALUES (?, ?) ON CONFLICT(sleutel) DO UPDATE SET waarde = excluded.waarde");
    for (const [k, v] of Object.entries(obj)) stmt.run(k, JSON.stringify(v));
  },
};

// Eerste keer: vul met voorbeeldgegevens
if (db.prepare("SELECT COUNT(*) n FROM instellingen").get().n === 0) {
  for (const [k, v] of Object.entries(voorbeeld.instellingen)) {
    db.prepare("INSERT INTO instellingen (sleutel, waarde) VALUES (?, ?)").run(k, JSON.stringify(v));
  }
  for (const a of voorbeeld.autos) opslaanAuto(a);
  console.log("Database aangemaakt en gevuld met voorbeeld-auto's.");
}

module.exports = { db, autos, instellingen, DATA_DIR, UPLOAD_DIR };
