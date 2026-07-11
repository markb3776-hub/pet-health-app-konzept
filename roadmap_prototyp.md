# Roadmap: Von heute bis zum ersten testbaren Prototyp

Dieses Dokument definiert den ehrlichen, schrittweisen Weg von den fertigen Konzepten (Stand 08.07.2026) bis zu einer ersten überprüfbaren App auf deinem Smartphone. Es grenzt bewusst ab, was für den Prototyp zwingend nötig ist und was erst später (für Launch oder Beta) gebraucht wird.

## 1. Bestandsaufnahme: Was haben wir?

Die Konzeptphase ist vollständig abgeschlossen. Das bedeutet, wir wissen exakt, was wir bauen wollen und wie es funktionieren soll.
- **Gesichert (GitHub):** 46 Dokumente (App-Struktur, Datenkatalog, Nutzerkonzept, Doktrin, Blindspot-Bericht).
- **Entschieden:** KI-Scan läuft nur selbst gehostet (Start ohne KI), Kellerserver-Strategie, Offline-First-Ansatz, Android-API-Level 35.
- **Design:** Drei Kern-Mockups (Startbildschirm, Tierakte, Notfallpass) existieren.
- **Werkzeuge (verbunden):** GitHub (für Code), Neon (als Test-Datenbank; aktuell US-Region, EU-Umzug vor echten Daten verpflichtend).

## 2. Definition: Was ist der "erste überprüfbare Prototyp"?

Ein Prototyp ist nicht die fertige App. Er ist die kleinste Version, an der wir die Kernversprechen der Doktrin praktisch auf dem Handy testen können.
- **Was er KANN:** Starten (auch offline), ein Tier manuell anlegen, die Tierakte anzeigen, manuelle Einträge (Gewicht, Notiz) speichern, den Notfallpass mit QR-Code anzeigen, **Dokumente fotografieren und in der Akte ablegen (mit echter Kamera-Berechtigungs-Abfrage — bestätigte Erweiterung vom 08.07.2026)**.
- **Was er NOCH NICHT kann:** KI-Auswertung der fotografierten Dokumente (der Foto-Weg selbst ist drin, nur das automatische Auslesen fehlt), Familien-Synchronisation, UPD-Medikamentenabgleich, Versicherungs-Weiterleitung. Diese komplexen Themen werden isoliert hinzugefügt, sobald das Fundament stabil steht.
- **Wie er getestet wird:** Du bekommst eine APK-Datei, die du direkt auf deinem Android-Handy installierst (oder nutzt die "Expo Go"-App). Es braucht dafür noch keinen Google Play Store.

## 3. Die 5 Schritte bis zum Prototyp

### Schritt 1: Deine Entscheidungen (Vorarbeiten) — ✅ ABGESCHLOSSEN am 08.07.2026
- **Arbeitstitel festgelegt: "simplyPet"** (vom Projektinhaber bestätigt). Rein interner Name für Code, GitHub und Test-Symbol; der endgültige App-Name folgt später nach Namensfindung mit Markenprüfung (offener Blindspot 19).
- **MVP-Umfang bestätigt — mit einer Erweiterung:** Der Scan-/Einlese-Knopf ist im Prototyp bereits enthalten und löst die echte Berechtigungs-Kette aus (Android-Kamera-Freigabe, Nutzer-Einwilligung). Das Foto wird real in der Dokumenten-Ablage des Tieres gespeichert; nur die automatische KI-Auswertung fehlt noch, und die App sagt das ehrlich ("Foto gespeichert. Automatisches Auslesen kommt in einer späteren Version."). Kein toter Knopf, kein falsches Versprechen — und der komplette Weg (Knopf → Freigabe → Foto → Ablage) ist bereits gebaut und getestet, wenn später der selbst gehostete KI-Scan ergänzt wird.
- **Zielgeräte definieren:** Auf welchen Android-Geräten wird getestet? **Festgelegt (08.07.2026): Es stehen zwei Android-Telefone als Testgeräte zur Verfügung.** Das ist ein echter Vorteil: Zwei Geräte (idealerweise verschiedener Hersteller) decken Layout-Unterschiede, abweichende Android-Oberflächen und vor allem das kritische Push-Erinnerungs-Verhalten unter herstellerspezifischen Akku-Sparmodi ab (Blindspot C.14). Später dienen beide Geräte zudem als Testaufbau für die Familien-Freigabe. Hinweis: Im Prototyp-Stadium hält jedes Gerät seine eigenen lokalen Daten (noch keine Synchronisation); die Installation erfolgt per APK-Direktinstallation auf beiden Geräten, ohne Play Store und ohne Kosten.

