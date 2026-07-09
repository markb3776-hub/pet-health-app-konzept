# Konzept: Daten-Weitergabe an Partner, Praxis und Sitter

**Datum:** 09.07.2026 (aus Fragen des Projektinhabers entwickelt)
**Status:** Konzept beschlossen; Umsetzung nach Prototyp-Abnahme (Ausnahme: Notfallpass-PDF ist bereits im MVP)

Dieses Dokument beantwortet die Frage: *"Wie stelle ich die Daten meines Tieres anderen Menschen zur Verfügung – dem Partner, der Tierarztpraxis oder einem Tiersitter?"* Es definiert drei klar getrennte Weitergabe-Stufen und das neue Exportformat "Sitter-Zettel" inklusive der Lösung für die Kostenfrage im Notfall.

## 1. Die drei Weitergabe-Stufen

Jeder Empfänger braucht etwas anderes. Die App bietet deshalb keine Einheits-Freigabe, sondern drei bewusst unterschiedliche Wege:

| Stufe | Empfänger | Was er bekommt | Technik | Verfügbar ab |
| :--- | :--- | :--- | :--- | :--- |
| **1. Familien-Sync** | Partner / Familienmitglied | Volle, dauerhafte Mitnutzung: sieht und pflegt dieselben Akten live | Server-Synchronisation, eigenes Konto | Nach Prototyp (Premium) |
| **2. Praxis-Freigabe** | Tierarzt / Klinik | Befristeter Lesezugriff auf die medizinische Akte im Behandlungsmoment | QR-/Kurzcode → Browser-Ansicht | Nach Prototyp (Konzept fertig) |
| **3. Sitter-Zettel** | Tiersitter, Nachbar, Urlaubsbetreuung | Kompaktes PDF mit Betreuungs-Infos, ohne Krankenhistorie | PDF-Export → Teilen-Dialog (WhatsApp, E-Mail, Druck) | Nach Prototyp; Notfallpass-PDF pro Tier bereits im MVP |

Grundprinzipien für alle Stufen: Der Empfänger eines PDFs muss **nichts installieren** und kein Konto anlegen. Der Halter entscheidet bewusst, welche Informationen das Dokument enthält – sensible Diagnosen bleiben beim Sitter-Zettel außen vor (Datensparsamkeit). Und es gilt das Prinzip der einen Quelle: Alle Exporte werden aus den aktuellen Stammdaten erzeugt, es gibt keine getrennt gepflegten Kopien.

## 2. Der Sitter-Zettel (neues Exportformat)

Ein Sitter braucht keine Diagnosehistorie, sondern Handlungswissen. Der Sitter-Zettel ist deshalb **ein PDF pro Haushalt** (nicht pro Tier), das für jedes ausgewählte Tier eine kompakte Karte enthält:

1. **Identität:** Foto, Name, Tierart, Kennfarbe, Chipnummer, besondere Erkennungsmerkmale.
2. **Versorgung:** Fütterung (was, wann, wie viel), Wasser/Käfig/Becken-Besonderheiten.
3. **Medikamente:** Präparat, Dosierung, Uhrzeit – direkt aus dem Medikationsplan der Akte.
4. **Eigenheiten und Warnungen:** Freitext des Halters ("versteckt sich bei Gewitter", "darf keine Leckerli", "beißt beim Krallenschneiden").
5. **Notfall-Kern:** Allergien, Vorerkrankungen (nur die notfallrelevanten, vom Halter wählbar), Stammtierarzt mit Telefonnummer, Hinweis auf Notdienst-Suche (vetnotdienst.de).
6. **Kontakt und Kostenübernahme:** siehe Abschnitt 3.

Der Versand läuft über den Standard-Teilen-Dialog von Android (WhatsApp, E-Mail, Ausdruck). Bewusst **kein Online-Link** für den Sitter-Fall: Ein Papier am Kühlschrank oder ein PDF im Chat funktioniert im Alltag am zuverlässigsten, auch ohne Internet, und veraltet nicht durch Server-Abschaltungen.

