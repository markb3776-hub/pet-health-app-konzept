# Recherche: Wie bekommt Praxispersonal externe Daten ins Praxissystem?

## Zentrale Erkenntnis (Tandem Health, 12.06.2026 – Interoperabilitäts-Analyse Europa)
Der Standard-Workflow in europäischen Tierarztpraxen ist HEUTE manuell: "Ein Befund trifft per E-Mail ein, ein Mitarbeiter öffnet das PDF, liest die Werte ab und gibt sie manuell in das Praxisverwaltungssystem ein." Zwei Ebenen:
1. Grundlegender Datentransfer = PDF wird an die Patientenakte ANGEHÄNGT (Dokumentenablage) – Standard, überall möglich
2. Echte bidirektionale strukturierte Integration – in Europa Ausnahme
"Die meisten europäischen Praxen befinden sich derzeit näher am ersten als am zweiten Zustand."

Belege: Umweltscan 2025: nur 42,4 % der Systeme extrahieren Daten aus EHR/Laboren, nur 9,1 % integrieren bei Erfassung. Veterinärmedizin hat KEIN flächendeckendes HL7/FHIR-Äquivalent; SNOMED-CT-Vet/VeNOM existieren, werden aber laut peer-reviewed Paper (Association for Veterinary Informatics, PMC7382640) von Laboren und PIMS "nicht routinemäßig" verwendet. ~15 große PIMS-Plattformen × 140+ Integrationspartner = potenziell 2.100 Integrationspaare – deshalb keine marktgeführte Lösung. APIs "häufig geschlossen, undokumentiert oder gebührenpflichtig". Kommerzieller Lock-in ist strukturell gewollt.
Quelle: tandemhealth.ai/de/ressourcen/artikel/warum-die-interoperabilitat-von-tierarztsoftware-in-europa-begrenzt-bleibt

## Dokumentenablage in der Patientenakte ist Standardfunktion aller modernen PIMS
- inBehandlung (DE, 07.01.2026): "Fotos, Videos, PDFs und weitere gängige Dateiformate in der Patientenakte hinterlegen... jederzeit auch nach dem Behandlungstermin ergänzen"; eingescannte Dokumente, Überweisungen, VORBERICHTE explizit genannt
- ezyVet (international, IDEXX): "Add documents and files to records" – PDF/Bilder bis 200 MB als file attachment an Patient Record; Standard-Workflow
- easyVET (Thieme-Praxistipps 2025): PDF-Export/Mailversand aus dem System heraus vorhanden; umgekehrt Dokumentenannahme über Ablage
- Vetera: automatisierter Laborbefund-Import NUR über spezielle Laboranbindungen (IDEXX/Scil/Laboklin); externe Fremddokumente = manuelle Ablage
Quellen: inbehandlung.de/dateien-in-der-patientenakte-tierarzt; docs.ezyvet.com; tiermedizin.thieme.de; vetera.net

## Konsequenz für unsere App (3 realistische Übernahme-Stufen)
Stufe 1 (funktioniert HEUTE überall): QR → Browser-Ansicht → Personal lädt unser bereitgestelltes PDF herunter (oder erhält es per Mail-Weiterleitung vom Halter) → hängt es als Dokument an die Patientenakte. Werte, die der Arzt strukturiert braucht (z. B. Allergie in Stammdaten), tippt er selektiv ab – genau wie bei jedem Fremd-Vorbericht heute.
Stufe 2 (Komfort ohne Integration): Unsere Browser-Ansicht bietet "Kopieren"-Schaltflächen je Datenblock + kompakte Zusammenfassungszeile (Signalement/Allergien/Medikation) für schnelles Einfügen ins PIMS-Textfeld; PDF-Download-Button prominent; optional strukturierte Daten als Datei (CSV/JSON) für Praxen, die importieren können.
Stufe 3 (Zukunft, ehrlich als "nicht versprochen" markieren): PIMS-Partnerschaften/API-Integrationen erst bei Nutzermasse; Vendor-APIs geschlossen/kostenpflichtig.

WICHTIG (Ehrlichkeit): Es gibt KEINEN Weg, ohne Praxissoftware-Integration Daten automatisch in das PIMS zu schreiben. Jede App, die das verspricht, lügt oder ist auf einen einzigen Vendor beschränkt (petsXL→easyVET). Der PDF-Anhang an die Akte ist der universelle, heute funktionierende Weg – und exakt derselbe Weg, den Praxen für Laborbefunde per E-Mail heute schon täglich nutzen.
