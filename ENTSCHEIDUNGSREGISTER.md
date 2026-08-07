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
| E-58 | Notfall-Button | Floating-Button ENTFERNT. Stattdessen: Notfall als 5. Tab mit ISO-Erste-Hilfe-Zeichen (weißes Kreuz auf grünem Grund) | Verdeckt Inhalte, universell erkennbar, immer erreichbar |
| E-59 | Überfällig-Karte | Karte auf HomeScreen wird antippbar → navigiert direkt zum Termine-Tab | Nutzer erwartet Interaktion |
| E-60 | Tier-Kacheln | Kompakter gestalten (weniger Padding) → mehr Tiere auf einen Blick | Ohne Floating-Button ist mehr Platz, wichtige Infos schneller sichtbar |
| E-61 | App-Shortcut | Lang drücken auf App-Icon → "Notfallpass" als Schnellzugriff (Android-Standard) | Sofort umsetzbar, kein Setup nötig |
| E-62 | Sperrbildschirm-Zugriff | Permanente Notification (Opt-in): kleines weißes Kreuz-Icon in Statusleiste (24×24dp, monochrom). Priorität MIN/LOW (kein Sound/Vibration). Beim Herunterziehen: "simplyPet Notfallpass – Tippe für sofortigen Zugriff". Tipp → Notfallpass öffnet sich OHNE Entsperren (Show-on-Lock-Screen Activity, kein PIN/Fingerprint nötig). Standardmäßig AUS, Nutzer aktiviert in Einstellungen. | Notfall = sofort, keine Barriere. Hochgezogen auf v0.1.3 |
| E-63 | QR-Code statisch | QR-Code bleibt statisch (Klartext, kein Server-Link). Doktrin-konform. | Dynamischer QR bräuchte Server → widerspricht Offline-Doktrin |
| E-64 | QR-Änderungshinweis | Nach Änderung von Notfall-relevanten Daten: Hinweis "Dein ausgedruckter Pass ist veraltet. Neu drucken?" | Nutzer vergisst sonst veralteten Ausdruck |
| E-65 | QR-Druckdatum | PDF-Ausdruck zeigt unten: "Stand: [Datum]" | Finder/Besitzer sieht sofort ob Pass aktuell ist |
| E-66 | App-Beschreibung | "Tiergesundheits-App" ENTFERNT. Neu: "simplyPet – dein unabhängiges Pocket-Tool für deine Liebsten." | Kein medizinischer Anspruch, emotional, trifft den Kern |
| E-67 | Bug: Tierverwaltung Layout | Text wird vertikal dargestellt (Buchstabe pro Zeile). Ursache: flex-Layout der Kacheln. Fix: Text-Container flex:1 | Kritischer UI-Bug in v0.1.2 |
| E-68 | Familien-Teilen | "Mit Familie teilen"-Button öffnet nativen Android-Teilen-Dialog. Nutzer entscheidet selbst: WhatsApp, E-Mail, Google Drive, Bluetooth etc. Kein Zwang zu bestimmtem Dienst. .simplypet-Dateityp als Intent-Filter registrieren (Tipp auf empfangene Datei → App öffnet sich). Kein eigener Server, keine INTERNET-Permission. | Nutzer-Souveränität: er wählt den Weg. Keine zusätzliche App nötig. Doktrin bleibt intakt. |
| E-69 | Kreuz/Plus + Grünspektrum = STRIKT UNTERSAGT | Notfall-Tab nutzt exaktes ISO 7010 E003: weißes Kreuz auf ISO-Grün (#237F52, RAL 6032). Alle weiteren Kombinationen von Kreuz/Plus (+) mit JEDER Farbe des gesamten Grünspektrums (Grün, Teal, Mint, Lime, Olive, Smaragd etc.) sind STRIKT UNTERSAGT. Plus-Zeichen in Schwarz, Grau, Blau etc. erlaubt. | Eindeutige, sofortige Assoziation: Grünes Kreuz = Notfall. Keine Ausnahmen, keine Verwechslung. |
| E-70 | App-Farbe = Teal (#2E9E83) | Teal #2E9E83 ist die fixe, geblockte Primary-Farbe der App. Ersetzt das bisherige dunkle Grün #3E6B4F im Code. Alle UI-Elemente (Buttons, aktive Tabs, Akzente, Header) nutzen diese Farbe. | Einheitliche Markenfarbe, klar unterscheidbar vom ISO-Grün (#237F52) des Notfallpasses. |
| E-71 | Teal für Buttons = OK (Nutzer-validiert) | Teal (#2E9E83) darf weiterhin für alle gefüllten Buttons (Exportieren, Speichern, QR-Code zeigen etc.) und aktive Elemente (Tabs, Chips, Checkboxen) verwendet werden. Kein Wechsel auf andere Farbe nötig. | Rückmeldung Testperson 11.07.2026: Grün wird mit "OK / Bestätigung" assoziiert. Notfall-Tab hebt sich durch Form + Position ausreichend ab. |
| E-72 | Show-on-Lock-Screen: verschoben | v0.1.4 implementiert permanente Notification + Tipp öffnet Notfallpass. OHNE Entsperren (showWhenLocked Activity) wird auf v0.1.5 verschoben – benötigt nativen Kotlin-Code. | Pragmatischer Prototyp-Ansatz: Notification sofort nutzbar, Lock-Screen-Bypass als Verbesserung. |

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

1. **Dokumentation zuerst** – Bei jeder Änderung/Neuerung werden ZUERST die Dokumente und Dokumentation aktualisiert und gepusht, DANN erst der Code angefasst. So stehen Entscheidungen bei einem Sandbox-Reset immer zur Verfügung. Diese Regel steht vor allem anderen.
2. **Keine INTERNET-Permission** – App geht niemals online
3. **Kein Account/Login** – nur lokaler Halter-Name
4. **Kein Tracking/Analytics** – kein PostHog, kein Firebase, nichts
5. **Keine medizinischen Empfehlungen** – nur ehrliche Hinweise
6. **Null-Datenverlust** – Draft-Autosave auf jedem Formular
7. **Defensive Migrationen** – IF NOT EXISTS, niemals Spalten löschen
8. **Einmalkauf** – kein Abo, keine Werbung, keine In-App-Käufe
9. **Nutzer-Souveränität** – seine Daten, seine Entscheidung wo er sie speichert
10. **Kreuz/Plus + Grünspektrum = STRIKT UNTERSAGT** – Notfallpass nutzt ISO 7010 E003 (#237F52). Alle weiteren Kombinationen von +/Kreuz mit JEDER Farbe des Grünspektrums sind strikt untersagt. Keine Ausnahmen.

---

## Aktualisierungs-Regel

> **Dieses Dokument wird bei JEDER Einigung, JEDER neuen offenen Frage und JEDER Doktrin-Ergänzung sofort aktualisiert und gepusht. Kein Gespräch ohne Dokumentation.**
| E-73 | Permanente Notification = Foreground Service | expo-notifications `sticky:true` reicht NICHT – Samsung OneUI behandelt sie als normale Notification (wegwischbar, zeitlich begrenzt, verschwindet nach Antippen). Fix: Nativer Android Foreground Service. Notification ist nicht wegwischbar, bleibt nach Antippen bestehen, verschwindet NUR wenn der Schalter auf AUS steht. Verhalten wie ein Lichtschalter: AN = da, AUS = weg. | Nutzer-Test 11.07.2026: Notification verschwand nach Nutzung trotz Aktivierung. Samsung "erneut anzeigen in X Min" Dialog beweist: nicht als ongoing erkannt. |
| E-74 | Backup-Dateiname mit Nummer + Datum | Manueller Export erzeugt Dateinamen im Format `Backup_001_2026-07-11.simplypet`. Fortlaufende Nummer (in AsyncStorage gespeichert) + aktuelles Datum. Auto-Backup nutzt festen internen Dateinamen (überschreibt sich selbst). | Nutzer-Feedback 11.07.2026: Bisheriger Name `simplypet_backup.simplypet` war nicht unterscheidbar bei mehreren Backups. Kein Hinweis auf Zeitpunkt oder Reihenfolge. |
| E-75 | Tab-Bar überall sichtbar | Tab-Bar (Zuhause, Termine, Erfassen, Mehr, Notfall) muss auf ALLEN Screens sichtbar sein – auch in Unter-Screens wie Tierakte, Erfassen-Formulare etc. Navigation-Umbau: Screens vom Stack in den Tab-Navigator verschieben oder Tab-Bar als Custom-Komponente überall einblenden. | Nutzer-Anweisung: Buttonleiste soll überall nutzbar sein. War beschlossen, wurde aber architektonisch nicht umgesetzt (Tierakte lag im Stack über den Tabs). |
| E-76 | Tierakte-Einträge bearbeiten/löschen | Jeder Eintrag in der Tierakte (Medikament-Protokollierung, Gewicht, Beobachtung, Vorfall, Impfung) muss bearbeitbar und löschbar sein. Antippen → Optionen: Bearbeiten / Löschen. Bearbeiten zeigt vorausgefülltes Formular + "Bearbeitet am"-Vermerk. Löschen mit Bestätigungs-Dialog. | War bereits als E-29/E-30 beschlossen, aber nur für Stammdaten implementiert. Tierakte-Einträge hatten keine Bearbeiten/Löschen-Funktion. Konkurrenz-Kritikpunkt. |
| E-77 | Hilfe-Fragezeichen im Notfallpass | Neben den Bereichs-Überschriften im Notfallpass (Besondere Erkennungsmerkmale, Allergien, Dauermedikation, Vorerkrankungen, Impfstatus, Letzte bekannte Werte) erscheint ein kleines (?)-Icon. Beim Antippen: kurze Hilfeblase mit Erläuterung, z.B. "Diese Daten bearbeitest du in der Tierakte (Stift-Symbol bei deinem Tier).". NUR in der App sichtbar – NICHT im PDF-Export, NICHT im QR-Code, NICHT in der Browser-Ansicht. | Nutzer-Feedback 11.07.2026: Frage "wo Eingabe?" bei leeren Feldern. Hilfe-Tooltip löst das ohne den Notfallpass editierbar zu machen. |
| E-78 | Reihenfolge Notfallpass: Allergien + Vorerkrankungen direkt untereinander | Neue Reihenfolge der Blöcke im Notfallpass: 1. Allergien und Unverträglichkeiten, 2. Vorerkrankungen, 3. Dauermedikation, 4. Impfstatus, 5. Letzte bekannte Werte. Allergien und Vorerkrankungen gehören inhaltlich zusammen (E-23: "ein Bereich") und dürfen nicht durch Dauermedikation getrennt werden. | Nutzer-Feedback 11.07.2026: Vorerkrankungen und Allergien wurden nicht direkt untereinander angezeigt – Dauermedikation stand dazwischen. Widerspricht E-23. |
| E-79 | Parasitenschutz = eigener Block im Notfallpass, getrennt von Impfstatus | Parasitenschutz (Wurmkuren, Zecken-/Floh-Spot-On, Halsbänder, Tabletten) ist KEINE Impfung und darf NICHT unter "Impfstatus" angezeigt werden. Neuer eigener Block "PARASITENSCHUTZ" im Notfallpass. Reihenfolge: 1. Allergien, 2. Vorerkrankungen, 3. Dauermedikation, 4. Impfstatus (nur echte Impfungen: Tollwut, Staupe, Parvo, Borreliose etc.), 5. Parasitenschutz (Wurmkuren, Zecken-/Flohschutz), 6. Letzte bekannte Werte. Gilt für ALLE Tierarten (nicht nur Hund/Katze). Fachliche Grundlage: Es gibt bei keiner Tierart eine Impfung gegen Parasiten – Parasitenschutz ist immer ein Medikament (ESCCAP, Fressnapf, Tierspital Zürich). Einzige Ausnahme: Borreliose-Impfung schützt vor der KRANKHEIT (nicht vor dem Zeckenbiss) und ist eine echte Impfung. | Nutzer-Feedback 11.07.2026: "Riesenwurm" und "Zecken und Flöhe" standen fälschlicherweise unter IMPFSTATUS. Fachlich falsch – Entwurmung/Spot-On sind keine Impfungen. E-53 hatte Parasitenschutz bereits als eigene Kategorie unter Medikament/Pflege definiert, aber im Notfallpass fehlte die Trennung. |
| E-80 | Pferde-spezifischer Notfallpass-Block | Wenn species=pferd, wird im Notfallpass ein komplett eigener Block gerendert, der auf Pferde-Notfälle zugeschnitten ist. Unterschiede zum generischen Pass: (1) Erkennungsmerkmale enthält Equidenpass-Nr., Abzeichen, Brand; (2) Vorerkrankungen enthält Kolik-Vorgeschichte; (3) Parasitenschutz zeigt letzte Kotprobe (Datum + EpG-Wert) statt nur Medikament; (4) "Letzte bekannte Werte" zeigt geschätztes Gewicht (Maßband-Methode) statt Waagen-Gewicht; (5) Kontakt-Block enthält zusätzlich Stallkontakt (Pensionsstall/Box-Nr.) und Hufschmied; (6) Neuer Block "Haltung" mit Box/Weide-Info. Generische Blöcke (Allergien, Dauermedikation, Impfstatus) bleiben gleich. Technisch: Bedingtes Rendering per species-Check, eigene Komponente EquinePassBlocks. Gilt auch für PDF und QR. | Nutzer-Feedback 11.07.2026: Pferde haben erheblich andere Anforderungen im Notfall (Kolik, Equidenpass gesetzliche Pflicht, selektive Entwurmung, Pensionsstall). Generischer Pass deckt das nicht ab. Architektur-Prinzip: tierartspezifische Blöcke die nur bei Auswahl der Tierart aktiv werden. |
| E-81 | Termine-Screen: Tiername eigene Zeile + Hinweis vs. Termin visuell trennen | (1) Tiername steht als eigene Zeile OBERHALB des Erinnerungstexts (nicht mehr inline "Hanna: ..."). (2) Visuelle Trennung: Hinweise (täglich/Pflege/Medikament) = orangener Seitenbalken; Termine (festes Datum, Impfung) = grüner/petrol Seitenbalken. Damit sofort erkennbar was ein Hinweis und was ein Termin ist. (3) Kleiner Prototyp-Hinweis am Ende des Screens: "Prototyp – noch keine Push-Notifications oder Kalender-Sync aktiv!" | Nutzer-Feedback 11.07.2026: Tiername geht in der Zeile unter, Hinweise und Termine sehen identisch aus obwohl sie unterschiedliche Dinge sind. Prototyp-Transparenz: Nutzer soll wissen dass Push/Kalender-Sync noch kommt. |
| E-82 | Termine-Gruppen: Überfällig / Bald fällig / Geplant | Die bisherige Gruppe "Demnächst" wird abgeschafft (irreführend bei Terminen die Monate entfernt sind). Neue Gruppierung: (1) **Überfällig** (rot) – Fälligkeit in der Vergangenheit. (2) **Bald fällig** – Fälligkeit innerhalb der nächsten 14 Tage. (3) **Geplant** – Fälligkeit > 14 Tage in der Zukunft. Tägliche Hinweise (Medikament/Pflege) erscheinen immer unter "Überfällig" (wenn nicht erledigt) oder werden nach Erledigung ausgeblendet – sie haben kein "Geplant" weil sie jeden Tag anfallen. | Nutzer-Feedback 14.07.2026: Tollwut-Impfung fällig am 15.01.2027 stand unter "Demnächst" – das sind 6 Monate, nicht "demnächst". Irreführend. |
| E-83 | Rasse statt Tierart auf HomeScreen wenn vorhanden | Auf dem HomeScreen und in der Tierliste wird unter dem Tiernamen die **Rasse** angezeigt, sobald diese in den Stammdaten eingetragen ist. Wird die Rasse wieder gelöscht, fällt die Anzeige auf die Tierart zurück. Beispiel: "Hanna – Maine Coon" statt "Hanna – Katze". Bidirektional: Rasse eingetragen → Rasse anzeigen; Rasse gelöscht → Tierart anzeigen. | Nutzer-Feedback 14.07.2026: Auf dem HomeScreen steht nur "Katze" / "Hund" / "Reptil" – wenig aussagekräftig wenn man die Rasse bereits eingetragen hat. Die Rasse ist spezifischer und hilft bei mehreren Tieren gleicher Art. |
| E-84 | Artspezifisches Label für Fellfarbe/Zeichnung | Das Feld "Fellfarbe / Zeichnung" im EditPetScreen passt nicht für alle Tierarten. Label wird artspezifisch: Hund/Katze/Kleinsäuger = "Fellfarbe / Zeichnung"; Reptil = "Hautfarbe / Musterung"; Ziervogel = "Gefiederfarbe / Zeichnung"; Pferd = "Fellfarbe / Abzeichen"; Aquarium = Feld komplett ausblenden. Platzhaltertexte ebenfalls artspezifisch anpassen. | Nutzer-Feedback 14.07.2026: Gustav ist ein Reptil – "Fellfarbe" bei einem Reptil ist fachlich falsch. Reptilien haben kein Fell. Doktrin: Keine Hund/Katze-lastigen Labels. |
| E-85 | App-Icon Badge (Notification Badge) | Das simplyPet App-Icon auf dem Homescreen des Geräts zeigt eine Zahl-Badge an (wie Instagram, WhatsApp etc.), die die Anzahl überfälliger Aufgaben darstellt. Implementierung über `expo-notifications` setBadgeCountAsync() oder nativen Badge-API. Badge wird bei jeder Statusänderung aktualisiert (Aufgabe erledigt → Badge -1; neue Aufgabe überfällig → Badge +1; alle erledigt → Badge verschwindet). Funktioniert auch ohne Push-Notifications (lokaler Badge-Count). | Nutzer-Feedback 14.07.2026: Referenz Instagram-Badge auf Homescreen. Nutzer soll auch ohne App-Öffnung sehen ob etwas überfällig ist. Ergänzt E-73 (Foreground Notification) als leichtgewichtige Alternative für den Prototyp. |
| E-86 | Aquarium-spezifische Felder und Anpassungen | Das Aquarium ist ein Behältnis, kein Einzeltier. Folgende Anpassungen: (1) „Geboren" → **„Eingerichtet am"** (Datum des Beckenstarts). (2) **Chip-Nummer ausblenden** (Fische haben keine Chips). (3) NEU: **Beckentyp** als Auswahl: Süßwasser / Meerwasser / Brackwasser. (4) NEU: **Volumen (Liter)** als Zahlenfeld. (5) **Besatz-Liste** (stock_list Modul) implementieren: Fischarten mit Anzahl erfassbar, da verschiedene Arten unterschiedliche Wasseranforderungen haben – hilft bei Diagnose wenn eine Art Auffälligkeiten zeigt. Diese Felder gelten nur bei species=aquarium. | Nutzer-Feedback 14.07.2026: Screenshot zeigt „Chip-Nummer: Nicht angegeben" und „Geboren: Nicht angegeben" bei einem Aquarium – beides sinnlos. Fachlich: Verschiedene Fischarten haben verschiedene Wasseranforderungen; Süß-/Meerwasser-Unterscheidung ist fundamental. |
| E-87 | Artspezifische Feld-Sichtbarkeit (Chip-Nummer, Identifikation) | Die Chip-Nummer ist nicht bei allen Tierarten relevant. Neue Regeln: (1) **Kleinnager** (Meerschweinchen, Chinchilla, Ratte, Maus, Degu, Hamster): Chip-Feld **ausblenden** (werden nie gechipt). (2) **Ziervogel**: Label ändern zu **„Ring-/Chip-Nummer"**, Platzhalter: „Ringnummer oder Transponder-Nummer", Hint: „Die Ringnummer steht auf dem geschlossenen Fußring. Bei großen Papageien ggf. auch Chip." (3) **Reptil**: Chip-Feld behalten, Platzhalter: „Optional – bei Meldepflicht empfohlen". (4) **Pferd**: Platzhalter: „15-stellig, steht im Equidenpass". (5) **Hund/Katze/Frettchen/Kaninchen**: Bleibt wie bisher. Gilt für EditPetScreen UND PetFileScreen (Tierakte-Ansicht). | Nutzer-Feedback 14.07.2026: Vögel haben Fußringe mit Ringnummer – das ist ihr Identifikationsmerkmal, nicht der Chip. Kleinnager werden nie gechipt → Feld ist irreführend. Doktrin: Keine sinnlosen Felder anzeigen die den Nutzer verwirren. |


### 15.07.2026

| ID | Thema | Entscheidung | Begründung |
|:---|:---|:---|:---|
| E-88 | EditPetScreen: Pferde-Eingabefelder | Bei species === 'pferd' werden im EditPetScreen zusätzliche Felder angezeigt: Equidenpass-Nr., Haltungsform (Box/Offenstall/Weide/Paddock als ChoiceChips), geschätztes Gewicht (kg, Zahlenfeld), Kolik-Vorgeschichte (Freitext), Stallkontakt (Name/Tel/Box), Hufschmied (Name/Tel). Eigene Sektion "Pferde-Daten" mit visueller Trennlinie. Alle Felder optional. Daten fließen in den Notfallpass (EquinePassBlocks). DB-Felder bereits in Migration 005 angelegt. | Pferde haben spezifische Verwaltungsdaten die für den Notfall entscheidend sind (Kolik-Vorgeschichte, Stallkontakt zum Auffinden, Hufschmied bei Hufproblemen). Equidenpass ist EU-Pflichtdokument (VO 2015/262). Gewicht per Maßband geschätzt ist Standard bei Pferden (keine Waage verfügbar) und wichtig für Medikamenten-Dosierung. |
| E-89 | Kotprobe als eigener Erfassungstyp | Neuer Erfassungstyp im CaptureSheet: "Kotprobe (Pferd)". Eigener Screen (FecalSampleEntryScreen.tsx) mit EpG-Wert (Eier pro Gramm) als Pflichtfeld und optionaler Notiz. record_type = 'Kotprobe' in health_records, epg_value als INTEGER. Nur für Pferde verfügbar (PetPicker filtert auf species === 'pferd'). Anzeige im Verlauf als "Kotprobe: X EpG". Keine medizinischen Warnhinweise oder Schwellenwert-Bewertungen (Doktrin). | Selektive Entwurmung ist bei Pferden Standard: Statt routinemäßiger Wurmkur wird per Kotprobe der Befallsgrad ermittelt. Der EpG-Wert bestimmt ob entwurmt werden muss. Pferdehalter brauchen einen Verlauf dieser Werte für den Tierarzt. DB-Feld epg_value bereits in Migration 005 angelegt. |
| E-90 | Bugfix: Notification-Icon Fragezeichen in Statusleiste | Das Notification-Icon des Notfallpass-Schnellzugriffs (Foreground Service) zeigte ein generisches "?" statt eines simplyPet-Symbols. Ursache: `android.R.drawable.ic_menu_help` wurde als SmallIcon verwendet. Fix: Eigenes VectorDrawable `ic_notification.xml` (weißes Kreuz auf transparentem Grund, 24dp). Das Plugin `withForegroundService.js` generiert das Drawable automatisch bei jedem Prebuild. `EmergencyForegroundService.kt` referenziert jetzt `R.drawable.ic_notification`. | Nutzer-Feedback 15.07.2026: Screenshot zeigt "?" in der Statusleiste oben links. Android verwendet bei ungültigem oder fehlendem SmallIcon ein Fallback-Symbol. Ein eigenes Drawable ist Pflicht für eine professionelle Darstellung. |
| E-91 | Konsistenter APK-Dateiname | APK-Dateiname wird automatisch auf `simplyPet_v{versionName}.apk` gesetzt (z.B. `simplyPet_v0.1.5.apk`). Neues Expo Config Plugin `withApkName.js` + Gradle `applicationVariants`-Block. Schema: camelCase App-Name + Semantic Version mit Punkten. | Nutzer-Feedback 15.07.2026: APK-Dateinamen waren inkonsistent (simplypet_v015, simplyPet_v0.1, simplyPet-0.1). Verwirrend für Tester und Versionsverwaltung. Ein festes Schema verhindert das dauerhaft. |

### E-92: Notification-Icon korrekte Lösung (16.07.2026)
- **Problem:** Notification-SmallIcon in Statusleiste war auf Samsung ein "?", auf ZTE/Tablet ein weißer Blob
- **Ursache:** `R.mipmap.ic_launcher` wird auf Stock-Android als runder Blob gerendert (Adaptive-Icon-Maske). `android.R.drawable.ic_menu_help` war das Fragezeichen.
- **Lösung:** `R.drawable.ic_notification` (dedizierte Monochrome-Pfote ohne Hintergrund) + `setColor(0xFF2E9E83)` für Akzentfarbe
- **Ergebnis:** Samsung OneUI → grüne Pfote, Stock-Android → weiße Pfoten-Silhouette
- **Dokumentation:** TESTGERAETE_MATRIX.md mit allen Geräten, OS-Versionen und Verhalten erstellt

### E-93: Backup-System komplett überarbeiten (17.07.2026)
- **Problem 1:** Anzeige "Noch keine Sicherung erstellt" trotz Export. **Lösung:** `autoBackup()` wird ab sofort bei JEDER Datenänderung getriggert (Tier anlegen/bearbeiten/löschen, Einträge anlegen/bearbeiten/löschen). Nicht nur im shared Form-Hook.
- **Problem 2:** Backup-Anzeige verschwindet nach App-Update (weil `documentDirectory` geleert wird). **Lösung:** Das Datum des letzten Backups wird persistent in `AsyncStorage` gespeichert (Key: `simplypet.last_backup_date`), was App-Updates überlebt.
- **Problem 3:** Lokales Speichern unter "Dateien" auf dem Handy fehlte. **Lösung:** Der Export-Dialog bietet nun ZWEI Optionen: (1) Share-Intent (WhatsApp, Drive etc.) und (2) Lokal speichern via Storage Access Framework (`expo-file-system/StorageAccessFramework`), was den nativen Android "Speichern unter..."-Dialog öffnet.
- **Problem 4:** Import-Button wusste nichts von lokalen Backups. **Lösung:** Import greift auf `DocumentPicker` zurück, der direkt lokale Dateien (auch aus dem SAF-Speicherort) findet und anbietet.

### 20.07.2026

| ID | Thema | Entscheidung | Begründung |
|:---|:---|:---|:---|
| E-94 | Chip-/Transponder-Nummer als Stammdaten-Feld | Für Hund/Katze/Frettchen/Kaninchen/Pferd: 15-stelliger alphanumerischer Transponder-Code als Freitext-Feld in Stammdaten. Zusätzlich: Datum der Implantation (optional) und Implantationsstelle (optional). Bei Pferd bereits als "steht im Equidenpass" gehintet (E-87). Für Katze/Hund: Platzhalter "15-stellig, steht im Impfpass oder EU-Heimtierausweis". | Impfpass-Analyse 20.07.2026: Sektion "Kennzeichnung des Tieres" enthält Transponder-Code + Implantationsdatum + Implantationsstelle. Grundlegendes Identifikationsmerkmal, braucht jeder Tierhalter beim TA-Besuch oder bei Verlust des Tieres. |
| E-95 | Tätowierungsnummer (optional) | Optionales Freitext-Feld "Tätowierungsnummer" in Stammdaten, nur bei Hund/Katze/Kaninchen sichtbar. Zusätzlich: Datum der Tätowierung (optional), Tätowierungsstelle (optional, z.B. "linkes Ohr"). | Impfpass-Analyse 20.07.2026: Ältere Tiere haben oft eine Tätowierung statt Chip. Beide Kennzeichnungen können parallel existieren. Vor allem bei Katzen noch verbreitet. |
| E-96 | Impfungen erweitern: Gültig-ab/bis + Charge + Impfstoff | Impfeinträge bekommen zusätzliche optionale Felder: (1) Impfstoff-Name (Freitext, z.B. "Nobivac T", "Purevax RCP"), (2) Chargen-Nummer (Freitext, z.B. "A502A02"), (3) Gültig ab (Datum), (4) Gültig bis (Datum – ersetzt/ergänzt die bisherige Erinnerungsfunktion). Alle Felder optional, damit schnelle Eingabe weiterhin möglich. "Gültig bis" wird automatisch als Erinnerungsdatum übernommen wenn gesetzt. | Impfpass-Analyse 20.07.2026: Jeder Impfeintrag im Pass hat Hersteller/Name, Chargen-Nr., Impfdatum, Gültig-ab, Gültig-bis. Ohne diese Daten ist die digitale Impfverwaltung unvollständig. Chargen-Nr. ist relevant bei Rückrufen oder Nebenwirkungsmeldungen. |
| E-97 | Dokumentenscan (Phasenweise) | **Phase 1 (v0.1.7):** Nutzer fotografiert Dokument (Kamera oder Galerie) → App fragt "Welchem Tier zuordnen?" → Foto wird in der Tierakte unter "Dokumente" gespeichert und angezeigt. Einfacher Flow ohne OCR. **Phase 2 (später):** On-Device-OCR (Google ML Kit) erkennt Impfpass-Daten automatisch und füllt Felder vor (Impfstoff, Charge, Datum). Handschrift-Erkennung als optionale Cloud-Erweiterung. | Sprachmemo 20.07.2026: "Dokumentenscan muss noch eingefügt werden. Wenn das Dokument eingescannt ist, ist zu fragen, welchem Tier das Dokument zugeordnet werden soll." Phase 1 deckt den Kern-Wunsch ab (Scan + Zuordnung). OCR ist Komfort-Upgrade für später – spart Credits und Komplexität. |
| E-98 | Alphabetische + Gruppen-Sortierung der Tiere | HomeScreen-Tierliste wird sortierbar: (1) Standard: alphabetisch nach Name. (2) Optional: Gruppierung nach Tierart (alle Katzen zusammen, alle Hunde zusammen etc.). Umschaltbar über kleines Icon oben rechts (A-Z / Gruppen-Symbol). Innerhalb einer Gruppe ebenfalls alphabetisch. | Sprachmemo 20.07.2026: "Tiere sollten alphabetisch und nach Gruppen sortiert werden in der Hauptansicht." Bei mehreren Tieren wird die Liste sonst unübersichtlich. |
| E-99 | Untersuchungsergebnisse als Erfassungstyp | Neuer Erfassungstyp im CaptureSheet: "Untersuchungsergebnis". Felder: Art der Untersuchung (Freitext, z.B. "Blutbild", "Ultraschall", "Röntgen"), Ergebnis/Befund (Freitext, multiline), Datum, optional: Foto/Scan des Befunds anhängen. Für alle Tierarten verfügbar. | Impfpass-Analyse 20.07.2026: Sektion "Ergebnisse weiterführender Untersuchungen" im Impfpass. Tierhalter brauchen einen Ort für Laborergebnisse, Röntgenbefunde etc. Aktuell nur als "Beobachtung" erfassbar – zu unspezifisch. |
| E-100 | EU-Heimtierausweis-Nummer (optional) | Optionales Freitext-Feld "EU-Heimtierausweis-Nr." in Stammdaten, nur bei Hund/Katze/Frettchen sichtbar (nur diese 3 Tierarten bekommen einen EU-Pass). Platzhalter: "Nummer steht auf dem blauen EU-Pass". Hinweis im Feld: "Für Reisen ins Ausland benötigt." | Impfpass-Analyse 20.07.2026: Reisehinweis-Seite im Impfpass verweist auf den blauen EU-Heimtierausweis. Nummer ist wichtig für Grenzkontrollen und Tierarzt-Besuche im Ausland. |

### 25.07.2026

| ID | Thema | Entscheidung | Begründung |
|:---|:---|:---|:---|
| BUG-3 | Tägliche Checkbox resettet nicht um 00:00 Uhr | Tägliche Erinnerungen (z.B. "Ohren eincremen") müssen um 00:00 Uhr automatisch auf "unerledigt" zurückgesetzt werden. Aktuell bleibt die Checkbox dauerhaft markiert. Fix: Beim App-Start und/oder per Scheduler prüfen ob das Erledigungsdatum < heute ist → wenn ja, Reset auf unchecked. | Tester-Feedback 25.07.2026: Checkbox für "Ohren eincremen" wurde gestern markiert, ist heute immer noch markiert. Tägliche Aufgaben verlieren ihren Sinn wenn sie nicht resetten. |
| BUG-4 | Verlauf/Tierakte zeigt tägliche Routine-Erledigungen | Wenn eine tägliche Erinnerung als "erledigt" markiert wird, soll dies NICHT als "Medikament gegeben" in der Tierakte/Verlauf erscheinen. Der Verlauf soll nur essentielle Informationsänderungen zeigen: Gewichtsänderungen, Impfungen, TA-Besuche, Diagnosen, Untersuchungsergebnisse, Medikamentenänderungen. Tägliche Routine-Erledigungen ergeben sich aus der hinterlegten Erinnerung und müssen nicht permanent dokumentiert werden. | Tester-Feedback 25.07.2026: Tierakte zeigt 3x "Medikament gegeben – Ohren eincremen (Sonnenschutz)" am selben Tag. Macht den Verlauf unbrauchbar und unübersichtlich. Essentielle Infos gehen unter. |
| E-101 | Farben pro Tiergruppe statt pro Tier | Die farbliche Kennzeichnung der Tier-Kacheln wird von individuell-pro-Tier auf pro-Tiergruppe umgestellt. Farbzuordnung: Hunde = Teal (#008080), Katzen = Orange (#E67E22), Reptilien/Terrarium = Grün (#27AE60), Fische/Aquarium = Gold (#D4AC0D), Pferde = Braun (#8B4513), Vögel = Blau (#2980B9), Kaninchen/Nager = Lila (#8E44AD). | Tester-Feedback 25.07.2026: "Jedes Tier mit eigener Farbe zu versehen finde ich extrem verwirrend. Sinnvoller wäre, die Farben nur für die verschiedenen Gruppen." Farben sollen auf einen Blick die Tierart signalisieren, nicht das Individuum. |
| E-102 | Gruppen-Icons im Header (nicht als Einzel-Avatar) | Gruppen-spezifische Tier-Icons werden im **Gruppen-Header** angezeigt (neben dem Gruppennamen): Hund-Icon neben "Hunde", Katze-Icon neben "Katzen", Fisch-Icon neben "Aquarium", Salamander neben "Reptilien" etc. Als **individueller Avatar** bei den einzelnen Tieren bleiben die Großbuchstaben (oder eigenes Foto) bestehen. Icons als SVG/Vektor, weiß auf der jeweiligen Gruppenfarbe. | Nutzer-Entscheidung 25.07.2026: "Die Icons neben den Gruppen sollen aber schon noch dort bleiben." Buchstaben als Einzel-Avatar reichen da Gruppierung die Tierart bereits zeigt. |
| E-103 | HomeScreen-Layout: **Variante C – Gruppen-Accordion** | Einstimmige Entscheidung für Variante C: Tiere werden nach Tiergruppe gruppiert mit einklappbaren Headern (Hunde, Katzen, Reptilien, Aquarium etc.). Jeder Gruppen-Header hat die Gruppenfarbe (E-101) und ein Chevron zum Ein-/Ausklappen. Innerhalb der Gruppe: kompakte Zeilen mit Buchstaben-Avatar + Name + Rasse. Gruppen alphabetisch sortiert, Tiere innerhalb der Gruppe ebenfalls alphabetisch. | Einstimmiges Feedback 25.07.2026: Variante C gewählt. Gruppierung macht Tierart sofort erkennbar, Buchstaben als Avatar reichen aus (E-102 entfällt dadurch). Skaliert gut bei 10+ Tieren durch Einklappen. |
| BUG-5 | QR-Code enthält nicht alle Notfall-Pass-Daten | Der QR-Code-Text muss ALLE Sektionen des Notfall-Passes enthalten, die auch in der App angezeigt werden. Aktuell fehlen: Geschlecht, Kastration, Fellfarbe/Zeichnung, Impfstatus (alle Impfungen mit Datum + Gültigkeit), Letzte bekannte Werte (Gewicht). Vorhanden sind bereits: Tier/Rasse, Geburtsdatum, Merkmale, Allergien, Medikation, Vorerkrankungen, Parasitenschutz, Halter-Kontakt. Fix: Die QR-Text-Generierungsfunktion muss um die fehlenden DB-Abfragen erweitert werden. Architektur (live generieren bei Knopfdruck) ist korrekt und bleibt. | Nutzer-Meldung 25.07.2026: QR-Code-Scan zeigt weniger Daten als der Notfall-Pass in der App. Ein Tierarzt der den QR-Code scannt bekommt unvollständige Informationen – insbesondere Impfstatus und Gewicht fehlen, die im Notfall kritisch sind. |
| E-104 | PDF-Dateiname beim Notfallpass-Export | Der Notfallpass-PDF-Export bekommt einen sprechenden Dateinamen statt einer UUID. Schema: `Notfallpass_{Tiername}_{DD-MM-YYYY}.pdf` (z.B. `Notfallpass_Hanna_25-07-2026.pdf`). Sonderzeichen im Tiernamen werden durch Unterstriche ersetzt. | Nutzer-Feedback 25.07.2026: Aktuell heißt die PDF `580b6237-3d5e...76ca63c7e7.pdf` – nicht als Notfallpass erkennbar. Empfänger (Tierarzt, Tiersitter) sollen sofort sehen was die Datei ist. |

### 26.07.2026

| ID | Thema | Entscheidung | Begründung |
|:---|:---|:---|:---|
| BUG-5 FIX | QR-Code um fehlende Felder erweitert | `buildQrPayload()` in `passData.ts` erweitert um: Geschlecht (`d.pet.gender`), Kastration (`d.pet.castration_status`), Fellfarbe (`d.pet.coat_color`), Impfstatus (alle Impfungen mit Datum), Gewicht (letzter Wert mit Datum). Konsistenz-Check bestanden: QR-Code enthält jetzt alle Felder die auch in der UI und im PDF angezeigt werden. | Fix für BUG-5 (25.07.2026). Code-Review bestätigt: QR-Felder sind jetzt Superset der PDF-Felder. |
| E-104 FIX | PDF-Dateiname sprechend | `EmergencyPassScreen.tsx`: Nach `Print.printToFileAsync()` wird die Datei via `FileSystem.moveAsync()` umbenannt zu `Notfallpass_{safeName}_{DD-MM-YYYY}.pdf`. Sonderzeichen im Tiernamen werden durch Unterstriche ersetzt. Gilt für ALLE Tiere, nicht nur Katzen. | Fix für E-104 (25.07.2026). Tierärzte und Tiersitter erkennen sofort was die Datei ist. |
| E-105 | Sitter-Modus (pro Tier) | **Platzierung:** Button "Sitter-Modus" auf dem Tier-Profil (nicht im Hauptmenü). **Funktionen:** (1) Sitter anlegen: Name, Telefon, Gültigkeitszeitraum (von–bis). (2) Info-Paket: Fütterung, Medikamente, Eigenheiten, Tierarzt-Kontakt, Notfall-Pass – ankreuzbar was der Sitter sehen soll. (3) Tierarzt-Vollmacht als PDF: Name+Adresse+Telefon Halter, Name Sitter, Tier, Zeitraum, Berechtigung (Behandlung + Kostenübernahme durch Halter), Finger-Unterschrift des Halters (einmalig in App hinterlegt), QR-Code mit Klartext-Daten (KEINE Bankdaten). Dateiname: `Vollmacht_{Tiername}_{Datum}.pdf`. (4) Teilen: Info-Paket + Vollmacht per WhatsApp/E-Mail an Sitter. **Keine Bankdaten:** Tierarzt schickt Rechnung an Halter-Adresse (wie bei normalem Besuch). **Spezifikation:** Die tierarten-spezifischen Informationsfelder (Hunde, Katzen, Reptilien, Fische, Vögel, Pferde, Nager) sind in `SITTER_MODUS_SPEZIFIKATION.md` detailliert dokumentiert. | Nutzer-Anforderung 26.07.2026: Sitter braucht alle relevanten Infos + Vollmacht für den Tierarzt. Pro Tier sinnvoller als global, weil Infos/Medikamente/Vollmacht tierbezogen sind. Bankdaten bewusst ausgelassen – Sicherheitsrisiko auf Papier/PDF, und Tierärzte rechnen ohnehin per Post ab. |
| E-106 | App-Kategorie im Play Store | **Lifestyle** als Kategorie im Google Play Store. Nicht "Gesundheit & Fitness" (strengere Google-Prüfung wegen Gesundheitsdaten-Richtlinien für Menschen), nicht "Medizin" (zusätzliche Nachweise nötig), nicht "Produktivität" (klingt nach Büro-App). | Nutzer-Entscheidung 26.07.2026: Die meisten erfolgreichen Haustier-Apps (PetNote, 11pets, Pet Care) sind unter Lifestyle gelistet. Etablierte Kategorie für Tier-Apps im Play Store. |
| E-107 | Play Store statt APK für Tester | Geschlossener Test über Google Play Store statt APK-Verteilung per WhatsApp/E-Mail. Mindestens 12 Tester (seit Dez 2024 reduziert von 20), 14 Tage Testphase. | Nutzer-Entscheidung 26.07.2026: APK-Verteilung an 3 Tester brachte null Rückmeldung. Installationshürde ("unbekannte Quelle"), kein Auto-Update, kein Feedback-Kanal, kein Vertrauen. Play Store löst alle Probleme. |

### 28.07.2026

| ID | Thema | Entscheidung | Begründung |
|:---|:---|:---|:---|
| AUDIT-1 | Store-Listing vs. Code Audit | **3 Blocker identifiziert:** (1) Push-Notifications beworben aber nicht implementiert, (2) Sitter-Modus beworben aber nicht implementiert, (3) "verschlüsselte Backup-Datei" beworben aber Backup ist unverschlüsseltes JSON. **Entscheidung: Option C** – Push-Notifications implementieren (Kern-Feature), Store-Listing für Sitter-Modus und Verschlüsselung korrigieren. Sitter-Modus und Verschlüsselung kommen als Post-Release Updates. | Audit 28.07.2026: Systematischer Abgleich jedes Store-Listing-Bullets gegen den tatsächlichen Code. Google lehnt Apps ab die nicht-existierende Features bewerben. Push-Notifications sind für eine Termin-App unverzichtbar. Sitter-Modus und Verschlüsselung sind nice-to-have und können als Update nachgeliefert werden. |
| AUDIT-2 | Store-Listing bleibt unverändert | **Alle 3 Features werden implementiert.** Store-Listing wird NICHT angepasst – es beschreibt den geplanten Funktionsumfang der v1.0.0. Sitter-Modus, Push-Notifications und verschlüsselte Backups müssen VOR dem Release fertig sein. | Marks Entscheidung 28.07.2026: "Da wird nix geändert im Store-Listing, so wirds kommen. Das war geplant seit Wochen." |
| AUDIT-3 | Paketname-Problem | Alte App (`com.simplydevapps.simplypet`) in Play Console stehen lassen (kann nicht gelöscht werden). **Neue App mit korrektem Paketnamen `de.simplypet.app` anlegen.** Alle Formulare erneut ausfüllen (Mark kennt den Prozess). | AAB wurde abgelehnt wegen Paketname-Mismatch. Play Console erlaubt kein Löschen von kostenpflichtigen Apps die nie veröffentlicht wurden. |

### E-108: Push-Notifications implementiert (28.07.2026)
- **Entscheidung:** Lokale Notifications via expo-notifications für alle Termine/Erinnerungen
- **Umsetzung:**
  - Neuer Service: `src/services/notificationService.ts` (Scheduling, Stornierung, Channel)
  - DB-Migration 008: `reminder_active`, `notification_id`, `reminder_offset_days` in reminders
  - AppointmentsScreen: Prototyp-Banner entfernt, Toggle pro Erinnerung
  - VaccinationEntryScreen + MedicationEntryScreen: Notification wird beim Anlegen geplant
  - App.tsx: Channel-Init + Notification-Tap → Termine-Tab
  - navigationRef.ts: `navigateToAppointments()` hinzugefügt
- **TypeScript:** 0 Fehler
- **Grund:** Store-Listing bewirbt "Erinnerungen & Termine" – muss funktionieren vor Release

### E-105-IMPL (28.07.2026)
**Kontext:** Sitter-Modus Implementierung
**Entscheidung:** Sitter-Infos als Freitextfelder in den Stammdaten (pets-Tabelle) gespeichert, nicht erst im Sitter-Modus eingegeben. Begründung: Nutzer füllt einmal aus, hat es immer parat. Sitter-Modus zieht Daten nur noch raus und generiert PDF.
**Umsetzung:**
- Migration 009: 6 neue Spalten (sitter_feeding, sitter_routine, sitter_behavior, sitter_equipment, sitter_climate, sitter_notes)
- EditPetScreen: Neue Sektion "Sitter-Infos" mit artspezifischen Labels
- SitterScreen: Sitter-Daten (Name, Telefon, Zeitraum) + PDF-Generierung + Teilen
- Vollmacht: HTML→PDF mit Unterschrift (react-native-signature-canvas, AsyncStorage)
- Info-Paket: HTML→PDF mit allen Tierdaten + Checkliste
- Navigation: PetFileScreen Button → SitterModus Route
- Neue Dependencies: react-native-signature-canvas, react-native-webview

### E-109-IMPL (28.07.2026)
**Kontext:** Backup-Verschlüsselung implementiert
**Entscheidung:** AES-256-GCM via expo-crypto (native Implementierung). Key-Derivation über iteratives SHA-512 (10.000 Runden) statt PBKDF2 (expo-crypto hat kein natives PBKDF2). Salt: 16 Bytes zufällig. Format: JSON-Envelope mit {encrypted: true, salt, data}. Auto-Detect beim Import: isEncryptedBackup() prüft ob Envelope-Format vorliegt. Abwärtskompatibel: Alte unverschlüsselte Backups werden weiterhin direkt importiert.
**Umsetzung:**
- cryptoService.ts (NEU): encryptBackup, decryptBackup, isEncryptedBackup
- backupService.ts: exportBackup erweitert (Passwort 2x abfragen → verschlüsseln), importBackup erweitert (Auto-Detect → Passwort abfragen → entschlüsseln)
- MoreScreen.tsx: Passwort-Modal (da Alert.prompt nur iOS), addPasswordListener Pattern
- Dependency: expo-crypto (bereits im Expo SDK enthalten)

### BUGFIX-SESSION-2 (28.07.2026)

**Kontext:** Zweite Runde Gerätetest-Bugfixes nach User-Feedback

| Bug | Ursache | Fix | Datei(en) |
|:---|:---|:---|:---|
| Bearbeiten-Buttons in "Tiere verwalten" tun nichts | ManagePetsScreen liegt im MoreStack, navigiert aber zu `StammdatenBearbeiten` das nur im HomeStack registriert war | `StammdatenBearbeiten` + `TierAnlegen` auch im MoreStack registriert, ManagePetsScreen Navigation-Typ auf `MoreStackParamList` geändert | AppNavigator.tsx, ManagePetsScreen.tsx |
| Unterschrift-Zeichenfeld: Löschen/Übernehmen-Buttons nicht sichtbar | `overflow: hidden` auf dem sigPad-Container schnitt den WebView-Footer (mit den Buttons) ab | `overflow: hidden` entfernt, Footer-Buttons via webStyle größer und deutlicher gestylt (min-height 56px, font-size 17px) | SitterScreen.tsx |
| Über-Dialog zeigt "(Prototyp)" | Alter Text aus der Entwicklungsphase | "(Prototyp)" entfernt – App ist v1.0.0 Store-Release | MoreScreen.tsx |
| Über-Dialog: "Tiergesundheits-App" | User-Entscheidung: App soll als "Pocket-Tool" positioniert werden | Geändert zu "unabhängige Pocket-Tool-App für dein Tier" | MoreScreen.tsx |

**Entscheidung E-116:** App-Selbstbezeichnung ist "Pocket-Tool-App für dein Tier" (nicht "Tiergesundheits-App"). Store-Listing bleibt unverändert (dort steht "Tier-Gesundheits-App" im Kontext der Features), aber die App selbst nennt sich neutraler.

**Archiv-Verhalten (Klarstellung):** Das Archiv ist kein separater Menüpunkt. Archivierte Tiere erscheinen als eigene Sektion am Ende der "Tiere verwalten"-Seite mit "Zurückholen"-Button. Die Sektion ist nur sichtbar wenn mindestens ein Tier archiviert ist. Bewusste Entscheidung: Kein endgültiges Löschen möglich (Doktrin gegen versehentlichen Datenverlust).

### BUGFIX-SESSION-3 (28.07.2026)

**Kontext:** Dritte Runde Gerätetest-Bugfixes – Unterschrift-Buttons + Tab-Navigation

| Bug | Ursache | Fix | Datei(en) |
|:---|:---|:---|:---|
| Unterschrift-Buttons (Löschen/Übernehmen) immer noch nicht sichtbar | WebView-Footer wird vom Container abgeschnitten – `overflow: hidden` entfernen reichte nicht, da der WebView den Footer intern nicht rendert wenn der Container zu klein ist | WebView-Footer komplett ausgeblendet (`display: none`). Stattdessen 3 native `<Pressable>`-Buttons untereinander im gleichen Stil wie "Abbrechen": Übernehmen (grün), Löschen (schwarz), Abbrechen (rot) | SitterScreen.tsx |
| Tab-Navigation: Unter-Screens bleiben hängen | Notfall-Tab navigiert zu `Notfallpass` im HomeStack. Beim Zurückwechseln auf Zuhause-Tab bleibt der HomeStack auf dem Notfallpass stehen (React Navigation setzt Stacks nicht automatisch zurück bei Tab-Wechsel) | Alle 3 Tabs mit eigenem Stack (Zuhause, Termine, Mehr) bekommen `tabPress`-Listener der den Stack auf die jeweilige Main-Seite zurücksetzt | AppNavigator.tsx |

**Entscheidung E-117:** Tab-Press setzt immer auf die Hauptseite des jeweiligen Tabs zurück. Kein "Merken" des letzten Unter-Screens. Begründung: Nutzer erwartet bei Tab-Klick immer die Startseite des Bereichs, nicht einen zufällig noch offenen Unter-Screen.

**Entscheidung E-118:** Unterschrift-Buttons werden NICHT als WebView-interne HTML-Buttons gerendert, sondern als native React-Native `<Pressable>`. Begründung: WebView-Footer ist unzuverlässig (Größe, Rendering, Touch-Targets variieren je nach Gerät). Native Buttons funktionieren garantiert.

### BUGFIX-SESSION-4 (29.07.2026)

**Kontext:** Play Console Store-Release Blocker + Notification-Tap Bug

| Bug | Ursache | Fix | Datei(en) |
|:---|:---|:---|:---|
| Play Console: "Berechtigungen für Dienste im Vordergrund" blockiert Release | `FOREGROUND_SERVICE_SPECIAL_USE` erfordert Video-Nachweis den Google prüft. Video-Aufnahme auf dem Gerät nicht möglich (Screenrecorder stoppt bei Power-Taste, Timeout wird durch Recorder verhindert) | Berechtigung entfernt. Normaler `FOREGROUND_SERVICE` bleibt (braucht kein Video). Lockscreen-Feature wird für v1.1.0 mit Video nachgereicht | app.json |
| Notification-Tap öffnet Hauptseite statt Notfallpass | LockScreenActivity startete MainActivity mit Intent-Extra `show_emergency_pass=true`, aber nirgends im React-Native-Code wurde dieses Extra ausgelesen | LockScreenActivity setzt jetzt Action `de.simplypet.app.OPEN_EMERGENCY` (wie App-Shortcut). Wird von bestehendem `intentHandler.ts` über `Linking.getInitialURL()` erkannt | withShowOnLockScreen.js |
| versionCode 7 bereits in Console | Alte AAB (vor Bugfixes) war mit versionCode 7 hochgeladen worden | versionCode auf 9 erhöht (8 war Zwischenschritt der nie hochgeladen wurde) | app.json |

**Entscheidung E-119:** `FOREGROUND_SERVICE_SPECIAL_USE` wird für v1.0.0 entfernt. Der Lockscreen-Notfallpass funktioniert trotzdem (über normale Notification + LockScreenActivity mit `showWhenLocked`). Für v1.1.0 wird das Video erstellt und die Berechtigung wieder hinzugefügt, falls Google den Vordergrunddienst ohne SPECIAL_USE ablehnt.

**Entscheidung E-120:** Paketname bleibt `de.simplypet.app`. Die alte App (`com.simplydevapps.simplypet`) in der Play Console wird nicht mehr verwendet. User muss darauf achten, in der richtigen App zu arbeiten.

### BUGFIX-SESSION-5 (29.07.2026)
**Kontext:** ANR-Fix (Foreground Service Typ) + Notification-Navigation-Bug

| Bug | Ursache | Fix | Datei(en) |
|:---|:---|:---|:---|
| ANR (App Not Responding) nach 3 Minuten | `foregroundServiceType` wurde in E-119 von `specialUse` auf `shortService` geändert. `shortService` hat ein 3-Minuten-Timeout – danach killt Android den Service und löst ANR aus | Zurück auf `specialUse`. `FOREGROUND_SERVICE_SPECIAL_USE` Permission wieder eingefügt. Video-Nachweis wurde auf YouTube (unlisted) hochgeladen | withForegroundService.js, app.json |
| Notification-Tap öffnet Hauptseite statt Notfallpass | Beim Tippen auf die Notification wird die App in den Vordergrund gebracht. Dabei feuert der `tabPress`-Listener auf dem Zuhause-Tab und setzt den Stack auf `HomeMain` zurück – BEVOR die `navigateToEmergencyPass()`-Navigation durchkommt | Navigation-Lock-Mechanismus: `navigateToEmergencyPass()` setzt einen 600ms-Lock. Alle `tabPress`-Listener prüfen `isNavigationLocked()` und überspringen den Reset wenn aktiv. Zusätzlich navigiert die Funktion mit 150ms Delay um sicher NACH dem Tab-Wechsel zu landen | navigationRef.ts, AppNavigator.tsx |

**Entscheidung E-119 REVIDIERT:** `FOREGROUND_SERVICE_SPECIAL_USE` wird NICHT entfernt. Video-Nachweis wurde erfolgreich auf YouTube als "unlisted" hochgeladen. Der Link wird in der Play Console im Formular "Vordergrunddienst" eingetragen. `foregroundServiceType` ist wieder `specialUse`.

**Entscheidung E-121:** Navigation-Lock-Pattern für externe Navigation. Wenn eine Notification oder ein Intent die App öffnet und zu einem bestimmten Screen navigieren will, wird ein temporärer Lock (600ms) gesetzt. Alle `tabPress`-Listener prüfen diesen Lock und überspringen ihren Stack-Reset. Verhindert Race-Condition zwischen Tab-Aktivierung und externer Navigation.

**versionCode:** 11 (erhöht von 10)

### BUGFIX-SESSION-6 (29.07.2026)
**Kontext:** PDF-Crash + Medikation/Vorerkrankungen-Darstellung verbessern

| Bug | Ursache | Fix | Datei(en) |
|:---|:---|:---|:---|
| PDF konnte nicht erstellt werden (Notfallpass) | `new File(uri).base64()` – die `File`-Klasse in expo-file-system SDK 57 hat KEINE `base64()`-Methode. Die Legacy-API (`readAsStringAsync`) wirft zur Laufzeit einen Fehler | Import auf `expo-file-system/legacy` umgestellt. `FileSystem.readAsStringAsync()` statt `File.base64()` verwendet | EmergencyPassScreen.tsx |
| PDF konnte nicht erstellt werden (Sitter-Vollmacht) | Gleiche Ursache: `FileSystem.readAsStringAsync()` und `FileSystem.moveAsync()` aus dem Hauptexport von expo-file-system werfen in SDK 57 zur Laufzeit | Import auf `expo-file-system/legacy` umgestellt | SitterScreen.tsx |
| Medikation im Notfallpass zeigt keinen Hinweistext | `hint_text` wurde in der DB-Query nicht geladen und im Interface nicht definiert. Sitter/Notarzt sieht nur Name + Dosierung, aber nicht WARUM das Medikament gegeben wird | `PassMedication` Interface um `hint_text` erweitert. DB-Query lädt `hint_text`. Darstellung in App, PDF, QR-Code zeigt hint_text | passData.ts, EmergencyPassScreen.tsx, EquinePassBlocks.tsx |
| Vorerkrankungen ohne Datum | `PassCondition` hatte nur `name`. Ein Sitter/Notarzt kann nicht einschätzen ob eine OP 2 Monate oder 4 Jahre her ist | `PassCondition` Interface um `active_since` erweitert. Vorerkrankungen aus medications-Tabelle bekommen ihr `active_since` mit. Darstellung überall mit Datum | passData.ts, EmergencyPassScreen.tsx, EquinePassBlocks.tsx |

**Entscheidung E-122:** Medizinische Informationen im Notfallpass und Sitter-PDF müssen immer den vollständigen Kontext liefern: Name + Dosierung + Hinweis (warum) + seit-wann. Ein Sitter oder Notfall-Tierarzt muss ohne Rückfrage alle relevanten Infos sehen können.

**versionCode:** bleibt 11 (noch kein neuer Build nötig – Fixes werden mit nächstem Build ausgeliefert)

### E-110 – "In Erinnerung"-Modus (30.07.2026)
**Kontext:** Wenn ein Tier stirbt, muss die Akte erhalten bleiben (emotionale Bindung). Feature geplant für v1.1.0.

**Entscheidungen:**

| Aspekt | Entscheidung |
|:---|:---|
| Bezeichnung | "In Erinnerung" |
| Icon | Wolke mit Kreuz |
| Platzierung | Unter "Tiere verwalten" (ManagePetsScreen), eigene Sektion |
| Hinweis | In "Tiere verwalten" soll ein Hinweis auf den Bereich sichtbar sein |
| Ton/Stil | Sachlich, respektvoll, kein Kitsch |
| Akte | Bleibt vollständig einsehbar (read-only) |
| Notifications | Sofort stoppen beim Markieren als verstorben |
| Sitter-Modus | Tier taucht nicht mehr auf |
| Notfallpass | Tier taucht nicht mehr auf |
| Endgültiges Löschen | Möglich (mit Warnung) |
| Eingabe beim Markieren | Datum + optionale Notiz |

**Zeitplan:** v1.1.0 (nach Store-Release und 14-Tage-Testphase)

### BUGFIX-SESSION-7 (30.07.2026)
**Kontext:** Nur 1 von N täglichen Medikamenten-Erinnerungen zeigt eine Notification

| Bug | Ursache | Fix | Datei(en) |
|:---|:---|:---|:---|
| Nur 1 Notification statt N bei mehreren täglichen Erinnerungen | Notification wird nur einmalig beim Erstellen geplant. Nach dem Feuern ist sie weg. Nur Abhaken plant die nächste. Nicht-abgehakte Erinnerungen verlieren ihre Notification dauerhaft. | Beim `reload()` im AppointmentsScreen werden ALLE aktiven täglichen Erinnerungen auf morgen 09:00 neu gescheduled. Gleiche ID → kein Duplikat, nur Sicherstellung. | AppointmentsScreen.tsx |

**Entscheidung E-123:** Tägliche Erinnerungen müssen bei jedem App-Start ihre Notification erneuern. Das Scheduling ist idempotent (gleiche ID überschreibt vorherige Planung).

### E-114 – Notification-Uhrzeit wählbar + DailyTrigger (30.07.2026)
**Kontext:** E-123 (Reschedule) war ein Workaround. Die saubere Lösung ist `DailyTriggerInput` – feuert automatisch jeden Tag zur gewählten Uhrzeit, ohne dass die App laufen muss.

**Änderungen:**

| Bereich | Vorher | Nachher |
|:---|:---|:---|
| Trigger-Typ (tägliche) | Einmaliger Date-Trigger auf morgen 09:00 | `DailyTriggerInput` (persistent, feuert jeden Tag) |
| Uhrzeit | Fest 09:00 (hardcoded) | Wählbar beim Erstellen (Standard 09:00) |
| DB-Schema | Keine Uhrzeit-Spalten | `reminder_hour` + `reminder_minute` (Migration 010) |
| Reschedule bei App-Start | Manuell alle auf morgen 09:00 planen | DailyTrigger sicherstellen (idempotent) |
| Impfungen | Einmaliger Date-Trigger | Bleibt einmaliger Date-Trigger (kein täglicher Bedarf) |
| Toggle AN | Date-Trigger auf morgen | DailyTrigger mit gespeicherter Uhrzeit |
| Toggle AUS | Cancel | Cancel (unverändert) |
| Abhaken täglicher Erinnerung | Reschedule auf morgen 09:00 | Nicht nötig (DailyTrigger ist persistent) |

**Betroffene Dateien:**
- `notificationService.ts` – neue `scheduleDailyNotification()` Funktion
- `database.ts` – Migration 010 (reminder_hour, reminder_minute)
- `MedicationEntryScreen.tsx` – Uhrzeit-Picker UI + DailyTrigger beim Speichern
- `AppointmentsScreen.tsx` – Reschedule, Toggle, Undo nutzen DailyTrigger
- `VaccinationEntryScreen.tsx` – bleibt bei einmaligem Date-Trigger

**versionCode:** 12 (bereits gesetzt, noch kein neuer Build)

### E-124 – App-Hintergrund: Grüner Gradient + Blasen (30.07.2026)

**Kontext:** User wünscht sich das simplyPet-Grün als App-Hintergrund auf ALLEN Screens. Bisher war der Hintergrund ein warmes Beige (#F7F5F0). Das simplyPet-Banner im Repo ist das DevApps-Account-Banner (Retro-Monitore), nicht das simplyPet-Branding.

**Entscheidung E-124:** App-Hintergrund wird programmatisch generiert (Python/PIL) als vertikaler Gradient mit semi-transparenten Blasen. Das Bild wird als PNG in `app/assets/app-background.png` gespeichert und über eine `ScreenBackground`-Komponente auf allen Screens als fixierter Hintergrund angezeigt.

**Design-Spezifikation:**
- Gradient: oben #1F7A64 (primaryDark) → unten #5ECFB0 (helles Mint)
- Richtung: vertikal (top-to-bottom)
- Blasen: Semi-transparente Kreise (weiß, hellgrün, dunkelgrün) mit Alpha 8-35
- Hintergrund ist FIXIERT (scrollt nicht mit dem Content)
- Weiße Content-Cards/Bubbles behalten ihre weiße Hintergrundfarbe

**Technische Umsetzung:**
- `create_bg.py` – Python-Script generiert 1080x2340 PNG
- `ScreenBackground.tsx` – Wiederverwendbare Komponente mit `ImageBackground` + `StyleSheet.absoluteFill`
- Alle 18 Screens gewrapped (ScrollView, KeyboardAvoidingView, statische Views)
- Container-Styles: `backgroundColor` von `colors.background` auf `'transparent'` geändert
- `colors.background` in `theme.ts` bleibt als Fallback erhalten (#F7F5F0)

**Betroffene Dateien:**
- `app/assets/app-background.png` – generiertes Hintergrundbild
- `app/src/components/ScreenBackground.tsx` – neue Komponente
- Alle 18 Screen-Dateien (Import + Wrapping + backgroundColor transparent)
- `create_bg.py` – Generierungs-Script (reproduzierbar)

## E-125: Fix Backup-Entschlüsselung (Android-Bug expo-crypto #47274)
- **Datum:** 30.07.2026
- **Problem:** "Entschlüsselung fehlgeschlagen" beim Import eines verschlüsselten Backups – auch mit korrektem Passwort.
- **Ursache:** Bekannter Bug in expo-crypto (GitHub Issue #47274): `AESSealedData.fromCombined()` akzeptiert auf Android nativ nur `ByteArray`, nicht Base64-String. Die TypeScript-Schicht übergibt aber einen String.
- **Fix:** Base64-String vor `fromCombined()` manuell in `Uint8Array` konvertieren (`base64ToUint8(envelope.data)`).
- **Datei:** `src/backup/cryptoService.ts`, Zeile 125
- **Status:** Implementiert, TypeScript 0 Fehler. Braucht neuen Build zum Testen.

## E-126: Fix Backup-Import – fromCombined komplett umgangen (31.07.2026)
- **Datum:** 31.07.2026
- **Problem:** E-125 (base64ToUint8 vor fromCombined) war nicht ausreichend. Der Bug in expo-crypto 57.0.1 (Issue #47274) liegt tiefer: Die native Kotlin-Bridge übergibt das ByteArray nicht korrekt an die native `fromCombined()`-Funktion, unabhängig davon ob Base64 oder Uint8Array übergeben wird.
- **Analyse:** Backup-Export funktioniert einwandfrei (verifiziert durch lokale Entschlüsselung mit Python-Script). Alle Daten (1 Tier, 1 Impfung, 1 Medikament, 1 Gesundheitseintrag, 1 Erinnerung) sind vollständig im Backup enthalten.
- **Fix:** `fromCombined()` komplett umgangen. Stattdessen Combined-Bytes manuell in die drei AES-256-GCM-Komponenten aufgeteilt:
  - IV: Bytes 0-11 (12 Bytes)
  - Ciphertext: Bytes 12 bis (Ende-16)
  - AuthTag: Letzte 16 Bytes
  - Dann `AESSealedData.fromParts(iv, ciphertext, tag)` aufgerufen – diese native Funktion funktioniert nachweislich korrekt.
- **Datei:** `src/backup/cryptoService.ts`, Zeilen 122-131
- **versionCode:** 15 (hochgesetzt von 14)
- **Status:** Implementiert, TypeScript 0 Fehler. APK-Build wird automatisch bei Push getriggert. AAB muss manuell in GitHub Actions getriggert werden.

## E-127: UX-Fix Passwort-Modal – Tastatur verdeckt Buttons (31.07.2026)
- **Datum:** 31.07.2026
- **Problem:** Beim Passwort-Bestätigungs-Dialog (Backup-Export/Import) war der "OK"-Button hinter der Tastatur versteckt. User musste erst die Tastatur ausblenden, um das Passwort zu überprüfen (Auge-Icon) oder zu bestätigen.
- **Fix:** `pwOverlay` (View) durch `KeyboardAvoidingView` ersetzt (behavior: 'height' auf Android). Das gesamte Modal rutscht jetzt bei geöffneter Tastatur nach oben – Eingabefeld, Auge-Icon und Buttons bleiben sichtbar.
- **Datei:** `src/screens/MoreScreen.tsx` (Zeilen 344-391)
- **Status:** Implementiert, committed, gepusht. TypeScript 0 Fehler.

## E-128: Lesbarkeits-Fix – Texte auf grünem Hintergrund (01.08.2026)
- **Datum:** 01.08.2026
- **Problem:** Mehrere Texte die direkt auf dem grünen App-Hintergrund (app-background.png) liegen, waren schlecht lesbar. WCAG-Kontrastanalyse ergab: textSecondary (#6B6B6B) = 1.82:1 (FAIL), primary (#2E9E83) = 1.13:1 (FAIL). Mindestanforderung AA: 4.5:1.
- **Fix:** Alle betroffenen Texte auf `#000000` (schwarz, Kontrast 7.17:1 = PASS) gesetzt:
  - `FormParts.tsx`: Hint-Komponente (wirkt auf alle Screens mit Hinweistexten)
  - `EditPetScreen.tsx`: footnote, vetTipText
  - `SitterScreen.tsx`: sigStatus, loading, hintBoxText
  - `ManagePetsScreen.tsx`: addButtonText, archiveHint, emptyText, footnote
  - `EmergencyPassScreen.tsx`: footnote
  - `MoreScreen.tsx`: footnote
  - `HomeScreen.tsx`: addTileText
- **Nicht geändert:** Disabled-Buttons (opacity 0.4) – bewusstes UI-Pattern, Button wird aktiv sobald User etwas ändert.
- **versionCode:** 15 → 16
- **Status:** Implementiert, TypeScript 0 Fehler, committed, gepusht.

## E-129: Timer-Logik komplett entfernt + APK-Workflow vereinfacht (04.08.2026)

- **Datum:** 04.08.2026
- **Entscheidung:** Die 90-Tage-Timer-Logik (BUILD_DATE, EXPIRY_DAYS, checkExpiry, Alert, BackHandler.exitApp) wird komplett aus App.tsx entfernt. Es gibt keine TESTER/DEV-Unterscheidung mehr. Der APK-Workflow wird auf einen einzigen manuellen Job vereinfacht.
- **Begründung:** Die App ist seit 29.07.2026 im Play Store live. Tester erhalten die App über den geschlossenen Test-Track mit Promo-Codes. Ein Ablauf-Timer ist nicht mehr nötig – er war nur für die APK-Verteilung außerhalb des Stores relevant. Die TESTER/DEV-Unterscheidung und der Auto-Trigger bei Push erzeugten unnötige Komplexität und Doppel-Artifacts.
- **Änderungen:**
  - `app/App.tsx`: BUILD_DATE, EXPIRY_DAYS, checkExpiry() entfernt. Alert + BackHandler aus Import entfernt (werden in App.tsx nicht mehr verwendet).
  - `.github/workflows/build-apk.yml`: Komplett ersetzt. Nur noch `workflow_dispatch`, ein Job (`build-apk`), ein Artifact (`simplyPet_v{version}.apk`). Kein Auto-Trigger bei Push.
  - Dokumentation: ARBEITSANWEISUNG, INFRASTRUKTUR, ARBEITSSTAND aktualisiert.
- **versionCode:** 16 → 17
- **Status:** Implementiert, TypeScript 0 Fehler, committed, gepusht (`6c2fb42`).

## E-130: Workflow-Dispatch-Test – Manus-GitHub-Verbindung verifiziert (04.08.2026)

- **Datum:** 04.08.2026
- **Entscheidung:** Zwei Testläufe wurden bewusst per `gh workflow run` ausgelöst und sofort abgebrochen, um zu verifizieren, dass die Manus-GitHub-App-Verbindung `workflow_dispatch`-Rechte hat.
- **Ergebnis:**
  - Build APK (Run #36): Erfolgreich gestartet, sofort gecancelt.
  - Build AAB (Run 30929181706): Erfolgreich gestartet, lief bis Gradle-Daemon-Start, dann gecancelt.
- **Kein Artefakt erzeugt, kein versionCode-Verbrauch.**
- **Kein Einfluss auf die nächste reguläre Version.**
- **Erkenntnis:** Beide Workflows sind per Manus triggerbar. Der "Disable Timer"-Step in build-aab.yml war ein toter Step (EXPIRY_DAYS existiert nicht mehr) – wurde im Anschluss entfernt (Commit `2311dc1`).
- **Status:** Abgeschlossen, keine Aktion nötig.

## E-131: Android 17 Memory-Limits – Relevanzprüfung für simplyPet (05.08.2026)

- **Datum:** 05.08.2026
- **Anlass:** Google-Blogpost "Prioritizing Memory Efficiency: Essential Steps for Android 17" geprüft und gegen den echten Codebestand verifiziert (nicht nur gegen app.json, sondern gegen das per `npx expo prebuild --clean` tatsächlich generierte `android/app/build.gradle`).

**Ergebnisse:**

| Thema | Betrifft uns? | Status |
|:---|:---|:---|
| Memory Limits (Prozess-Kill ab Android 17) | Mittel | Foreground Service (Notfallpass-Notification) hält Prozess aktiv – Risiko bei Leaks, da Android 17 auch "privilegierte" Prozesse killt, wenn sie RAM-Limits überschreiten |
| R8 / Shrinking | NICHT AKTIV | enableMinifyInReleaseBuilds und enableShrinkResourcesInReleaseBuilds sind weder in app.json (expo-build-properties) noch in gradle.properties gesetzt. Defaults sind false. Verifiziert direkt im generierten build.gradle, Zeile 69 und 112–122. |
| Image Loading | Relevant, geringes Risiko | expo-image-picker + Komprimierung im Einsatz, kein dediziertes Caching-Framework (Glide/Coil), aber React Native handhabt das intern anders als natives Android |
| onTrimMemory | Bereits implementiert | registerLowMemoryHandler in App.tsx vorhanden |
| ApplicationExitInfo | Nicht implementiert | Könnte künftig genutzt werden, um Memory-bedingte Kills im Feld zu erkennen (Debugging-Zweck, keine Priorität) |

**Detailprüfung der 5 Google-Strategien gegen den echten Code (verifiziert, nicht nur behauptet):**

1. **R8:** Nicht aktiv (siehe oben) – geplant v1.1.0
2. **Image Loading:** expo-image-picker + Komprimierung vorhanden, aber kein Downsampling/Disk-Caching/Hardware-Bitmaps nach Google-Empfehlung. Geringe Priorität, da Bildmengen in der App klein sind (Tierfotos, Notfallpass).
3. **LeakCanary/Memory-Profiler:** Verifiziert NICHT im Einsatz (keine Treffer im Code/Dependencies)
4. **onTrimMemory:** Verifiziert vorhanden in `src/utils/lowMemoryHandler.ts` (registerLowMemoryHandler, E-52), reagiert auf React Natives generisches `memoryWarning`-Event und leert den Bilder-Cache. WICHTIG: Unterscheidet NICHT zwischen TRIM_MEMORY_UI_HIDDEN und TRIM_MEMORY_BACKGROUND wie von Google empfohlen – React Native bündelt beide nativen Android-Signale zu einem einzigen JS-Event. Granularere Behandlung wäre nur über einen eigenen nativen Modul-Layer möglich, aktuell nicht vorgesehen.
5. **ProfilingManager (TRIGGER_TYPE_OOM/ANOMALY):** Nicht implementiert, Android-17-spezifisch, erst relevant bei targetSdk-37-Umstellung

- **Entscheidung:** Kein akuter Handlungsbedarf für den aktuellen Release. R8-Aktivierung ist ein sinnvoller, aber NICHT dringender Schritt für v1.1.0 – erfordert vorheriges Testen in einer separaten Test-APK wegen möglicher Reflection-Konflikte mit den eigenen Config-Plugins (withForegroundServiceBridge, withRegisterServicePackage), bevor es in den AAB-Workflow für den Play Store übernommen wird.
- **Korrektur-Hinweis:** Eine erste Prüfung kam fälschlich zum Schluss, R8 sei bereits aktiv – das wurde durch direkten Blick ins generierte build.gradle widerlegt und korrigiert, bevor es dokumentiert wurde.
- **Status:** Zur Kenntnis genommen, keine sofortige Aktion. R8-Aktivierung als Aufgabe für v1.1.0 vorgemerkt.

## E-132: AAB-Build vC18 getriggert (06.08.2026)

- **Datum:** 06.08.2026
- **Entscheidung:** AAB-Build für versionCode 18 per `gh workflow run build-aab.yml` ausgelöst. vC 17 war bereits im Play Store Alpha-Track (seit 03.08.2026), daher Bump auf 18 erforderlich.
- **Run:** [#31088265597](https://github.com/markb3776-hub/pet-health-app-konzept/actions/runs/31088265597)
- **Commit:** `39aea39` (main)
- **Inhalt:** Identischer Code wie vC 17, plus: Timer-Step aus build-aab.yml entfernt, withRemovePermissions-Plugin hinzugefügt, versionCode-Bump.
- **Zweck:** Neues AAB für Play Store Upload (geschlossener Test → Produktion). Gleichzeitig Geräte-Test der 5 offenen Punkte (ANR-Fix, Backup-Entschlüsselung, Reschedule, DailyTrigger, App-Hintergrund).
- **Status:** Build läuft (~29 Min erwartet).

## E-133: Sitter-PDF – Page-Break vor Checkliste (06.08.2026)

- **Datum:** 06.08.2026
- **Entscheidung:** CSS `page-break-before: always;` vor dem Checkliste-Abschnitt in `src/sitter/sitterPdf.ts` eingefügt. Die Checkliste beginnt damit immer auf einer neuen A4-Seite, unabhängig von der Länge der vorherigen Abschnitte (Medikamente, Notfallkontakte).
- **Umsetzung:** `<div style="page-break-before: always;"></div>` direkt vor `<h2>Checkliste für den Sitter</h2>` (Zeile 166).
- **Hinweis:** `page-break-before` wird von expo-print (WebView-basiert) unterstützt. Falls bei Tests Probleme auftreten, Alternative: `break-before: page;` (neuere CSS-Syntax).
- **TypeScript:** 0 Fehler
- **Status:** Implementiert, gepusht (`2ea1433`). Geräte-Test ausstehend (mit vC18-Build).
