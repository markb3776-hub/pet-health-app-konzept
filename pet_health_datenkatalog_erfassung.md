# Datenkatalog und Erfassungskonzept: Pet-Health-App

**Datum:** Juli 2026
**Autor:** Manus AI

Dieses Dokument definiert, welche Daten Tierarztpraxen vom Halter zwingend benötigen und wie diese Daten mit minimalem Nutzeraufwand – gemäß MEMORIA-Doktrin ohne falsche Automatisierungsversprechen – in die App gelangen.

## 1. Der Datenbedarf der Tierarztpraxis (Anamnese-Standard)

Die veterinärmedizinische Anamnese folgt klaren Standards, die bei Neupatienten oder im Notdienst zwingend abgefragt werden [1]. Eine Analyse realer Klinik-Aufnahmebögen (z. B. AniCura) und tierärztlich geprüfter Ratgeber (z. B. AGILA) zeigt, dass Praxen die folgenden Datenblöcke vom Halter benötigen [2] [3]:

| Datenkategorie | Konkrete Datenpunkte | Bedeutung für den Tierarzt |
| :--- | :--- | :--- |
| **Signalement (Stammdaten)** | Tierart, Rasse, Geschlecht, Geburtsdatum, Kastrationsstatus (wann?), Chipnummer. | Essentiell für alters- und rassespezifische Prädispositionen (z. B. Narkoserisiko) und eindeutige Identifikation. |
| **Medizinische Historie** | Vorerkrankungen, Allergien, aktuelle Dauermedikation (exakter Name, Dosis, seit wann), letzte Läufigkeit (bei Hündinnen). | **Kritisch im Notfall.** Verhindert gefährliche Wechselwirkungen bei der Medikamentengabe. |
| **Prävention & Prophylaxe** | Letzte Impfungen (welche?), Entwurmung (wann, Produkt), Ektoparasitenschutz (Flöhe/Zecken). | Wichtig bei Infektionsverdacht oder vor stationärer Aufnahme (Seuchenschutz). |
| **Lebensumstände** | Haltung (Wohnung/Freigang), Auslandsaufenthalte (Reisekrankheiten?), Herkunft (Tierschutz/Züchter). | Liefert Hinweise auf Parasitenbelastung oder endemische Krankheiten. |
| **Aktuelles Problem** | Hauptsymptom (seit wann?), Begleitsymptome (Erbrechen, Durchfall, Husten), Fress-/Trinkverhalten, Kot-/Harnabsatz. | Situative Daten, die direkt vor Ort erfragt oder tagesaktuell vom Halter notiert werden. |

*Hinweis: Die App deckt die ersten vier Blöcke vollständig als mitführbare Akte ab. Der fünfte Block (Symptomverlauf) wird über ein einfaches Tagebuch unterstützt.*

## 2. Das Erfassungskonzept: Minimaler Nutzeraufwand

Tracking-Apps scheitern oft an der "Dateneingabe-Müdigkeit" der Nutzer. Laut Branchenzahlen entstehen 64 % der verpassten Termine durch schlichtes Vergessen [4]. Gleichzeitig zeigen aktuelle KI-Studien, dass reine OCR-Technik (Texterkennung) bei handschriftlichen Impfpässen fehleranfällig ist; erst der Einsatz multimodaler Large Language Models (LLMs) ermöglicht eine verlässliche Extraktion [5].

Um den Nutzeraufwand auf **unter eine Minute pro Tierarztbesuch** zu drücken, setzen wir auf ein hybrides Erfassungskonzept: **KI-Assistenz mit zwingender Nutzer-Freigabe** (Human-in-the-loop). Dies erfüllt die MEMORIA-Doktrin: Technologie wird genutzt, aber die Wahrheitspflicht bleibt beim Menschen.

### Die 4 Erfassungswege der App

**Weg 1: Der KI-Dokumentenscan (für Impfpass & Befunde)**
*   **Aktion:** Der Nutzer fotografiert eine Seite des gelben EU-Heimtierausweises oder eine Tierarztrechnung.
*   **Technik:** Ein multimodales LLM extrahiert Impfstoff, Datum, Charge bzw. auf der Rechnung stehende Diagnosen, Medikamente und das aktuelle Gewicht [5].
*   **Doktrin-Check:** Die App trägt *nichts* automatisch ein. Sie zeigt die erkannten Daten als Vorschlag. Der Nutzer prüft und klickt auf "Bestätigen".
*   **Aufwand:** ca. 30 Sekunden.

