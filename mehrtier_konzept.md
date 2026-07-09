# Konzept: Mehrere Tiere aus unterschiedlichen Tierarten

**Ausgangslage (belegt):** 13 Prozent der deutschen Tierhalter-Haushalte halten mehrere Tierarten parallel, 43 Prozent der Katzenhalter besitzen zwei oder mehr Katzen [1]. Der Mehrtier-Haushalt ist also kein Randfall, sondern ein Kernszenario – und zugleich der Punkt, an dem viele Wettbewerber-Apps unpraktisch werden.

## 1. Das Datenmodell: Die Tierart steuert alles

Jedes Tier bekommt eine eigene, vollständige Akte unter einem gemeinsamen Halter-Konto. Entscheidend ist: **Die Tierart ist nicht nur ein Anzeigefeld, sondern steuert die Fachlogik der App.** Denn die Vorsorge-Anforderungen unterscheiden sich fundamental – das belegt die offizielle Impfleitlinie der StIKo Vet (6. Auflage, Januar 2025), die für Hund, Katze, Frettchen und Kaninchen jeweils eigene Core-Impfkomponenten und eigene Schemata definiert [2]:

| Bereich | Hund | Katze | Kaninchen |
| :--- | :--- | :--- | :--- |
| Core-Impfungen | Staupe, Hepatitis, Parvovirose, Leptospirose | Katzenschnupfen, Katzenseuche (RCP) | Myxomatose, RHD-1/RHD-2 |
| Typische Intervalle | Leptospirose jährlich, SHP je nach Impfstoff bis 3 Jahre | 1–3 Jahre je nach Impfstoff und Haltung | Je nach Produkt 6–12 Monate [3] |
| Entwurmung | Risikobasiert 1–12x/Jahr (ESCCAP-Schema) | Risikobasiert, Freigang entscheidend | Keine Routine-Entwurmung |

Eine pauschale "jährliche Impferinnerung" für alle Tiere wäre also sachlich falsch – beim Kaninchen hängt das korrekte Intervall sogar vom konkreten Impfstoff-Produkt ab (Nobivac Myxo-RHD Plus: jährlich; monovalente RHDV-2-Impfstoffe: teils 6 Monate) [3]. Nach Doktrin gilt daher: Die Erinnerungslogik arbeitet tierart- und produktspezifisch. Erkennt der KI-Scan das Impfstoff-Produkt, schlägt die App das dazu passende, belegte Intervall vor; ist das Produkt nicht erkennbar, fragt sie den Halter nach der Tierarzt-Angabe, statt ein Intervall zu erfinden.

## 2. Bedienkonzept: Ein Haushalt, klare Trennung, kein Chaos

Die Startansicht zeigt alle Tiere als Karten mit Foto, Name und Status-Hinweis ("Impfung fällig in 14 Tagen"). Jede Erfassung, jede Erinnerung und jede Freigabe ist immer eindeutig einem Tier zugeordnet. Drei Design-Regeln verhindern das im Alltag größte Problem – die Verwechslung:

**Regel 1 – Jede Push-Nachricht nennt Name UND Tierart:** "Balou (Hund): 1/2 Tablette Medikament C" statt "Medikamentenerinnerung". Bei mehreren gleichzeitigen Erinnerungen werden sie als Liste gruppiert, nicht als identisch aussehende Einzelnachrichten.

**Regel 2 – Der Dokumenten-Scan ordnet selbst zu, der Halter bestätigt:** Steht auf der Rechnung "Katze, Luna", schlägt die App die Zuordnung zur Akte von Luna vor. Bei Sammelrechnungen über mehrere Tiere (in Mehrtier-Haushalten üblich, da oft alle Tiere gemeinsam zum Termin gebracht werden) splittet die KI die Positionen als Vorschlag pro Tier auf – der Halter bestätigt jede Zuordnung einzeln. Ist die Zuordnung unklar, fragt die App nach, statt zu raten.

