# JD Occasions – website

Website voor autoverkoop. Gewone HTML, CSS en JavaScript: geen installatie of database nodig.

**[Live demo →](https://Roemang.github.io/jd-occasions/)** — klik op _Voorbeelddata laden_ om het met gevulde data te zien.

## Bestanden

| Bestand | Wat het is |
|---|---|
| `index.html` | Homepage |
| `aanbod.html` | Voorraad met filters, zoeken en sorteren |
| `auto.html` | Detailpagina van één auto (`auto.html?id=1`) |
| `contact.html` | Contactformulier, openingstijden en kaart |
| `js/data.js` | **Hier pas je alles aan**: bedrijfsgegevens en auto's |
| `js/main.js` | De werking van de site (normaal niet aanpassen) |
| `css/style.css` | Opmaak; kleuren staan bovenaan |
| `img/` | Logo en autofoto's |

## Bekijken in VS Code

1. Open de map `jd-occasions` in VS Code (File → Open Folder).
2. Installeer de extensie **Live Server** (van Ritwick Dey).
3. Rechtsklik op `index.html` → **Open with Live Server**. De site opent in Chrome en ververst automatisch als je iets opslaat.

## Gegevens aanpassen

Open `js/data.js` en vul bovenaan bij `SITE` het echte telefoonnummer, WhatsApp-nummer, e-mail, adres, KvK-nummer en de openingstijden in.

## Auto toevoegen

Kopieer in `js/data.js` een blok `{ ... },` binnen `AUTOS`, plak het eronder en pas de gegevens aan. Let op:
- geef elke auto een **nieuw, uniek `id`** (hoogste nummer = staat bovenaan als "nieuwste");
- `status`: `"beschikbaar"`, `"gereserveerd"` of `"verkocht"`;
- `uitgelicht: true` zet de auto op de homepage;
- `btw`: `"Marge"` of `"BTW"`.

De auto's die er nu in staan zijn **voorbeelden** – vervang ze door de echte voorraad.

## Foto's toevoegen

1. Zet de foto's in `img/autos/`, bijv. `golf-1.jpg`, `golf-2.jpg`. Gebruik liggende foto's (16:10), bij voorkeur kleiner dan 300 KB per stuk (verklein ze bijv. via squoosh.app).
2. Zet ze bij de auto: `fotos: ["img/autos/golf-1.jpg", "img/autos/golf-2.jpg"],`
3. De eerste foto is de hoofdfoto. Zonder foto's toont de site een nette "Foto volgt"-afbeelding.

## Logo

Het logo staat er al in, met een doorzichtige achtergrond:
- `img/logo-header.png`: in de menubalk
- `img/logo-groot.png`: op de homepage en onderaan de site
- `img/favicon.png`: het icoontje in het browsertabblad

Een nieuw logo? Vervang deze bestanden door nieuwe met dezelfde naam.

## Contactformulier

Standaard opent het formulier het e-mailprogramma van de bezoeker. Wil je dat berichten direct in je mailbox komen: maak gratis een formulier aan op [formspree.io](https://formspree.io) en zet het adres bij `formulierAdres` in `js/data.js`.

## Reviews

De reviews op de homepage (`index.html`, zoek op "Voorbeeldreview") zijn voorbeeldteksten. Vervang ze door echte reviews of verwijder dat blok.

## Later online zetten

Omdat het een statische site is, kan hij gratis online via **GitHub Pages**
