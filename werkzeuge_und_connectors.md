# Werkzeug-Übersicht: Verbundene Connectors und ihre Rolle im Projekt

Stand: 08.07.2026 — Dieses Dokument hält fest, welche externen Werkzeuge (Connectors) im Manus-Konto des Projektinhabers verbunden sind und welche Rolle sie auf dem Weg zum Prototyp und darüber hinaus spielen. Grundsatz: Verbundene Connectors verursachen keine laufenden Kosten; Kosten (Agent-Credits) entstehen nur durch aktive Arbeit mit ihnen.

## 1. Kernwerkzeuge für die Entwicklung

| Werkzeug | Rolle im Projekt | Einsatzzeitpunkt | Status |
| --- | --- | --- | --- |
| **GitHub** | Versionierung von Code und Dokumenten. Privates Repository `pet-health-app-konzept` existiert bereits mit allen Konzeptdokumenten (46+ Dateien). Setzt die Chaos-Präventionsregel der Doktrin um: kein Stand geht verloren, jede Änderung nachvollziehbar. | Bereits aktiv genutzt | Verbunden ✓ |
| **Neon** (Postgres, **EU-Region gewählt**) | Test-Datenbank für die Entwicklungsphase. Wichtig: Neon gehört zu Databricks (US-Unternehmen) — trotz EU-Serverstandort gilt der US CLOUD Act. Daher nur für Test- und Entwicklungsdaten; echte Nutzerdaten laufen später ausschließlich über eigene Infrastruktur im deutschen Rechenzentrum (siehe Infrastruktur-Konzept). | Roadmap Schritt 3 (Projekt-Setup) | Verbunden ✓ |
| **Playwright** | Automatisierte Tests (Browser-/UI-Automatisierung). Technische Umsetzung der Projektanweisung "Selbstprüfung auf Funktion vor Auslieferung": Prüfkatalog aus dem App-Struktur-Konzept (Zwei-Tap-Notfallpass, Offline-Start, größte Schriftgröße) kann damit automatisiert geprüft werden. | Roadmap Schritt 4 (interne Prüfung) | Verbunden ✓ |
| **Sentry** | Fehlerüberwachung im Live-Betrieb. Frühwarnsystem gegen unbemerkte Update-Fehler — das dokumentierte Kernproblem der Wettbewerber. | Ab Beta/Launch | Verbunden ✓ |
| **Serena** | Semantische Code-Navigation. Beschleunigt Entwicklungsarbeit in wachsendem Code-Bestand und reduziert dadurch Arbeitsgänge (= Credits). | Roadmap Schritt 4 (Entwicklung) | Verbunden ✓ |
| **Mein Browser** | Zugriff auf das Web mit den echten Logins des Projektinhabers, ohne Passwort-Weitergabe. Nützlich z. B. für die spätere Einrichtung der Google-Play-Konsole. | Bei Bedarf (Launch-Phase) | Verbunden ✓ |

## 2. Unterstützende Werkzeuge (später relevant)

| Werkzeug | Rolle im Projekt | Einsatzzeitpunkt |
| --- | --- | --- |
| **Canva** | Grafiken für Marketing und den MEMORIA-Instagram-Kanal (App-Store-Bilder, Ankündigungsgrafiken). | Nach Prototyp, wenn es etwas zu zeigen gibt |
| **Brand24** | Markenüberwachung (wer spricht über die App). | Erst nach Namensfindung/Launch |

## 3. Bewusst nicht genutzt

- **Airtable**: No-Code-Werkzeug für interne Verwaltungs-Workflows. Erzeugt keine echte, installierbare Android-App, kein Offline-Betrieb, Daten lägen bei einem US-Dienst. Für dieses Projekt ungeeignet — geprüft und verworfen am 08.07.2026.
- Weitere verfügbare Connectors (Finanzen, Meetings, B2B-Vertrieb, Medienproduktion) haben keinen Projektbezug und bleiben ungenutzt.

## 4. Sonstige Testressourcen

- **Zwei Android-Telefone** als Testgeräte (festgehalten in der Roadmap, Schritt 1 und 5): Layout-Tests auf verschiedenen Bildschirmen, Push-Erinnerungs-Verhalten unter herstellerspezifischen Akku-Sparmodi (Blindspot C.14), später Testaufbau für die Familien-Freigabe. Installation per APK-Direktinstallation, ohne Play Store.

## 5. Fazit

Die Werkzeugkiste für den gesamten Weg — Prototyp, Test, Beta, Launch — ist vollständig. Es fehlt kein Werkzeug, und es muss vorerst auch keines aktiviert oder gekauft werden. Der einzige Kostenfaktor der Prototyp-Phase ist die eigentliche Arbeitsleistung (Agent-Credits bzw. alternativ Arbeitszeit eines Programmierers), empfohlen als klar umrissene Einzelaufträge gemäß Roadmap.
