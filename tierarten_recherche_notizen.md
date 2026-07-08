# Recherche-Notizen: Deutsche Heimtier-Landschaft (Tierarten, Anforderungen, Beschwerden)

## Kontext
Aufgabe: Tiefere Recherche über der Deutschen liebste Tiere. Wie viele Tierarten? Unterschiedliche Anforderungen? Was bemängeln Tierhalter am meisten?
Bereits vorhandene Dateien: nutzerkonzept_pet_health.md, mehrtier_konzept.md, nutzerseite_recherche_notizen.md, notfall_szenario_datenrueckfluss.md, pet_health_wettbewerbsanalyse.md (alle in /home/ubuntu/app_defizit_analyse/)

## Block 1: Bestandszahlen (IVH/ZZF, offizielle Branchendaten, Stand 2025, veröffentlicht 27.04.2026)
Quellen: https://www.ivh-online.de/der-verband/daten-fakten/der-deutsche-heimtiermarkt.html, https://www.zzf.de/marktdaten/heimtiere-in-deutschland, diyonline.de (28.04.2026)
- Gesamt: 33,4 Mio. Hunde, Katzen, Kleinsäuger und Ziervögel in deutschen Haushalten (2025); 43% aller Haushalte mit mindestens einem Heimtier
- Statista-Themenseite (Basis IVH/ZZF): Hunde ~10 Mio., Katzen ~15-16 Mio. (größte Gruppe, "Katzen haben die Schnauze vorn"), Kleintiere/Kleinsäuger ~4,4 Mio., Ziervögel ~3,3 Mio.
- Dazu kommen (nicht in 33,4 Mio. enthalten): Aquarien ~1,8-2 Mio. (Fische zählen als Aquarienzahl!), Gartenteiche mit Zierfischen ~1,2 Mio., Terrarien ~0,8-1,2 Mio.
- Reptilien ~4% der Haushalte, ähnlich häufig wie Pferde (~4%); Schildkröten = 68,5% der gehaltenen Reptilien (landschildkroeten.de, grobe Schätzung)
- Pferde: ~1,3 Mio. Pferde/Ponys in DE (FN-Schätzung, separat zu prüfen)
- Kleinsäuger-Aufteilung (übliche IVH-Gliederung): Kaninchen/Zwergkaninchen größte Gruppe, dann Meerschweinchen, Hamster, Mäuse/Ratten, Frettchen, Chinchillas, Degus

## Merkposten für Bericht
- "Der Deutschen liebste Tiere" = Katze (Platz 1), Hund (Platz 2) – aber Hund hat höchste Ausgaben/Tierarztbindung
- App-Relevanz-Reihenfolge ≠ Bestandszahlen: Tierarztkontakt-Frequenz und Dokumentationsbedarf entscheidend

## VERIFIZIERT: Offizielle IVH/ZZF-Zahlen 2025 (Skopos-Erhebung, 5.000 Haushalte, veröffentlicht 23./27.04.2026)
Quellen direkt gelesen: zzf.de/marktdaten/heimtiere-in-deutschland + ivh-online.de (identische Zahlen, konsistent):
- Katzen: 15,7 Mio. in 24% der Haushalte; 43% der Katzenhaushalte mit >=2 Katzen → PLATZ 1
- Hunde: 10,0 Mio. in 20% der Haushalte; 43% Mischlinge → PLATZ 2
- Kleintiere (Kaninchen, Meerschweinchen, Hamster, Mäuse): 4,4 Mio. in 5% der Haushalte
- Ziervögel (Sittiche, Kanarien, Kleinpapageien): 3,3 Mio. in 3% der Haushalte
- Aquarien: 2,1 Mio. in 4% der Haushalte (Anzahl AQUARIEN, nicht Fische!)
- Gartenteiche mit Zierfischen: 1,0 Mio. in 2% der Haushalte
- Terrarien: 1,0 Mio. in 1% der Haushalte
- Homefarming (Hühner, Wachteln): 1,4% der Haushalte
- Gesamt "klassische" Heimtiere: 33,4 Mio. (Hunde+Katzen+Kleinsäuger+Vögel); 43% aller Haushalte mit Heimtier; 67% der Familien mit Kindern; 28% der Singles; 13% halten >=2 Tierarten
- Haushaltsstruktur: 26% Single-Haushalte, 35% 2-Personen, 39% 3+ Personen
- Alter: bis 29: 17%; 30-39: 19%; 40-49: 18%; 50-59: 21%; 60+: 25% (größte Einzelgruppe!)
- Markt: ~7 Mrd. € Gesamtumsatz 2025 (5,3 Mrd. stationär, 1,5 Mrd. online, 134 Mio. Wildvogelfutter)
- KORREKTUR zu meiner früheren Notiz: Aquarien 2,1 Mio. (nicht 1,8-2), Terrarien 1,0 Mio. (nicht 0,8-1,2), Gartenteiche 1,0 Mio. (nicht 1,2)
Noch offen: Pferde (nicht in IVH/ZZF-Erhebung enthalten! FN-Zahlen nötig), Frettchen-Anteil, Halter-Beschwerden je Tierart, tierartspezifische Versorgungsprobleme (Vogel-/Reptilien-Tierärzte selten!)

