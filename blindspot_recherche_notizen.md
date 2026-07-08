# Blindspot-Recherche: Notizen (Rohdaten mit Quellen)

## 1. Google Play: Testpflicht für neue persönliche Entwicklerkonten (VERIFIZIERT)
Quelle: primetestlab.com/blog/google-play-changed-20-to-12-testers (April 2026), gestützt auf Google Play Console Help (support.google.com/googleplay/android-developer/answer/14151465)
- Persönliche Entwicklerkonten, die NACH 13.11.2023 erstellt wurden: Pflicht-Closed-Test mit mind. **12 opted-in Testern** (reduziert von 20 am 11.12.2024) über **14 aufeinanderfolgende Tage**, bevor Produktions-Zugang beantragt werden kann.
- Organisations-Konten (Unternehmenskonten) sind AUSGENOMMEN.
- Google prüft zusätzlich Engagement der Tester, Feedback-Zusammenfassung, ob Updates während des Tests kamen. 12 ist Minimum, keine Genehmigungsgarantie. Empfohlen 20-25 Tester als Puffer.
- Fällt Testerzahl unter 12, kann 14-Tage-Timer zurückgesetzt werden.
- Interner Test zählt NICHT für die 14 Tage, nur Closed-Track.
- Review nach Antrag: üblicherweise ≤7 Tage.
- Konsequenz für uns: Entweder Organisations-Konto (erfordert Gewerbe/D-U-N-S) ODER 12+ Tester organisieren. Beta-Test ist ohnehin Doktrin-Pflicht (Praxistest!) → Synergien.

## 2. Google Play: Target API Level (VERIFIZIERT)
Quelle: developer.android.com/google/play/requirements/target-sdk, support.google.com/googleplay/android-developer/answer/11926878
- Seit 31.08.2025: Neue Apps und Updates müssen Android 15 (API Level 35) oder höher targeten. Jährliche Anhebung zu erwarten (2026 vermutlich API 36).

## 3. Google Play: Konto-Löschungspflicht (VERIFIZIERT)
Quelle: support.google.com/googleplay/android-developer/answer/13327111
- Apps mit Konto-Erstellung MÜSSEN: (a) In-App-Pfad zur Konto- und Datenlöschung, (b) zusätzlich Web-Link für Löschanfrage AUSSERHALB der App (auch wenn In-App-Löschung existiert).
- Data-Safety-Formular mit Data-Deletion-Fragen ist Pflicht für alle Apps (seit 12/2023, Enforcement seit Mitte 2024; Nichteinhaltung → Ablehnung/Entfernung).
- Löschinfos werden im Store-Eintrag sichtbar (Badge).
- Konsequenz: Konto-Löschung + Web-Löschformular von Anfang an einplanen. Passt zu unserer Doktrin (Daten-Souveränität) – wird bei uns ohnehin Feature.

## 4. BFSG / European Accessibility Act (VERIFIZIERT)
Quelle: it-intouch.de/magazin/barrierefreiheitsstarkungsgesetz-fuer-apps/ (Stand 02/2025), bmas.de, bundesfachstelle-barrierefreiheit.de
- BFSG (deutsche Umsetzung des EAA) gilt seit 28.06.2025 vollständig.
- Betroffen u.a.: "elektronischer Geschäftsverkehr" = Apps mit Verbraucherverträgen (In-App-Käufe!) fallen darunter.
- **WICHTIGE AUSNAHME: Kleinstunternehmen (<10 Mitarbeiter UND ≤2 Mio. € Jahresumsatz), die DIENSTLEISTUNGEN anbieten, sind ausgenommen.** (Produkte in Verkehr bringen: nicht ausgenommen; App-Dienstleistung = Dienstleistung.)
- Aber: Ausnahme gilt nur solange Kleinstunternehmen-Status besteht; bei Wachstum greift Pflicht. Bußgelder bis 100.000 €, zivilrechtliche Ansprüche, UWG-Abmahnungen möglich.
- Anforderungen: Screenreader-Unterstützung, Kontraste, lesbare Texte, alternative Bedienoptionen (= WCAG-orientiert, EN 301 549).
- Konsequenz: Formal zunächst ausgenommen (Kleinstunternehmen), ABER strategisch ohnehin sinnvoll (Zielgruppe 50+, 46 % über 50) → Barrierefreiheit von Anfang an einbauen = Doktrin-konform + zukunftssicher + abmahnsicher.

