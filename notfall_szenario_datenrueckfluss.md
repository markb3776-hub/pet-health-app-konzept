# Konzept: Datenrückfluss nach dem Notfall-Klinikbesuch

**Szenario:** Halter mit Stammtierarzt in Buxtehude muss sonntags in die Notfall-Klinik. Es folgen Untersuchungen, Befunde, eine Diagnose und eine neue Dauermedikation (Medikament C). Der Halter ist gestresst und muss die Klinik-Daten anschließend einfach und korrekt in die App bekommen.

## 1. Welche Daten entstehen und in welcher Form? (Belegte Faktenbasis)

Nach einem Klinikbesuch verlässt der Halter die Klinik mit einer Kombination aus garantierten und üblichen Dokumenten:

| Datenquelle | Verfügbarkeit | Inhalt | Belegqualität |
| :--- | :--- | :--- | :--- |
| **Rechnung** | Gesetzlich garantiert (GOT § 7 Abs. 4) | Datum, Tierart, **Diagnose oder Konsultationsgrund**, alle Leistungen mit GOT-Ziffer, abgegebene Arzneimittel (gesondert ausgewiesen), Beträge | Gesetz [1] |
| **Medikamenten-Etikett** | Bei jeder Abgabe (Dispensierrecht, TAMG/TÄHAV) | Präparatname, Dosierungsanweisung der Klinik | Gesetzlich geregelt [2] |
| **Entlassungsbrief / Befundbericht** | Üblich bei Kliniken, aber nicht garantiert; oft später per E-Mail | Anamnese, Untersuchungsergebnisse, Laborwerte, Therapieplan | Klinik-Praxis [3] |
| **Mündliche Anweisungen** | Immer, aber flüchtig | "Geben Sie 2x täglich eine halbe Tablette mit dem Futter" | – |

Die zentrale Erkenntnis: **Die Rechnung ist die einzige gesetzlich garantierte, strukturierte Datenquelle.** § 7 Abs. 4 GOT verpflichtet jede Klinik, Datum, Tierart, Diagnose, alle Leistungen mit GOT-Nummer und die abgegebenen Medikamente auszuweisen. Der Halter hält damit immer ein Dokument in der Hand, das fast alles enthält, was die App braucht.

## 2. Die Lösung: Der "Nach-dem-Tierarzt"-Ablauf (ein Foto, eine Bestätigung)

Der Halter öffnet die App und tippt auf eine einzige, prominente Aktion: **"Tierarztbesuch erfassen"**. Danach läuft folgender Prozess:

**Schritt 1 – Fotografieren (30 Sekunden):** Der Halter fotografiert die Rechnung (mehrseitig möglich) und, falls vorhanden, das Medikamenten-Etikett und den Befundbericht. Kein Formular, keine Kategorieauswahl vorher – nur Fotos.

**Schritt 2 – KI-Extraktion und Zuordnung (automatisch):** Die multimodale KI liest die Dokumente und sortiert die Inhalte selbstständig an die richtigen Stellen der Akte:

| Erkannt im Dokument | Landet automatisch in |
| :--- | :--- |
| Diagnose (GOT-Pflichtangabe) | Krankengeschichte, mit Datum und Klinikname |
| GOT-Ziffern (Untersuchungen, Röntgen, Labor) | Behandlungshistorie des Besuchs |
| Abgegebenes "Medikament C" + Dosierung vom Etikett | **Medikationsplan (als Vorschlag)** |
| Gewicht (steht häufig auf Rechnung/Befund) | Gewichtskurve |
| Klinikname und Datum | Besuchsprotokoll |

**Schritt 3 – Bestätigen statt Eintippen (30 Sekunden):** Die App zeigt eine Zusammenfassung: "Gefunden: Diagnose X, 4 Untersuchungen, Medikament C (2x täglich 1/2 Tablette). Stimmt das?" Der Halter korrigiert bei Bedarf einzelne Felder und bestätigt. Gemäß Doktrin wird **nichts ungeprüft** in die Akte geschrieben – aber die Prüfung ist ein Blick und ein Tap, keine Tipparbeit.

