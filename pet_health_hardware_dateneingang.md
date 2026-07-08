# Analyse: Dateneingang und Hardware in Tierarztpraxen

**Datum:** Juli 2026
**Autor:** Manus AI

Dieses Dokument beantwortet die Frage, wie Tierarztpraxen aktuell Daten einlesen und ob vorhandene Praxis-Hardware genutzt werden kann, um Daten aus unserer geplanten Pet-Health-App auszulesen.

## 1. Aktuelle Dateneingangskanäle in Praxen

Tierarztpraxen sind bei der Dateneingabe derzeit stark fragmentiert. Branchenberichten zufolge verlieren Praxen wöchentlich 5 bis 10 Stunden durch rein manuelle Dateneingabe [1]. Die primären Wege, auf denen heute Daten in das Praxisverwaltungssystem (PIMS) gelangen, sind:

1. **Manuelle Eingabe (Tastatur):** Der häufigste Weg für Fremdbefunde und Anamnesen.
2. **Dokumentenscanner:** Papierdokumente werden von der Rezeption eingescannt (oft gekoppelt mit Archiv-Software wie mediDOK oder x.archiv) und manuell der Patientenakte zugewiesen [2].
3. **Geräte-Schnittstellen (Labor/Bildgebung):** Etablierte Schnittstellen existieren fast ausschließlich für In-House-Blutmessgeräte (z. B. IDEXX, Scil) und DICOM-Bildgebung [3].
4. **Digitale Anamnesebögen:** Neuere Systeme (z. B. petflare) lassen Halter vorab Formulare am Smartphone ausfüllen, die strukturiert ins PIMS laufen [4].

## 2. Welche Hardware steht in der Praxis zur Verfügung?

Um Daten aus unserer App in die Praxis zu bekommen, müssen wir die Hardware nutzen, die bereits flächendeckend vorhanden ist. Spezielle Zusatzhardware wird keine Praxis für eine unabhängige App anschaffen.

| Vorhandene Hardware | Was sie aktuell liest | Kann sie unsere App-Daten lesen? |
| :--- | :--- | :--- |
| **Chip-Lesegerät (RFID-Handscanner)** | Liest ausschließlich den passiven 134,2-kHz-Transponder (Chip) unter der Haut des Tieres [5]. | **Nein.** Ein Chip-Scanner funkt auf einer speziellen RFID-Frequenz. Smartphones können dieses Signal weder empfangen noch simulieren. |
| **2D-Barcode-Scanner (Kabel/Bluetooth)** | Meist an der Rezeption vorhanden für den Verkauf von Futter und Medikamenten (Warenwirtschaft). | **Ja.** Ein Standard-2D-Scanner kann einen auf dem Smartphone-Display angezeigten QR-Code scannen und die enthaltene URL im Praxis-Browser öffnen. |
| **Smartphones / Tablets des Teams** | Werden zunehmend im Behandlungszimmer für Fotos oder Cloud-PIMS-Zugriff genutzt. | **Ja.** Jedes Standard-Smartphone/-Tablet kann über die Kamera-App QR-Codes scannen und direkt den Notfall-Pass der App im Browser öffnen. |
| **PC mit Internetbrowser** | Steht in jedem Behandlungszimmer und an der Anmeldung. | **Ja.** Über einen per E-Mail gesendeten Freigabe-Link oder einen abgetippten Kurz-Code (z. B. app.de/1234) kann die Praxis die Daten sofort abrufen. |

## 3. Die Konkurrenz-Situation und unsere Lücke

Die Recherche hat gezeigt, dass die großen Software-Hersteller genau diesen Weg (QR-Code & Smartphone) bereits erfolgreich gehen – allerdings als **geschlossene Systeme**:

* **petsXL:** Diese Halter-App gehört zur VetZ GmbH (Entwickler des Marktführers easyVET, Teil des Mars-Konzerns). Sie bietet digitale Patientenaufnahme und einen QR-Code-Check-in an der Praxis-Anmeldung [6]. Ein Nutzerbericht bestätigt: *"Als ich in die Klinik überwiesen wurde, mussten wir keine Zettel ausfüllen. Die hatten einfach solch einen Handycode und schon hatte die Klinik meine Daten."* [6] Das Problem: Es funktioniert *nur* mit Praxen, die easyVET nutzen.
* **Petleo:** Bietet einen digitalen Heimtierausweis an. Der Tierarzt verifiziert Impfungen über die Praxissoftware (Vetera). Danach erhält der Halter in der App einen QR-Code, den andere Praxen oder Tierpensionen scannen können, um den Impfstatus abzurufen [7].
* **MeineTiere.app:** Eine Web-App, die exklusiv an die Software *vetpraxis.de* angebunden ist. Tierhalter können dort ihre Tagebuch-Einträge an die Praxis senden [8].

**Unsere doktrin-konforme Strategie (Die Marktlücke):**
Die Praxen sind bereits an den Umgang mit QR-Codes gewöhnt (siehe petsXL und Petleo). Der große Frust bei Tierhaltern entsteht jedoch durch die Fragmentierung: Wechselt der Halter den Tierarzt (oder muss in eine Ausweichklinik), bricht das geschlossene System zusammen, weil die neue Klinik eine andere Software nutzt.

Unsere App positioniert sich als **PIMS-unabhängige, haltergeführte Universalakte**. 
Wir nutzen keine proprietären Schnittstellen, sondern das universellste Protokoll der Welt: **Einen sicheren Weblink, verpackt in einen QR-Code.** 
Der Tierarzt (oder Notdienst) scannt den QR-Code auf dem Handy des Halters einfach mit seinem Praxis-Tablet oder dem Barcode-Scanner an der Anmeldung. Im Browser öffnet sich sofort die strukturierte Notfallakte (Allergien, Dauermedikation, letzte Laborwerte) – komplett unabhängig davon, ob die Praxis easyVET, Vetera oder Karteikarten nutzt.

---

## Referenzen

[1] Adam Wysocki. (2025). Veterinary software surprises: Integration gaps are the silent practice killer. LinkedIn. Abgerufen von https://www.linkedin.com/posts/the-adam-wysocki_i-just-hit-a-milestone-100-in-depth-conversations-activity-7388567757002493952-7TCb
[2] mediDOK. (2026). Digitales Praxisarchiv. Abgerufen von https://nordprax.de/medidok-praxisarchiv/
[3] Medizinio. (2026). Praxissoftware Tierarzt: Vergleich & Empfehlungen. Abgerufen von https://medizinio.de/software/praxis/tierarzt
[4] petflare. (2026). Online-Anamnese Tierarzt. Abgerufen von https://petflare.io/funktionen/online-anamnese
[5] Findefix. (2026). Chiplesegeräte. Abgerufen von https://www.findefix.com/service/chiplesegeraete/
[6] petsXL. (2026). Smarte Tiergesundheit. Abgerufen von https://www.petsxl.com/
[7] Petleo. (2026). Heimtierausweis Onboarding (DE). Abgerufen von https://26852832.fs1.hubspotusercontent-eu1.net/hubfs/26852832/TBD_Petleo%20Heimtierausweis%20Onboarding%20(DE)%20.pdf
[8] vetpraxis. (2026). Smartphone-App für Tierhalter. Abgerufen von https://www.vetpraxis.de/funktionen/tierhalter-app
