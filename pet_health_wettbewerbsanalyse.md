# Wettbewerbsanalyse: Pet-Health-Apps im DACH- und internationalen Markt

## 1. Marktlage und Typologie der Wettbewerber

Die Analyse von 12 relevanten Pet-Health-Apps (DACH und USA) zeigt, dass sich der Markt aktuell in zwei dominierende Lager spaltet, die beide spezifische Defizite aufweisen.

### Typ A: Die B2B2C-Praxis-Apps (petsXL, Petleo, PetDesk, MeineTiere.app)
Diese Apps werden von Praxissoftware-Anbietern oder B2B-Dienstleistern betrieben. Ihr Geschäftsmodell basiert darauf, dass die Tierarztpraxis für das System bezahlt.
**Vorteile:** Tiefe Integration in die teilnehmende Praxis (Online-Termine, automatische Erinnerungen).
**Das Defizit:** Der Lock-in-Effekt. Die Halter-App funktioniert nur vollständig, wenn die Praxis mitmacht. Wechselt der Halter die Praxis (z. B. im Notfall oder Umzug), bricht das System zusammen. Zudem bemängeln Nutzer, dass die Akte davon abhängt, was die Praxis aktiv einpflegt [1] [2].

### Typ B: Die halterzentrierten Standalone-Apps (11pets, LennLu, YourPetDiary, FellAkte, Tier-Akte)
Diese Apps sind unabhängig von Tierärzten und fokussieren sich auf den Halter als Datenpfleger.
**Vorteile:** Unabhängigkeit von der Praxissoftware, alle Tiere an einem Ort.
**Das Defizit:** Der enorme manuelle Pflegeaufwand. Nutzer müssen Laborwerte, Medikamente und Impfdaten händisch abtippen. Zudem versuchen viele dieser Apps, durch fragwürdige KI-Diagnosen (Symptom-Checker) oder Shop-Integrationen (Affiliate-Modelle) zu monetarisieren, was der MEMORIA-Doktrin (Wahrheit und Fokus) widerspricht [3] [4].

## 2. Stärken-Schwächen-Matrix der Top-Wettbewerber

| App (Anbieter) | Kernfunktion | Dokumentierte Schwächen (Nutzer-Reviews) |
| :--- | :--- | :--- |
| **petsXL** (Mars/VetZ) | Praxis-Integration (easyVET), Online-Termine | Paywall auf eigene Daten (Halter muss zahlen), kein PDF-Export, Praxis-Abhängigkeit [1]. |
| **Petleo** (unabhängig, 4,8 Sterne / 1.880 Rezensionen) | Terminbuchung, Gassi-Runden, Akte | Unzuverlässige Erinnerungen, starre Terminlogik (Stornierung bei Änderung nötig); volle Funktion nur mit zahlender Praxis (ab 59 €/Monat) [5]. |
| **FellAkte** (DE, Startup) | KI-Impfpass-Scan, Symptom-Checker | Fragwürdige KI-Diagnosen (Handlungsempfehlungen), Abo-Modell (Premium 4,99 €/M) [6]. |
| **Tier-Akte** (DE, Startup) | KI-Scan, Notfallpass (QR) | Neu am Markt, Paywall ab dem 15. Scan [7]. |
| **11pets** (International) | Umfassende Gesundheitsakte | Manueller Pflegeaufwand, fehlerhafter Dokumenten-Upload (Bug) [8]. |
| **PetDesk** (USA) | Praxis-Kommunikation, Erinnerungen | Sync-Fehler (Erinnerungen für erledigte Termine), verlorene Termin-Anfragen [9]. |
| **vetevo** (DE, 4,8 Sterne / 5.235 iOS-Bewertungen) | Impfpass, Tagebuch, Heimtest-Shop | Fokus auf E-Commerce (Wurmtests) statt Gesundheitsakte; Datenweitergabe an Dritte laut Play-Store-Datensicherheit [10]. |
| **Mein Haustier** (Tierschutzbund) | Ratgeber, Steckbrief, Checklisten | Keine echte Gesundheitsakte, kein Impfmanagement – reine Ratgeber-App [12]. |
| **YourPetDiary** (DE, Startup) | Tierakte, Community, Shop | Sehr geringe Traktion, keine unabhängigen Bewertungen, Shop-Fokus verwässert Kernnutzen [13]. |
| **VitusVet** (USA) | Records, Refills, Erinnerungen | Fokus zunehmend auf B2B-Praxissoftware; ohne teilnehmende Praxis eingeschränkt [14]. |
| **MeineTiere.app** (vetpraxis.de) | Web-App: Rechnungen, Befunde, Termine | Nur mit vetpraxis.de-Praxen; Praxis entscheidet, welche Daten der Halter sieht [11]. |
| **LennLu** (DE, Indie) | Food-Scanner, Akte | Nur auf Englisch verfügbar, Tracker-Datenschutz-Probleme, Einzelentwickler-Risiko [3]. |

