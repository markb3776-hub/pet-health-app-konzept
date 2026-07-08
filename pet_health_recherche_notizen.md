# Pet-Health-App: Recherche zu 4 Integrationsfragen des Nutzers

## Aufgabenstellung (Nutzerfragen, Juli 2026)
1. Wie sollen Praxisdaten (Tierarzt) mit Kundendaten synchronisiert werden?
2. Notfall: Stammtierarzt nicht verfügbar → Ausweichtierarzt → wieder Datenproblem. Wie lösen?
3. Tier ist gechipt; mehrere Chip-Registrierungs-Anbieter → Daten verarbeiten/speichern?
4. Chiptracking: ebenfalls mehrere Anbieter → wie integrieren?

Feedback muss nach MEMORIA-Doktrin belegt sein (Quellen, keine Behauptungen).

## Kontext aus vorheriger Analyse (bereits ausgeliefert)
- Empfehlung 3 der Marktanalyse: Digitaler Heimtier-Impfpass + Gesundheitsakte; Pet-Tech-Markt wächst 10,5–18 % p.a.; Defizit: bestehende Apps = Social/GPS statt Gesundheitsmanagement
- MEMORIA-Bauprinzipien und Produktions-Protokoll (P1–P7) liegen in /home/ubuntu/app_defizit_analyse/memoria_app_bauprinzipien.md
- Bericht: analysebericht_play_store_defizite.md; Belegprüfung: belegpruefung_protokoll.md

## Rechercheergebnisse (werden fortlaufend ergänzt)

### Block 1: Praxissoftware / Datensynchronisation (Frage 1)

**Praxissoftware-Landschaft DACH (medizinio.de, Stand 2026):**
- Marktführer: easyVET (VetZ, >114.000 Anwender weltweit), Vetera (>18.000 Anwender, 7 Vet-Unis), Provet Cloud (SaaS), IDEXX Animana (Cloud), Vetinf (On-Premise), dazu VetDream, inBehandlung, vetpraxis.de, vet@work (WDT)
- WICHTIG: Praxissoftware hat bereits "integrierte Chipnummer-Datenbanken (TASSO, FINDEFIX)" – direkte Abfrage zur Halteridentifikation ist Standard-Feature
- Regulatorik Praxisseite: GOT (Nov 2022), TÄHAV (ab 1.1.2025), VO (EU) 2019/6, BtMVV § 13, DSGVO/AVV Art. 28, EWR-Serverstandort
- eRezept-Veterinär der Bundestierärztekammer (BTK) derzeit im Rollout
- Schnittstellen heute v. a. zu Laboren (IDEXX VetConnect PLUS, Scil, Heska), DICOM-Bildgebung – NICHT primär zu Tierhalter-Apps
- Quelle: https://medizinio.de/software/praxis/tierarzt

**Integrations-Realität (viggo.vet, Jan 2026):**
- PIMS = System of Record; nur 4–5 % der Praxen wechseln PIMS pro Jahr (USA: 1.200–1.500 von ~30.000)
- API-Zugang bei Cloud-PIMS erfordert Vendor-Partnerschaft; Vendors haben "large queue" an Integrationsanfragen → langsame Prozesse
- Read-only vs. Read-write entscheidend: ohne Write-back nur 10–15 % Zeitersparnis statt 40 %
- 15 % der Tierhalter nutzen bereits KI zur Einschätzung von Tiergesundheit (CATalyst); 50 % Suchmaschinen
- Neuere PIMS-Anbieter positionieren offene APIs als Differenzierung (z. B. Shepherd, Provet Cloud, Digitail)
- Quelle: https://viggo.vet/blog/the-integration-imperative-...

