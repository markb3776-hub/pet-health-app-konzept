# Recherche: Tierarzt-Praxissoftware Deutschland – Schnittstellen-Analyse

## Quellen
- https://medizinio.de/software/praxis/tierarzt (Stand 2026)
- https://tierarztsoftware-vergleich.de/
- https://tandemhealth.ai/resources/knowledge/why-veterinary-software-interoperability-remains-limited-in-europe (12.06.2026)
- http://www.vetxml.co.uk/en/about-the-consortium/
- https://www.shepherd.vet/blog/open-api-access-in-veterinary-software-what-does-it-mean-for-your-practice/
- https://www.datahubvet.com/veterinary-api
- https://docs.ezyvet.com/en/browse-documentation/ezyvet/ezyvet-for-partners/standard-of-care-and-the-ezyvet-api

## Marktführer Deutschland (2026)

| Anbieter | Zielgruppe | Bereitstellung | Anwender | Schnittstellen |
|:---|:---|:---|:---|:---|
| easyVET | Klein-/Großtier, gemischt | On-Premise + Cloud | 114.000+ weltweit | IDEXX, TÄHAV-Export, GOT |
| Vetera | Klein-/Groß-/Pferd, Klinik, Uni | On-Premise + Web | 18.000+, 7 Vet-Unis | DICOM, Labor, Equidenpass |
| Provet Cloud | Kleintier, Überweisungspraxis | Cloud (SaaS) | k.A. | Bidirektionale Laborintegration |
| IDEXX Animana | Kleintier, urban | Cloud (SaaS) | k.A. | IDEXX VetConnect PLUS |
| debevet | Solo bis Klinik | Cloud | k.A. | Laboklin, IDEXX, Barsoi, DATEV, HIT, VetProof |
| inBehandlung | Alle Praxisgrößen | Cloud | k.A. | TASSO, IDEXX, VetProof, Hi Tier |
| Petflare.io | Kleine Praxen | Cloud | k.A. | SumUp, DATEV, Lexware |
| Vetinf | Kleintier, gemischt | On-Premise | k.A. | Röntgen, Labor |

## Preise
- Petflare: 49-89 €/Monat
- debevet: 48-168 €/Monat
- inBehandlung: 79-149 €/Monat
- easyVET: individuell (größere Praxen)
- Vetera: individuell

## Schnittstellen und Standards

### VetXML (UK-basiert)
- XML-Datenstandardset für Veterinärsoftware
- Ermöglicht Senden/Empfangen von Informationen innerhalb der Branche
- Hauptsächlich in UK adoptiert (einige PIMS-Anbieter)
- Consortium: http://www.vetxml.co.uk
- Schemas für: Patientendaten, Versicherungsdaten, Laborergebnisse

### HL7 FHIR (Fast Healthcare Interoperability Resources)
- Internationaler Standard für Gesundheitsdatenaustausch
- Deckt SOWOHL Human- als auch Veterinärmedizin ab
- FHIR v6.0.0 hat explizit "human and veterinary" Coverage
- IPS (International Patient Summary) wird für Tiere adaptiert
- Konferenz-Paper: "Revolutionizing Veterinary Practices with an International Health Booklet" (Magnus Conferences 2023)
- Ermöglicht Echtzeit-Zugriff auf kritische Tiergesundheitsdaten

### Open APIs in Veterinärsoftware
- ezyVet: Dokumentierte REST API (Standard-of-Care System, Impfungen, Behandlungen, Fälligkeiten)
- Shepherd: Open API Access (Booking, Patientendaten)
- DataHubVet: Veterinary API als Middleware zwischen Apps und PIMS
- Provet Cloud: API für Drittanbieter-Integration

### Laborschnittstellen
- IDEXX VetConnect PLUS: Automatischer Befundimport in Patientenakte
- SCIL VetExpert: Laborgeräte-Anbindung
- Laboklin: Laborergebnis-Übertragung
- Alle bidirektional möglich (Auftrag senden → Ergebnis empfangen)

### Chipnummer-Datenbanken
- TASSO (Deutschland, größtes Register)
- FINDEFIX (Deutsches Haustierregister des Dt. Tierschutzbundes)
- Direkte Abfrage zur Halteridentifikation aus Praxissoftware

### DICOM (Bildgebung)
- Standard für Röntgen, Ultraschall, MRT
- PACS-Integration in Praxissoftware
- Befunde ohne Medienbruch in Patientenakte

### eRezept-Veterinär
- Im Rollout (Bundestierärztekammer BTK)
- Für verschreibungspflichtige Tierarzneimittel
- Anbindung an Veterinär-eRezept-System

## Hardware in Praxen (typisch)
- Desktop-PCs (Windows) mit Praxissoftware
- Chiplesegeräte (ISO 11784/11785 Transponder)
- Laborgeräte (IDEXX Catalyst, SCIL VetABC)
- Digitale Röntgengeräte (DICOM-fähig)
- Barcode-Scanner (Medikamente, Lager)
- Tablets (zunehmend für mobile Dokumentation)
- Drucker (Rechnungen, Impfpässe)
- Kartenlesegeräte (EC/Kreditkarte)

