# Tierart-übergreifende Abdeckung der Festlegungen vom 09.07.2026

**Datum:** 09.07.2026
**Autor:** Manus AI
**Anlass:** Hinweis des Projektinhabers: "Wir müssen das Ganze auch tierartübergreifend im Blick behalten, nicht nur Katzen und Hunde." Die 14-Arten-Abdeckung ist das Alleinstellungsmerkmal der App — jede neue Festlegung muss gegen alle Arten geprüft werden, nicht nur gegen die zwei häufigsten.

Die 14 Tierarten der App: Hund, Katze, Kaninchen, Frettchen, Meerschweinchen, Chinchilla, Ratte, Maus, Degu, Hamster, Ziervogel, Reptil, Pferd, Aquarium.

## 1. Vorfall-Eintragstyp — Prüfergebnis: Auswahllisten müssen artneutral sein

Der Vorfall-Typ (Biss/Kratzer/Sturz/Giftverdacht) war in der Erstfassung Hund/Katze-lastig formuliert ("fremde Katze/fremder Hund"). Verbindliche Erweiterung:

| Bereich | Festlegung |
| :--- | :--- |
| Vorfallart (Auswahl) | Biss, Kratzer, Sturz, Giftverdacht, Verbrennung/Verbrühung, Hitzschlag, Fremdkörper (verschluckt/eingeatmet), Flucht/Entweichen, Angriff durch anderes Tier, Sonstiges |
| Verursacher (Auswahl) | Anderes eigenes Tier, fremdes Tier (Art als Freitext), Wildtier (z. B. Greifvogel bei Ziervögeln/Kaninchen, Fuchs, Marder), Mensch/Unfall, unbekannt, entfällt |
| Artspezifische Beispiele | Kaninchen/Meerschweinchen: Greifvogel- oder Marderangriff im Außengehege; Ziervogel: Anflugtrauma (gegen Scheibe), Verbrennung an Herdplatte, Vergiftung durch Teflon-Dämpfe; Reptil: Verbrennung an Wärmelampe, Fremdkörper durch Bodengrund; Pferd: Weideunfall, Kolik-Verdacht nach Giftpflanze, Tritt; Aquarium: Vergiftungsverdacht ganzer Besatz (Wasserwerte-Verweis), Springer (Fisch außerhalb des Beckens); Hamster/Ratte/Maus: Sturz aus der Hand, Klemm-Verletzung; Frettchen: Fremdkörper (Gummi), Hitzschlag ab 26 °C |

Der Vorfall-Typ ist bei allen Arten aktiv — kein artspezifisches Abschalten nötig, nur die Auswahllisten sind neutral gehalten und die Detailmaske zeigt artgerechte Beispiele als Platzhaltertext.

**Wichtige Korrektur des Projektinhabers (09.07.2026) — Freitext-first:** Keine noch so vollständige Liste deckt die Realität ab ("man kann nicht blöd genug denken"). Die Kategorien oben sind Komfort-Abkürzungen, keine Pflicht. Das Freitextfeld "Was ist passiert?" ist das Herzstück jedes Vorfall-Eintrags — immer sichtbar, nie blockiert, ohne Zeichenlimit. "Sonstiges" + Freitext ist ein vollwertiger Eintrag. Verbindliche Details: Datenmodell-Spezifikation, Abschnitt 2.3.

## 2. Pflege-Typ — Prüfergebnis: funktioniert artübergreifend, Beispielkatalog erweitert

Die Struktur (Mehrfach-Zeiten, Erinnerung, Timeline, Sitter-Zettel) passt für alle Arten unverändert. Der Beispielkatalog wird artübergreifend dokumentiert, damit die Eingabemaske sinnvolle Vorschläge pro Art anbieten kann:

| Tierart | Typische Pflege-Aufgaben (Beispiele für Vorschlagsliste) |
| :--- | :--- |
| Hund | Krallen schneiden, Zahnpflege, Fellpflege, Pfotenpflege (Winter/Streusalz) |
| Katze | Ohren eincremen (Sonnenschutz, weiße/unbehaarte Ohren), Fellpflege Langhaar, Krallen |
| Kaninchen/Meerschweinchen | Krallen schneiden, Zahnkontrolle (nachwachsende Zähne!), Gewichtskontrolle wöchentlich, Fellpflege, Po-Kontrolle (Fliegenmadenbefall im Sommer!) |
| Chinchilla/Degu | Sandbad bereitstellen/wechseln, Zahnkontrolle, Krallen |
| Hamster/Ratte/Maus | Käfigreinigung, Zahnkontrolle, Gewichtskontrolle |
| Frettchen | Krallen, Ohrenreinigung, Impf-Vorbereitung |
| Ziervogel | Krallen-/Schnabelkontrolle, Käfig-/Volierenreinigung, Bade-/Sprühgelegenheit |
| Reptil | UV-Lampen-Wechsel (Leistungsverlust nach 6–12 Monaten — klassisch vergessene Aufgabe!), Terrarienreinigung, Häutungskontrolle, Wasserbecken |
| Pferd | Hufpflege/Hufschmied (alle 6–8 Wochen), Fellwechsel-Pflege, Weidepflege-Kontrolle, Equidenpass-Kontrolle. **Notfallpass:** Eigener Block (E-80) mit Equidenpass-Nr., Abzeichen, Brand, Kolik-Vorgeschichte, Kotprobe/EpG, geschätztes Gewicht, Stallkontakt, Hufschmied, Haltungsform |
| Aquarium | Teilwasserwechsel (wöchentlich), Filterreinigung, Wasserwerte messen, Scheiben reinigen |