### Schritt 2: Technische Spezifikation (Das "Bauplan"-Detail) — ✅ ABGESCHLOSSEN am 08.07.2026
*Diese Arbeit übernimmt die Entwicklung (Agent/Programmierer) auf Basis der Konzepte:*
- **Datenmodellierung:** Die Konzepte in echte Datenbank-Tabellen übersetzt (siehe `technische_spezifikation_datenmodell.md`).
- **Screen-Flow komplettieren:** Die fehlenden Bildschirme logisch verknüpft und beschrieben (siehe `technische_spezifikation_screen_flow.md`).
- **Offline-Strategie festlegen:** Local-First-Strategie mit Last-Writer-Wins-Konfliktlösung definiert (siehe `technische_spezifikation_offline_strategie.md`).

### Schritt 3: Projekt-Setup & Infrastruktur — ✅ ABGESCHLOSSEN am 08.07.2026
- **Code-Basis initialisiert:** Expo-Projekt (SDK 57, React Native 0.86, TypeScript) mit targetSdk 35 / minSdk 29 angelegt — liegt im Repository unter `app/`. Enthalten: lokale SQLite-Datenbank (Offline-First mit Sync-Flag), Tierarten-Konfiguration (14 Arten), Farbsystem mit reserviertem Signalrot, Navigation (4 Bereiche + Notfallpass-Stack) und Grundgerüste aller MVP-Screens. TypeScript-Prüfung fehlerfrei bestanden.
- **GitHub-Anbindung:** Der Code-Rahmen ist als Unterordner `app/` ins private Repository gepusht (Single Source of Truth: Konzepte und Code in einem Repo).
- **Datenbank-Anbindung:** Neon-Test-Datenbank angebunden, Schema (7 Tabellen) eingespielt und verifiziert. **Ehrlicher Hinweis:** Die Testdatenbank liegt vorübergehend in us-east-1 (USA), da die Anbindung keine Regionswahl erlaubte — vom Projektinhaber am 08.07.2026 freigegeben, weil nur synthetische Testdaten gespeichert werden. Verbindliche Auflage: EU-Umzug (Frankfurt) vor jeglichen echten Daten (dokumentiert in `infrastruktur_und_kellerserver_konzept.md`, Abschnitt 5).