## 5. Tierkrankenversicherungen (VERIFIZIERT, Snippets)
Quellen: agila.de/service/rechnungen-schaeden, play.google.com (AGILA Kunden-App), uelzener.de
- AGILA: eigene Kunden-App, Rechnung fotografieren → einreichen, Bearbeitung binnen 8 Arbeitsstunden. Betreibt auch eigenes Tierarztverzeichnis (4.000+ Einträge).
- Uelzener: Online-Schadenmeldung, Rechnung digital einreichen.
- Muster: Versicherer haben eigene Einreich-Apps, aber KEINE Gesundheitsakten-Funktionalität in der Tiefe unseres Konzepts.
- Potenzial für uns: Halter scannt Rechnung ohnehin in unsere App → Feature "Rechnung an Versicherung weiterleiten" (E-Mail-Export an Versicherer oder Teilen-Funktion) = Doppelnutzen ohne Partnerschaft. Später: offizielle Partnerschaften (Lead-Provision?) möglich, aber nicht MVP.

## Noch offen (P2, aus eigenem Wissen beantwortbar, kennzeichnen als unverifiziert wo nötig):
- KI-Kosten pro Scan: abhängig vom Modell; multimodale Scans kosten typischerweise Bruchteile von Cents bis wenige Cent pro Bild → Free-Tier-Limit (z.B. X Scans/Monat) als Kostenschutz. GENAUE Preise erst bei Modellwahl in Entwicklungsphase festlegen.
- Android Alarm-Zuverlässigkeit: Doze-Mode drosselt Hintergrund-Tasks; für kritische Erinnerungen exakte Alarme (SCHEDULE_EXACT_ALARM) bzw. WorkManager + hohe Priorität; Play-Policy für exakte Alarme beachten (nur mit Begründung). → Testpflicht auf realen Geräten.
- Unternehmensform: UG (haftungsbeschränkt) als kostengünstige Haftungsabgrenzung üblich; Organisations-Konto im Play Store erfordert D-U-N-S-Nummer. → Entscheidung des Nutzers, keine Rechtsberatung.
- Haftung/AGB: Haftungsbegrenzung auf Vorsatz/grobe Fahrlässigkeit üblich; App ist Dokumentations-Tool, kein Medizinprodukt (MDR gilt nur Humanmedizin). AGB/Datenschutzerklärung anwaltlich prüfen lassen → Budgetposten.
- Tod des Tieres: Akte archivieren statt löschen (emotionale Bedeutung, "Erinnerungsmodus"); Besitzerwechsel: Akten-Export/Übertragung als Feature.

---

## 6. KI-Dokumentenscan: DSGVO & EU AI Act (VERIFIZIERT, Stand Juli 2026)

### Mistral AI (verifiziert via help.mistral.ai, mistral.ai/news)
- Daten werden **standardmäßig in der EU gehostet** (US-Endpoint nur bei expliziter Wahl). Quelle: help.mistral.ai/en/articles/347629 (Stand 06/2026).
- ABER: Je nach Feature können Daten temporär außerhalb der EU verarbeitet werden (Subprozessoren, siehe trust.mistral.ai/subprocessors) — mit SCC nach Art. 46 DSGVO abgesichert. → Subprozessorliste vor Vertragsabschluss prüfen!
- **DPA (AV-Vertrag)** öffentlich verfügbar: legal.mistral.ai/terms/data-processing-addendum. Kein individuelles Offline-Signing; DPA gilt vertraglich mit API-Nutzung.
- **Zero Data Retention (ZDR)**: nur im Scale-Plan (bezahlter API-Plan), nur für stateless Endpoints — u.a. `/v1/chat/completions` und **`/v1/ocr`** (beide für unseren Use Case relevant). ZDR muss beantragt und begründet werden, Genehmigung im Ermessen von Mistral.
- Training-Opt-out separat von ZDR steuerbar.
- **Mistral OCR 3** (mistral-ocr-2512, 12/2025): explizit stark bei **Handschrift**, Formularen, Rechnungen, schlechten Scans, komplexen Tabellen. Output: Markdown/strukturiertes JSON. → passt exakt auf Impfpass-/GOT-Rechnungs-Scan.
- **Preis OCR: 2 $ pro 1.000 Seiten** (Batch: 1 $/1.000). = **0,2 Cent pro Seite**. Annotations (strukturierte Extraktion): 3 $/1.000 Seiten. → Kostenschätzung bestätigt: Bruchteile eines Cents pro Scan. Bei 10.000 Scans/Monat: ~20-30 $. Free-Tier-Limit trotzdem sinnvoll als Missbrauchsschutz.
- **Self-Hosting-Option** für OCR existiert (für später relevant, falls volle Datenhoheit gewünscht).

### Aleph Alpha
- Deutscher Anbieter (Heidelberg), Fokus "souveräne KI" für Behörden/Enterprise. Eher Enterprise-Vertrieb, keine einfache Self-Service-API mit transparenten Kleinst-Preisen wie Mistral. → Für Solo-/Kleinbetrieb weniger praktikabel als Mistral, aber als EU-Alternative notieren.

