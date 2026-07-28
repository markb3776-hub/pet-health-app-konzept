# Analyse: Tierarzt-Praxissoftware & Interoperabilität (Deutschland)

Diese Analyse untersucht die aktuelle Software- und Hardware-Landschaft in deutschen Tierarztpraxen und identifiziert realistische Andockpunkte für **simplyPet**, um einen reibungslosen Datenaustausch zwischen Tierhalter und Praxis zu ermöglichen, ohne die Offline-Philosophie der App aufzugeben.

## 1. Die Software-Landschaft in Deutschland

Der Markt für Veterinärsoftware in Deutschland ist stark fragmentiert und wird von einigen wenigen etablierten On-Premise-Anbietern sowie aufstrebenden Cloud-Lösungen dominiert [1] [2].

| Anbieter | Zielgruppe | Bereitstellung | Besonderheiten & Schnittstellen |
|:---|:---|:---|:---|
| **easyVET** | Klein-/Großtier, Kliniken | On-Premise + Cloud | Über 114.000 Anwender weltweit; starke IDEXX-Integration |
| **Vetera** | Gemischt, Pferde, Unis | On-Premise + Web | 18.000+ Anwender; Equidenpass-Fokus; DICOM-Schnittstellen |
| **debevet** | Solo bis Klinik | Cloud (SaaS) | Laboklin, IDEXX, Barsoi, DATEV, HIT, VetProof |
| **inBehandlung** | Alle Praxisgrößen | Cloud (SaaS) | Eigene Halter-App (moosePET); TASSO-Anbindung |
| **Petflare.io** | Kleine Praxen | Cloud (SaaS) | Eigenes Halter-Portal (Magic-Link); SumUp-Integration |
| **Provet Cloud** | Kleintier, Überweisung | Cloud (SaaS) | Offene REST-API; Fokus auf Drittanbieter-Integration |

### Das Interoperabilitäts-Problem
Im Gegensatz zur Humanmedizin gibt es in der Veterinärmedizin kein gesetzliches Mandat für Interoperabilität (wie z.B. den European Health Data Space) [3]. Dies führt zu einem geschlossenen Ökosystem, in dem Anbieter ihre Systeme oft durch proprietäre Formate abschotten ("Vendor Lock-in") [3]. Eine Analyse aus dem Jahr 2026 zeigt, dass nur 42,4 % der Systeme Daten aus elektronischen Gesundheitsakten und Laboren extrahieren können [3].

## 2. Standards und Austauschformate

Obwohl Bemühungen zur Standardisierung existieren, ist die praktische Umsetzung in Europa gering.

- **VetXML:** Ein in Großbritannien entwickeltes XML-basiertes Format für den Austausch von Patientendaten, Laborergebnissen und Versicherungsfällen [4]. In Deutschland wird es kaum unterstützt.
- **HL7 FHIR:** Der internationale Standard für Gesundheitsdaten deckt in der Version 6.0.0 explizit auch die Veterinärmedizin ab [3]. Dennoch ist die Implementierung in Praxisverwaltungssystemen (PIMS) nahezu nicht existent [3].
- **Open APIs:** Einige moderne Cloud-Systeme wie *Provet Cloud* oder *ezyVet* bieten gut dokumentierte REST-APIs [5]. Middleware-Lösungen wie *DataHubVet* versuchen, Legacy-Systeme (v.a. in den USA) über lokale Agenten ansprechbar zu machen [6].

## 3. Hardware-Ausstattung in Praxen

Die Hardware in Praxen bietet physische Andockpunkte für den Datenaustausch [7].

- **Desktop-PCs & Laptops:** Standard für die Praxisverwaltung am Empfang und im Behandlungsraum.
- **Tablets:** Zunehmend für mobile Dokumentation (z.B. Vet Radar) im Einsatz.
- **Chiplesegeräte (ISO 11784/11785):** Standard in jeder Praxis zur Identifikation via RFID-Transponder.
- **Barcode-/2D-Scanner:** Werden häufig für das Scannen von Medikamenten (Warenwirtschaft) genutzt und können QR-Codes lesen.

## 4. Lösungsansätze für simplyPet

