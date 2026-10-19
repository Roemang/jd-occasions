# JD Occasions – website + beheeromgeving

**[Live demo →](https://Roemang.github.io/jd-occasions/)**

Een website voor autoverkoop met een eigen beheerpagina. De eigenaar logt in en beheert daar alles zelf, zonder iets van code te weten:

- **Auto's** toevoegen, bewerken, kopiëren en verwijderen, met foto's (slepen om de volgorde te wijzigen)
- **Status** wijzigen met één klik: beschikbaar / gereserveerd / verkocht, en auto's uitlichten op de homepage
- **Berichten** lezen die via het contactformulier binnenkomen, en direct beantwoorden per mail, telefoon of WhatsApp
- **Reviews** van klanten beheren
- **Bedrijfsgegevens** aanpassen: telefoon, adres, openingstijden enzovoort
- **Account**: wachtwoord wijzigen en een back-up downloaden

De beheerpagina werkt ook op de telefoon, dus foto's kun je direct vanaf je mobiel uploaden.

---

## 1. Eenmalig: Node.js installeren

Download en installeer de **LTS-versie** van [nodejs.org](https://nodejs.org) (versie 22.13 of nieuwer). Klik bij de installatie gewoon steeds op "Volgende".

Je hoeft verder niets te installeren: de site gebruikt geen extra pakketten.

## 2. De site starten op je eigen computer

1. Open de map `jd-occasions` in **VS Code** (File → Open Folder).
2. Open een terminal: **Terminal → New Terminal**.
3. Typ `npm start` en druk op Enter.
4. Ga in Chrome naar:
   - **Website:** http://localhost:3000
   - **Beheer:** http://localhost:3000/admin

Stoppen doe je met **Ctrl + C** in de terminal.

> Tip: met `npm run dev` start de server automatisch opnieuw als je code aanpast.

## 3. Het eerste account aanmaken

De eerste keer dat je naar `/admin` gaat, vraagt de site je een account aan te maken. Daarvoor heb je een **installatiecode** nodig. Die staat in de terminal waarin de server draait:

```
  Nog geen beheeraccount. Installatiecode om het aan te maken: 3F9A2C
```

Zo kan alleen iemand die toegang heeft tot de server het account aanmaken, en niet een willekeurige bezoeker van de website. Na het aanmaken verschijnt de code niet meer.

**Wachtwoord vergeten?** Stop de server, verwijder de database (zie "Waar staan de gegevens?") en begin opnieuw. Let op: dan ben je ook alle auto's en berichten kwijt. Maak dus regelmatig een back-up.

## 4. Waar staan de gegevens?

Alles wat via de beheerpagina wordt ingevoerd, staat in de map **`data/`**:

- `data/jd-occasions.db` – de database (auto's, berichten, reviews, gegevens, account)
- `data/uploads/` – de foto's van de auto's

Deze map wordt automatisch aangemaakt bij de eerste start en is gevuld met **voorbeeld-auto's**. Verwijder die via de beheerpagina zodra de echte voorraad erin staat.

De map `data/` staat bewust **niet in GitHub** (zie `.gitignore`): daar horen geen klantberichten en wachtwoorden in. Bewaar hem dus zelf goed.

## 5. Mappen in het project

| Map / bestand | Wat het is |
|---|---|
| `server.js` | De server: website, beheer, inloggen en de API |
| `server/db.js` | Database-opzet |
| `server/voorbeelddata.js` | Voorbeeldgegevens voor de allereerste start |
| `public/` | De website (HTML, CSS, JavaScript, afbeeldingen) |
| `public/admin/` | De beheerpagina |
| `public/img/` | Logo en favicon |
| `data/` | Database en foto's (wordt automatisch aangemaakt) |

---

## 6. Later: online zetten

Omdat de site nu een database en foto-uploads heeft, kan hij **niet** meer op gratis statische hosting zoals GitHub Pages. Er is een server nodig die blijft draaien en de map `data/` bewaart. Dit is het deel dat geld kost. Reken op ongeveer:

- **Server (VPS):** vanaf een paar euro per maand, bijvoorbeeld bij Hetzner, TransIP of DigitalOcean. Goedkoopst en volledige controle, maar je moet de server zelf inrichten (Node.js installeren, HTTPS instellen).
- **Node-hosting met opslag:** bijvoorbeeld Render of Railway. Makkelijker, maar meestal iets duurder. **Let op:** kies een abonnement met *persistent disk / volume*. Zonder vaste opslag verdwijnen de database en foto's bij elke herstart.
- **Domeinnaam** (bijv. `jdoccasions.nl`): ongeveer € 10 per jaar.

Belangrijk bij het online zetten:

1. **Op naam van de eigenaar.** Maak het hostingaccount en de domeinnaam aan op naam (en betaalgegevens) van de eigenaar van JD Occasions. Dan is hij eigenaar en kun jij hem helpen zonder dat het van jou afhangt.
2. **HTTPS** (het slotje) moet aan staan. Bij Render en Railway gaat dat automatisch; op een VPS regel je het met bijvoorbeeld Caddy of nginx + Let's Encrypt.
3. **Instellingen** via omgevingsvariabelen:
   - `PORT` – de poort (vaak stelt de host die zelf in)
   - `DATA_DIR` – de map voor database en foto's. Laat die wijzen naar de vaste opslag, bijv. `/var/data`
   - `SETUP_CODE` – optioneel: zelf een installatiecode kiezen in plaats van een willekeurige
4. **Startcommando:** `npm start`
5. Maak **direct na het live gaan** het account aan via `/admin`.
6. **Back-ups:** download af en toe een back-up via Beheer → Account, en kopieer de map `data/` (inclusief foto's) regelmatig naar een veilige plek.

De code op GitHub zetten kan wel gewoon gratis (via VS Code: Source Control → Publish to GitHub). Gebruik bij voorkeur een **privé-repository**.
