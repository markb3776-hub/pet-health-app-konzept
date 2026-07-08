# Recherche-Notizen: Nutzerseite der Pet-Health-App

## Block 1: Zielgruppe & Demografie

### Heimtierstudie 2025 (Prof. Dr. Renate Ohr, Universität Göttingen, unterstützt vom IVH e.V.)
Quelle: https://tiermedizin.thieme.de/aktuelles/vet-news/detail/welche-wirtschaftliche-bedeutung-hat-die-heimtierhaltung-2255 (31.01.2026)
Hinweis: IVH ist Industrieverband (Interessenkonflikt möglich), aber Studie ist universitär (Uni Göttingen) und einzige umfassende DE-Quelle; als Primärquelle die Uni-Publikation zitieren.
- Ausgaben deutscher Haushalte für Heimtiere 2024: >18 Mrd. EUR (Wertschöpfungsbeitrag ~15,2 Mrd. EUR, ~0,35% BIP, bis zu 165.000 Arbeitsplätze)
- Gesundheitsbereich (Veterinärwesen, Tierheilpraktiker etc.): 4–4,2 Mrd. EUR, WACHSTUMSTREIBER
- Mittelfristig weiter steigende Gesundheitsausgaben von 5–10% erwartet (Zitat Ohr)
- Treiber: (1) Bereitschaft zu teuren Diagnose-/Behandlungsformen aus Humanmedizin, (2) Boom bei Tierkrankenversicherungen (Versicherungsbereich: 1,1–1,2 Mrd. EUR)
- Tiere werden als "Sozialpartner und Familienmitglieder" gesehen (Humanisierung)
- Heimtiernahrung: 7,5–9,5 Mrd. EUR (+~50% vs. 2018)
- Tierverteilung (lt. Uni Göttingen PDF-Snippet): Hunde 52%, Katzen 38%, Kleintiere/Vögel/Reptilien 10% (Anteil an Tierarztkosten o.ä. – im Bericht vorsichtig formulieren)

### Generationswandel (internationale Quellen)
- Weltweit: ~40% der "Pet Parents" sind Millennials, ~17% Gen Z (Medium/Statista-Sekundär; als Näherung kennzeichnen)
- 60% der Gen-Z-/Millennial-Halter priorisieren Ausgaben für ihr Tier gegenüber sich selbst (LinkedIn-Sekundärquelle, VORSICHT: schwach belegt, ggf. weglassen oder abschwächen)
- APPA 2025 (US): 94 Mio. US-Haushalte mit Tier, Gen Z treibt Mehrtier-Haltung
- Vet Times (UK, 2023): Halter-Demografie verschiebt sich von Boomer/Gen X zu Millennials/Gen Z (Artikel hinter Anmeldung, nur Snippet)

### Zwischenfazit Zielgruppe
- Kernzielgruppe: 25–45 Jahre (Millennials + ältere Gen Z), digital affin, behandeln Tier als Familienmitglied, hohe Zahlungsbereitschaft für Gesundheit
- Sekundär: 45+ mit chronisch kranken Tieren (höchster Dokumentationsbedarf)
- DE-Basis: ~34,3 Mio. Heimtiere / knapp die Hälfte der Haushalte (ZZF-Zahlen, noch zu verifizieren)

## Marktbasis Deutschland (IVH/ZZF, Skopos-Erhebung, Basis 5.000 Befragte, veröffentlicht 27.04.2026 für Jahr 2025)
Quelle: https://www.ivh-online.de/der-verband/daten-fakten/der-deutsche-heimtiermarkt.html
- 33,4 Mio. Heimtiere (Hunde, Katzen, Kleinsäuger, Ziervögel) in Deutschland 2025, plus Zierfische/Terrarientiere
- 43% aller Haushalte mit mindestens einem Heimtier
- Katzen: 15,7 Mio. in 24% der Haushalte; 43% der Katzenhalter haben 2+ Katzen (→ Mehrtier-Funktion wichtig!)
- Hunde: 10 Mio., jeder 5. Haushalt; 43% Mischlinge
- Kleintiere: 4,4 Mio. (5% HH); Ziervögel 3,3 Mio. (3% HH)
- 13% der Haushalte halten mindestens zwei Tierarten
- ALTERSSTRUKTUR der Halter 2025: bis 29 J: 17% | 30–39: 19% | 40–49: 18% | 50–59: 21% | 60+: 25%
  → WICHTIG: Zielgruppe ist NICHT nur jung! 46% sind 50+. Kernsegment 30–49 = 37%.