**Konsequenz für unsere App (These):** Direkte bidirektionale PIMS-Integration mit allen deutschen Anbietern ist kurzfristig NICHT realistisch (geschlossene Legacy-Systeme, Vendor-Warteschlangen). Realistischer Weg: halter-zentrierte Akte (Halter = Dateneigentümer nach DSGVO Art. 15/20 – Auskunfts-/Datenübertragbarkeitsrecht!), Dokumenten-Import (PDF/Foto + OCR/KI-Strukturierung), E-Mail-Weiterleitung von Befunden, Freigabe-Link für Tierärzte. PIMS-API-Partnerschaften als Phase 2.

### Block 2: Chip-Registrierung (Frage 3)

**Technik-Grundlagen (Tierheim Hannover, 2026, mit Fachquellen):**
- Chip = passiver Transponder, ISO 11784/11785, FDX-B, 134,2 kHz, 15-stellige weltweit eindeutige Nummer. KEINE Batterie, KEIN GPS, sendet nichts aktiv → Chip kann NICHT getrackt werden (wichtig für Frage 4: "Chiptracking" existiert technisch nicht; Tracking = separate GPS-Geräte)
- Chip-Nummer steht im EU-Heimtierausweis (VO (EU) 576/2013); Ausweis nur gültig mit Chip
- Registrierungslandschaft Deutschland: TASSO e.V. (größtes Register Europas, >11 Mio. Tiere, 7,5 Mio. Halter, 24h-Notruf, kostenlos), FINDEFIX (Deutscher Tierschutzbund, kostenlos), IFTA (tierregistrierung.de), dazu staatliche Register je Bundesland (z. B. Hunderegister Niedersachsen/GovConnect, § 6 NHundG, gebührenpflichtig 14,50 €)
- Mehrere Anbieter parallel möglich und üblich; Registrierung bei TASSO UND Findefix zulässig
- Europäischer Verbund: Europetnet (26 Länder, Meta-Suche über Mitgliedsdatenbanken); PETMAXX (Datamars): internationale Meta-Suche über 30+ Datenbanken
- Halter-Pflichten: Aktualisierung bei Umzug/Halterwechsel; die Datenhaltung liegt bei den Registern, DSGVO-konform, zweckgebunden
- Quellen: https://tierheim-hannover.de/ratgeber/chippen-und-registrierung/ ; https://europetnet.org/ ; https://www.petmaxx.com/

**Konsequenz für App (These):** Die App muss die Chipnummer NICHT selbst „verarbeiten/registrieren“ – Registrierung bleibt bei TASSO/FINDEFIX/staatlichen Registern. Sinnvolle App-Rolle: (a) Chipnummer als Stammdatum in der Tierakte speichern (mit Scan/Foto vom Heimtierausweis), (b) Registrierungs-Checkliste („Ist dein Tier bei TASSO/Findefix/Landesregister registriert?“ mit Deep-Links), (c) Erinnerung bei Umzug, Kontaktdaten in Registern zu aktualisieren, (d) im Fundfall Anleitung + Links zu Europetnet/PETMAXX-Suche. Öffentliche Schreib-APIs der Register existieren nicht öffentlich dokumentiert → keine Fake-Integration versprechen (Doktrin!).

### Block 3: GPS-Tracking (Frage 4)

- Markt DACH: Tractive (Marktführer, Österreich, Abo 5–13 €/Monat, KI-Gesundheitseinblicke), Fressnapf-Tracker (ohne Abo, ~37–50 €), Weenect (~10 €/Monat), Telekom (~5 €/Monat), Fi (USA)
- Tractive: KEINE offizielle öffentliche API; es existieren inoffizielle REST-API-Wrapper (GitHub: dominique-boerner/unofficial-tractive-rest-api) und eine Home-Assistant-Integration (community-gepflegt). Tractive-Blog (März 2026): keine offiziellen Drittanbieter-Integrationen (Alexa/Google/Siri)
- Fressnapf/Weenect/Telekom: ebenfalls keine öffentlich dokumentierten Partner-APIs bekannt
- Konsequenz (These): GPS-Tracking-Integration ist NICHT MVP-fähig ohne offizielle Partner-APIs; inoffizielle APIs sind instabil und rechtlich riskant (ToS-Verstoß). Ehrliche Option: Tracking bewusst NICHT integrieren (Abgrenzung: wir sind Gesundheitsakte, nicht Ortung) ODER Phase-3-Partnerschaftsgespräche. Deckt sich mit Marktanalyse: bestehende Apps sind ortungs-/social-lastig, Gesundheitsmanagement ist die Lücke.
- Quellen: https://tractive.com/blog/en/tech/do-pet-trackers-integrate-with-smart-home-devices ; https://github.com/dominique-boerner/unofficial-tractive-rest-api ; https://www.home-assistant.io/integrations/tractive/ ; https://www.stern.de/digital/tests/hund-und-katze-orten-ohne-teures-abo--fressnapf-tracker-im-test-33850404.html