## Block 2: Pferde (FN-Zahlen, direkt gelesen pferdesport-deutschland.de)
Pferde im Privatbesitz: ~1,25 Mio. (Hochrechnung FN/IPSOS); 600.000 Haushalte mit Pferdebesitz + 920.000 Haushalte mit Reitbeteiligung; 2,32 Mio. bezeichnen sich als Reiter (840.000 regelmäßig). Haltung: ~1/3 privat, ~45% Pensionsbetriebe. Reiter: 78% weiblich, Ø38 Jahre, Einkommen über Durchschnitt. Pferdewirtschaft ~6,7 Mrd. € Umsatz. WICHTIG: Pferde sind NICHT in IVH/ZZF-33,4-Mio. enthalten. Besonderheit App: Equidenpass ist EU-PFLICHTDOKUMENT (VO 2015/262), Pferd = einziges Heimtier mit gesetzlicher Ausweispflicht + Medikationsdokumentation (lebensmittelliefernde Tiere-Status!).

## Block 3: Was bemängeln Tierhalter am meisten? (Belege Stand 2024-2026)
### Beschwerde 1: TIERARZTKOSTEN (GOT 2022) – dominantestes Thema
- Tierschutzbund-Umfrage (PM 20.04.2026): ~80% der Tierschutzvereine berichten von steigender Zahl von Tierhaltern, die um finanzielle Hilfe für Tierarztkosten bitten; 60% der Tierheime: mehr vermutlich ausgesetzte (Fund-)Tiere seit GOT-Anpassung; Tierheime selbst: 30-50%+ Mehrkosten. GOT-Reevaluierung für 2026 geplant.
- FN startet GOT-Umfrage 2026 unter Pferdehaltern (Juni 2026) – „Tierarztkosten leistbar für Halter" als politisches Thema
- vetline (Mai 2026): GOT „unter Druck", öffentliche+politische Debatte über Kostensteigerungen
### Beschwerde 2: TIERARZTMANGEL / NOTDIENSTKRISE
- Tagesschau (11.07.2024): Zahl niedergelassener Tierärzte 2019: 12.019 → 2023: 11.437 (-5%); viele Kliniken geben 24/7-Notdienst auf (bpt); Landpraxen schließen; zentrale Notdienst-Hotlines als Notlösung (SH, BB)
- Morgenpost (2023): „Viele tierärztliche Kliniken geben die 24/7-Versorgung auf" (bpt-Sprecherin)
→ Verbindung zur App: Notfall = Ausweichklinik = Datenproblem (unser Kernszenario), verschärft durch Notdienstkrise
Noch offen: Beschwerden je Tierart (Vogel-/Reptilien-/Kleinsäuger-Spezialisten extrem rar), Exoten-Versorgung