- 67% der Familien mit Kindern haben ein Tier; 28% der Singles
- Haushaltsgröße Halter: 26% Einpersonen-, 35% Zweipersonen-, 39% 3+-Personen-HH (→ Familien-Sync relevant für ~74% Mehrpersonen-HH)
- 61% der Halter kaufen sowohl stationär als auch online (digitale Affinität)

## eEPA-Validierung (FU Berlin, Dissertationsprojekt A. Kraft / Prof. Brunnberg)
Quelle: https://just4vets.online/gefluester/umfrage-kraft
- Wissenschaftliche Bestätigung des Bedarfs: einrichtungsübergreifende elektronische Patientenakte (eEPA) für Hund/Katze spart Arbeitszeit und "im Notdienst kostbare Zeit"
- Relevante Datenfelder lt. eEPA-Konzept: Allergien, Impfungen, OPs, Medikamente, Diagnosen, Befunde, Laboruntersuchungen, Anschrift/Telefon
- Bestätigt unser Notfall-Pass-Konzept aus veterinärmedizinischer Forschungsperspektive

## Block 2: Onboarding-Standards (App-Branche)
Quelle: digia.tech (03/2026), Airship, apiko
- Kürzeste Onboarding-Flows mit schnellem Weg zum ersten Wert haben die besten Aktivierungsraten
- Erste 3–7 Tage nach Download entscheiden über Abbruch oder Weiternutzung
- "Time-to-Value" ist die Kernmetrik; Aha-Moment so früh wie möglich
- Permission-Requests (Push etc.) zu früh = "silent killer" → Berechtigungen erst im Kontext anfragen
- Progressive Disclosure (schrittweise) schlägt Front-Loaded Setup (alles am Anfang)
- Value-First Onboarding: erst Nutzen zeigen, dann Registrierung verlangen

## Block 5: Retention-Benchmarks (Realitätscheck für "Dranbleiben")
Quelle: https://uxcam.com/blog/mobile-app-retention-benchmarks/ (Stand 21.04.2026; Basis: AppsFlyer State of App Marketing 2025, Adjust Mobile App Trends 2026, data.ai State of Mobile 2026, UXCam-Daten 37.000+ Apps)
- Day-30-Retention Median ALLER Kategorien: ~4%; typische App verliert 75% der Nutzer in den ersten 3 Tagen
- Health & Fitness: Day-1 Median 25% (stark: 35–45%), Day-7 Median 10%, Day-30 Median 5% (stark: 8–12%)
- Business of Apps: Health/Fitness Day-30 nur ~3% (2023)
- WICHTIGSTER PRÄDIKTOR: Day-1-Abschluss einer sinnvollen ersten Aktion → 2–3x höhere Day-30-Retention ("first-session activation")
- Produktivitäts-Apps halten am besten (Day-30 Median 8%, stark 12–18%), weil in Workflows eingewoben → Lehre: App muss Werkzeug- statt Entertainment-Charakter haben
- Adjust: Ø Day-30 ~7%; erste 3–7 Tage entscheidend
- KONSEQUENZ für uns: Utility-/Dokumentations-App wird NIEMALS täglich geöffnet → richtige Metrik ist nicht DAU, sondern "kommt der Nutzer bei Ereignissen zurück" (Tierarztbesuch, Erinnerung) + Zuverlässigkeit der Push-Erinnerungen. Ehrliches Nutzungsmodell: ereignisgetrieben, nicht gewohnheitsgetrieben.