## 3. Lücken-Analyse und unsere Positionierung

Die Analyse der Nutzerbeschwerden offenbart drei zentrale Schmerzpunkte, die von keinem der 12 Wettbewerber vollständig und ehrlich gelöst werden:

1. **Der Daten-Lock-in:** Halter klagen darüber, dass sie ihre eigenen Daten bei Praxis-Apps nicht exportieren können (fehlender PDF-Export bei petsXL) oder gar für den Zugriff auf die Historie bezahlen müssen [1].
2. **Der manuelle Aufwand:** Standalone-Apps scheitern oft daran, dass Halter nach der anfänglichen Euphorie aufhören, die Daten händisch einzutippen [8].
3. **Unzuverlässige Kernfunktionen:** Die am häufigsten beworbene Funktion – die Impf- und Medikamentenerinnerung – funktioniert selbst bei Marktführern (Petleo, PetDesk) unzuverlässig, was zu massivem Vertrauensverlust führt [5] [9].

### Unser MEMORIA-konformer Lösungsansatz

Unsere Pet-Health-App zielt exakt in die Lücke zwischen Typ A und Typ B:
* **Halterzentriert, aber ohne Tipparbeit:** Wir nutzen multimodale KI ausschließlich für den Dokumentenscan (Impfpass/Rechnung) zur automatischen Datenerfassung. Keine KI-Diagnosen, keine Ratschläge – strikte Trennung von Dokumentation und Medizin.
* **PIMS-unabhängig, aber für Praxen lesbar:** Wir verzichten auf teure, geschlossene Schnittstellen zu Praxissoftwares. Stattdessen geben wir dem Halter einen zeitlich befristeten QR-Code (Web-Link), den jede Notfallklinik im Browser öffnen kann – ein Ansatz, den die Web-App von *vetpraxis.de* technisch bereits validiert hat [11].
* **Keine Paywall auf eigene Daten:** Der Export der eigenen Gesundheitsdaten (PDF/CSV) muss eine kostenlose Grundfunktion sein. Monetarisiert wird über Komfort-Features (KI-Scans), nicht über Daten-Geiselnahme.

## Quellen

[1] Forenbeiträge und Erfahrungsberichte zu petsXL, u. a. DogForum.de (Juli 2024) und Das-Katzen-Forum (November 2021).
[2] Katzen-Forum.net (September 2022): Diskussion über die Abhängigkeit der petsXL-Akte von der Praxis-Pflege.
[3] App Store (iOS): LennLu App-Beschreibung und Datenschutz-Informationen (Stand: Juli 2026).
[4] Website YourPetDiary (petdiary.tech): Analyse des Funktionsumfangs und der Shop-Integration.
[5] Google Play Store: Nutzerrezensionen zu Petleo (Juni 2026).
[6] Website FellAkte (fellakte.de): Analyse der beworbenen KI-Symptom-Checks.
[7] App Store (iOS): Tier-Akte App-Beschreibung und In-App-Käufe (Stand: Juni 2026).
[8] App Store (iOS): Nutzerrezensionen zu 11pets bezüglich defekter Uploads.
[9] Google Play Store und App Store: Nutzerrezensionen zu PetDesk bezüglich Erinnerungs-Bugs.
[10] Trustpilot und DogForum.de: Erfahrungsberichte zu vetevo.
[11] Website vetpraxis.de: Analyse der MeineTiere.app als Web-App-Lösung.
[12] Deutscher Tierschutzbund (tierschutzbund.de/haustierapp): Funktionsbeschreibung der App „Mein Haustier".
[13] Website YourPetDiary (petdiary.tech) sowie App-Store-Einträge (Stand: Juli 2026).
[14] Website VitusVet (vitusvet.com) und App-Store-Rezensionen (id955252538).
