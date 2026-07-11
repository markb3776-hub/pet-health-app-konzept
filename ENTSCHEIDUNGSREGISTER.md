# Entscheidungsregister: simplyPet

**Zweck:** Zentrale, lebende Datei. Jede Entscheidung wird hier dokumentiert, jede offene Frage gelistet. Wird bei JEDER Session als erstes gelesen und bei jeder Einigung sofort aktualisiert.

**Regel:** Nichts darf nur „im Gespräch" bleiben. Was besprochen wurde, steht hier.

---

## Offene Punkte (warten auf Entscheidung)

| Nr. | Thema | Frage | Seit |
|:---|:---|:---|:---|
| O-01 | Bearbeiten/Löschen | Soll „Bearbeitet am…"-Vermerk immer sichtbar oder aufklappbar sein? | 11.07.2026 |
| O-02 | Bearbeiten/Löschen | Soll Löschen endgültig sein oder erst in Papierkorb (30 Tage)? | 11.07.2026 |
| ~~O-03~~ | ~~Parasitenschutz~~ | **GELÖST → E-53:** Eigene Kategorie unter Medikament/Pflege mit Untertypen (Spot-On/Halsband/Tablette) | 11.07.2026 |
| O-04 | Tester-Feedback | Interview mit zweiter Testperson – Ergebnisse ausstehend | 11.07.2026 |

---

## Getroffene Entscheidungen (chronologisch)

### 11.07.2026

| ID | Thema | Entscheidung | Begründung |
|:---|:---|:---|:---|
| E-20 | Preismodell | Einmalkauf 2,99€, kein Abo, keine Werbung | Konkurrenzanalyse: Nutzer hassen Abos |
| E-21 | Rasse-Feld | Freitext, kein Dropdown, keine Datenbank | Einfachheit, keine Haftung |
| E-22 | Tierarzt-Tipp | Permanenter statischer Hinweis unter Rasse-Feld (wenn ausgefüllt) | Kein medizinischer Inhalt, nur Empfehlung zum Tierarzt-Gespräch |
| E-23 | Allergien/Vorerkrankungen | Ein Bereich, zwei separate Titelfelder in Stammdaten | Nutzer-Feedback: „Wo trage ich das ein?" |
| E-24 | Rassenspezifische Vorschläge | NICHT im Prototyp. Keine automatischen Prädispositions-Vorschläge. | Haftungsrisiko, Datenqualität, Aufwand |
| E-25 | Backup-Konzept | Automatische lokale Backup-Datei + manueller Export über Teilen-Dialog | Nutzer ist verantwortlich für externe Sicherung |
| E-26 | Backup-Import | Import-Button auf neuem Gerät, .simplypet-Datei wird als Dateityp registriert | Muss auf jedem Android-Gerät funktionieren |
| E-27 | Backup-Inhalt | Alles: Daten + Fotos + Einstellungen in einer Datei | Datei muss eigenständig und geräteunabhängig sein |
| E-28 | Kauf bei Gerätewechsel | Nutzer zahlt NICHT nochmal – Google-Konto = Kaufnachweis | Standard-Play-Store-Verhalten |
| E-29 | Einträge bearbeiten | Stift-Symbol, Formular vorausgefüllt, Bearbeitungs-Vermerk | Tippfehler-Korrektur ermöglichen |
| E-30 | Einträge löschen | Löschen mit Bestätigungs-Dialog, doppelte Bestätigung bei Impfungen/Medikamenten | DSGVO + UX |
| E-31 | Doppelklick-Schutz | Auf allen Speichern-Buttons | Konkurrenz-Schwäche vermeiden |
| E-32 | Rotation | Portrait-only (gesperrt) | Verhindert Layout-Brüche |
| E-33 | Dark Mode | Light erzwingen | Verhindert unsichtbare Texte |
| E-34 | Foto-Komprimierung | Sicherstellen bei Kamera-Aufnahme | Speicher-Überlauf verhindern |
| E-35 | Zukunfts-Datum | Gesperrt bei Gewicht/Beobachtung/Vorfall | Fehleingaben verhindern |
| E-36 | DB-Fehlerbehandlung | Try/Catch mit sichtbarer Fehlermeldung | Kein stummes Scheitern |
| E-37 | Textumbruch | numberOfLines + Ellipsis oder flexibler Umbruch bei langen Texten | Tablet niedrige DPI: Texte können überlaufen |
| E-38 | Tap-Targets | Mindestens 48dp auf allen Buttons und Icons | ZTE/Budget: kleine Displays, dicke Finger |
| E-39 | ScrollView | Alle Screens scrollbar (kein festes Layout) | Split-Screen + kleine Displays |
| E-40 | Flexible Feldhöhen | Keine fixen Pixel-Höhen bei Eingabefeldern | Barrierefreiheit: große Systemschrift muss passen |
| E-41 | Google-unabhängig | Keine Abhängigkeit von Google Play Services | Budget-Tablets ohne Google müssen funktionieren |
| E-42 | Notification-Permission | Explizit anfragen bei Android 13+ (POST_NOTIFICATIONS) | Ohne Anfrage: keine Erinnerungen |
| E-43 | Kamera-Permission | READ_MEDIA_IMAGES statt READ_EXTERNAL_STORAGE auf Android 13+ | Sonst Absturz bei Foto-Auswahl |
| E-44 | FlatList bei Listen | Tierliste + Einträge-Listen als FlatList (nicht ScrollView) | RAM-Schutz auf ZTE (2 GB) |
| E-45 | Thumbnails in Listen | Tierfotos als Thumbnail laden, nicht Original | RAM-Explosion verhindern |
| E-46 | Hermes-Engine | Aktiviert lassen (Standard bei Expo) | -30% RAM, schnellerer Start |
| E-47 | Scoped Storage | Backup-Export über Share-Intent, nicht direkter Dateipfad | Android 11+ Pflicht |
| E-48 | Locale-sichere Daten | Datumsformatierung unabhängig von Geräte-Locale (ISO intern, lokale Anzeige) | Crash-Prävention |
| E-49 | Leerer Zustand | App-Start ohne Daten darf nicht crashen (Empty-States) | Neues Gerät nach Backup-Import |
| E-50 | SQLite WAL-Modus | Write-Ahead-Logging aktivieren | Verhindert DB-Locks bei Backup während Nutzung |
| E-51 | Speicherplatz-Check | Vor Backup-Erstellung freien Speicher prüfen | ZTE 64 GB kann voll sein |
| E-52 | Low-Memory-Handling | Bei Android-Warning: Bilder-Cache leeren | Graceful Degradation statt Crash |
| E-53 | Parasitenschutz | Eigene Kategorie unter Medikament/Pflege mit Untertypen: Spot-On, Halsband, Tablette | Nutzer-Feedback: klare Zuordnung nötig |
| E-54 | Kennfarbe-Bezeichnung | "Kennfarbe in der App" statt "Farbe für dieses Tier" + Hinweis-Text | Testperson dachte es sei Fellfarbe |
| E-55 | Farbpalette | Orange + Gelb hinzu, Oliv + Gold entfernt, Weiß (Cremeweiß mit Rand) ergänzt | Zu viel Grün, fehlende Grundfarben |
| E-56 | Galerie-Favoriten | Shared ImagePicker-Helper mit korrektem Android 13+ Permission-Handling | Testperson: Fotos aus Favoriten nicht aufrufbar |
| E-57 | APK v0.1.2 | Erfolgreich gebaut (134 MB), compileSdk 36, alle 33 Punkte implementiert | Build 11.07.2026 |

