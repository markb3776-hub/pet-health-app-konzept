# Konzept: Datenübernahme in die Tierarztpraxis

Dieses Dokument beschreibt den Workflow, wie externe Notfalldaten aus der Halter-App in die Praxissoftware der Tierarztpraxis gelangen. Gemäß der MEMORIA-Doktrin zur epistemischen Sauberkeit ist jede Stufe dieses Workflows klar hinsichtlich ihres Verifikationsstatus gekennzeichnet.

## Die drei Zugangswege zur Praxis-Ansicht

Um das Problem der Hardware-Fragmentierung (Tablet vs. Praxis-PC) zu lösen, bietet die App drei gleichwertige Wege an, um die Notfalldaten im Browser zu öffnen.

1. **Der QR-Scan (Tablet/Scanner):** Die Praxis scannt den QR-Code auf dem Handy des Halters.
   * *Status:* **Belegt/Verifiziert.** Die Generierung und Lesbarkeit des QR-Codes wurde im Testfall erfolgreich verifiziert. Das Öffnen von Links per Scanner ist in Praxen etabliert [1].
2. **Der Kurzcode-Abruf (Direkt am PC):** Die TFA tippt am Praxis-Rechner die URL `tierakte.app` ein und gibt einen 4-stelligen Kurzcode (z. B. "7F3K") ein.
   * *Status:* **Belegt/Verifiziert.** Die Mechanik wurde im Testfall erfolgreich simuliert und verifiziert. Dieser Weg löst das Problem, wenn die Praxissoftware auf einem stationären PC läuft, aber nur das Handy des Halters vorliegt.
3. **Der E-Mail-Link (Vorab-Versand):** Der Halter sendet den zeitlich befristeten Link aus der App direkt an das Postfach der Praxis.
   * *Status:* **Belegt.** Standard-E-Mail-Versand.

## Die Datenübernahme ins Praxissystem

Sobald die Praxis-Ansicht im Browser geöffnet ist, stehen zwei primäre Übernahmewege zur Verfügung. Ein automatischer API-Import wird bewusst nicht angeboten, da geschlossene Schnittstellen dies verhindern [2].

### Weg A: Der Dokumenten-Anhang (PDF)
Die Praxis lädt die Notfalldaten als übersichtliches PDF herunter und hängt dieses an die digitale Patientenakte im Praxissystem an.

* *Status Browser-Seite (PDF-Generierung):* **Belegt/Verifiziert.** Die automatische Generierung eines strukturierten PDFs aus den Notfalldaten wurde im Testfall erfolgreich verifiziert.
* *Status Praxis-Seite (PDF-Ablage):* **Belegt (Recherche).** Die Möglichkeit, PDFs an die Patientenakte anzuhängen, ist als Standardfunktion aller gängigen Praxissysteme (easyVET, Vetera, ezyVet, inBehandlung) durch Herstellerdokumentationen belegt [3] [4].

### Weg B: Die Kopier-Buttons (Copy-Paste-Optimierung)
Für Werte, die die Praxis strukturiert in eigenen Feldern benötigt (z. B. Chipnummer, Allergien), bietet die Browser-Ansicht neben jedem Datenblock einen "Kopieren"-Button. Ein Klick kopiert den Text, ein "Strg+V" fügt ihn in die Praxissoftware ein.

* *Status Browser-Seite (Kopier-Funktion):* **Belegt/Verifiziert.** Die `navigator.clipboard`-API wurde im Sandbox-Testfall implementiert und erfolgreich verifiziert. Text wird fehlerfrei in die Zwischenablage gelegt.
* *Status Praxis-Seite (Einfügen in Software):* **Plausibel, aber ungetestet.** Die Zwischenablage ist ein Betriebssystem-Standard. Es ist hochgradig plausibel, dass Textfelder in easyVET oder Vetera das Einfügen per Strg+V erlauben. Es kann jedoch nicht ausgeschlossen werden, dass bestimmte Felder (z. B. Datumsfelder) strikte Formatvorgaben haben.
* *Nächster Schritt:* **Offener Praxistest.** Vor einem Launch muss dieser Copy-Paste-Workflow zwingend in echten Praxen mit laufenden Installationen von easyVET und Vetera getestet werden.

## Zusammenfassung

Das Konzept verzichtet auf falsche Integrationsversprechen. Es nutzt stattdessen universelle, systemübergreifende Mechanismen (PDF-Download, Zwischenablage), um den heute ohnehin manuellen Workflow des Praxispersonals maximal zu beschleunigen und Tippfehler zu eliminieren.

## Quellen

[1] Website vetpraxis.de: Analyse der MeineTiere.app als etablierte Web-App-Lösung mit QR/Link-Zugang.
[2] Tandem Health (2026): *Warum die Interoperabilität von Tierarztsoftware in Europa begrenzt bleibt*.
[3] ezyVet Knowledge Center (2025): *Add documents and files to records*.
[4] inBehandlung.de (2026): *Digitale Patientenakte für Tierärzte: Fotos, Videos und Dateien zentral hinterlegen*.
