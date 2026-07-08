# Ehrliche Machbarkeitsbewertung: Datenübernahme ins Praxissystem

Die Recherche zu den Import-Wegen europäischer Tierarzt-Praxissoftware liefert ein klares, aber ehrliches Bild: Es gibt aktuell **keinen allgemeingültigen, automatisierten Weg**, strukturierte Daten in jedes beliebige Praxissystem zu schreiben. Eine App, die dies verspricht, ist entweder auf einen einzelnen Anbieter beschränkt (z. B. petsXL auf easyVET) oder lügt.

Im Folgenden werden die realistischen Übernahme-Wege anhand von Branchenanalysen und Software-Dokumentationen bewertet.

## Die Realität in Europas Tierarztpraxen

Laut einer aktuellen Marktanalyse (Juni 2026) ist der Standard-Workflow für externe Dokumente in europäischen Tierarztpraxen vollständig manuell geprägt [1]. Die Veterinärmedizin verfügt im Gegensatz zur Humanmedizin über kein Äquivalent zu universellen Datenstandards wie HL7 oder FHIR. Zwar existieren Terminologien wie SNOMED-CT Veterinary, diese werden jedoch in der Datenübertragung zwischen Laboren und Praxisverwaltungssystemen (PIMS) "nicht routinemäßig" verwendet [2].

Die Folge: Es gibt rund 15 große Praxisverwaltungsplattformen mit geschlossenen, oft gebührenpflichtigen Schnittstellen [1]. Der kommerzielle Lock-in der Anbieter verhindert eine organische, offene Interoperabilität.

> "Ein grundlegender Datentransfer könnte bedeuten, dass ein Labor ein PDF per E-Mail sendet, das an eine Patientenakte angehängt wird. [...] Echte bidirektionale Integration bedeutet, dass strukturierte Daten in beide Richtungen fließen [...] Die meisten europäischen Praxen befinden sich derzeit näher am ersten als am zweiten Zustand." [1]

## Drei realistische Übernahme-Stufen für unsere App

Basierend auf diesen Fakten ergeben sich drei Stufen der Datenübernahme, die das Praxispersonal nutzen kann, wenn es die Browser-Ansicht unserer App (via QR-Code oder Link) öffnet:

### Stufe 1: Der Dokumenten-Anhang (100 % Kompatibilität heute)
**Wie es funktioniert:** Das Praxispersonal öffnet die Browser-Ansicht und klickt auf "Als Notfall-Pass herunterladen" (PDF). Dieses PDF wird als Dokument an die digitale Patientenakte des Tieres angehängt.
**Warum es funktioniert:** Die Dokumentenablage (für PDFs, Bilder, Vorberichte) ist eine Kernfunktion **jedes** modernen Praxissystems, egal ob inBehandlung, ezyVet, easyVET oder Vetera [3] [4].
**Die Einschränkung:** Wenn der Tierarzt bestimmte Werte (z. B. eine chronische Erkrankung) nicht nur im PDF lesen, sondern als strukturiertes Stammdatum im System haben will, muss das Personal diese Werte händisch abtippen – exakt so, wie es bei E-Mail-Befunden von Laboren oder Fremd-Tierärzten heute schon geschieht [1].

### Stufe 2: Copy-Paste-Optimierung (Unser USP für das Personal)
**Wie es funktioniert:** Um das unvermeidbare Abtippen zu minimieren, bietet unsere Browser-Ansicht eine für Praxispersonal optimierte Darstellung. Neben jedem wichtigen Datenblock (Medikation, Allergien, Signalement) befindet sich ein "Kopieren"-Button.
**Warum es funktioniert:** Das Personal kann die essenziellen Textblöcke mit einem Klick in die Zwischenablage nehmen und in die entsprechenden Freitextfelder ihrer Praxissoftware einfügen. Dies reduziert Tippfehler (Transkriptionsfehler) auf null und beschleunigt den Prozess massiv.

### Stufe 3: Echte API-Integration (Zukunftsmusik)
**Wie es funktioniert:** Daten fließen unsichtbar und strukturiert von unserer App direkt in die Datenbankfelder des Praxissystems.
**Die ehrliche Bewertung:** Dies ist für ein MVP (Minimum Viable Product) nicht darstellbar. Es erfordert individuelle, oft kostenpflichtige Partnerschaften mit den Herstellern der Praxissoftware [1]. Gemäß MEMORIA-Doktrin versprechen wir diese Integration nicht, sondern kommunizieren sie transparent als langfristiges Ziel bei Erreichen einer kritischen Nutzermasse.

## Fazit für das Produkt-Design

Der QR-Code (oder Kurzlink) führt zu einer Landingpage, die speziell für Praxispersonal am Empfang oder im Behandlungszimmer gestaltet ist. Sie bietet:
1. Sofortige Lesbarkeit der kritischen Notfalldaten im Browser.
2. Einen 1-Klick-Download eines übersichtlichen PDFs (für den Standard-Ablage-Workflow der Praxis).
3. Kopier-Buttons für alle Textblöcke (für die manuelle, aber fehlerfreie Übernahme in System-Felder).

Dies ist der einzige Weg, der **heute, praxissystem-unabhängig und ohne falsche Versprechungen** funktioniert.

## Quellen

[1] Tandem Health (2026): *Warum die Interoperabilität von Tierarztsoftware in Europa begrenzt bleibt*. Analyse zur Integration von Laborsystemen und Praxisverwaltungssoftware.
[2] Association for Veterinary Informatics (2016): *A method for extracting electronic patient record data from practice management software*. PMC5073902.
[3] inBehandlung.de (2026): *Digitale Patientenakte für Tierärzte: Fotos, Videos und Dateien zentral hinterlegen*.
[4] ezyVet Knowledge Center (2025): *Add documents and files to records*. Dokumentation zum Hinzufügen von PDF-Dokumenten und Bildern.