## Block 4: Datenschutz-Erwartungen deutscher Nutzer
Quelle 1: Strato/Forsa-Studie (repräsentativ, ~1.000 Befragte je Land, 18–75 J., August 2025): https://netzpalaver.de/2026/01/08/deutschland-bleibt-skeptiker-in-puncto-cloud-speicher/
- Nur 66% der Deutschen nutzen Cloud-Speicher (NL/SE: je 80%) → Deutschland cloud-skeptisch
- 67% der deutschen Cloud-Nutzer haben datenschutzrechtliche Bedenken gegenüber außereuropäischen Diensten
- 73% legen Wert auf europäischen Serverstandort + DSGVO-Einhaltung
- 65% sagen: europäischer Serverstandort wichtiger als niedrigerer Preis eines Nicht-EU-Angebots
- 67% wünschen automatische Warnungen bei verdächtigen Zugriffen (KI-Sicherheitsfunktionen)
- 58% nutzen weiterhin externe Datenträger (konservatives Speicherverhalten)
Quelle 2: SOS-Recht-Zusammenfassung (31.10.2025): ~3/4 bevorzugen EU-only-Speicherung; >50% zahlungsbereit für EU-Server; Ältere (60+) besonders skeptisch ggü. Nicht-EU-Anbietern, Jüngere komfortorientiert, aber wachsendes Bewusstsein bei sensiblen Inhalten (Fotos, Dokumente)
- KONSEQUENZ: EU-Serverstandort + DSGVO-Transparenz + Offline-Verfügbarkeit + Export = Vertrauensfundament, kein "nice to have"; Zugriffsbenachrichtigungen ("Praxis X hat Ihre Freigabe geöffnet") entsprechen exakt dem 67%-Wunsch nach Zugriffs-Warnungen

## Block 6: Abo-Müdigkeit (Ergänzung zu früherer Recherche)
- Subscription Fatigue dokumentiert (Adapty, Paddle, HBS 2023: "companies need to tread carefully or risk alienating customers")
- Entwickler-Diskussionen (Reddit r/iOSProgramming): Einmalkauf-Option als Antwort auf Abo-Müdigkeit verbreitet diskutiert
- Frühere Belege aus Marktanalyse: mittleres Abo-Segment 5–10€ "tote Zone"; Barbell-Strategie (gratis+fair ODER Premium-Nische)
- petsXL-Negativbeispiel dokumentiert: Bezahlschranke auf eigene Tierakte = Beschwerde Nr. 1

## Block 3/5: Nutzungsauslöser und Compliance-Lücke (der eigentliche Nutzwert)
Quelle: FellAkte Research (Juni 2026, Kompilation aus 5 Fremdquellen – KEINE Eigenerhebung; zugrunde liegende Primärquellen sind aber solide und einzeln benannt):
- Gothaer/Forsa (März 2023, 3.074 Tierhalter, repräsentativ): nur 74% der Hundehalter und 63% der Katzenhalter nahmen Impftermin im letzten Jahr wahr; 15% der Hundehalter / 27% der Katzenhalter gehen seltener als 1x/Jahr zum Tierarzt; 6% der Katzenhalter nie
- Eschle et al. 2020 (veterinärmed. Studie, 1.315 Hunde): nur 47% der Hunde vollständig gemäß Empfehlung jährlich geimpft
- DA-Direkt-Studie (Sep 2023, ~1.000 Befragte): 13% der Hundehalter / 17% der Katzenhalter gehen nur bei Krankheit zum Tierarzt
- Genannte Ursachen: Zeitmangel, Kostenangst, ORGANISATORISCHE HÜRDEN (Impfpass verlegt, Terminfrist vergessen, keine Erinnerung) → exakt unser Anwendungsfall
- ACHTUNG: FellAkte nutzt diese Daten selbst als Marketing ("damit du zu den 74% gehörst") – wir zitieren die Primärquellen (Gothaer/Forsa, Eschle), nicht FellAkte

## Block 5: Wissenschaftliche Abandonment-Studie (Kidman et al. 2024, J Med Internet Res, Scoping Review, 18 Studien, 525.824 Teilnehmer)
Quelle: https://pmc.ncbi.nlm.nih.gov/articles/PMC11694054/ (peer-reviewed)
- Median 70% der Nutzer beenden Health-App-Nutzung innerhalb der ersten 100 Tage
- Industriedaten: 66% der Health-Apps binnen 90 Tagen aufgegeben (schlechter als 52%-Durchschnitt aller Kategorien)
- Kurvenverlauf: steiler Abfall direkt nach Installation, danach verlangsamt
- 22 Abandonment-Gründe in 6 Kategorien: (1) technische/funktionale Probleme, (2) Datenschutzbedenken, (3) schlechte UX, (4) Inhalte/Features, (5) Zeit-/Geldkosten, (6) veränderte Nutzerbedürfnisse/Ziele erreicht
- Faktoren für bessere Adhärenz (aus zitierten Reviews Jakob et al./Amagai et al. 2022): Benutzerfreundlichkeit, Personalisierung, ERINNERUNGEN, In-App-Support, (Gamification, finanzielle Anreize – für uns nur doktrinkonforme Elemente)
- WICHTIG für uns: Kategorien 1, 2, 3, 5 sind exakt unsere Querschnitts-Defizite; Kategorie 6 ("Ziel erreicht, brauche Tracking nicht mehr") betrifft uns WENIGER, weil eine Gesundheitsakte ein Langzeit-Archiv ist, kein Ziel-Tracker → ereignisgetriebenes Nutzungsmodell ist strukturell abandonment-resistenter, solange Erinnerungen zuverlässig sind

