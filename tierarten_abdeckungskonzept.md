# Vollständiges Tierarten-Abdeckungskonzept für die Pet-Health-App

Die App muss alle üblichen Heimtierarten abbilden, ohne durch ein starres "One-size-fits-all"-Design veterinärmedizinisch falsche Funktionen (wie Impferinnerungen für Hamster) anzubieten. Die Lösung ist ein modulares Datenmodell: Jedes Tier erhält nur die Module, die für seine Spezies medizinisch und rechtlich relevant sind.

## 1. Die Tierarten-Matrix (Belegte Anforderungen)

Die folgende Matrix basiert auf tierärztlichen Leitlinien, offiziellen Impfempfehlungen (StIKo Vet) und gesetzlichen Vorgaben. Sie definiert, welche Funktionen bei welcher Tierart aktiviert werden.

| Tierart | Modul: Impfplan & Erinnerung | Modul: Gewichtstracking | Modul: Zahn-Check / Ernährung | Modul: Pflichtdokumente / Sonderfunktionen |
| :--- | :--- | :--- | :--- | :--- |
| **Hund** | **JA** (Staupe, Parvo, Tollwut etc.) | Ja | Nein (aber Zahnsanierung als OP) | EU-Heimtierausweis, Haftpflicht/Steuer |
| **Katze** | **JA** (Katzenschnupfen/-seuche etc.) | Ja (kritisch bei CNI im Alter) | Nein | EU-Heimtierausweis |
| **Kaninchen** | **JA** (RHD, Myxomatose) | Ja | **JA** (lebenslang nachwachsende Zähne) | Spezifischer "kaninchenkundiger" Tierarzt [1] |
| **Frettchen** | **JA** (Staupe, Tollwut) [2] | Ja | Nein | Einziger weiterer Kleinsäuger mit Impfempfehlung [2] |
| **Meerschweinchen** | *Nein* (keine Impfungen) | Ja | **JA** (Zähne) + **Vitamin-C-Tracking** [3] | - |
| **Chinchilla / Ratte / Maus** | *Nein* | Ja (Frühwarn-Indikator Nr. 1) | **JA** (Zähne) | - |
| **Degu** | *Nein* | Ja | **JA** (Zähne) | **Diabetes-Vorsorge** (zuckerfreie Ernährung) [4] |
| **Hamster** | *Nein* | Ja | **JA** (Zähne) | Sehr kurze Lebenserwartung (2-3 Jahre) |
| **Ziervögel** (Sittiche, Papageien) | *Nein* | Ja (Vögel verbergen Krankheiten) | Nein | Jährlicher **Routine-Check** [5], "vogelkundiger" Tierarzt [6] |
| **Reptilien** (Schildkröten etc.) | *Nein* | Ja | Nein | **CITES-Nachweise** [7], **Winterstarre-Zyklus** [8] |
| **Pferde** | **JA** (Tetanus, Influenza, Herpes) | Nein (kaum wiegbar) | **JA** (jährlicher Pferdezahnarzt) | **Equidenpass** (EU-Pflicht) [9], Medikationsdoku |

## 2. Der Sonderfall: Fische / Aquaristik

Fische und Aquarienbewohner lassen sich nicht in ein Einzeltier-Akte-Modell pressen. Ein kranker Fisch wird selten isoliert behandelt; die Prävention und Therapie erfolgt fast ausschließlich über das Milieu (das Aquarium). 

Krankheiten bei Zierfischen werden durch Stressfaktoren, falsche Vergesellschaftung oder verschmutztes Wasser ausgelöst [10]. Vorbeugende Maßnahmen bestehen aus der Quarantäne neuer Fische und der Kontrolle der Wasserwerte [11].

**Konsequenz für das Datenmodell:** Die App behandelt bei der Auswahl "Aquaristik" nicht den Fisch als Patient, sondern das Behältnis (das Aquarium oder den Teich) als Entität.
- **Module für Aquaristik:** Wasserwerte-Tagebuch (pH, Nitrit, Ammoniak), Besatz-Liste (welche Arten leben im Becken), Wartungs-Erinnerungen (Filterwechsel, Teilwasserwechsel) und eine Behandlungshistorie für das gesamte Becken.

## 3. Das modulare Datenmodell (Technisches Konzept)

Um diese Vielfalt ohne Chaos in der Benutzeroberfläche abzubilden, arbeitet die App mit einem komponenten-basierten Profil.