### Schritt 4: Die eigentliche Entwicklung (Iterativ) — ✅ ABGESCHLOSSEN (4.1–4.3 am 09.07.2026, 4.4 interne Prüfung + APK am 10.07.2026)
*Hier entsteht der Code, Schritt für Schritt:*
1. **Das Fundament:** Lokale Speicherung und das Datenmodell einbauen. — ✅ **4.1 abgeschlossen (09.07.2026):** Zentrales Zeit-Modul (eine Zeitquelle, UTC intern, Anzeige TT.MM.JJJJ, Neuberechnung bei App-Start/Foreground), Draft-Autosave-Fundament gemäß Null-Datenverlust-Regel (fortlaufende Entwurfs-Sicherung ≤ 2 s, „Fortsetzen oder verwerfen?“-Dialog, Nachfrage bei Zurück-Geste, atomares Speichern mit sichtbarer Bestätigung), kontoloses Halter-Profil (nur Name, kein E-Mail/Passwort — Freigabe vom 09.07.2026), einheitliches Datumsfeld (Kalender-Picker only, Chips Heute/Gestern/Vorgestern, Zukunft gesperrt außer Termine).
2. **Die Kern-Screens:** Onboarding → Tier anlegen → Startbildschirm → Tierakte. — ✅ **4.1 abgeschlossen (09.07.2026):** Kontoloses Onboarding (Begrüßung mit Doktrin-Satz → Name → erstes Tier → Start), Startbildschirm mit 3 Zonen (Status-Karten „Heute fällig“/Überfällig, Tier-Kacheln mit Foto und Plus-Kachel, fester Notfall-Knopf) samt Anleitungskarte im Leerzustand, Tier-anlegen-Formular (Tierart zuerst, dynamische Felder je Art, Foto via Kamera/Galerie, voller Draft-Schutz), Tierakte mit Passkarte und dynamischen Reitern je Tierart (Sortierung nach Ereignis-Datum, Neuestes oben, „Nachgetragen am …“-Vermerk), Erfassen als Overlay/BottomSheet statt Tab, Notfallpass-Schnellzugriff auf allen Hauptbildschirmen (Zwei-Tap-Regel), volle Querformat-Unterstützung (responsive Layouts, kein Zustandsverlust beim Drehen). Interne Prüfung dokumentiert in `pruefprotokoll_teilauftrag_4_1.md` (TypeScript 0 Fehler, expo-doctor 20/20, Android-Bundle baubar, vollständiger Spezifikations-Abgleich).
3. **Die Funktionen:** Manuelle Einträge ermöglichen. — ✅ **4.2 abgeschlossen (09.07.2026):** Alle sechs Erfassen-Formulare voll funktionsfähig und aus dem Erfassen-Overlay erreichbar — Gewicht (artspezifischer Plausibilitäts-Hinweis, nicht blockierend), Beobachtung (Freitext-first; Aquarium: Wasserwert-Modus mit Parameter+Messwert), Vorfall (Freitext „Was ist passiert?“ als vollwertiger Eintrag, artneutrale Komfort-Kategorien, optionales Wundfoto, Tierarzt-Flag), Impfung (erzeugt automatisch eine Erinnerung aus dem Fälligkeitsdatum — atomar in einer Transaktion), Medikament/Pflege (Typen, Mehrfach-Dosierung mit Uhrzeiten, optionale tägliche Erinnerung, Saisonfenster z. B. Zeckenzeit Apr–Okt inkl. Jahreswechsel-Fenstern), Dokument-Foto (ehrliche Berechtigungs-Erklärung VOR dem System-Dialog, Kamera/Galerie, Tier-Zuordnung). Dazu: Termine-Tab mit Ein-Tap-Checkbox (tägliche Erinnerungen protokollieren die Gabe im Verlauf und rücken auf morgen), Erledigt-Liste (30 Tage) mit Rückgängig, Stammdaten-Bearbeiten (alle Felder inkl. Kastration, Chip-Nummer mit 15-Ziffern-Hinweis, Spezialisten-Tierarzt; Tierart bewusst nicht änderbar), Tiere verwalten mit Archiv (Archivieren/Zurückholen, kein Löschen im Prototyp — ehrlich kommuniziert), „Gabe protokollieren“-Knopf in der Tierakte, Dokument-Vollbild-Ansicht. Alle Formulare mit vollem Draft-Schutz gemäß Null-Datenverlust-Regel. Interne Prüfung dokumentiert in `pruefprotokoll_teilauftrag_4_2.md` (TypeScript 0 Fehler, expo-doctor 20/20, Android-Bundle baubar, 18 SQL-Statements gegen Schema verifiziert, Saisonfenster-Logiktest 11 Fälle + 60 Kombinationen bestanden).
4. **Der Notfallpass:** Generierung und Anzeige des QR-Codes (die Machbarkeit ist bereits getestet). — ✅ **4.3 abgeschlossen (09.07.2026):** Notfallpass komplett im Pass-Design — Passkarte mit Foto (Tap → Vollbild; ehrlicher Platzhalter mit Initial statt Fremdbild), Signalement (Geboren, Geschlecht, Kastration, Rasse, Fellfarbe), besondere Erkennungsmerkmale immer sichtbar (auch wenn leer: ehrlicher Vermerk), Chip-Nummer mit Kopieren-Knopf; Notfall-Block in fester Reihenfolge (Allergien → Dauermedikation → Vorerkrankungen → Impfstatus → letzte Werte → fachkundiger Tierarzt bei Spezialisten-Arten → Kontakt); QR-Code komplett offline erzeugt (deutscher Klartext, von jeder Handykamera ohne Internet lesbar, keine Server-URL, kein Tracking; Browser-Freigabe für Praxen ehrlich als „nach dem Prototyp“ gekennzeichnet); PDF-Export in A4 (Graustufen-tauglich für Schwarz-Weiß-Druck) über den System-Teilen-Dialog; Mehrtier-Umschaltung per Chips; neue Stammdaten-Felder Fellfarbe/Zeichnung und Stamm-Tierarztpraxis (Name + Telefon); Halter-Telefon kontolos im Mehr-Bereich hinterlegbar. Architektur: eine einzige Datenquelle (`passData.ts`) für Bildschirm, QR und PDF — Abweichungen zwischen den drei Darstellungen sind technisch ausgeschlossen. Interne Prüfung dokumentiert in `pruefprotokoll_teilauftrag_4_3.md` (TypeScript 0 Fehler, expo-doctor 20/20, Android-Bundle baubar, 24/24 QR/PDF-Logiktests, SQL-Spalten-Abgleich, vollständiger Spezifikations-Abgleich).
5. **Interne Prüfung:** Ein automatisierter Test gegen die "Testpflichtigen Punkte" aus dem Strukturkonzept (Zwei-Tap-Regel, Offline-Start, große Schrift). — ✅ **4.4 abgeschlossen (10.07.2026):** Alle intern prüfbaren Punkte bestanden (11 Prüfblöcke, Logiktests jeweils in 3 Durchgängen). Zwei Funde direkt korrigiert: (1) Tierfarben-Palette bestand Graustufen-/Rot-Grün-Simulation nicht → sechs Farbtöne rechnerisch neu bestimmt (jetzt 4/4 PASS inkl. Weiß-Kontrast und Signalrot-Abstand); (2) Tierakte hatte keinen direkten Notfall-Zugang → Notfall-Knopf ergänzt, öffnet direkt den Pass des jeweiligen Tieres. APK gebaut und verifiziert (134 MB, Android 10+, `de.simplypet.app` 0.1.0, apksigner PASS). Nur-Geräte-Punkte ehrlich an die Nutzertest-Checkliste delegiert. Dokumentiert in `pruefprotokoll_teilauftrag_4_4.md`.
   - Zusätzlich verbindlich: die **Null-Datenverlust-Regel** mit 3-fach-Prüfung aller Eingabeformulare gemäß `pruefdoktrin_eingabe_stabilitaet.md` (Festlegung vom 09.07.2026).
   - Zusätzlich verbindlich (festgelegt am 09.07.2026): **Tageswechsel-Testfall auf dem echten Gerät.** Geprüft wird, dass „Heute fällig“ immer den tatsächlichen Kalendertag laut Telefon-Uhr nutzt — in drei Szenarien: (a) App bleibt über Mitternacht geöffnet (Anzeige muss spätestens nach 1 Minute auf den neuen Tag umspringen, ein heute fälliger Termin erscheint, ein gestriger wandert zu „Überfällig“), (b) App war über Nacht im Hintergrund und wird morgens zurückgeholt (Anzeige sofort korrekt, kein veralteter „Gestern“-Stand), (c) manuelle Änderung der Geräte-Uhrzeit/Zeitzone bei laufender App (Anzeige folgt der Systemuhr, keine Datenänderung in der Datenbank — nur die Einsortierung Überfällig/Heute/Demnächst passt sich an). Hintergrund: Nutzer-Rückfrage vom 09.07.2026 zur Formulierung „neu berechnet“; klargestellt: Es werden keine Daten verändert, die App fragt lediglich die Systemuhr erneut ab (Zeit-Modul, Offline-Strategie 2.3).