## Server-/Hosting-Recherche (Stand Juli 2026)
Quelle 1: Northflank-Analyse der Hetzner-Preiserhöhung (17.06.2026): Hetzner hat zum 15.06.2026 Cloud-Preise erhöht: CCX (dedizierte vCPU) 2,1–2,73x, CPX 2,4–2,75x; ABER CX/CAX (shared) nur 1,3–1,4x. Neue Preise DE: CX23 (2 vCPU/4GB) 5,49€, CX33 (4 vCPU/8GB) 8,49€, CX43 15,99€, CAX11 (Arm) 5,99€/Monat (exkl. MwSt./IPv4). Bestandsserver behalten alte Preise. Kritik aus Community (Reddit): keine Hot-Migrationen, für "serious production" umstritten – als Einzelmeinung werten.
Quelle 2: Opsio-Vergleich (03/2026): OVHcloud (FR) = größter EU-Anbieter, 20–40% unter AWS, keine Egress-Gebühren; Hetzner = günstigster (50–70% unter AWS); IONOS (DE) = Mittelweg mit deutschem Enterprise-Support, Managed Kubernetes, S3-kompatibler Storage; Open Telekom Cloud (T-Systems) = BSI-C5-Testat, Hyperscaler-Preise, für Compliance-lastige Workloads. Hyperscaler (AWS/Azure/GCP) überlegen bei Managed Services, aber US-CLOUD-Act-Problem trotz EU-Region.
Bewertung für unser Projekt: MVP-Backend ist klein (API + DB + Dateispeicher + Push). Shared-vCPU-Instanzen (CX/CAX) reichen für tausende Nutzer. Kosten Startphase: ~6–30€/Monat (Server) + Backups + S3-kompatibler Objektspeicher (Hetzner/IONOS). DSGVO: deutsche Anbieter strukturell im Vorteil (kein CLOUD Act); AVV nötig. Skalierungspfad: vertikal (größere Instanz) → horizontal (Load Balancer) erst weit jenseits MVP.
Wichtig: Entwicklungs-/Testphase braucht noch gar keinen gemieteten Server (lokale Umgebung/Sandbox genügt); Serverwahl wird erst zum Beta-Launch bindend.

## Notfall-Klinik-Szenario: Welche Dokumente bekommt der Halter garantiert?
Quelle GOT §7 Abs. 4 (Tierärztegebührenordnung 2022, gesetze-im-internet.de – GESETZ, höchste Belegqualität):
Die Rechnung MUSS mindestens enthalten: (1) Datum der Leistung, (2) Tierart, (3) DIAGNOSE oder Konsultationsgrund, (4) berechnete Leistungen mit GOT-Nummer, (5) Rechnungsbetrag, (6) USt. Arzneimittel/Material sind GESONDERT auszuweisen. Auf Verlangen ist die Rechnung weiter aufzugliedern.
→ Die Rechnung ist damit die einzige GESETZLICH GARANTIERTE strukturierte Datenquelle nach jedem Klinikbesuch: Datum + Diagnose + alle Untersuchungen (GOT-Ziffern) + abgegebene Medikamente. Perfekte Scan-Quelle.
GOT §4: Notdienst = 2-4facher Satz + 50€ Notdienstgebühr (Kontext, erklärt Kostenstress des Halters).
Quelle Tierklinik Oberhaching (TAMG/TÄHAV): Kliniken haben Dispensierrecht, geben Medikamente direkt ab (Etikett mit Dosierung), Dauermedikation erfordert regelmäßige Wiedervorstellung. Entlassungsbriefe/Befundberichte: üblich bei Kliniken (Merkblatt Tierklinik Hofheim), aber NICHT gesetzlich garantiert – oft nachgereicht per E-Mail an Halter/Haustierarzt. Laborbefunde teils als Ausdruck/PDF mitgegeben.
→ Datenquellen im Notfall-Szenario: 1. Rechnung (garantiert, strukturiert), 2. Medikamenten-Etikett auf Packung (Dosierungsanweisung), 3. Entlassungsbrief/Befund (üblich, oft später per Mail), 4. mündliche Anweisungen (flüchtig!).

