# Infrastruktur-Konzept & Kellerserver-Blaupause

Dieses Dokument definiert die verbindliche Infrastruktur-Strategie für die Pet Health App, abgeleitet aus der MEMORIA-Doktrin ("Wahrheit, Funktion, Vertrauen").

## 1. Grundsatzentscheidung: Datenhoheit und KI-Scan

Das Kernversprechen der App lautet: **Deine Daten bleiben in Europa und unter unserer Kontrolle.**
Daraus ergeben sich zwingende Vorgaben für die Architektur, insbesondere für das wichtigste und datenschutzrechtlich sensibelste Feature: den KI-Dokumentenscan von Impfpässen und Tierarztrechnungen (die personenbezogene Daten enthalten).

- **Keine US-Anbieter:** OpenAI, Microsoft, Google und AWS scheiden für die Verarbeitung echter Nutzerdaten aus, da der US CLOUD Act den US-Behörden potenziellen Zugriff auch auf EU-Server gewährt. Dies kollidiert mit dem Vertrauensversprechen.
- **Keine EU-Anbieter mit Subprozessoren-Risiko:** Auch EU-Anbieter wie Mistral AI setzen für bestimmte Funktionen Subunternehmer außerhalb der EU ein. Ein Datenversand "kreuz und quer durch die Welt" wird vom Nutzer als Vertrauensbruch empfunden, selbst wenn er vertraglich (über Standardvertragsklauseln) abgesichert ist.
- **Die verbindliche Strategie:** Der KI-Scan wird **ausschließlich auf selbst gehosteten Servern (Self-Hosting)** in einem zertifizierten deutschen Rechenzentrum (z.B. Hetzner) durchgeführt. Die Daten verlassen unser System nicht.
- **Konsequenz für den Launch:** Bis die Selbst-Hosting-Lösung technisch und finanziell realisierbar ist, wird der KI-Scan in der App nicht angeboten. Die App startet stattdessen mit der ohnehin vorgesehenen manuellen Eingabefunktion. Die Funktion "KI-Scan" wird erst aktiviert, wenn sie den Doktrin-Vorgaben entspricht.

## 2. Zwei-Umgebungen-Strategie

Um Kosten zu sparen und sicher zu entwickeln, wird die Infrastruktur strikt in zwei Umgebungen getrennt:

| Umgebung | Zweck | Standort | Erreichbarkeit | Daten |
| --- | --- | --- | --- | --- |
| **Test & Entwicklung** | Programmierung, KI-Experimente (OCR-Tests) | "Kellerserver" (zuhause) | Nur via privatem VPN (Tailscale), **nicht öffentlich** | Nur synthetische Testdaten, **keine echten Nutzerdaten** |
| **Produktion** | Live-Betrieb für Endnutzer | ISO-zertifiziertes Rechenzentrum in Deutschland | Öffentlich erreichbar | Echte Nutzerdaten |

## 3. Blaupause: Der Kellerserver (Testumgebung)

Der Kellerserver dient als exakte Kopie der späteren Produktionsumgebung. Durch den konsequenten Einsatz von Docker-Containern wird sichergestellt, dass die lokal getestete Software später ohne Regressionen in das Rechenzentrum übertragen werden kann.

### Hardware-Ausstattung

Die Hardware wird in zwei Stufen aufgebaut, um Kosten zu staffeln:

**Stufe 1: Basis-Backend (ohne KI)**
- **Rechner:** Gebrauchter Mini-PC oder Büro-Tower (z.B. Lenovo ThinkCentre, Dell OptiPlex) mit Intel Core i5 und 16 GB RAM.
- **Speicher:** 500 GB bis 1 TB SSD als Hauptspeicher, plus eine externe oder zweite interne Festplatte für Backups.
- **Netzwerk:** Zwingend per LAN-Kabel an den Router angeschlossen (kein WLAN).
- **Kosten:** ca. 150–300 € einmalig (gebraucht). Stromkosten bei 10–30 Watt Leerlauf ca. 3–10 € monatlich.

