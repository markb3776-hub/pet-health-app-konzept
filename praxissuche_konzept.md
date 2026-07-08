# Konzept: Praxis- und Notdienst-Suche (Meta-Ansatz)

**Status:** Konzeptphase · Teil der verbindlichen Projektunterlagen
**Grundsatz:** Die App pflegt kein eigenes Tierarzt-Verzeichnis, sondern fungiert als Meta-Hub. Sie leitet den Nutzer an die verlässlichen, offiziellen Stellen weiter, die diese Daten bereits aktuell halten.

---

## 1. Die ehrliche Machbarkeitsbewertung (Warum wir kein eigenes Verzeichnis bauen)

Die Recherche zu Datenquellen hat drei Fakten ergeben, die gegen ein eigenes, internes Verzeichnis in der App sprechen:

1. **Die Kostenfalle (Google Places API):** Kommerzielle POI-Schnittstellen wie Google Places sind für ein kostenloses Feature nicht finanzierbar. Die Google Places API kostet in der aktuellen Preisstruktur 2026 ca. 17 USD pro 1.000 Anfragen – bei einer wachsenden Nutzerbasis würde allein die Suchfunktion die Serverkosten sprengen.
2. **Die Aktualitäts-Falle (Open Data):** OpenStreetMap (OSM) hat zwar den Tag `amenity=veterinary`, aber die Datenqualität ist lückenhaft. Tierärzte pflegen ihre Öffnungszeiten und Notdienst-Beteiligungen dort nicht selbst. Ein Verweis auf eine geschlossene Klinik im Notfall wäre ein fataler Vertrauensbruch.
3. **Die Pflege-Illusion:** Es gibt in Deutschland rund 11.000 Tierärzte/Kliniken. Praxen schließen, fusionieren oder steigen aus dem 24/7-Notdienst aus (eine aktuell stark zunehmende Entwicklung). Ohne ein Team, das diese Daten pflegt, veraltet ein internes Verzeichnis binnen Monaten.

## 2. Die Lösung: Der Meta-Ansatz (Dein Vorschlag)

Statt Daten zu horten, liefert die App den direkten Weg zur richtigen Quelle – passgenau zum Standort oder zur PLZ des Nutzers.

### A. Der Notfall-Weg (Die wichtigste Funktion)
Im Notfall braucht der Halter den **aktuell diensthabenden Notdienst**, nicht einfach irgendeine Praxis. Die App fragt nach PLZ/Standort und leitet direkt auf die offiziellen Notdienst-Portale weiter:
- **vetnotdienst.de** (das zentrale Portal, das nach Tierart trennt)
- **AniCura-Notfallübersicht** (für Kliniken mit 24/7-Status)
- Die **Tierärztekammern der Bundesländer**, die die verbindlichen Notdienst-Pläne führen.

*Bedienung:* Ein Tap auf „Notdienst finden" → PLZ-Eingabe (oder Standortfreigabe) → Die App öffnet im internen Browser-Fenster (WebView) direkt die Suchergebnisseite der passenden Plattform für diese PLZ. Der Nutzer verlässt die App nicht optisch, nutzt aber die verlässlichen Daten der Experten.

### B. Die Stammtierarzt-Suche (Regulär)
Um den Stammtierarzt im Profil zu hinterlegen, greifen wir auf das **offizielle Verzeichnis des Bundesverbandes Praktizierender Tierärzte (bpt)** zurück.
- Vorteil: Das bpt-Verzeichnis erlaubt die Filterung nach Spezialisierungen (z.B. „vogelkundig", „Heimtiere/Exoten"), was exakt unsere Tierarten-Matrix unterstützt.
- Der Halter sucht dort seine Praxis, kopiert den Namen/Telefonnummer und speichert sie als Freitext in der Akte.

### C. Der „Vogelkundig / Reptilienkundig"-Sonderweg
Da die Versorgungslücke bei Exoten real ist, verlinkt die App für Halter von Vögeln und Reptilien zusätzlich auf die von der Community gepflegten Spezial-Verzeichnisse (z.B. der entsprechenden Fachforen), da selbst offizielle Kammerlisten hier oft nicht detailliert genug sind.

---

## 3. Doktrin-Check
Dieser Ansatz erfüllt alle Kriterien der MEMORIA-Doktrin:
- **Wahrheit/Belegpflicht:** Wir behaupten nicht, ein Verzeichnis zu haben, das wir nicht pflegen können.
- **Funktion:** Der Nutzer kommt im Notfall an sein Ziel – den offenen Tierarzt.
- **Transparenz:** Die App sagt ehrlich: „Wir leiten dich an das offizielle Notdienst-Verzeichnis weiter, damit du garantiert aktuelle Daten hast." Das schafft mehr Vertrauen als eine veraltete In-App-Karte.
