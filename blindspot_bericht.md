# Blindspot-Bericht: Pet Health App

Dieses Dokument fasst die Ergebnisse der systematischen Lückenanalyse (Blindspot-Check) zusammen. Ziel ist es, vor Entwicklungsbeginn alle potenziellen Risiken, rechtlichen Hürden und betrieblichen Herausforderungen zu identifizieren und zu bewerten.

Die Bewertung erfolgt gemäß der MEMORIA-Doktrin in drei Stufen:
- **[VERIFIZIERT]**: Durch Recherche oder Tests bestätigte Fakten.
- **[PLAUSIBEL, ABER UNGETESTET]**: Logische Ableitungen oder Standard-Praktiken, die noch nicht am spezifischen Fall geprüft wurden.
- **[OFFEN]**: Punkte, die zwingend externe Expertise (z.B. Anwalt) oder spätere Tests erfordern.

## A. Rechtlich & Datenschutz

### 1. DSGVO-Betrieb & Auftragsverarbeitung [OFFEN]
Die App speichert personenbezogene Daten der Halter (Name, E-Mail, Adresse) in Verknüpfung mit den Tierdaten.
- **Herausforderung**: Erstellung von Datenschutzerklärung, Verzeichnis der Verarbeitungstätigkeiten (VVT) und Auskunfts-/Löschprozessen.
- **Maßnahme**: Die finale datenschutzrechtliche Einordnung (insbesondere die Rechtsgrundlage für den KI-Scan, voraussichtlich Vertragserfüllung nach Art. 6 Abs. 1 lit. b DSGVO) und die Erstellung der Rechtstexte müssen zwingend durch einen spezialisierten Anwalt oder Datenschutzbeauftragten erfolgen.

### 2. KI-Verarbeitung, DSGVO & EU AI Act [VERIFIZIERT]
Der geplante Dokumenten-Scan extrahiert Daten aus Rechnungen und Impfpässen.
- **Datenschutz & Infrastruktur**: Um das Vertrauensversprechen ("Daten bleiben bei uns") zu 100 % zu erfüllen, scheiden US-Anbieter (CLOUD Act) sowie EU-Anbieter mit Subprozessoren außerhalb der EU (z.B. Mistral AI via API) aus. **Die verbindliche Strategie lautet: Selbst-Hosting.** Das OCR-Modell muss auf einem eigenen, in Deutschland gemieteten Server (z.B. Hetzner) laufen. Daten verlassen das System nicht. Bis diese Infrastruktur steht, startet die App ausschließlich mit manueller Eingabe.
- **EU AI Act**: Die Dokumentenextraktion für eine Heimtier-Gesundheitsakte fällt in keine der im Gesetz definierten Hochrisiko-Kategorien (wie z.B. Biometrie, kritische Infrastruktur oder Humangesundheit) [3]. Die Einstufung ist "minimal bis begrenzt". Etwaige Transparenzpflichten werden durch die ohnehin geplante "Human-in-the-loop"-Prüfung (Nutzer bestätigt extrahierte Daten) erfüllt.

### 3. Haftungsfrage bei Fehlfunktionen [OFFEN]
Falsche Erinnerungen oder fehlerhaft extrahierte Dosierungen könnten theoretisch zu Schäden am Tier führen.
- **Herausforderung**: Ausschluss von Haftungsrisiken für die App als reines Dokumentationstool.
- **Maßnahme**: Die AGB müssen einen robusten Haftungsausschluss (Begrenzung auf Vorsatz und grobe Fahrlässigkeit) enthalten. Eine anwaltliche Prüfung ist hierfür zwingend erforderlich.

### 4. Abgrenzung zum Medizinprodukt [PLAUSIBEL, ABER UNGETESTET]
- **Status**: Die App richtet sich an Tiere und fällt daher nicht unter die Medical Device Regulation (MDR), die ausschließlich für die Humanmedizin gilt.
- **Risiko**: Werbeaussagen dürfen dennoch keine Heilversprechen enthalten, um nicht gegen das Heilmittelwerbegesetz (HWG) oder das Gesetz gegen den unlauteren Wettbewerb (UWG) zu verstoßen.

### 5. Impressum, AGB & Markenrecht [OFFEN]
- **Maßnahme**: Ein rechtssicheres Impressum, AGB (insbesondere bei In-App-Käufen) sowie eine Markenrecherche (DPMA) für den finalen App-Namen stehen noch aus.

## B. Play-Store-Richtlinien (Release-kritisch)

