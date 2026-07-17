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