**Weg 2: Natürliche Spracheingabe (Chat-Interface)**
*   **Aktion:** Statt sich durch Dropdown-Menüs zu klicken, tippt oder spricht der Nutzer einen Satz in die App (z. B. *"Habe Balou heute Morgen mit Milbemax entwurmt"* oder *"Kalle wiegt heute 5,4 kg"*).
*   **Technik:** Das LLM strukturiert den Satz in die korrekten Datenbankfelder (Ereignis: Entwurmung, Produkt: Milbemax, Datum: heute).
*   **Aufwand:** ca. 10 Sekunden.

**Weg 3: Automatische Ableitung (Folgeaktionen)**
*   **Aktion:** Sobald ein Datum (z. B. Tollwut-Impfung am 01.03.2026) bestätigt ist, berechnet die App das Fälligkeitsdatum für die Auffrischung nach den Richtlinien der Ständigen Impfkommission Vet (StIKo Vet).
*   **Ergebnis:** Automatische Push-Erinnerung rechtzeitig vor Ablauf.
*   **Aufwand:** 0 Sekunden (vollautomatisch).

**Weg 4: Einmaliges Onboarding (Stammdaten)**
*   **Aktion:** Bei der Registrierung wird das Signalement (Rasse, Alter, Kastration) und die Chipnummer erfasst – idealerweise durch ein Foto der ersten Seite des Heimtierausweises.
*   **Aufwand:** Einmalig ca. 2 Minuten.

## 3. Wettbewerbs-Analyse und Differenzierung

Der Markt in Deutschland bewegt sich aktuell genau in diese Richtung. Zwei junge deutsche Start-ups (*Tier-Akte* und *FellAkte*) bieten bereits KI-Scans für Impfpässe und Rechnungen an [6] [7]. Beide versprechen eine Erfassung in unter 30 Sekunden und nutzen Erinnerungsfunktionen.

**Unsere Abgrenzung (USP nach MEMORIA-Doktrin):**
Während Wettbewerber wie *FellAkte* eine KI-Chat-Assistentin integrieren, die bei Symptomen ungeprüfte Diagnose-Empfehlungen gibt (z. B. Ratschläge bei Erbrechen) [7], lehnen wir dies strikt ab. Ungeprüfte medizinische Ratschläge verstoßen gegen die Doktrin (Wahrheit und Belegpflicht). 

Unsere App positioniert sich als **rein dokumentarischer, PIMS-unabhängiger Notfall-Safe**:
1.  **Fokus auf den Praxis-Übergang:** Der QR-Code teilt die strukturierte Notfallakte mit *jeder* Praxis, ohne Software-Abhängigkeit (im Gegensatz zu *petsXL* oder *Petleo*).
2.  **Fokus auf Fakten, nicht auf KI-Diagnosen:** Wir scannen Dokumente zur Arbeitserleichterung, spielen aber nicht den digitalen Tierarzt.
3.  **Local-First-Resilienz:** Die Notfalldaten müssen offline auf dem Gerät liegen, um im Funkloch der Tierklinik verfügbar zu sein.

---

## Referenzen

[1] DocCheck Flexikon. (2020). Anamnese (Veterinärmedizin). Abgerufen von https://flexikon.doccheck.com/de/Anamnese_(Veterin%C3%A4rmedizin)
[2] AniCura. (2026). Anamnese Fragebogen für Tierbesitzer. Abgerufen von https://www.anicura.ch/globalassets/switzerland/kliniken-blocke--forms/thun/anamnese-fragebogen-fur-tierbesitzer_v2.pdf
[3] AGILA. (2022). Was wird bei der Anamnese für Hund und Katze abgefragt? Abgerufen von https://www.agila.de/tiergesundheit/fragen-zum-tierarztbesuch/3188-anamnese-fuer-hund-und-katze-vorbericht-fuer-tiere
[4] FellAkte. (2026). Was die Daten über Tiergesundheit in Deutschland sagen (Marktdaten). Abgerufen von https://fellakte.de/
[5] Khanchandani, K., et al. (2025). Automated Invoice Data Extraction: Using LLM and OCR. arXiv preprint arXiv:2511.05547. Abgerufen von https://arxiv.org/pdf/2511.05547
[6] Tier-Akte. (2026). Impfpass in 30 Sekunden abfotografieren. Abgerufen von https://www.tier-akte.de/impfpass-in-30-sekunden/
[7] FellAkte. (2026). App für Hund & Katze: Impfpass, Gesundheit. Abgerufen von https://fellakte.de/