**Stufe 2: OCR-Testlabor (KI-Selbst-Hosting)**
- **Grafikkarte (GPU):** Für das Selbst-Hosting von KI-Modellen (z.B. Mistral OCR) ist zwingend eine GPU erforderlich. Je mehr Grafikspeicher (VRAM), desto besser.
- **Empfehlung:** Eine gebrauchte NVIDIA RTX 3060 (12 GB VRAM, ca. 200–250 €) für erste Versuche, oder eine RTX 3090 (24 GB VRAM, ca. 600–800 €) für größere Modelle.
- **Wichtig:** Der Kauf der GPU erfolgt erst, nachdem in der technischen Planungsphase der exakte VRAM-Bedarf des Ziel-Modells ermittelt wurde.

### Software-Stack (Kostenlos & Quelloffen)

Alle Komponenten laufen unter einem Linux-Betriebssystem und sind in Container gekapselt:

| Schicht | Software | Zweck |
| --- | --- | --- |
| **Betriebssystem** | Ubuntu Server 24.04 LTS | Robuste Basis, identisch zur späteren Produktionsumgebung. |
| **Container-Engine** | Docker | Isoliert alle Dienste; ermöglicht den 1:1-Umzug ins Rechenzentrum. |
| **Datenbank** | PostgreSQL | Speicherung der strukturierten Test-Tierakten. |
| **Backend-Logik** | Node.js (eigener Code) | API-Schnittstelle zwischen App und Datenbank/KI. |
| **Dateiablage** | MinIO | S3-kompatibler lokaler Speicher für hochgeladene Testfotos. |
| **KI-Inferenz** | vLLM oder Ollama | Stellt das lokal gehostete OCR-Modell auf der GPU bereit. |
| **Fernzugriff** | Tailscale | Privates VPN (Mesh-Netzwerk). Ermöglicht den Zugriff auf den Server von überall, ohne Ports am Router öffnen zu müssen. |
| **Backup** | restic | Verschlüsselte, automatisierte Sicherungen auf das Zweitlaufwerk. |
| **Monitoring** | Uptime Kuma | Einfaches Dashboard zur Überwachung aller laufenden Container. |

## 4. Sicherheitsvorgaben für den Heimbetrieb

Der Kellerserver darf unter keinen Umständen zur Gefahr für das Heimnetzwerk oder für spätere Nutzerdaten werden:
1. **Keine Portfreigaben:** Am heimischen Router werden keine Ports (z.B. 80, 443, 22) für den Server geöffnet.
2. **Zugriff nur via VPN:** Die Verbindung zum Server erfolgt ausschließlich über das Tailscale-VPN.
3. **Strikte Datentrennung:** Sobald die App in den Beta-Test mit echten fremden Nutzern geht, zieht das Backend auf einen Mietserver (ca. 20–30 €/Monat) in ein zertifiziertes deutsches Rechenzentrum um. Der Kellerserver verarbeitet **niemals** echte Nutzerdaten, da ein Heimbetrieb die DSGVO-Anforderungen (technische und organisatorische Maßnahmen wie Zugangskontrolle und Brandschutz) nicht rechtssicher erfüllen kann.


## 5. Dokumentierter Kompromiss: Prototyp-Testdatenbank in den USA (Stand 08.07.2026)

Für den Prototyp (Roadmap Schritt 3) wurde eine kostenlose Neon-Testdatenbank angebunden (Projekt `simplypet-test`, ID `royal-pond-21225992`). Diese liegt in der Region **us-east-1 (USA)**, weil die automatisierte Anbindung keine Regionswahl erlaubte und der manuelle Konsolen-Login zum Einrichtungszeitpunkt nicht möglich war (Projektinhaber im Urlaub, Passwort nicht verfügbar). Der Projektinhaber hat diesen Kompromiss am 08.07.2026 ausdrücklich freigegeben.

Der Kompromiss ist vertretbar, weil die Datenbank **ausschließlich synthetische Testdaten** enthält (erfundene Tiere, keine personenbezogenen Daten) und damit der Kern der Doktrin – keine echten Nutzerdaten bei US-Anbietern – nicht verletzt wird.

> **Verbindliche Auflage:** Vor der Eingabe jeglicher echter Daten (auch eigener Tiere des Projektinhabers) muss die Datenbank auf EU-Infrastruktur umziehen: entweder ein Neon-Projekt in Frankfurt (eu-central-1) oder direkt der Kellerserver/Mietserver gemäß Abschnitt 2. Der Umzug besteht aus dem Schema-Import (`app/server/migrations/001_initial_schema.sql`) und der Anpassung der Verbindungs-URL – Aufwand unter 15 Minuten.