### 10.07.2026

| ID | Thema | Entscheidung | Begründung |
|:---|:---|:---|:---|
| E-17 | Insets-Fix | SafeAreaView auf allen 19 Screens | Samsung-Navigationsleiste überlappt |
| E-18 | Jahr-Picker | Schnellzugriff-Button für Jahr-Auswahl | Nutzer-Feedback: zu viel Scrollen |
| E-19 | Zweite Testperson | Eingebunden, Interview geplant | Breiteres Feedback |

### 09.07.2026

| ID | Thema | Entscheidung | Begründung |
|:---|:---|:---|:---|
| E-01 – E-16 | Prototyp-Grundlagen | Siehe `roadmap_prototyp.md` Schritt 4 | Fundament, Screens, Funktionen, Notfallpass |

---

## Doktrin (unveränderlich)

Diese Punkte sind NICHT verhandelbar:

1. **Keine INTERNET-Permission** – App geht niemals online
2. **Kein Account/Login** – nur lokaler Halter-Name
3. **Kein Tracking/Analytics** – kein PostHog, kein Firebase, nichts
4. **Keine medizinischen Empfehlungen** – nur ehrliche Hinweise
5. **Null-Datenverlust** – Draft-Autosave auf jedem Formular
6. **Defensive Migrationen** – IF NOT EXISTS, niemals Spalten löschen
7. **Einmalkauf** – kein Abo, keine Werbung, keine In-App-Käufe
8. **Nutzer-Souveränität** – seine Daten, seine Entscheidung wo er sie speichert

---

## Aktualisierungs-Regel

> **Dieses Dokument wird bei JEDER Einigung, JEDER neuen offenen Frage und JEDER Doktrin-Ergänzung sofort aktualisiert und gepusht. Kein Gespräch ohne Dokumentation.**
