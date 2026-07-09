# Credit-Referenzwerte für Aufwandsschätzungen

Dieses Dokument sammelt gemessene Credit-Verbräuche abgeschlossener Arbeitsschritte, um zukünftige Aufträge realistisch hochrechnen zu können. Die Werte stammen aus den Kontostand-Ablesungen des Projektinhabers (vorher/nachher).

## Gemessene Werte

| Datum | Arbeitsschritt | Umfang | Verbrauch (Credits) |
| --- | --- | --- | --- |
| 08.07.2026 | Roadmap Schritt 3: Projekt-Setup & Infrastruktur | Expo-Projekt initialisiert, 10+ Code-Dateien (Screens, DB, Theme, Navigation), DB-Schema erstellt und in Neon eingespielt, Selbstprüfung (tsc, expo-doctor), GitHub-Push, Doku-Updates | **3.224** (123.528 → 120.304) |
| 08.–09.07.2026 | Konzept- und Festlegungs-Session (zwischen Schritt 3 und 4) | Zwischenanalyse-Bericht, Credit-Referenzdoku, Festlegung 6.1 (keine Testphase) + Transparenz-Präzisierung, Verwandtschafts-Feature-Vormerkung, Mehrarten-Stabilitätstest, Nutzer-Prüfprotokoll, Freigabe/Sitter-Konzept mit Kostenübernahme, Zeit-Integritäts-Regel, Querformat-Doktrin (inkl. app.json), Prüfdoktrin Eingabe-Stabilität, Testgeräte-Doku – insgesamt 13 Commits, viele Einzelfragen | **4.627** (120.304 → 115.677) |

**Einordnung des Schritt-3-Werts:** Darin enthalten sind ungeplante Umwege, die etwa ein Viertel bis ein Drittel des Verbrauchs ausgemacht haben dürften: zwei fehlgeschlagene Neon-Login-Versuche (Browser), das Regionsproblem (US statt EU, inkl. zweitem Projektanlauf und Löschung) und die zugehörige Abstimmung. Ein "glatter" Schritt vergleichbaren Umfangs läge geschätzt bei **2.000–2.500 Credits**.

## Hochrechnung für Roadmap Schritt 4 (grobe Schätzung, ungeprüft)

Schritt 4 (die eigentliche Entwicklung) ist deutlich umfangreicher als Schritt 3, da echte Funktionslogik, Formulare, Validierung und Tests entstehen. Basierend auf dem Referenzwert:

| Teilauftrag | Inhalt | Geschätzter Verbrauch |
| --- | --- | --- |
| 4.1 Fundament + Kern-Screens | Onboarding, Tier anlegen (vollständig), Startbildschirm, Tierakte mit echten Daten | ca. 3.000–5.000 |
| 4.2 Einträge-Funktionen | Gewicht, Notizen, Impfungen, Foto-Ablage mit Berechtigungs-Kette, Erinnerungen | ca. 3.000–5.000 |
| 4.3 Notfallpass + QR | Offline-Notfallpass komplett, QR-Generierung, Zwei-Tap-Verankerung | ca. 2.000–3.500 |
| 4.4 Interne Prüfung + APK | Automatisierte Tests (Doktrin-Punkte), Fehlerkorrektur, APK-Build und Übergabe | ca. 2.500–4.500 |
| **Summe Schritt 4** | | **ca. 10.500–18.000** |

Diese Schätzung ist bewusst als Spanne angegeben, da der tatsächliche Verbrauch stark davon abhängt, wie viele Korrekturschleifen nötig werden (insbesondere beim APK-Build, der erfahrungsgemäß Überraschungen birgt). Nach jedem abgeschlossenen Teilauftrag sollte der gemessene Ist-Wert hier nachgetragen werden, um die Schätzung für die Folgeschritte zu präzisieren.

## Spar-Regeln (bewährt)

**Lehre aus der Konzept-Session vom 08.–09.07.2026:** Viele wertvolle, aber einzeln gestellte Fragen in einer fortlaufenden Session summieren sich – 4.627 Credits, mehr als der komplette Schritt 3. Der Inhalt war es wert (zehn verbindliche Festlegungen, die spätere teure Umbauten verhindern), aber das Muster bestätigt die Regel: Ideen zunächst lokal sammeln (Notizzettel) und gebündelt als einen Auftrag einreichen ("Halte diese 5 Punkte fest") ist deutlich günstiger als fünf Einzelfragen mit je eigener Prüf- und Sicherungsrunde.

Ein Auftrag pro Session als einzelner, klar umrissener Arbeitsauftrag ("Erledige Teilauftrag 4.1 gemäß Roadmap, nutze nur vorhandene Dokumente, keine Web-Recherche") ist die kostengünstigste Form. Zwischenfragen, Login-Probleme und Kurswechsel während der Session erhöhen den Verbrauch spürbar – wo möglich, benötigte Zugänge (z. B. Logins) vor Auftragsstart bereitlegen.