**Schritt 4 – Automatische Konsequenzen (0 Sekunden Aufwand):** Mit der Bestätigung passiert alles Weitere von selbst: Der Medikationsplan für Medikament C wird angelegt, tägliche Einnahme-Erinnerungen starten ("Balou: 1/2 Tablette Medikament C, morgens"), eine Nachschub-Warnung wird berechnet (Packungsgröße ÷ Tagesdosis) und – wichtig wegen der Wiedervorstellungspflicht bei Dauermedikation – eine Erinnerung an den Kontrolltermin beim Stammtierarzt in Buxtehude gesetzt. Die Originalfotos bleiben als Belege am Besuch gespeichert.

**Schritt 5 – Der Kreis schließt sich:** Beim nächsten Besuch in Buxtehude zeigt der Halter die QR-Freigabe. Der Stammtierarzt sieht den kompletten Klinikbesuch: Diagnose, Untersuchungen, Medikament C samt Dosierung – ohne dass die Klinik und die Praxis je direkt kommuniziert haben.

## 3. Der Stress-Sonderfall: Sofort-Erfassung mit Sprache

Nicht alles steht auf Papier. Die mündliche Anweisung ("erst mal nur die halbe Dosis, ab nächster Woche ganz") ist flüchtig und im Stress nach 2 Stunden vergessen. Dafür gibt es die Sprachnotiz direkt in der App: Noch auf dem Klinikparkplatz diktiert der Halter "Klinik sagt, Medikament C erst halbe Tablette, ab Montag ganze". Die KI strukturiert das als Ergänzungsvorschlag zum Medikationsplan, der Halter bestätigt. Aufwand: 15 Sekunden.

## 4. Was passiert mit dem später nachgereichten Befundbericht?

Kliniken senden Befundberichte häufig erst Tage später per E-Mail. Dafür gibt es zwei einfache Wege: Der Halter teilt das PDF aus seiner Mail-App direkt in unsere App (Standard-Teilen-Funktion des Smartphones), oder jedes Tier hat eine persönliche Einwurf-E-Mail-Adresse (z. B. balou-x7k2@tierakte.app), die der Halter der Klinik nennen kann – eingehende Dokumente erscheinen dann als Vorschlag zur Bestätigung in der App.

## 5. Ehrlichkeits-Kennzeichnung nach Doktrin

| Aussage | Status |
| :--- | :--- |
| Rechnung enthält garantiert Datum, Diagnose, Leistungen, Medikamente | **Belegt** (GOT § 7 Abs. 4, Gesetzestext) [1] |
| Multimodale KI kann Tierarztrechnungen/Impfpässe zuverlässig auslesen | **Belegt als Marktpraxis** (Tier-Akte, FellAkte bieten dies an); die konkrete Genauigkeit unserer Umsetzung ist **testpflichtig** vor jedem Release |
| Automatische Zuordnung an die richtige Stelle der Akte | **Plausibel, testpflichtig** – Pflichttest mit realen, anonymisierten Rechnungen verschiedener Kliniken (unterschiedliche Layouts!) |
| Teilen-Funktion und E-Mail-Einwurf | **Standard-Technik**, Umsetzung testpflichtig |

## Quellen

[1] Tierärztegebührenordnung (GOT) vom 15.08.2022, § 7 Abs. 4: https://www.gesetze-im-internet.de/got_2022/BJNR140100022.html

[2] Tierklinik Oberhaching: Abgabe von Medikamenten (Dispensierrecht, TAMG/TÄHAV): https://tierklinik-oberhaching.de/informationen-zu-medikamenten/

[3] Tierklinik Hofheim: Merkblatt Entlassung nach Klinikaufenthalt: https://www.tierklinik-hofheim.de/