### Block 4: Notfall / Ausweichtierarzt (Frage 2)

**Bestätigung des Problems durch Fachquelle (Barmenia-Gothaer-Ratgeber Tiernotdienst):**
> "Derartige Unterlagen [Diagnosen, Medikamente, Laborbefunde, kürzliche Behandlungen/OPs] können im Notdienst meist nur schwer oder gar nicht angefordert werden. Etwa, wenn der Haustierarzt beziehungsweise die Haustierärztin nicht erreichbar ist. Umso mehr helfen den behandelnden Tierärzten [...] Informationen zum Gesundheitszustand des betroffenen Tieres, wenn diese durch die Besitzer*innen vorgelegt werden."
→ Das vom Nutzer beschriebene Problem ist real und dokumentiert. Die Lösung, die die Fachwelt selbst empfiehlt: HALTER hält die Unterlagen bereit. Genau das ist die App-Rolle: Notfallprofil + vollständige mitführbare Akte.
- Notdienst-Kontext: wenige Praxen/Kliniken im Notdienst, 4-facher GOT-Satz nur im Notdienst zulässig; AniCura: >225 Kliniken, >2 Mio. Patienten/Jahr; Telemedizin-Dienste existieren (Pfotendoctor, haustierdocs.de - 24/7 Video)
- Quelle: https://www.barmeniagothaer.de/magazin/tiere-freizeit/hund/tierarzt-notdienst/

**Rechtsgrundlage Datenzugriff (Dr. Datenschutz, Juli 2026):**
- Art. 20 DSGVO (Datenübertragbarkeit): Halterdaten beim Tierarzt sind personenbezogene Daten des Halters (Tier = Sache, Daten laufen über Halter); Anspruch auf interoperables Format (XML/JSON/CSV; PDF genügt regelmäßig NICHT), unentgeltlich, Frist max. 1 Monat
- Grenzen: nur bei Verarbeitung auf Basis Vertrag/Einwilligung; vom Verantwortlichen selbst erschaffene Daten (z. B. Diagnose-Bewertungen) nicht zwingend erfasst → Auskunftsrecht Art. 15 DSGVO ergänzend
- Praxisrealität: Kompatibilität fehlt oft, Übertragung stockt → 1-Monats-Frist macht Art. 20 für NOTFÄLLE unbrauchbar; taugt nur für geplanten Aktenaufbau
- WICHTIG/EHRLICH: Anwendbarkeit von Art. 20 im (Human-)Arzt-Patient-Verhältnis ist umstritten (KVWL verneint für Humanmedizin, da Verarbeitung auf rechtl. Verpflichtung beruht); beim Tierarzt ist Grundlage der Behandlungsvertrag → Art. 20 eher anwendbar als in Humanmedizin, aber nicht höchstrichterlich geklärt → im Feedback als offene Rechtsfrage kennzeichnen (Doktrin: Ungeklärtes kennzeichnen)
- Zivilrechtlich: Anspruch auf Einsicht/Kopie der Behandlungsdokumentation gegen Kostenerstattung (§ 630g BGB analog für Tiermedizin diskutiert; tierärztl. Berufsordnungen sehen Dokumentationspflichten vor)
- Quelle: https://www.dr-datenschutz.de/datenuebertragbarkeit-das-betroffenenrecht-in-der-praxis/