6. **Mehrarten-Stabilitätstest (verbindlich, festgelegt am 09.07.2026):** Jede interne Prüfung läuft mit einem realistischen Testhaushalt aus **mindestens drei unterschiedlichen Tierarten mit unterschiedlichen Modul-Konfigurationen** (z. B. Hund mit Impf-Modul, Hamster ohne Impf-Modul, Aquarium mit Wasserwerten statt Gesundheitsreiter). Geprüft wird: korrekte dynamische Modul-Zuschaltung pro Art, keine Datenvermischung zwischen Akten, eindeutige Tier-Zuordnung in Terminliste und Erinnerungen (Name + Tierart + Kennfarbe), Startbildschirm-Kacheln und Notfallpass pro Tier korrekt, sowie Stabilität (kein Absturz, keine Layout-Brüche) beim schnellen Wechsel zwischen den Akten. Hintergrund: 13 % der Tierhalter-Haushalte halten mehrere Arten parallel – das ist Kernszenario, kein Randfall (siehe Mehrtier-Konzept).

### Schritt 5: Auslieferung & Überprüfung
- Die App wird als Testversion (APK oder via Expo) an dich übergeben.
- Du testest sie auf **beiden Android-Geräten** auf Herz und Nieren (Funktion, Bedienbarkeit, Doktrin-Treue) — insbesondere: Erinnerungen über mehrere Tage auf beiden Geräten (Akku-Sparmodus-Test), Layout bei größter Schriftgröße auf beiden Bildschirmgrößen, Zwei-Tap-Notfallpass.
- **Mehrarten-Praxistest:** Du legst auf mindestens einem Gerät drei Tiere unterschiedlicher Arten an (z. B. Hund, Katze, Hamster) und nutzt die App eine Zeit lang so, wie ein echter Mehrtier-Haushalt es täte – Einträge bei allen Tieren, Erinnerungen parallel, Wechsel zwischen den Akten. Die App muss dabei stabil laufen und jede Information eindeutig dem richtigen Tier zuordnen. **Deine persönliche Checkliste dafür (inkl. Tierwechsel-Verhalten): `pruefprotokoll_prototyp_nutzertest.md`.**