**Datenmodell-Ergänzung (präzisiert am 09.07.2026):** Statt eines groben Freitextfelds ist die Fütterung als **strukturierter Block `feeding_info`** in der Pets-Tabelle festgelegt (fünf Angaben: Futter, Zeiten, Menge, Vorlieben, Tabus — Details in der Datenmodell-Spezifikation, Abschnitt 2.2) plus `care_notes` (Hinweise für Betreuer). Beides speist den Sitter-Zettel automatisch. Die Datenfelder werden bereits im Prototyp angelegt; Eingabemaske und Zettel-Generator folgen nach der Prototyp-Abnahme, inklusive Auswahl-Dialog, welche Tiere und welche Notfall-Angaben in den Zettel aufgenommen werden. Wiederkehrende Pflege-Aufgaben mit Uhrzeiten (z. B. "Ohren eincremen bei Sonnenschein, 2× täglich") erscheinen ebenfalls automatisch auf dem Zettel — Quelle ist der Medikamenten-/Pflege-Eintrag (Typ 'Pflege') des Tieres.

## 3. Die Kostenfrage im Notfall (Frage des Projektinhabers, 09.07.2026)

**Szenario:** Der Sitter muss mit dem Tier in die Notaufnahme. Die Kosten soll nicht der Sitter tragen, sondern der Halter. Im Notdienst gilt laut GOT der 2- bis 4-fache Gebührensatz plus 50 Euro Notdienstgebühr [1] – Kliniken verlangen zudem häufig Vorkasse oder Anzahlung. Wer den Behandlungsvertrag schließt, haftet; ohne Vorsorge riskiert der Sitter, selbst als Vertragspartner dazustehen.

Die App kann keine Zahlungspflicht verschieben, liefert aber die drei praktischen Hebel, die das Problem im echten Leben lösen:

**Hebel 1 – Kostenübernahme-Erklärung auf dem Sitter-Zettel:** Der Zettel weist den Halter eindeutig als Kostenträger aus (Name, Anschrift, Telefonnummer, Chipnummer des Tieres als Zuordnungsnachweis) und enthält den vorformulierten Baustein:

> "Der/die Betreuer/in bringt das Tier in meinem Auftrag. Den Behandlungsvertrag schließe ich als Halter/in; die Kosten übernehme ich. Ich bin erreichbar unter: [Telefonnummer]. — [Ort, Datum, Unterschrift des Halters]"

Das PDF enthält ein Unterschriftsfeld; der Halter unterschreibt vor der Abreise. Damit hält der Sitter genau das Dokument in der Hand, das Kliniken sehen wollen, bevor sie behandeln.

**Hebel 2 – Erreichbarkeit im Behandlungsmoment:** Der Zettel nennt die Halter-Nummer plus eine Ersatzperson. Im Zweifel schließt der Halter den Behandlungsvertrag telefonisch selbst – der Sitter ist nur Überbringer. Das ist der rechtlich sauberste Weg.

**Hebel 3 – Zahlungsweg (bewusst außerhalb der App):** Die tatsächliche Zahlung läuft direkt zwischen Halter und Klinik (telefonische Kartenzahlung, Zahlungslink der Klinik) oder per Vorstrecken und Erstattung. Die App baut **keine** Bezahlfunktion und **keine** Kostenübernahme-Garantie – das wäre regulatorisch ein Finanzdienstleistungs-Thema und liegt außerhalb von Doktrin und Kernkompetenz. Optional gehört auf den Zettel: Tierkrankenversicherung mit Policennummer (manche Kliniken rechnen direkt ab; verbindet sich mit Blindspot 18, Versicherungs-Ökosystem).

**Ehrlichkeits-Kennzeichnung:** Die Kostenübernahme-Vorlage ist eine praktische Hilfe, **keine Rechtsberatung**. Ob eine Klinik sie akzeptiert, entscheidet die Klinik. Die finale Formulierung wird vor dem Launch anwaltlich geprüft (gehört zum bestehenden Blindspot "rechtliche Texte", A.1/A.3). Dieser Hinweis erscheint auch in der App neben der Funktion.

## 4. Abgrenzung zum Prototyp

Im Prototyp (Roadmap Schritte 4–5) ist von alledem nur der **Notfallpass-PDF-Export pro Tier** enthalten (bereits spezifiziert). Der Sitter-Zettel, die Praxis-Browser-Freigabe und der Familien-Sync folgen nach der Prototyp-Abnahme als getrennte Bausteine. Diese Reihenfolge ist bewusst: erst das stabile Fundament, dann die Weitergabe-Funktionen.

## Quellen

[1] Tierärztegebührenordnung (GOT) vom 15.08.2022, § 4 (Notdienst: 2- bis 4-facher Satz, 50 € Notdienstgebühr) und § 7 Abs. 4 (Rechnungspflichtangaben): https://www.gesetze-im-internet.de/got_2022/BJNR140100022.html