**Wettbewerber-Referenz (USA):** VitusVet, Vetster: Halter-Apps mit Medical-Records-Sharing existieren im US-Markt; in DACH keine dominante Lösung → bestätigt Marktlücke.

### Block 5: Wie lesen Praxen aktuell Daten ein? Vorhandene Hardware (Nutzerfrage Juli 2026)

**Dateneingangskanäle einer typischen Tierarztpraxis (belegt):**
1. Manuelle Eingabe in PIMS (Tastatur) – Hauptkanal; laut Branchengesprächen verlieren Praxen 5–10 h/Woche durch manuelle Dateneingabe (Adam Wysocki, LinkedIn, 100 Interviews mit Praxen)
2. Dokumentenscanner + Dokumentenmanagement (z. B. vet7: "Abfotografieren oder scannen"; mediDOK: Papierdokumente via QR-Code ins Archiv)
3. Laborgeräte-Schnittstellen: IDEXX VetConnect PLUS, Scil, Heska – automatischer Befundimport (bidirektional)
4. DICOM (Röntgen/Ultraschall/MRT)
5. Chip-Lesegeräte: RFID-Handscanner 134,2 kHz ISO 11784/85 – Standardausstattung, liest NUR die 15-stellige Chipnummer
6. Online-Formulare/Anamnesebögen vom Halter (petflare: "Halter füllen vorab aus, Daten landen strukturiert in der Tierakte, spart 10 Min/Termin")

**Vorhandene Hardware, die App-Daten lesen könnte:**
- JEDE Praxis hat PC/Browser → Freigabe-Link funktioniert universell
- Smartphones/Tablets im Praxisteam → QR-Code scannen mit Bordmitteln (Kamera-App); KEINE Spezialhardware nötig
- Chip-Lesegeräte können KEINE App-Daten lesen (nur 134,2-kHz-RFID-Transponder im Tier)
- Barcode-/QR-Scanner: teils an Rezeption für Warenwirtschaft vorhanden; Standard-2D-Scanner liest QR → URL

**WICHTIGE WETTBEWERBER-ERKENNTNISSE (bestätigen QR/Link-Ansatz als etablierten Praxis-Workflow):**
- petsXL (VetZ GmbH = easyVET-Hersteller, Tochter von Mars Inc.!): Halter-App mit digitaler Behandlungsakte, Online-Termin, digitale Patientenaufnahme, Check-in per QR-Code in der Praxis, Gesundheitspass (Blutgruppe/Allergien/OPs) "selbst im Notfall". Nutzer-Review bestätigt: Klinik-Überweisung ohne Zettel "die hatten einfach solch einen Handycode und schon hatte die Klinik meine Daten". ABER: funktioniert nur mit petsXL-Partnerpraxen (easyVET-Ökosystem). Quelle: https://www.petsxl.com/
- Petleo (petleo.app): Digitaler Heimtierausweis; Tierarzt validiert Impfpass via Petleo Connect (Integration mit Vetera); nach Verifizierung QR-Code im Tierprofil, den Tierarzt/Pension scannen kann → Impfstatus. Impfgültigkeit nach StiKoVet. Quelle: Petleo Onboarding-PDF (hubspot)
- vetpraxis.de "MeineTiere.app": Praxis teilt Gewicht/Diagnosen/Labor/Bilder mit Halter; Tagebuch-Daten des Halters können AN DIE PRAXIS geschickt werden; Web-App ohne Installation; Kosten für Praxis: 15 Cent/aktiver Nutzer/Monat. Quelle: https://www.vetpraxis.de/funktionen/tierhalter-app
- vetevo: unabhängige Halter-App (digitaler Impfpass, Tagebuch) ohne Praxisbindung