### US-Anbieter mit EU-Optionen (Fallback-Wissen, verifiziert via bitecode.tech 01/2026)
- Azure OpenAI: EU-Geography-Deployments möglich, Abuse-Monitoring-Logs (EEA-Reviewer), DPA vorhanden.
- OpenAI API: Europe-Region-Projekte + Zero Retention nur für "eligible customers".
- AWS Bedrock: kein Prompt-Storage per Default, EU-Regionen verfügbar.
- ABER: alle US-Mutterkonzerne → CLOUD-Act-Konflikt mit unserem Vertrauensversprechen → gemäß Nutzer-Vorgabe NICHT verwenden. Mistral (Frankreich) bleibt erste Wahl.

### DSGVO-Einordnung des Scan-Features
- Tierarztrechnungen/Impfpässe enthalten personenbezogene Daten (Name/Adresse des Halters, Tierarztname) → Verarbeitung durch KI-Anbieter = Auftragsverarbeitung → **AV-Vertrag (DPA) mit KI-Anbieter zwingend** (bei Mistral vorhanden).
- Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung — Nutzer will Scan-Funktion) — plausibel, aber finale Einordnung durch Datenschutz-Fachperson/Anwalt bei Datenschutzerklärungs-Erstellung.
- Datenminimierung: Foto nur zur Extraktion senden, danach beim KI-Anbieter nicht speichern (ZDR beantragen), Ergebnis nur auf unserem EU-Server.
- Transparenz: Nutzer VOR erstem Scan informieren, dass Foto an KI-Dienstleister (Mistral, EU) gesendet wird — Doktrin-konform ("App fragt statt rät").

### EU AI Act Einstufung (verifiziert via trail-ml.com, artificialintelligenceact.eu)
- 4 Risikoklassen: unannehmbar / hoch / begrenzt / minimal.
- Hochrisiko (Annex III): Biometrie, kritische Infrastruktur, Bildung, Beschäftigung, essentielle Dienste (Kredit-Scoring, KRANKENVERSICHERUNGS-Risikobewertung beim Menschen), Strafverfolgung etc. → **Dokumenten-OCR/Extraktion für Heimtier-Gesundheitsakte fällt in KEINE dieser Kategorien.**
- Begrenztes Risiko = Transparenzpflichten bei KI-Interaktion (Chatbots, Deepfakes). Falls wir KI-generierte Inhalte anzeigen: Kennzeichnung "per KI extrahiert — bitte prüfen" ohnehin Doktrin-Pflicht → Transparenzpflicht damit erfüllt.
- Einstufung unseres Use Case: **minimal bis begrenzt** — keine Zulassungs-/Konformitätspflichten. Wir sind "Deployer" eines GPAI-Modells, nicht Anbieter eines Hochrisikosystems. KENNZEICHNUNG: fundierte Einschätzung auf Basis der Kategorienliste, keine Rechtsberatung; bei Zweifeln kurze anwaltliche Bestätigung einholen.
- Wichtig: KI-Extraktion wird bei uns IMMER vom Nutzer bestätigt bevor Daten in die Akte übernommen werden (Human-in-the-loop) → senkt Risiko zusätzlich und ist bereits Konzeptbestandteil.

---

## 7. UPD-Aktualisierungsrhythmus (VERIFIZIERT, Stand Juli 2026)
Quellen: gandlscientific.com/knowledge-hub/understanding-the-union-product-database-upd; ocvigilance.com FAQ-PDF (EMA Industry-FAQ); basg.gv.at (Österr. Behörde, Stand 02/2026); ema.europa.eu/union-product-database; hma.eu
- UPD live seit 28.01.2022 (Verordnung (EU) 2019/6, Art. 55).
- **VNRA (Variations Not Requiring Assessment)** — dazu gehören viele Änderungen der Produktinformation: Zulassungsinhaber MUSS sie **binnen 30 Tagen nach der Änderung** in der UPD erfassen. → gesetzlicher Takt: max. 30 Tage Verzug.
- Genehmigungspflichtige Änderungen (Variations requiring assessment, z.B. neue Warnhinweise nach Pharmakovigilanz-Verfahren): werden nach Behördengenehmigung in UPD eingetragen — kein fester öffentlicher Frist-Wert gefunden, aber Eintrag ist Teil des Genehmigungsvollzugs.
- Jährliche Pflichten: Verkaufsvolumen + Verfügbarkeitsstatus (Art. 58) — für uns irrelevant.
- KONSEQUENZ FÜR APP: Die UPD ist KEINE Echtzeit-Datenbank, aber gesetzlich max. ~30 Tage hinter der Realität (bei VNRA). Unser Abfrage-/Cache-Rhythmus sollte deutlich unter 30 Tagen liegen → Empfehlung: wöchentlicher Abgleich der gecachten Produktdaten + Live-Abfrage bei erstmaligem Aufruf eines Präparats. Zeitstempel des Datenstands immer anzeigen.
- OFFEN bleibt: technischer API-Zugang, Rate-Limits, Maschinenlesbarkeit der Gegenanzeigen-Felder (bereits als Blindspot 16 gelistet).
