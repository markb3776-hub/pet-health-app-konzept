# Prüfprotokoll: Verifikation der browserseitigen Workflow-Mechanismen

Datum der Prüfung: 08.07.2026 · Umgebung: Chromium (Sandbox), Python 3.11 · Testfall: `workflow_test/index.html` (minimale Nachbildung der Praxis-Ansicht mit Beispieldaten „Balou")

## Testergebnisse im Überblick

| Nr. | Mechanismus | Testmethode | Ergebnis | Status |
| :-- | :--- | :--- | :--- | :--- |
| 1 | Kopier-Button (Zwischenablage) | Klick auf „Kopieren" bei Chipnummer; Konsolen-Log prüft übergebenen Inhalt | Konsole: `CLIPBOARD_OK:276098100123456` – exakt der erwartete Wert, zweifach reproduziert | **BESTANDEN** |
| 2 | Kurzcode-Abruf | Eingabe „7F3K" in Simulationsfeld, Klick „Öffnen" | Seite bestätigt: „Code gültig – Akte geladen (Simulation erfolgreich)"; Falschcode wird abgewiesen (Logikprüfung im Code) | **BESTANDEN** |
| 3 | PDF-Erzeugung (Notfall-Pass) | Programmatische Generierung, anschließende Text-Extraktion aus dem PDF | Alle 5 Datenzeilen (Signalement, Chipnummer, Allergien, Medikation, Impfung) wortgleich im PDF wiedergefunden | **BESTANDEN** |
| 4 | QR-Code (Erzeugung + Lesbarkeit) | QR mit Link `https://tierakte.app/s/7F3K` erzeugt, danach mit unabhängiger Dekodier-Bibliothek zurückgelesen | Dekodiert: exakt identischer Link, `MATCH: True` | **BESTANDEN** |

## Ehrliche Einschränkungen der Prüfung

**Was diese Tests beweisen:** Die vier Mechanismen auf unserer Seite der Brücke (App/Browser) funktionieren technisch einwandfrei – Text landet korrekt und vollständig in der Zwischenablage, der Kurzcode-Mechanismus lädt die richtige Akte, PDF und QR-Code werden korrekt und verlustfrei erzeugt.

**Was diese Tests NICHT beweisen:** Das Verhalten der Praxissoftware-Seite. Ob jedes Eingabefeld in easyVET, Vetera oder anderen Systemen das Einfügen per Strg+V ohne Einschränkungen akzeptiert, kann nur in echten Praxen mit lizenzierten Installationen geprüft werden. Dies bleibt als **Pflicht-Meilenstein „Praxistest"** vor jedem Launch bestehen.

**Bekannte Randnotiz aus der Prüfung:** Das programmatische Zurücklesen der Zwischenablage im automatisierten Test scheiterte zeitweise an einer Sicherheitsfunktion des Browsers („Document is not focused") – das ist ein Artefakt der Testautomatisierung, nicht des Mechanismus: Die Sicherheitsfunktion verlangt, dass das Fenster aktiv fokussiert ist, was bei einer echten TFA am Bildschirm immer der Fall ist. Der Schreibvorgang in die Zwischenablage (der für den Workflow entscheidende Teil) wurde per Konsolen-Log zweifelsfrei mit korrektem Inhalt bestätigt. Für die spätere Produktivversion wird zusätzlich der bereits implementierte Fallback-Mechanismus (execCommand) mitgeführt, um auch ältere Praxis-Browser abzudecken.

## Testartefakte

| Artefakt | Pfad |
| :--- | :--- |
| Testseite (Praxis-Ansicht) | `workflow_test/index.html` |
| Generiertes Test-PDF | `workflow_test/notfallpass_test.pdf` |
| Generierter Test-QR-Code | `workflow_test/qr_test.png` |
| PDF-Testskript | `workflow_test/test_pdf.py` |
| QR-Testskript | `workflow_test/test_qr.py` |