### 6. Testpflicht für neue Entwicklerkonten [VERIFIZIERT]
- **Fakt**: Persönliche Entwicklerkonten, die nach dem 13.11.2023 erstellt wurden, müssen vor der Produktionsfreigabe zwingend einen geschlossenen Test mit mindestens 12 aktiven Testern über 14 aufeinanderfolgende Tage durchführen [4].
- **Lösungsweg**: Entweder ein Organisations-Konto eröffnen (erfordert Gewerbeanmeldung und D-U-N-S-Nummer, befreit von der Testpflicht) oder den Beta-Test organisieren (entspricht ohnehin der Doktrin für einen Praxistest).

### 7. Target API Level [VERIFIZIERT]
- **Fakt**: Seit dem 31.08.2025 müssen neue Apps und Updates mindestens Android 15 (API Level 35) als Zielplattform ausweisen [5].
- **Lösungsweg**: Dies muss bei der Projektinitialisierung in Expo/React Native entsprechend konfiguriert werden.

### 8. Konto-Löschungspflicht [VERIFIZIERT]
- **Fakt**: Apps, die eine Kontoerstellung anbieten, müssen zwingend einen In-App-Pfad zur Löschung sowie ein Web-Formular (für Löschanfragen außerhalb der App) bereitstellen [6].
- **Lösungsweg**: Diese Funktion (Daten-Souveränität) ist ohnehin Teil des Konzepts und muss von Tag 1 an implementiert werden.

### 9. iOS / App Store [PLAUSIBEL, ABER UNGETESTET]
- **Status**: Bisher liegt der Fokus auf Android. Die gewählte Technologie (React Native / Expo) erlaubt einen späteren iOS-Release. Das Apple Developer Konto erfordert jedoch eine jährliche Gebühr von 99 USD.

## C. Betrieb, UX & Technik

### 10. European Accessibility Act (EAA) / BFSG [VERIFIZIERT]
- **Fakt**: Das Barrierefreiheitsstärkungsgesetz (BFSG) gilt seit Juni 2025 auch für Apps im elektronischen Geschäftsverkehr. Kleinstunternehmen (<10 Mitarbeiter, <2 Mio. € Umsatz), die Dienstleistungen anbieten, sind formell ausgenommen [7].
- **Strategische Entscheidung**: Unabhängig von der Ausnahme sollte die App (aufgrund der Zielgruppe 50+) von Beginn an barrierefrei konzipiert werden (Kontraste, Screenreader-Support), um abmahnsicher und nutzerfreundlich zu sein.

### 11. Tierkrankenversicherungen [PLAUSIBEL, ABER UNGETESTET]
- **Fakt**: Große Versicherer (z.B. AGILA, Uelzener) bieten eigene Apps zum Einreichen von Rechnungen an, haben jedoch keine tiefe Gesundheitsakten-Funktionalität [8] [9].
- **Potenzial & Risiko**: Die Idee, Rechnungsfotos direkt aus der App an den Versicherer weiterzuleiten, ist plausibel, birgt aber ein hohes Enttäuschungsrisiko. Jeder Versicherer hat eigene, teils geschlossene Einreichungswege und Pflichtfelder (Vertragsnummer, Schadennummer). Eine einfache E-Mail-Weiterleitung führt oft zu Zuordnungsproblemen.
- **Maßnahme**: Das Feature wird für den MVP auf eine reine "Hilfestellung" reduziert: Die App hält das Foto und die Metadaten übersichtlich bereit, der Nutzer reicht es aber selbst über den offiziellen Weg seines Versicherers ein. Eine echte Integration erfordert spätere Detailrecherche pro Versicherer.

### 12. Daten-Lebenszyklus (Tod des Tieres) [PLAUSIBEL, ABER UNGETESTET]
- **Konzept**: Beim Tod eines Tieres darf die Akte nicht gelöscht werden (emotionale Bindung). Ein "Erinnerungsmodus" (Archivierung) muss konzipiert werden. Ebenso wird ein Export-Feature für Besitzerwechsel benötigt.

### 13. KI-Kostenkontrolle & Hardware [PLAUSIBEL, ABER UNGETESTET]
- **Fakt**: Da die API-Nutzung externer Anbieter (wie Mistral OCR) aus Datenschutzgründen verworfen wurde, verschiebt sich die Kostenstruktur vom Pay-per-Use-Modell zu Fixkosten für Hardware.
- **Maßnahme**: Für das Selbst-Hosting des OCR-Modells wird ein GPU-Server benötigt. Die genauen Anforderungen (VRAM-Bedarf) und die monatlichen Mietkosten (grob geschätzt 100–200 €/Monat) müssen in der technischen Planungsphase evaluiert werden. Zur Kostensenkung wird die Entwicklung und Erprobung auf einem lokalen "Kellerserver" mit gebrauchter GPU stattfinden.