**Regel 3 – Tierartspezifische Plausibilitätsprüfung:** Die Tierart definiert erwartbare Gewichtsbereiche und Impfkataloge. Wird versehentlich der 28-kg-Eintrag des Hundes in der Akte der Katze bestätigt, warnt die App. Ebenso, wenn eine Hunde-Impfung (z. B. Leptospirose) in einer Katzen-Akte landet.

## 3. Sicherheitsaspekt: Medikamenten-Warnhinweise zwischen Tierarten (amtlich belegt)

In Mehrarten-Haushalten existiert ein reales, dokumentiertes Risiko: Präparate, die für eine Tierart harmlos sind, können für eine andere giftig sein – das bekannteste Beispiel ist Permethrin in Hunde-Spot-ons, das für Katzen hochgiftig ist und dessen amtliche Produktinformation die Gegenanzeige "Nicht bei Katzen anwenden" enthält.

**Die belegte Lösung: Wiedergabe amtlicher Pflichtangaben statt eigener KI-Urteile.** Seit 2022 existiert die **Union Product Database (UPD)** der Europäischen Arzneimittelagentur (EMA), die per EU-Verordnung 2019/6 alle in der EU zugelassenen Tierarzneimittel enthält [4]. Der öffentliche Zugang erfolgt über die Veterinary-Medicines-Website (26 Sprachen, kostenlos) und – entscheidend für uns – über eine **öffentlich registrierbare, maschinenlesbare API** für nicht-vertrauliche Produktdaten [4]. Die Produktinformationen sind EU-weit standardisiert: Abschnitt 3.1 nennt die **Zieltierart(en)**, Abschnitt 3.3 die **Gegenanzeigen**, Abschnitt 3.4 die **besonderen Warnhinweise** – exakt die Angaben, die auch auf der Medikamentenschachtel stehen [5].

So funktioniert das Feature: Wird "Medikament C" in der Akte von Hund Benno erfasst und das Produkt eindeutig identifiziert (per Scan oder Namenseingabe), gleicht die App die Zieltierarten und Gegenanzeigen aus der amtlichen Datenbank mit den Tierarten im Haushalt ab. Leben im Haushalt auch Katze Luna und ein Kaninchen, zeigt die App den amtlichen Hinweis an – als wörtliches Zitat mit Quellenangabe: "Laut amtlicher Produktinformation: Zieltierart Hund. Gegenanzeige: Nicht bei Katzen anwenden." Das ist kein medizinischer Ratschlag der App, sondern die Wiedergabe derselben Pflichtangabe, die auf der Packung steht – nur zum richtigen Zeitpunkt am richtigen Ort sichtbar gemacht.

Die Doktrin-Grenzen bleiben dabei strikt: Kann das Produkt nicht eindeutig identifiziert werden, erscheint keine geratene Warnung, sondern der ehrliche Hinweis "Produkt nicht in der Arzneimittel-Datenbank gefunden". Die App erfindet keine Risikobewertungen, sie zitiert ausschließlich die Zulassungsdaten. Und sie ersetzt nie das Etikett oder den Tierarzt – das steht als fester Hinweis bei jeder Warnung.

## 4. Mehrtier und Monetarisierung

Gemäß Barbell-Prinzip und dem Grundsatz "keine Paywall auf eigene Daten": Die Grundakte bleibt kostenlos – vorgesehen ist ein Tier im Free-Tier, die Verwaltung mehrerer Tiere gehört zu den fairen Premium-Merkmalen (Einmalkauf oder Jahresabo), da Mehrtier-Haushalte messbar mehr Speicher- und KI-Scan-Kosten verursachen. Wichtig: Auch im Free-Tier bleiben Export und Notfall-Pass für das angelegte Tier uneingeschränkt – und ein Downgrade sperrt niemals den Lesezugriff oder Export bereits angelegter Tierakten. Daten bleiben immer zugänglich, nur das Anlegen weiterer Tiere ist Premium.

## 5. Ehrlichkeits-Kennzeichnung