### Der Onboarding-Workflow
1. **Tierart wählen:** Der Nutzer wählt aus der Liste (Hund, Katze, Kaninchen, Meerschweinchen, Hamster, Degu, Chinchilla, Ratte, Maus, Frettchen, Vogel, Reptil, Pferd, Aquarium).
2. **Dynamischer Profil-Aufbau:** Die App lädt die tierartspezifische Konfiguration (JSON-basiert).
3. **Beispiel Degu:** Die App blendet das Impf-Modul komplett aus (da es keine Impfungen gibt) und fügt stattdessen einen prominenten Warnhinweis zur Diabetes-Prävention sowie ein Gewichts- und Zahntagebuch ein.
4. **Beispiel Vogel:** Das Feld "Tierarzt" wird automatisch umbenannt in "Vogelkundiger Tierarzt", da die Spezialisierung hier überlebenswichtig ist [6].

### Die Basis-Module (für alle Landtiere gleich)
- **Stammdaten / Signalement:** Name, Alter, Geschlecht, Kastrationsstatus, Tierfoto.
- **Besondere Erkennungsmerkmale:** Feste Stammdaten-Sparte für Narben, Fellzeichnungen, Ohrkerben, Tätowierungen etc. mit Positionsangabe und optionalen Detail-Fotos; einmal erfasst, überall sichtbar (Profil, Notfall-Pass, Praxis-Freigabe, PDF). Bei ungechipten Tieren (Kleinsäuger, Vögel, Reptilien) neben dem Foto das einzige Identifikationsmerkmal.
- **Symptom-Tagebuch:** Freitext und Fotos (für den Tierarztbesuch).
- **Notfall-Pass:** Offline-verfügbare Zusammenfassung für die Ausweichklinik.
- **Dauermedikation:** Mit Dosierung und tierartspezifischen Warnhinweisen (z. B. EMA-Produktdatenbank-Abgleich zur Vermeidung von Fehlmedikationen bei Mehrarten-Haushalten).

### Die Experten-Module (werden nach Matrix zugeschaltet)
- **Impf-Engine:** Nur aktiv für Hund, Katze, Kaninchen, Frettchen, Pferd. Enthält die artspezifischen Intervalle der StIKo Vet.
- **Dokumenten-Safe (Recht):** Bei Reptilien zwingend auf CITES-Nachweise optimiert; beim Pferd auf den Equidenpass.
- **Saisonale Zyklen:** Winterstarre-Vorbereitung bei Schildkröten [8]; Weidesaison/Wurmkuren bei Pferden.

Dieses modulare Konzept garantiert, dass die App für einen Hamster-Halter genauso übersichtlich und logisch bleibt wie für einen Hundehalter, ohne dass der Hamster-Halter von leeren Impf-Tabs irritiert wird oder der Vogel-Halter die CITES-Dokumentenablage sieht.

## Quellen

[1] Kaninchenwiese.de: Kaninchen-Tierärzte. https://kaninchenwiese.de/gesundheit/allgemeines/kaninchentierarzt/

[2] Bundesverband für Tiergesundheit e.V.: Impfempfehlung Kleintier. https://www.bft-online.de/themen/krankheiten-vorbeugen/bedeutung-von-impfstoffen/haeufig-gestellte-fragen/impfempfehlung-kleintier

[3] MSD Veterinary Manual via Tierarzt Appenweier: Meerschweinchenspezialist. https://tierarzt-appenweier.de/meerschweinchenspezialist/

[4] DieBrain.de: Degu Info - Gesunderhaltung. http://www.diebrain.de/de-tuv.html

[5] Die Vogelschule: Wellensittich Krankheiten - Weißt du was zu tun ist? https://www.dievogelschule.com/sittich-papageien-gesundheit/wellensittich-krankheiten/

[6] IVH-Pressedienst: Dem Ziervogel helfen: Wo finde ich einen geeigneten Tierarzt? https://www.ivh-online.de/presse-medien/pressemitteilungen/pressedienst-heimtiere/mitteilung-des-aktuellen-ivh-pressedienstes/news/detail/News/dem-ziervogel-helfen-wo-finde-ich-einen-geeigneten-tierarzt.html

[7] BMEL: Mindestanforderungen an die Haltung von Reptilien (1997). https://www.bmleh.de/SharedDocs/Downloads/DE/_Tiere/Tierschutz/Gutachten-Leitlinien/HaltungReptilien.pdf

[8] Thieme Vet-News: Haltung von Schildkröten – Was muss man beachten? (2022). https://tiermedizin.thieme.de/aktuelles/vet-news/detail/haltung-von-schildkroeten-was-muss-man-beachten-267

[9] Deutsche Reiterliche Vereinigung (FN): Zahlen und Fakten aus Pferdesport und Pferdezucht. https://www.pferdesport-deutschland.de/deutsche-reiterliche-vereinigung/zahlen--fakten/zahlen--fakten

[10] DRTA-Archiv.de: Leitfaden zur Vorbeugung gegen Fischkrankheiten. https://www.drta-archiv.de/vorbeugung-gegen-fischkrankheiten/

[11] Dennerle: Fischkrankheiten erkennen & behandeln (2025). https://dennerle.com/blogs/ratgeber/fischkrankheiten