## Mehrtier-/Mehrarten-Haushalt: tierartspezifische Fakten
Quelle StIKo Vet Impfleitlinie Kleintiere, 6. Auflage (Stand 06.01.2025, openagrar/FLI – offizielle Leitlinie): behandelt Hund, Katze, Frettchen, Kaninchen mit je eigenen Core-/Non-Core-Komponenten und eigenen Schemata. Frettchen tollwutempfänglich wie Hund/Katze.
- Hund Core: Staupe, Hepatitis, Parvo, Leptospirose (Lepto jährlich, SHP je nach Impfstoff 3 Jahre)
- Katze Core: RCP (Schnupfen/Seuche); Intervalle je nach Impfstoff/Haltung 1–3 Jahre
- Kaninchen Core: Myxomatose + RHD1/2; Nobivac Myxo-RHD Plus = jährlich; monovalente RHDV2-Impfstoffe 6–12 Monate je nach Produkt/Seuchenlage (Quellen: Thieme 2025, kaninchenwiese.de, Tierarztpraxen) → SEHR unterschiedliche Intervalle je Produkt!
- Entwurmung: Hund/Katze risikobasiert 1–12x/Jahr (ESCCAP-Schema, abhängig von Freigang/Rohfütterung); Kaninchen: keine Routine-Entwurmung wie bei Hund/Katze
→ Konsequenz App: Erinnerungslogik MUSS tierartspezifisch UND produktspezifisch sein; pauschale "jährliche Impfung" wäre sachlich falsch (Doktrin-Verstoß). Tierarten-Datenmodell: Art bestimmt Impfkatalog, Gewichtsbereich (Plausibilitätsprüfung!), typische Medikamente. Gefahr: Medikamenten-Verwechslung zwischen Tieren (z.B. Permethrin für Hunde ist für Katzen GIFTIG – bekanntes Risiko in Mehrartenhaushalten).
Zielgruppendaten (bereits belegt, IVH/ZZF): 13% der Haushalte halten mehrere Tierarten; 43% der Katzenhalter ≥2 Katzen.

## Medikamenten-Warnhinweise: offizielle Datenquellen (Recherche Juli 2026)
1. EMA Union Product Database (UPD), Verordnung (EU) 2019/6, seit 01/2022: enthält ALLE in EU/EWR zugelassenen Tierarzneimittel. Öffentlicher Zugang: (a) Veterinary Medicines Info Website https://medicines.health.europa.eu/veterinary (26 Sprachen, kostenlos, Produktinformationen inkl. Fachinfo/Packungsbeilage), (b) ÖFFENTLICHE API für nicht-vertrauliche Produktdaten (Registrierung per Guide EMA/362250/2023 nötig; read-only API explizit für Öffentlichkeit/Organisationen vorgesehen). → offizielle, maschinenlesbare Quelle existiert!
2. Struktur der Fachinformation (SPC) ist EU-weit standardisiert und nummeriert: 3.1 ZIELTIERART(EN); 3.3 Gegenanzeigen; 3.4 Besondere Warnhinweise; 3.6 Nebenwirkungen. Beispiel vetisearch: "Zieltierart: Rind" ist Pflichtfeld auf Packung UND in Fachinfo. → "Nicht für Tierart X" ist KEINE Interpretation, sondern zitierbare Pflichtangabe.
3. BVL = deutsche Zulassungsbehörde mit eigener TAM-Datenbank; vetisearch.de = deutsche Fachinfo-Suche (SPCs als Volltext).
4. Permethrin-Katze: SPCs von Permethrin-Spot-ons für Hunde enthalten Standard-Warnhinweis "Nicht bei Katzen anwenden" (Gegenanzeige, lebensgefährlich) – als bekanntester Anwendungsfall.
→ Konsequenz: Warnhinweis-Feature ist doktrinkonform machbar als ZITAT der amtlichen Produktinformation (Zieltierart + Gegenanzeigen + Warnhinweise), Quelle UPD/EMA. Kein eigenes medizinisches Urteil, nur Wiedergabe amtlicher Pflichtangaben mit Quellenlink. Voraussetzung: Produkt eindeutig identifiziert (Scan/Name); wenn nicht identifizierbar → keine Warnung, ehrlicher Hinweis "Produkt nicht in Datenbank gefunden".
