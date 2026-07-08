# UPD-Live-Test: Praktische Abfrage eines konkreten Präparats

Testdatum: 08.07.2026. Ziel: Prüfen, ob das öffentliche UPD-Portal für unsere App-Funktion "aktuelle Medikamentendaten/Warnhinweise" praktisch nutzbar ist.

## Testobjekt
BRAVECTO CombiUNO 100 mg + 7,5 mg Kautablette für Hunde (Fluralaner + Milbemycinoxim), Zulassungsinhaber Intervet International B.V. (MSD Tiergesundheit).
Produktseite: https://medicines.health.europa.eu/veterinary/en/600001881224

## Ergebnisse (alle VERIFIZIERT durch Live-Test am 08.07.2026)

### 1. Öffentliche Suche: FUNKTIONIERT
- Portal: https://medicines.health.europa.eu/veterinary/ (offizielle EU-Seite, EMA-betrieben)
- Gesamtbestand: 50.523 Tierarzneimittel in der Datenbank
- Suche nach "Bravecto": 29 Treffer in <2 Sekunden, alle Varianten (Tabletten, Spot-on, Injektion) sauber gelistet
- Filter verfügbar: Wirkstoff, Zieltierart, Darreichungsform, ATCvet-Code, zugelassen in [Land], verfügbar in [Land], Zulassungsinhaber
- KEIN Login nötig, KEINE Registrierung, KEINE Kosten

### 2. Produktdetailseite: LIEFERT STRUKTURIERTE DATEN
Pro Präparat maschinenlesbar auf der Seite:
- Name, Wirkstoffe + Stärke, Zieltierart (Dog), Verabreichungsweg (Oral)
- Verschreibungspflicht: ja ("subject to veterinary prescription")
- Zulassungsstatus: Authorised/Valid + Datum der letzten Statusänderung (hier 30.07.2025)
- Zugelassen in: 31 Länder einzeln gelistet (inkl. Deutschland)
- Packungsgrößen (1/3/6 Tabletten)
- Verweis auf Nebenwirkungsdatenbank: www.adrreports.eu/vet

### 3. Packungsbeilage/Produktinformation: VORHANDEN, ABER MIT HÜRDE
- "Combined File of all Documents" als PDF, Veröffentlichungsdatum sichtbar (21.08.2025) → Zeitstempel für Datenstand verfügbar!
- In 24 Sprachen (auch Deutsch)
- ABER: Download ist durch Antispam-Captcha geschützt (Slider-Rätsel + verschleierter Text "Move the slider to select a number between twenty-nine and thirty-one")
- curl-Direktabruf der Download-URL liefert nur HTML-Captcha-Seite, kein PDF
- KONSEQUENZ: Automatisierter Massen-Download der PDFs ist vom Betreiber unerwünscht/blockiert. Die STRUKTURIERTEN Felder der Produktseite sind dagegen normal abrufbar.

### 4. Konsequenzen für die App-Architektur
- Produkt-Stammdaten (Name, Wirkstoff, Status, Zieltierart, Verschreibungspflicht): per Webseite gut zugänglich, strukturiert → für Medikamenten-Zuordnung und Statusprüfung nutzbar
- Detaillierte Warnhinweise/Gegenanzeigen stehen NUR in der PDF-Produktinformation → Captcha-geschützt, nicht trivial automatisierbar
- EMA bietet eine "Industry-dedicated read-only API" (Webinar 03/2025, YouTube) → Zugangsbedingungen für Drittanbieter-Apps MÜSSEN bei EMA angefragt werden (offener Punkt, Blindspot 16)
- Alternative: Für Deutschland-Start prüfen, ob BVL-Datenbank (Tierarzneimittel) einen einfacheren Zugang bietet
- Fallback-Design für App: Statt automatischem PDF-Parsing → Deep-Link auf die offizielle UPD-Produktseite ("Aktuelle Packungsbeilage bei der EMA ansehen") = immer aktuell, null Rechtsrisiko, null Wartung

### Offene Punkte nach dem Test
1. EMA-API-Zugang für Drittanbieter klären (Konditionen, Berechtigung)
2. Captcha-geschützter PDF-Download = kein verlässlicher automatischer Weg zu Volltext-Warnhinweisen
3. Empfehlung MVP: strukturierte UPD-Felder + Deep-Link auf offizielle Produktseite statt eigener Warnhinweis-Extraktion