### 14. Push-Zuverlässigkeit (Android Doze-Mode) [OFFEN]
- **Herausforderung**: Androids Energiemanagement (Doze-Mode) kann Hintergrundaufgaben und Alarme drosseln. Für kritische Medikamenten-Erinnerungen sind exakte Alarme (`SCHEDULE_EXACT_ALARM`) erforderlich.
- **Maßnahme**: Die Play-Store-Richtlinien für exakte Alarme müssen beachtet werden (Begründungspflicht). Die Zuverlässigkeit muss auf realen Geräten intensiv getestet werden.

### 15. Offline-Sync & Konfliktlösung [OFFEN]
- **Herausforderung**: Wenn mehrere Familienmitglieder dieselbe Akte offline bearbeiten, entstehen Konflikte.
- **Maßnahme**: Eine robuste Konfliktlösungsstrategie (z.B. Last-Writer-Wins oder manueller Merge) muss auf technischer Ebene definiert werden.

### 16. Backup, Monitoring & Update-Prozess [PLAUSIBEL, ABER UNGETESTET]
- **Herausforderung**: Serverseitige Datensicherung, Notfallwiederherstellung und ein Update-Prozess ohne Regressionen — letzteres war ein Kernfehler der analysierten Wettbewerber (Funktionsverlust nach Updates).
- **Maßnahme**: Tägliche automatisierte Backups mit getesteter Wiederherstellung, Monitoring der Serververfügbarkeit sowie ein verpflichtender Regressionstest-Katalog vor jedem Release (Doktrin: kein "es funktioniert" ohne Beleg). Details werden in der technischen Planungsphase konkretisiert.

### 17. Support-Organisation [OFFEN]
- **Herausforderung**: Das Versprechen eines "erreichbaren menschlichen Supports" muss mit den Ressourcen eines Solo-Entwicklers in Einklang gebracht werden.
- **Maßnahme**: Definition von realistischen Support-Zeiten und Einsatz effizienter Ticket-Systeme.

### 18. StIKo-Vet-Richtlinien & UPD-API [OFFEN]
- **Herausforderung**: Impfempfehlungen (StIKo-Vet) ändern sich. Die Anbindung an die Union Product Database (UPD) für Medikamentenwarnungen erfordert die Klärung von Rate-Limits und Datenqualität.
- **Maßnahme**: Es muss ein Prozess zur regelmäßigen Aktualisierung der medizinischen Regelwerke etabliert werden.

### 19. Unternehmensform & Internationalisierung [OFFEN]
- **Herausforderung**: Wahl der Rechtsform (Einzelunternehmen vs. UG/GmbH zur Haftungsbeschränkung) und steuerliche Behandlung von In-App-Käufen. Die Internationalisierung (DACH-Raum) bringt abweichende Gebührenordnungen (GOT) und Notdienste mit sich.
- **Maßnahme**: Beratung durch einen Steuerberater. Fokussierung zunächst auf den deutschen Markt ("Deutschland-first"). Hinweis: Die Wahl der Rechtsform hängt mit Punkt 6 zusammen — ein Organisations-Konto im Play Store setzt ein eingetragenes Unternehmen mit D-U-N-S-Nummer voraus.

### 20. Name & Branding [OFFEN]
- **Status**: Es ist noch kein Arbeitstitel festgelegt. Vor der Festlegung sind Markenrecherche (DPMA, EUIPO), Domain- und Play-Store-Namensverfügbarkeit zu prüfen (siehe Punkt 5).

## Abdeckung der ursprünglichen Lückenliste

Die folgende Tabelle gleicht diesen Bericht gegen alle 21 Lücken der ursprünglichen Bestandsaufnahme (`blindspot_lueckenliste.md`) ab, damit nichts verloren geht.