Das Saisonfenster ist ebenfalls artübergreifend nützlich: Fliegenmaden-Kontrolle beim Kaninchen (Mai–September), Weidegang-Aufgaben beim Pferd (Saison), Winterruhe-Vorbereitung bei Landschildkröten (Reptil, Oktober), Mauser-Beobachtung beim Ziervogel.

## 3. Fütterungs-Block — Prüfergebnis: Struktur passt, Bedeutung variiert pro Art

Die fünf Felder (Futter, Zeiten, Menge, Vorlieben, Tabus) tragen artübergreifend — mit artspezifischer Interpretation, die die Eingabemaske über Platzhaltertexte abbildet:

- **Heufresser (Kaninchen, Meerschweinchen, Chinchilla, Degu, Pferd):** "Futter" umfasst Heu ad libitum + Frischfutter + ggf. Kraftfutter; **Tabus sind hier lebenswichtig** (Meerschweinchen: Vitamin-C-Pflicht; Kaninchen: kein plötzlicher Futterwechsel — Verdauung kippt; Pferd: Giftpflanzen, kein frischer Grasschnitt).
- **Aquarium:** "Fütterung" gilt pro Becken, nicht pro Fisch; Tabu-Klassiker: Überfütterung (häufigste Todesursache) — der Sitter-Zettel muss die Menge exakt nennen ("1 Prise, einmal täglich, Fastentag Sonntag").
- **Reptil:** Fütterungsintervalle oft nicht täglich (Schlange: alle 7–14 Tage) — das Zeiten-Feld akzeptiert deshalb auch Intervalle, nicht nur Uhrzeiten. Plus Supplemente (Kalzium/UV-abhängig).
- **Ziervogel:** Tabus wie Avocado (hochgiftig), Küchendämpfe; Frischfutter-Anteil.
- **Frettchen:** obligate Fleischfresser — Tabu Rohfaser/Süßes; hohe Mahlzeitfrequenz (6–10 kleine Mahlzeiten, Freifütterung).

**Konsequenz für das Datenmodell:** Das Zeiten-Feld im `feeding_info`-Block erlaubt beide Modi — feste Uhrzeiten (Hund: 7:00/18:00) **oder** Intervall (Reptil: alle 10 Tage, Aquarium: Fastentag). Der Sitter-Zettel gibt den Modus entsprechend aus.

## 4. Sitter-Zettel — Prüfergebnis: eine Ergänzung nötig (Haltungs-Block)

Für Hund/Katze reicht Fütterung + Medikamente + Eigenheiten. Für Käfig-, Terrarien- und Beckentiere ist die **Haltungstechnik** genauso überlebenswichtig und gehört auf den Zettel:

- **Reptil:** Lampen-Zeiten (Licht/Wärme/UV), Zieltemperaturen, Luftfeuchte, Sprühen.
- **Aquarium:** Technik-Check (Filter, Heizer, Beleuchtungszeit), Was-tun-bei-Ausfall, Zielwerte.
- **Ziervogel:** Freiflug ja/nein (und Regeln!), Zugluft-/Dämpfe-Warnung.
- **Kleinsäuger:** Außengehege-Sicherung (Marder!), Temperaturgrenzen (Hitzschlag-Risiko: Kaninchen/Meerschweinchen/Frettchen ab ~26 °C).
- **Pferd:** Weide-/Boxenregime, Decken-Regeln, Hufschmied-/Stallkontakt. (Notfallpass: eigener Block mit Stallkontakt + Hufschmied, E-80)

Umsetzung: Der Sitter-Zettel erhält einen optionalen Abschnitt **"Haltung & Technik"**, gespeist aus `care_notes` plus artspezifischen Feldern der Tierarten-Konfiguration. Kein neues Modul — nur eine zusätzliche Sektion im PDF-Generator.

## 5. Verwandtschafts-Feature (vorgemerkt) — Prüfergebnis: artneutral formuliert, passt

Die Formulierung "zwischen Tieren des eigenen Haushalts" ist bereits artneutral (Wurfgeschwister bei Kaninchen/Meerschweinchen/Ratten sind sogar der häufigste Fall, da Gruppenhaltung Pflicht ist). Keine Änderung nötig — nur der Hinweis, dass die Beziehungstypen artübergreifend gelten.

## 6. Verbindliche Regel für alle künftigen Festlegungen

> **Tierarten-Check als Pflichtschritt:** Jede neue Funktions-Festlegung wird vor dem Festschreiben gegen die 14-Arten-Matrix geprüft (mindestens gegen die fünf Haltungs-Cluster: Hund/Katze, Kleinsäuger, Ziervogel, Reptil/Aquarium, Pferd). Das Prüfergebnis wird im jeweiligen Dokument vermerkt. Hund/Katze-lastige Auswahllisten, Beispiele oder Platzhaltertexte gelten als Fehler.

Dieser Check wird auch in die interne Prüfung von Schritt 4 übernommen: Der Mehrarten-Testhaushalt (Hund + Hamster + Aquarium) prüft genau diese Cluster-Vielfalt bereits baulich.
