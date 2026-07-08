# Pet-Health-App — Konzeptphase (Projekt MEMORIA)

**Status: Projekt auf Eis gelegt (08.07.2026)** — dieses Repository sichert alle Arbeitsergebnisse der Konzeptphase. Es wurde noch nichts entwickelt; alle Inhalte sind Konzept-, Recherche- und Analysedokumente.

## Projektdoktrin (Kurzfassung)

Wahrheit vor Bequemlichkeit. Belegpflicht für alle Aussagen. Dreistufen-Kennzeichnung aller Erkenntnisse: **verifiziert** / **plausibel, ungetestet** / **offen**. Kein Feature wird versprochen, das nicht nachweislich funktioniert. Der Nutzer behält immer die Kontrolle über seine Daten.

## Zentrale Grundsatzentscheidungen

1. **KI-Dokumentenscan nur auf eigenen Servern in Deutschland** (Selbst-Hosting, kein Datenversand an Dritte). Externe KI-APIs — auch EU-Anbieter wie Mistral — wurden geprüft und verworfen (Subunternehmer-Ketten widersprechen dem Vertrauensversprechen).
2. **Zwei-Umgebungen-Strategie**: Kellerserver zuhause für Entwicklung/Tests (nur Testdaten, VPN-only), zertifiziertes deutsches Rechenzentrum für den Betrieb mit echten Nutzerdaten.
3. **Manuelle Eingabe als immer funktionierender Kern**; der KI-Scan ist optionale Komfortfunktion und kommt erst, wenn er auf eigener Infrastruktur läuft.
4. **Medikamenten-Warnhinweise**: Aktualität durch Quellenanbindung (EMA/UPD) statt Eigenpflege; sichtbarer Datenstand-Zeitstempel; niemals selbst gepflegte Medikamentenlisten.

## Dokumentenübersicht

### Kernberichte
| Datei | Inhalt |
| --- | --- |
| `blindspot_bericht.md` | Finaler Blindspot-Bericht: alle 21 identifizierten Lücken mit Dreistufen-Kennzeichnung (3 verifiziert, 6 plausibel, 12 offen) |
| `blindspot_lueckenliste.md` | Rohliste der 21 identifizierten Lücken |
| `blindspot_recherche_notizen.md` | Recherche-Rohnotizen mit Quellen (EU AI Act, DSGVO/KI-Anbieter, Play Store, BFSG, Versicherer, UPD) |
| `infrastruktur_und_kellerserver_konzept.md` | Infrastruktur-Grundsatzentscheidung + komplette Kellerserver-Blaupause (Hardware/Software) |
| `upd_livetest_ergebnisse.md` | Live-Test der EMA/UPD-Datenbank (Bravecto): Portal frei zugänglich, PDF-Download Captcha-geschützt |

### Konzeptdokumente
| Datei | Inhalt |
| --- | --- |
| `app_struktur_konzept.md` | Gesamtstruktur der App |
| `nutzerkonzept_pet_health.md` | Nutzer- und Zielgruppenkonzept |
| `mehrtier_konzept.md` | Mehrtier-Haushalte |
| `tierarten_abdeckungskonzept.md` | Abdeckung verschiedener Tierarten |
| `berechtigungs_konzept.md` | Berechtigungen und Datenzugriff |
| `notfallpass_design_spezifikation.md` | Notfallpass-Spezifikation |
| `notfall_szenario_datenrueckfluss.md` | Notfall-Szenarien und Datenfluss |
| `vertrauens_und_erlebnis_konzept.md` | Vertrauens- und Nutzererlebnis-Konzept |
| `praxis_workflow_konzept.md` | Tierarztpraxis-Workflow |
| `praxissuche_konzept.md` | Praxissuche-Funktion |
| `pet_health_datenkatalog_erfassung.md` | Datenkatalog der Erfassung |
| `pet_health_hardware_dateneingang.md` | Hardware-Datenquellen |
| `memoria_app_bauprinzipien.md` | Bauprinzipien nach MEMORIA-Doktrin |

### Analysen & Recherchen
| Datei | Inhalt |
| --- | --- |
| `analysebericht_play_store_defizite.md` | Wettbewerber-Defizitanalyse (Play Store) |
| `pet_health_wettbewerbsanalyse.md` | Wettbewerbsanalyse |
| `wettbewerber_apps_notizen.md` | Rohnotizen Wettbewerber-Apps |
| `bewertungsmatrix.md` | Bewertungsmatrix der Wettbewerber |
| `heimtier_landschaft_deutschland.md` | Heimtier-Markt Deutschland |
| `praxis_datenuebernahme_bewertung.md` | Bewertung Praxis-Datenübernahme |
| `pet_health_architektur_feedback.md` | Architektur-Feedback |
| `belegpruefung_protokoll.md` | Belegprüfungs-Protokoll |
| `praxis_workflow_pruefprotokoll.md` | Prüfprotokoll Praxis-Workflow |
| Übrige `*_notizen.md` | Recherche-Rohnotizen zu den jeweiligen Themen |

### Mockups (`mockups/`)
Drei UI-Mockups als HTML + PNG: Startbildschirm, Tierakte, Notfallpass — mit Beispiel-Platzhalterdaten, plus `design_grundlagen.md`.

### Technische Machbarkeitstests (`workflow_test/`)
Kleiner Funktionstest: Notfallpass-PDF- und QR-Code-Generierung (Python-Skripte + Ergebnisdateien).

### Referenzmaterial
`bravecto_combiuno_produktinfo_en.pdf` — Beispiel-Produktinformation aus der UPD (Referenz für den Live-Test).

## Nächste Schritte bei Reaktivierung

Siehe offene Punkte im `blindspot_bericht.md`, insbesondere: Selbst-Hosting-Recherche (OCR-Modell, GPU-Bedarf, Lizenz), Namensfindung/Markenprüfung, UPD-API-Zugang für Drittanbieter, Anwalt (AGB/Datenschutz) und Steuerberater (Rechtsform).