| Lücke (Original-Nr.) | Behandelt in Abschnitt | Status |
| --- | --- | --- |
| 1. DSGVO-Betrieb konkret | A.1 | OFFEN (Anwalt/DSB) |
| 2. KI-Verarbeitung & AI Act | A.2 | VERIFIZIERT (AI-Act-Einstufung) / PLAUSIBEL (Selbst-Hosting-Strategie) |
| 3. Haftungsfrage | A.3 | OFFEN (Anwalt) |
| 4. Impressum/AGB/Widerruf | A.5 | OFFEN (Anwalt) |
| 5. Markenrecht | A.5 + C.20 | OFFEN |
| 6. Abgrenzung Medizinprodukt | A.4 | PLAUSIBEL |
| 7. Play-Store-Pflichten 2026 | B.6–B.8 | VERIFIZIERT |
| 8. iOS-Frage | B.9 | PLAUSIBEL |
| 9. Support-Organisation | C.17 | OFFEN |
| 10. Konto-/Daten-Lebenszyklus | C.12 + B.8 | PLAUSIBEL |
| 11. Backup/Monitoring/Updates | C.16 | PLAUSIBEL |
| 12. KI-Kosten pro Scan | C.13 | PLAUSIBEL (GPU-Fixkosten statt API) |
| 13. Offline-Sync-Konflikte | C.15 | OFFEN (Technikphase) |
| 14. Push-Zuverlässigkeit | C.14 | OFFEN (Gerätetest) |
| 15. StIKo-Vet-Pflegeprozess | C.18 | OFFEN (Prozess) |
| 16. UPD-API-Zugang konkret | C.18 | OFFEN (Technikphase) |
| 17. Unternehmensform & Steuern | C.19 | OFFEN (Steuerberater) |
| 18. Tierkrankenversicherungen | C.11 | PLAUSIBEL (nur Hilfestellung im MVP) |
| 19. Name & Branding | C.20 | OFFEN |
| 20. Barrierefreiheit (EAA/BFSG) | C.10 | VERIFIZIERT |
| 21. Internationalisierung | C.19 | OFFEN (Entscheidung) |

## Zusammenfassung & Nächste Schritte

Von den 21 identifizierten Lücken sind **3 verifiziert geklärt** (Play-Store-Pflichten, Barrierefreiheit, KI-Einstufung nach AI Act), **6 mit plausiblen, aber noch ungetesteten Konzeptantworten versehen** (KI-Selbst-Hosting-Strategie, Versicherungs-Hilfestellung, KI-Hardware-Kosten, Medizinprodukt-Abgrenzung, iOS-Frage, Daten-Lebenszyklus/Backup-Prozess) und **12 bewusst offen**. Von den offenen Punkten erfordern sechs externe Fachexpertise oder formale Schritte (Anwalt für AGB, Haftung, Impressum und DSGVO-Texte, Steuerberater für die Rechtsform, Markenrecherche für den Namen) und sechs gehören in die spätere technische Planungs- bzw. Testphase (Offline-Sync, Push-Tests auf realen Geräten, UPD-API-Details, StIKo-Pflegeprozess, Support-Organisation, Internationalisierungs-Entscheidung).

Kein einziger Befund stellt das Projekt infrage. Die drei release-kritischsten Punkte (Play-Store-Testpflicht, Konto-Löschung, API-Level) sind bekannt und planbar. Der KI-Dokumentenscan wurde architektonisch auf 100 % Datenhoheit (Selbst-Hosting auf deutschem Server) umgestellt, was API-Datenschutzrisiken eliminiert, aber höhere Hardware-Fixkosten bedeutet. Die BFSG-Ausnahme für Kleinstunternehmen verschafft rechtlichen Spielraum, während Barrierefreiheit aus strategischen Gründen trotzdem von Anfang an eingebaut wird.

Die rechtlichen Aspekte (AGB, Haftung, finale DSGVO-Prüfung) verbleiben als [OFFEN] und müssen vor einem Launch durch Fachexperten geklärt werden — dies ist ein Budget- und Zeitposten, kein Konzeptrisiko.

**Es wird weiterhin kein Code geschrieben, bis der Nutzer dies explizit anordnet.**

---
### Referenzen
[1] Mistral AI: Data Processing Addendum. https://legal.mistral.ai/terms/data-processing-addendum
[2] Mistral Help Center: Can I activate Zero Data Retention (ZDR)? https://help.mistral.ai/en/articles/347612-can-i-activate-zero-data-retention-zdr
[3] Trail ML: EU AI Act Risk Classifications. https://www.trail-ml.com/blog/eu-ai-act-how-risk-is-classified
[4] PrimeTestLab: Google Play's New Rules (2026). https://primetestlab.com/blog/google-play-changed-20-to-12-testers
[5] Google Play Help: Target API level requirements. https://support.google.com/googleplay/android-developer/answer/11926878
[6] Google Play Help: Understanding Google Play’s app account deletion requirements. https://support.google.com/googleplay/android-developer/answer/13327111
[7] IT Intouch: Barrierefreiheitsstärkungsgesetz für Apps. https://www.it-intouch.de/magazin/barrierefreiheitsstarkungsgesetz-fuer-apps/
[8] AGILA: Rechnungen & Schäden. https://www.agila.de/service/rechnungen-schaeden
[9] Uelzener Versicherungen. https://uelzener.de/
[10] Mistral AI: Introducing Mistral OCR 3. https://mistral.ai/news/mistral-ocr-3/
[11] Mistral Help Center: Where do you store my data? https://help.mistral.ai/en/articles/347629-where-do-you-store-my-data-or-my-organization-s-data