**Strategische Bedeutung:** Der Markt bewegt sich auf PIMS-gebundene Halter-Apps zu (petsXL nur easyVET-Praxen, MeineTiere.app nur vetpraxis-Praxen, Petleo mit Vetera). Lücke: PIMS-UNABHÄNGIGE Halter-Akte, die mit JEDER Praxis funktioniert (Browser/QR reicht als Hardware). Konzern-Hinweis: petsXL/VetZ gehört Mars Inc. (auch AniCura-Kliniken gehören Mars) → Unabhängigkeit als Differenzierung.

### Block 6: Welche Daten brauchen Praxen konkret? (Nutzerfrage)

**Fachliche Struktur der Anamnese (DocCheck Flexikon, Veterinärmedizin; Lit.: Baumgartner, Klinische Propädeutik, 8. Aufl.):**
- Signalement (Basisdaten): Tierart, Rasse, Geschlecht, Geburtsdatum/Alter, Kastrationsstatus → rasse-/altersabhängige Prädispositionen
- Allgemeine Anamnese: Was/wann/wie begonnen + Verlauf; Begleitsymptome; Herkunft des Tieres (Züchter/Ausland); Impfstatus (letzte Auffrischung, welche Impfungen); Entwurmung (wie oft, Produkte); Haltung; Fütterung/Wasser; Vorerkrankungen; Vorbehandlungen
- Spezielle Anamnese: organbezogen, situativ vom Tierarzt erfragt (NICHT vorab durch App abbildbar → ehrlich abgrenzen)

**Real existierender Klinik-Fragebogen (AniCura Thun, Pflichtfelder mit \*):**
Halterkontakt; Tiername/-art/Geschlecht/Geburtsdatum/Rasse/kastriert; Hauptproblem + seit wann; Allgemeinsymptome (Erbrechen/Durchfall/Niesen/Husten je Häufigkeit/Dauer); Vorbehandlung woanders (Untersuchungen, Medikamente wann/wie lange); Futter-/Wasseraufnahme, Kot-/Harnabsatz (normal/gesteigert/vermindert); Gewichtsverlust; Dauermedikation (Name, seit wann, Dosierung, Frequenz); Vorerkrankungen; letzte Läufigkeit; Auslandsaufenthalt; Tierpension; Haltung drinnen/draußen %; Fütterung (trocken/feucht, Futtername, Futterwechsel); Prophylaxe: letzte Impfung + welche, Entwurmung wann + Produkt, Ektoparasiten-Prophylaxe wann + Produkt

**AGILA (tierärztlich geprüft):** Bestätigt gleiche Kategorien + Tipp an Halter: Medikamentenverpackung mitbringen, konkrete Mengenangaben statt vager Aussagen, Symptom-Verlauf notieren („Tiergesundheitskalender") → genau die Rolle unserer App
- Quellen: https://flexikon.doccheck.com/de/Anamnese_(Veterinärmedizin) ; AniCura-Anamnesebogen PDF; https://www.agila.de/tiergesundheit/fragen-zum-tierarztbesuch/3188-anamnese-fuer-hund-und-katze-vorbericht-fuer-tiere

**Ableitung Datenkatalog der App (2 Klassen):**
A) STAMMDATEN (einmalig erfassen, selten ändern): Signalement, Chipnummer, Versicherung, Vorerkrankungen, Allergien, Dauermedikation, Halterkontakt, Stammtierarzt
B) VERLAUFSDATEN (laufend, Automatisierung nötig): Impfungen, Entwurmung/Prophylaxe, Medikationsänderungen, Gewicht, Symptome/Ereignisse, Befunde/Rechnungen, Futter

### Block 7: Automatisierte Datenerfassung mit minimalem Nutzeraufwand (Nutzerfrage)