Da eine direkte API-Integration in dutzende geschlossene Praxis-Systeme für eine Offline-App weder technisch skalierbar noch philosophisch sinnvoll ist, müssen alternative Wege für den Datenaustausch gefunden werden.

### Strategie 1: Der "Smart QR-Code" (Offline)
Praxen verfügen über 2D-Scanner. simplyPet kann einen hochdichten QR-Code generieren, der strukturierte Patientendaten (JSON-Format) enthält.
- **Vorteil:** Funktioniert zu 100 % offline. Die Praxis scannt den Code direkt vom Handy des Halters in ein Textfeld der Praxissoftware.
- **Inhalt:** Chipnummer, aktuelle Medikamente, Allergien.

### Strategie 2: Die Chipnummer als Primärschlüssel
Jedes Tier wird in der Praxis über das Chiplesegerät identifiziert. simplyPet nutzt die 15-stellige Chipnummer als eindeutigen Identifikator.
- **Vorteil:** Wenn die Praxissoftware eine PDF-Datei (den simplyPet-Notfallpass) erhält, kann diese über die Chipnummer im Dateinamen oder als Metadatum automatisch der richtigen Akte zugeordnet werden.

### Strategie 3: Standardisierter PDF-Export mit strukturiertem Anhang
Anstatt eines reinen Text-PDFs exportiert simplyPet ein PDF/A-3-Dokument. Dieses Format erlaubt es, XML- oder JSON-Daten unsichtbar in die PDF-Datei einzubetten (ähnlich dem ZUGFeRD-Standard bei Rechnungen).
- **Vorteil:** Die Praxis kann das PDF lesen (menschlich) ODER die Praxissoftware kann die eingebetteten Daten (z.B. Impfhistorie) maschinell auslesen und importieren.

### Strategie 4: Befund-Import via Scan
Um Daten *von* der Praxis *in* die App zu bekommen, ohne eine Cloud-Infrastruktur aufzubauen:
- Die Praxis druckt einen QR-Code auf die Rechnung oder den Befund (z.B. "Neue Impfung: Tollwut, Charge XYZ").
- Der simplyPet-Nutzer scannt diesen Code mit der App, und der Eintrag wird automatisch in der digitalen Tierakte angelegt.

## Fazit & Empfehlung für v1.1 / v1.2

Der Versuch, sich in die proprietären APIs der PIMS-Anbieter zu integrieren, würde massive Entwicklungsressourcen binden und einen Server-Zwang für simplyPet bedeuten. 

**Die beste Lösung für simplyPet ist der Weg über strukturierte Offline-Schnittstellen:**
1. **QR-Code-Optimierung:** Den bestehenden QR-Code so strukturieren, dass Praxis-Handscanner ihn als sauberen Text-String (z.B. vCard-Format für Tiere) ausgeben können.
2. **PDF/A-3 Export:** Den Notfallpass so erweitern, dass er maschinenlesbare JSON-Daten enthält.
3. **Scan-to-Import:** Eine Funktion entwickeln, mit der Halter standardisierte QR-Codes von Tierarztrechnungen scannen können, um Einträge automatisch zu erstellen.

---
### References
[1] Medizinio. "Praxissoftware Tierarzt: Vergleich & Empfehlungen". https://medizinio.de/software/praxis/tierarzt
[2] Tierarztsoftware-Vergleich. "Tierarzt Software im Vergleich". https://tierarztsoftware-vergleich.de/
[3] Tandem Health. "Why veterinary software interoperability remains limited in Europe". https://tandemhealth.ai/resources/knowledge/why-veterinary-software-interoperability-remains-limited-in-europe
[4] VetXML Consortium. "About the Consortium". http://www.vetxml.co.uk/en/about-the-consortium/
[5] Provet Cloud. "Welcome to Provet REST API's documentation!". https://developers.provetcloud.com/restapi/
[6] DataHub Vet. "Veterinary API: Integration Architecture & Developer Guide". https://www.datahubvet.com/veterinary-api
[7] Cybernet. "Why Medical Grade Computers Are Used by Vet Clinics". https://www.cybernetman.com/blog/why-medical-grade-computers-are-used-by-vet-clinics/