### Beschwerde 3: SPEZIALISTEN-MANGEL für Nicht-Hund/Katze (Exoten-Versorgungslücke)
- IVH-Pressedienst (05.10.2023, Dr. Steinmetz/DKB): Trotz 3,3-3,7 Mio. Ziervögeln ist es "mitunter schwer, einen spezialisierten Arzt für seinen Ziervogel zu finden"; >300 Ziervogelarten in menschlicher Obhut; relevant: "Fachtierarzt für Zier-, Zoo- und Wildvögel" bzw. "Zusatzbezeichnung"; DKB pflegt eigenes PLZ-Verzeichnis vogelkundiger Tierärzte (vogelbund.de) – Existenz solcher Community-Verzeichnisse = Beleg der Lücke
- welli.net (Community): "Auch als Kleintierarzt hat man sehr selten mit Vögeln zu tun" – normale Kleintierpraxis kann Vogel oft nicht helfen
- Kaninchenhilfe Deutschland (FB, 08/2024): "Gerade in ländlichen Gebieten ist es oft unglaublich schwer, einen guten Heimtierarzt für seine Kaninchen zu finden"; Community pflegt Listen "kaninchenkundiger Tierärzte" (kaninchenwiese.de)
- DocCheck zur Heimtierstudie (02/2026): "Auf Heimtiere spezialisierte Tierärzte sind rar"; private Ausgaben für Heimtiere 2024: >18 Mrd. € (Uni Göttingen Heimtierstudie 2025, Prof. Ohr)
- Empfehlung Ziervogel: jährliche Routineuntersuchung (Krankheiten mit bloßem Auge nicht erkennbar)
→ App-Konsequenz: Tierarzt-Kompetenz je Tierart ist ein DATENPUNKT im Halterprofil (welcher TA behandelt Vogel/Kaninchen?); Notfall-Pass für Exoten besonders wertvoll, weil Ausweich-TA fast nie tierartkundig ist → Vorbefunde kritisch
### Tierartspezifische Anforderungen (Kurzmatrix für Bericht)
- Katze: Mehrkatzenhaushalte (43%), Impfintervalle 1-3 Jahre je Impfstoff/Haltung (drinnen/draußen), Zahnsanierungen, CNI-Chroniker im Alter (Gewichts-/Laborwert-Tracking!)
- Hund: höchste TA-Kontaktfrequenz, Pflicht: Steuer/Haftpflicht (je Bundesland), Chip+Registrierung, Reisen (EU-Heimtierausweis, Tollwut), Dauermedikation häufig
- Kleinsäuger: kurze Lebensspanne, schnelle Krankheitsverläufe (Kaninchen: Impfpflicht-ähnliche Empfehlung RHD/Myxo; Meerschweinchen: KEINE Impfung, aber Vitamin-C, Zähne; Hamster: 2-3 J. Lebenszeit, kaum TA-Besuche), kaninchenkundige TA rar
- Ziervogel: jährliche Routine empfohlen, >300 Arten, vogelkundige TA sehr rar, Schwarmtiere (Bestandsdenken statt Einzeltier)
- Aquarium/Teich: kein Einzeltier-Tracking, sondern BESTAND+Wasserwerte (pH, Nitrit...) – ganz anderes Datenmodell!
- Terrarientiere: Wildtiere, Haltungsparameter (Temperatur, UV, Luftfeuchte), reptilienkundige TA extrem rar, CITES-/Herkunftsnachweise als Pflichtdokumente!
- Pferd: Equidenpass EU-Pflicht, Medikationsdokumentation gesetzlich, Wurmkuren/Zahnarzt/Hufschmied-Zyklen, Pensionsstall = geteilte Verantwortung