## 4. Kostenschätzung & Ausblick

**Für die Prototyp-Phase:**
- **Externe Werkzeuge:** 0 € (GitHub, Neon, Expo sind in den benötigten Basis-Stufen kostenlos).
- **Google Play Registrierung:** 25 $ (einmalig), aber erst nötig, wenn die App in einen offiziellen Beta-Test geht. Für den Prototyp nicht erforderlich.
- **Server:** Der Kellerserver (150–300 €) wird erst relevant, wenn wir nach dem Prototyp mit den KI-OCR-Tests beginnen.
- **Arbeitskosten (Agent-Credits):** Die Entwicklung (Schritt 2 bis 4) ist der ressourcenintensivste Teil. Empfehlung: Diese Schritte einzeln und klar umrissen beauftragen, um Kosten zu kontrollieren.

**Zusammenfassung:** Alles Konzeptionelle ist fertig; die Schritte 1 bis 3 sind seit dem 08.07.2026 abgeschlossen, **Schritt 4 (Entwicklung) ist seit dem 10.07.2026 komplett** (4.1 Fundament + Kern-Screens, 4.2 Funktionen/Einträge, 4.3 Notfallpass + QR, 4.4 interne Prüfung + APK). **Schritt 5 (Nutzertest) läuft seit dem 10.07.2026** — APK v0.1.1 auf S23 + S24 installiert, Feedback wird gesammelt.

### Schritt 5 Status: ⏳ LAUFEND (seit 10.07.2026)