**Wettbewerber-Benchmark (bestätigen Machbarkeit der KI-Erfassung):**
- Tier-Akte (tier-akte.de, DE, neu 2026): "Impfpass in 30 Sekunden" – Foto vom gelben EU-Impfpass, KI erkennt Impfstoff/Datum/Charge, Nutzer bestätigt Vorschläge ("nichts ohne deine Freigabe"); auch Tierarztrechnungen per KI; local-first, kein Konto nötig; Free = 1 Tier, Pro = 15 Scans/Monat, Premium unbegrenzt. Zusätzlich: Notfallpass, QR-/Lese-Link-Teilen, PDF-Export
- FellAkte (fellakte.de, DE, ~200 Nutzer): KI-Scan Impfpass/Arztbrief (Termine, Diagnosen, Medikamente automatisch); KI-Chat-Assistentin "Feli" (natürliche Spracheingabe: "Kalle wiegt heute 5,4 kg" → Eintrag); proaktive Hinweise (Impfung überfällig, Gewicht +12 %); Gesundheitsscore; Familien-Sync; NFC-SmartTag (Hardware); Free 5 Scans/Monat, Pro 2,49 €, Premium 4,99 €, Lifetime 179 €; deren Marktdaten: 53 % der Hunde in DE nicht vollständig geimpft (Eschle et al. 2020), 64 % verpasster Termine durch Vergessen (Univ. Lübeck), 120.000+ verlorene Tiere/Jahr (TASSO 2025) – Zahlen von Anbieterseite, nicht unabhängig verifiziert
- Digitaler Impfpass AT: Erinnerung nach österr. Impfplan; vetevo: Impfpass + Erinnerungen

**Technische Machbarkeit KI-Extraktion (arXiv 2511.05547, Khanchandani et al. 2025):**
- Klassisches OCR: ~95 % Zeichengenauigkeit nur bei hochwertigen Scans; bricht ein bei Handschrift, schlechten Fotos, komplexen Layouts → Impfpässe sind oft HANDSCHRIFTLICH + Aufkleber → reines OCR reicht nicht
- Stand der Technik: Hybrid OCR + multimodale LLMs; LLM-NER erreicht "human-like accuracy", erkennt und korrigiert OCR-Fehler kontextuell; Best Practice: human-in-the-loop-Validierung (Nutzer bestätigt Vorschläge) → genau das Muster von Tier-Akte
- Konsequenz: KI-Scan mit Bestätigungsschritt ist ehrlich machbar; 100 % vollautomatisch ohne Prüfung wäre unehrlich (Doktrin: Nutzer-Freigabe als Wahrheits-Gate)

**Aufwandsarme Erfassungswege (Ranking nach Nutzeraufwand):**
1. Foto/Scan + KI-Extraktion + 1-Tap-Bestätigung (Impfpass, Rechnung, Befund) – Kernweg
2. Natürliche Eingabe via Chat/Sprache ("heute entwurmt mit Milbemax") → strukturierter Eintrag
3. Automatische Folgerungen: aus 1 Impfeintrag → Fälligkeitsplan nach StiKoVet + Push-Erinnerungen; aus Rechnung → Kostenübersicht + Gewicht (steht oft auf Rechnung)
4. E-Mail-Weiterleitung von Praxis-Rechnungen/Befunden an persönliche App-Adresse (Rechnungen kommen zunehmend per Mail)
5. Einmalige Stammdaten beim Onboarding (Signalement, Chipnummer via Foto Heimtierausweis)
6. Termin-/Kalender-Integration für bevorstehende TA-Termine
→ Ziel-Metrik: <1 Minute Aufwand pro Tierarztbesuch, sonst Abbruch (Beschwerdedaten zeigen: Pflegeaufwand = Haupt-Churn-Grund bei Tracking-Apps)

**WICHTIG - Marktbeobachtung:** Nische füllt sich gerade (Tier-Akte + FellAkte beide DE, beide neu, beide KI-Scan). Differenzierungsbedarf: Notfall-QR für PRAXEN (nicht nur Finder), PIMS-unabhängige Vollakte, Doktrin-Werte (ehrliche Preise, kein KI-Slop, erreichbarer Support). FellAkte-Symptom-Check mit KI-"Diagnose"-Empfehlungen ist doktrin-kritisch (ungeprüfte Gesundheitsratschläge) – wir würden das NICHT so bauen (nur Dokumentation + Notfall-Checkliste nach Fachquellen).