## Block 4: Vorsorge-Anforderungen weiterer Kleinsäuger (für Tierarten-Matrix)
### Frettchen (WICHTIG: einziger weiterer Kleinsäuger MIT offizieller Impfempfehlung!)
- StIKo-Vet-Impfempfehlung Frettchen (01/2021, kleintierpraxis-hechtsheim.de PDF): Staupe = Core-Impfung (Frettchen hochempfänglich, bft-online.de bestätigt); Grundimmunisierung ab 8 Wochen, Booster 12. Woche, danach JÄHRLICHE Wiederholung Staupe + Tollwut. Zugelassene Impfstoffe laut Paul-Ehrlich-Institut: MUSTELIGEN D (Staupe, Virbac), Nobivac T (Tollwut, Intervet)
- → Frettchen braucht Impfplan-Modul wie Hund/Katze/Kaninchen!
### Meerschweinchen
- KEINE Impfungen; kritisch: Vitamin-C-Versorgung (kann es wie der Mensch nicht selbst bilden; Richtwert >=10 mg/kg/Tag, tragend 30 mg/kg – MSD Veterinary Manual via tierarzt-appenweier.de)
- Zahnfehlstellungen häufigstes Problem (lebenslang nachwachsende Zähne), heubasierte Fütterung als Prophylaxe (tierheim-hannover.de 04/2026)
- → Module: Gewichts-Tracking, Zahn-Check-Erinnerung, Ernährungsnotizen; KEIN Impfmodul
### Chinchilla / Degu / Ratte / Maus
- Keine Impfungen. Chinchilla: typische Probleme Augen, Kot, Gewicht, Fell (t-online Ratgeber); Degu: DIABETES-anfällig (zuckerfreie Ernährung), wöchentliche Halter-Kontrolle empfohlen (diebrain.de); Ratten: Atemwegserkrankungen/Mycoplasmose + Tumore häufig, Lebenserwartung ~2 J.
- Nager+Hasenartige generell: Zahnprobleme sehr verbreitet (lebenslang nachwachsend, tierarzt-kleinmachnow.de); heimtierkundige TA-Praxen listen explizit: Kaninchen, Meerschweinchen, Chinchilla, Degu, Ratte (tierarztpraxis-am-millerntor.de)
- → Module: Gewicht (Frühwarn-Indikator Nr. 1), Symptomtagebuch, Zahn-Checks; artspezifische Hinweisfelder (Degu: Diabetes/Ernährung)

## Block 5: Vögel, Reptilien, Fische (für Tierarten-Matrix)
### Ziervögel (Wellensittich, Kanarie, Papageien)
- Jährliche Vorsorgeuntersuchung empfohlen: Wiegen, klinische Untersuchung, ggf. Kotprobe (go4vet 03/2026: 40-70 € in AT); "beste Chance, Tumore im Frühstadium zu erkennen" (dievogelschule.com)
- Keine Routine-Impfungen bei Heimvögeln. Gewicht = wichtigster Frühwarnindikator; Kotveränderungen (Volumen/Farbe/Konsistenz) zweitwichtigster (AAV-Leitfaden deutsch)
- Vögel VERBERGEN Krankheiten (Fluchttier) → Halter-Beobachtung + Gewichtsprotokoll kritisch
- → Module: Gewicht, Kot-/Verhaltens-Tagebuch, Jahres-Check-Erinnerung, vogelkundiger TA als Datenpunkt; Schwarm-/Gruppenverwaltung sinnvoll
### Reptilien/Schildkröten
- Jährlicher "Winter-Check-up" beim reptilienkundigen TA vor der Winterstarre empfohlen (vogel-tierarzt.de, zoodocs.de, Thieme Vet-News 2022: Herbst-Gesundheitscheck + Kotuntersuchung vor Winterschlaf)
- Pflichtdokumente: CITES-/Herkunftsnachweis, teils Meldepflicht je Bundesland (BMEL-Gutachten Mindestanforderungen Reptilienhaltung)
- Haltungsparameter (Temperatur, UV, Luftfeuchte) = Gesundheitsfaktor Nr. 1
- → Module: Dokumenten-Safe (CITES!), Winterstarre-Zyklus mit Check-Erinnerung, Gewicht, Haltungsparameter-Notizen
### Zierfische (Aquarium/Teich)
- KEIN Einzeltier-Modell: Prävention = Wasserwerte (Ammoniak, Nitrit, pH...), Quarantäne neuer Fische, Besatzdichte (Dennerle 08/2025, drta-archiv.de)
- → Entweder Bestands-Modul (Aquarium als "Patient": Wasserwerte-Log, Besatzliste, Behandlungshistorie) ODER bewusst ausklammern; ehrliche Produktentscheidung nötig