- ✅ APK v0.1.0 ausgeliefert und installiert (10.07.2026)
- ✅ Erste Bugs gemeldet und behoben → APK v0.1.1 (Insets-Fix + Jahr-Picker)
- ✅ Zweite Testperson eingebunden
- ✅ Konkurrenzanalyse durchgeführt (11.07.2026)
- ✅ Korrektur-Durchlauf v0.1.2 durchgeführt (11.07.2026) → 33 Punkte implementiert
- ✅ APK v0.1.2 gebaut und ausgeliefert (11.07.2026, 134 MB)
- ⏳ Interview mit zweiter Testperson ausstehend
- ⏳ Feedback-Sammlung auf v0.1.2 läuft
- ⏳ Testgeräte ZTE Blade A35e + PRITOM 7" Tablet bestellt

### Schritt 6: Korrektur-Durchlauf v0.1.2 — ✅ ABGESCHLOSSEN (11.07.2026)

Gebündelter Durchlauf mit 33 Punkten erfolgreich implementiert und als APK gebaut.

**Implementierte Features:**
1. ✅ Rasse-Feld (Freitext) im AddPetScreen + permanenter Tierarzt-Tipp
2. ✅ Allergien & Vorerkrankungen als separate Felder in Stammdaten
3. ✅ Erinnerungs-Vorlauf einstellbar (X Tage vorher)
4. ✅ Überfällig-Hinweis bei Impfungen
5. ✅ Parasitenschutz als eigene Kategorie (Spot-On/Halsband/Tablette)
6. ✅ Kennfarbe-Bezeichnung klargestellt + Hinweis-Text
7. ✅ Farbpalette überarbeitet (Orange, Gelb, Weiß neu; weniger Grün)

**Implementierte Datensicherung:**
8. ✅ Automatisches lokales Backup nach jedem Save
9. ✅ Export via Android-Teilen-Dialog (.simplypet Datei)
10. ✅ Import via Datei-Picker (Ersetzen/Zusammenführen)
11. ✅ MoreScreen mit Backup-Bereich und Datenschutz-Info

**Implementierte Robustheit (33 Präventionsmaßnahmen):**
12. ✅ Doppelklick-Schutz auf SaveButton (1s Cooldown)
13. ✅ Portrait-Sperre (app.json orientation)
14. ✅ FlatList statt ScrollView auf HomeScreen (RAM-Schutz)
15. ✅ Shared ImagePicker-Helper (Android 13+ Galerie-Fix, Komprimierung)
16. ✅ Foto-Komprimierung auf max 800px/70% JPEG
17. ✅ Locale-sichere Datumsformatierung
18. ✅ Notification-Permission-Request bei App-Start (Android 13+)
19. ✅ Low-Memory-Handler
20. ✅ Speicherplatz-Check vor Foto-Aufnahme
21. ✅ DB Migration 004 (allergies, pre_conditions, sub_type, edited_at, reminder_offset_days)
22. ✅ compileSdk 36 für AAR-Kompatibilität

**TypeScript-Prüfung:** 0 Fehler. **Expo Export:** 1334 Module, 0 Fehler. **Build:** SUCCESSFUL.

### Schritt 7: Play Store Release (ZUKUNFT)

- Preismodell: **Einmalkauf 2,99€** (kein Abo, keine Werbung, keine In-App-Käufe)
- Google Play Registrierung: 25$ (einmalig)
- Store-Listing: Positionierung gegen Konkurrenz-Schwächen (siehe `konkurrenzanalyse_simplypet.md`)
- Datenschutzerklärung erstellen
- App-Signierung und Release-Build

## 5. Konkurrenzanalyse (11.07.2026)

Vollständige Analyse in `konkurrenzanalyse_simplypet.md`. Kernerkenntnisse:
- Häufigster 1-Stern-Grund bei Konkurrenz: Datenverlust durch Server/Updates → simplyPet immun (lokal)
- Zweit-häufigster Frust: Abo-Zwang → simplyPet: Einmalkauf 2,99€
- Trend 2026: Privacy-First wird Verkaufsargument → simplyPet: keine INTERNET-Permission
- Zentrale Nutzer-Erkenntnis: „Weniger Features, weniger Reibung“ → simplyPet: Navigation/UX verbessern