| Aussage | Status |
| :--- | :--- |
| Tierartspezifische Impfschemata (Hund/Katze/Kaninchen/Frettchen) | **Belegt** (StIKo Vet Impfleitlinie, 6. Aufl. 2025) [2] |
| Kaninchen-Impfintervalle produktabhängig 6–12 Monate | **Belegt** (Thieme-Fachbeitrag 2025, Praxisquellen) [3] |
| Mehrarten-Haushalte 13 %, Mehrkatzen 43 % | **Belegt** (IVH/ZZF-Strukturdaten) [1] |
| KI-Zuordnung von Sammelrechnungen auf mehrere Tiere | **Plausibel, testpflichtig** mit realen Sammelrechnungen |
| Amtliche Warnhinweise (Zieltierart/Gegenanzeigen) aus EU-Datenbank anzeigbar | **Belegt** – UPD/EMA mit öffentlicher API existiert [4]; die konkrete Produkt-Erkennungsrate ist **testpflichtig** |

## Quellen

[1] IVH/ZZF: Der Deutsche Heimtiermarkt 2025 (Strukturdaten): https://www.ivh-online.de/der-verband/daten-fakten/der-deutsche-heimtiermarkt.html

[2] StIKo Vet am FLI: Leitlinie zur Impfung von Kleintieren, 6. Auflage (06.01.2025): https://www.openagrar.de/servlets/MCRFileNodeServlet/openagrar_derivate_00063989/Impfleitlinie_Kleintiere_2025-01-06.pdf

[3] Thieme Tiermedizin (2025): Impfungen beim Kaninchen – Schutz vor Myxomatose & RHD: https://tiermedizin.thieme.de/hund-katze-co/fachbeitraege/detail/impfungen-beim-kaninchen-schutz-vor-myxomatose-und-rhd-1297

[4] EMA: Union Product Database (Verordnung (EU) 2019/6), öffentlicher Zugang via Veterinary Medicines Website und API: https://www.ema.europa.eu/en/veterinary-regulatory-overview/veterinary-medicinal-products-regulation/union-product-database sowie https://medicines.health.europa.eu/veterinary

[5] Beispiel einer standardisierten Fachinformation mit Pflichtfeldern Zieltierart (3.1), Gegenanzeigen (3.3), Warnhinweise (3.4): https://vetisearch.de/spcs/show/3745


## 6. Vorgemerkt (nach Prototyp): Verwandtschaftsgrad zwischen Haushalts-Tieren

**Idee des Projektinhabers (09.07.2026), geprüft und angenommen.** In Mehrtier-Haushalten (Kernszenario, siehe Abschnitt 2) sind Tiere häufig miteinander verwandt – etwa Wurfgeschwister bei Katzen oder Mutter und Nachkomme. Diese Information hat einen echten gesundheitlichen Nutzen: Erbliche Veranlagungen (z. B. HCM bei Katzen, HD bei Hunden) betreffen oft Wurfgeschwister und Nachkommen gemeinsam; wird bei einem Tier etwas diagnostiziert, ist der Verwandtschaftshinweis für den Tierarzt relevante Zusatzinformation.

**Bewusst schlanker Umfang:** Ein optionales Feld "Verwandt mit …" in den Tier-Stammdaten mit drei Beziehungstypen (Elterntier, Nachkomme, Wurfgeschwister), ausschließlich zwischen Tieren des eigenen Haushalts. Angezeigt wird die Beziehung in der Tierakte und im Notfallpass unter "Besonderheiten". **Ausdrücklich ausgeschlossen** (Entscheidung des Projektinhabers vom 09.07.2026): keine Stammbaum-Verwaltung, keine Zucht-Funktionen – das ist Züchter-Territorium mit eigener Spezialsoftware und würde die App verwässern.

**Technische Einordnung:** Das Datenmodell bildet dies später mit einer kleinen Zusatztabelle ab (`pet_relations`: pet_id, related_pet_id, relation_type), ohne Umbau bestehender Tabellen. Kein Bestandteil des Prototyps (Roadmap Schritte 3–5); Einplanung sinnvoll als kleiner Baustein nach der Prototyp-Abnahme.