## Interoperabilitäts-Problem (tandemhealth.ai, Juni 2026)
- "Veterinary software interoperability remains LIMITED in Europe"
- Kein einheitlicher Standard durchgesetzt
- Jeder Anbieter kocht sein eigenes Süppchen
- VetXML nur in UK teilweise adoptiert
- FHIR theoretisch möglich, aber praktisch kaum implementiert in Vet-Software
- Größtes Hindernis: Vendor Lock-in (Anbieter wollen Kunden halten)

## Relevanz für simplyPet

### Realistische Andockpunkte:
1. **QR-Code mit strukturierten Daten** → Praxis scannt, importiert in Patientenakte
2. **PDF-Export im standardisierten Format** → Universell lesbar
3. **Chipnummer als Brücke** → simplyPet speichert Chipnr., Praxis kann darüber zuordnen
4. **VetXML-kompatibles Export-Format** → Zukunftssicher, wenn Standard sich durchsetzt
5. **DataHubVet als Middleware** → API-Zugang zu verschiedenen PIMS

### Unrealistische Ansätze (für v1.x):
- Direkte API-Integration in jede Praxissoftware (zu viele Anbieter, geschlossene Systeme)
- Echtzeit-Sync (braucht Server, widerspricht Offline-Philosophie)
- HL7 FHIR vollständig implementieren (Overkill für eine Consumer-App)

## Bestehende Tierhalter-Portale (Wettbewerb/Inspiration)

### moosePET (von inBehandlung)
- Bidirektionaler Datenaustausch zwischen Praxis und Tierhalter
- Gesundheitstagebuch: Halter erfasst Daten → direkt in Praxissoftware synchronisiert
- Digitale Gesundheitsakte: Halter sieht Behandlungshistorie, Impftermine, Medikamente, Laborergebnisse
- Aktivierungscodes: Praxis erstellt Code → Halter registriert sich
- Nur mit inBehandlung kompatibel (proprietär)

### Petflare Tierhalter-Portal
- Login per Magic-Link (kein Passwort)
- Termine buchen/verschieben
- Rezept-Anfragen
- Digitaler Impfpass als PDF mit QR-Code
- Rechnungs-Archiv
- Apple Wallet Pass für Impftermin-Erinnerung
- Push-Erinnerung per SMS, E-Mail oder Apple Wallet
- Nur mit Petflare kompatibel (proprietär)

### ezyVet API (international, REST)
- Vollständige REST API: Animals, Appointments, Contacts, Consults, Diagnostics, Invoices
- Felder: species, breed, sex, colour, microchip, owner linkage, clinical metadata
- Standard-of-Care System: Impfungen, Behandlungen, Fälligkeiten
- OAuth2 Authentifizierung
- Webhooks für Echtzeit-Updates

### Provet Cloud API
- REST API + Webhooks
- 55.000+ Veterinärprofis, 3000+ Praxen
- OAuth 2.0 Authentifizierung
- Endpoints: Billing, Clients & Patients, Consultations, Appointments, Diagnostics
- Sandbox-Umgebung für Entwickler

### DataHubVet (US-fokussiert, Middleware)
- Unified API Layer für Legacy-PIMS (AVImark, Cornerstone, ImproMed)
- Lokaler Agent in der Praxis + Cloud Pipeline + REST API
- Normalisiertes Datenmodell: Clients, Patients, Appointments, Invoices, Medical Records
- Webhook-basiert (Echtzeit, <60s)
- Write-Back möglich (SOAP Notes zurückschreiben)
- Problem: Nur US-PIMS unterstützt

## Kernproblem Interoperabilität (tandemhealth.ai, Juni 2026)

- Nur 42,4% der Systeme extrahieren Daten aus EHRs und Vet-Labordaten
- Nur 9,1% integrieren Daten am Point of Collection
- Kein EU-Mandat für offene APIs in Vet-Software
- EHDS (European Health Data Space) gilt NUR für Humanmedizin
- ~15 große PIMS-Plattformen + 140 Integrationspartner = theoretisch 2.100 Integrationspaare
- Vendor Lock-in: Proprietäre Formate als Kundenbindung
- APIs oft "closed, undocumented, or fee-gated"
- Kein veterinäres Äquivalent zu HL7/FHIR durchgesetzt

## Hardware in Praxen (zusammengefasst)

| Gerät | Typ | Relevanz für simplyPet |
|:---|:---|:---|
| Desktop-PC (Windows) | Praxissoftware-Client | QR-Code-Scanner via Webcam möglich |
| Tablets (Android/iOS) | Mobile Dokumentation, Vet Radar | Direkte App-Nutzung denkbar |
| Chiplesegerät (ISO 11784/85) | RFID-Transponder auslesen | Chipnummer als Brücken-ID |
| Laborgeräte (IDEXX, SCIL) | Blutbild, Biochemie | Kein direkter Andockpunkt |
| Digitales Röntgen (DICOM) | Bildgebung | Kein direkter Andockpunkt |
| Barcode-Scanner | Medikamente, Lager | QR-Code scanbar |
| Drucker | Rechnungen, Impfpässe | PDF-Ausdruck möglich |
| Kartenlesegerät (EC) | Zahlung | Irrelevant |
