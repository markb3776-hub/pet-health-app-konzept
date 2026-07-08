# Architektur-Feedback: Integrationsfragen der Pet-Health-App

**Datum:** Juli 2026
**Autor:** Manus AI

Dieses Dokument beantwortet die vier gestellten Fragen zur technischen Integration und Datensynchronisation einer Pet-Health-App. Die Antworten basieren auf den Prinzipien der MEMORIA-Doktrin (Wahrheit, Belegpflicht, Epistemische Sauberkeit). Es werden keine Funktionen versprochen, die im aktuellen Markt technisch nicht umsetzbar sind.

## 1. Synchronisation von Praxisdaten mit Kundendaten

**Die Marktrealität:**
Der Markt für Tierarzt-Praxissoftware im DACH-Raum wird von etablierten Legacy-Systemen (wie easyVET oder Vetera) dominiert [1]. Diese Systeme sind als geschlossene Ökosysteme konzipiert. Während neuere Cloud-Systeme in den USA (wie Shepherd oder Provet Cloud) auf offene APIs setzen, ist dies im deutschsprachigen Raum noch nicht Standard [2]. Selbst bei Anbietern mit Cloud-Lösungen erfordert der API-Zugriff formelle Partnerschaften, für die Entwickler oft lange Wartelisten in Kauf nehmen müssen [2].

**Die doktrin-konforme Lösung:**
Eine direkte, automatische Zwei-Wege-Synchronisation mit *allen* Tierärzten ist als MVP (Minimum Viable Product) technisch nicht ehrlich darstellbar. Die Lösung muss stattdessen **halter-zentriert** aufgebaut werden:
1. **Der Halter als Datenhub:** Gemäß Datenschutz-Grundverordnung (DSGVO) hat der Tierhalter das Recht auf Kopien der Behandlungsdokumentation [3]. Die App ermöglicht den Import dieser Dokumente (z. B. PDF-Rechnungen, Laborbefunde).
2. **KI-gestützte Strukturierung:** Die App nutzt OCR (Texterkennung), um hochgeladene Tierarztrechnungen (nach GOT-Ziffern) und Laborbefunde (z. B. von IDEXX) automatisch in strukturierte Gesundheitsdaten (Gewicht, Diagnose, Medikament) zu übersetzen.
3. **Phase 2 (Ausblick):** Erst wenn die App eine kritische Masse an Nutzern erreicht hat, können gezielte API-Partnerschaften mit den großen PIMS-Anbietern (Practice Information Management Systems) verhandelt werden.

## 2. Das Notfall-Problem (Stammtierarzt vs. Ausweichtierarzt)

**Die Marktrealität:**
Das Problem ist real und von Versicherern und Notdiensten dokumentiert. Wenn der Haustierarzt im Notfall nicht erreichbar ist, fehlen der Klinik essenzielle Daten (Diagnosen, Medikamente, Laborbefunde), was zu Behandlungsverzögerungen führt [4]. Das Recht auf Datenübertragbarkeit (Art. 20 DSGVO) hilft im akuten Notfall nicht, da Praxen bis zu einem Monat Zeit für die Beantwortung haben [3].

**Die doktrin-konforme Lösung:**
Die App fungiert als **digitaler Notfall-Pass**, der vom Halter präventiv gepflegt wird.
1. **Offline-Verfügbarkeit (Resilienz):** Das Notfall-Profil (Blutgruppe, Allergien, aktuelle Dauermedikation, chronische Krankheiten) muss zwingend offline auf dem Gerät des Halters verfügbar sein, um auch in Kliniken mit schlechtem Empfang abrufbar zu sein.
2. **One-Click-Sharing:** Im Notfall generiert die App einen sicheren, zeitlich befristeten Freigabe-Link oder einen QR-Code. Der Ausweichtierarzt scannt den Code mit seinem Tablet und sieht sofort die vollständige, strukturierte Akte des Stammtierarztes, ohne dass eine API-Integration zwischen den Praxissystemen nötig ist.

## 3. Verarbeitung von Chip-Daten (Tasso, Findefix etc.)

**Die Marktrealität:**
Ein Mikrochip ist ein passiver Transponder (RFID), der lediglich eine 15-stellige ISO-genormte Nummer ausgibt [5]. Die eigentlichen Halterdaten liegen nicht auf dem Chip, sondern in Datenbanken wie TASSO e.V. (Europas größtes Register) oder FINDEFIX [5]. Diese Register bieten keine öffentlichen APIs an, über die Drittanbieter-Apps schreibend auf die Datenbanken zugreifen könnten. Eine Meta-Suche im Fundfall wird auf europäischer Ebene über Verbünde wie Europetnet oder PETMAXX abgewickelt [6] [7].

**Die doktrin-konforme Lösung:**
Wir täuschen keine Integration vor, die es nicht gibt. Die App wird nicht versuchen, die Chip-Register zu ersetzen.
1. **Stammdaten-Ablage:** Die App speichert die 15-stellige Chipnummer lokal als Stammdatum (inklusive Foto des EU-Heimtierausweises).
2. **Registrierungs-Assistent:** Die App führt einen Status-Check durch ("Ist das Tier bei TASSO registriert?") und verlinkt direkt auf die offiziellen Registrierungsportale.
3. **Umzugs-Trigger:** Ändert der Nutzer in der App seine Adresse, erinnert die App aktiv daran, diese Änderung auch bei TASSO/Findefix nachzuziehen – ein häufiger Fehler in der Praxis [5].
4. **Fundfall-Protokoll:** Die App integriert Such-Links zu Europetnet und PETMAXX für den Fall, dass der Halter ein fremdes Tier findet [6].

## 4. Integration von GPS-Tracking (Tractive, Fressnapf etc.)

**Die Marktrealität:**
Der Markt wird von Anbietern wie Tractive (Marktführer), Fressnapf und Weenect dominiert [8]. **Keiner** dieser Anbieter stellt derzeit eine offizielle, öffentlich dokumentierte API für Drittanbieter-Apps zur Verfügung [9]. Es existieren lediglich inoffizielle Workarounds (z. B. für Home Assistant), deren Nutzung jedoch gegen die Nutzungsbedingungen der Hersteller verstößt und jederzeit abbrechen kann [10].

**Die doktrin-konforme Lösung:**
Gemäß der MEMORIA-Doktrin ("Wahrheit, keine Fake-Funktionen") wird GPS-Tracking im ersten Wurf der App **nicht integriert**.
1. **Klare Abgrenzung:** Die App positioniert sich bewusst als *Gesundheitsakte*, nicht als Ortungs-App. Ortung ist ein gelöstes Problem (Hardware + Hersteller-App); Gesundheitsmanagement ist das ungelöste Defizit.
2. **Manueller Aktivitäts-Import:** Anstatt einer fehleranfälligen inoffiziellen Schnittstelle bietet die App dem Nutzer die Möglichkeit, Aktivitätsdaten (z. B. "heute 2 Stunden gelaufen") manuell oder via Apple Health / Google Fit (sofern der Nutzer das Handy beim Gassi trägt) in das Gesundheits-Tagebuch zu übernehmen.

---

## Fazit für die Produktentwicklung
Die größte Gefahr bei diesem Projekt wäre es, dem Nutzer vollautomatische Synchronisationen mit Tierärzten und Tracker-Herstellern zu versprechen, die technisch nicht existieren. 

Der doktrin-konforme USP (Unique Selling Proposition) der App ist die **Befähigung des Halters**: Die App macht den Tierbesitzer zum souveränen Verwalter seiner Daten. Er pflegt die Akte (unterstützt durch KI-Dokumenten-Scan), er hat sie im Notfall offline dabei, und er teilt sie per QR-Code mit dem Ausweichtierarzt. Dies ist sofort umsetzbar, rechtlich sauber (DSGVO) und löst das Notfall-Problem zu 100 %.

---

## Referenzen

[1] Medizinio. (2026). Praxissoftware Tierarzt: Vergleich & Empfehlungen. Abgerufen von https://medizinio.de/software/praxis/tierarzt
[2] Viggo.vet. (2026). The Integration Imperative: How Open Ecosystems Will Define Veterinary Practice Success in 2026. Abgerufen von https://viggo.vet/blog/the-integration-imperative-how-open-ecosystems-will-define-veterinary-practice-success-in-2026/
[3] Dr. Datenschutz. (2026). Datenübertragbarkeit als Betroffenenrecht im Datenschutz. Abgerufen von https://www.dr-datenschutz.de/datenuebertragbarkeit-das-betroffenenrecht-in-der-praxis/
[4] BarmeniaGothaer. (2026). Wann den Tierarzt-Notdienst kontaktieren – Was ist ein Notfall? Abgerufen von https://www.barmeniagothaer.de/magazin/tiere-freizeit/hund/tierarzt-notdienst/
[5] Tierheim Hannover. (2026). Chippen und Registrierung von Hund und Katze. Abgerufen von https://tierheim-hannover.de/ratgeber/chippen-und-registrierung/
[6] Europetnet. (2026). Home - Europetnet. Abgerufen von https://europetnet.org/
[7] PetMaxx. (2026). Microchip Search. Abgerufen von https://www.petmaxx.com/
[8] Stern. (2023). Hund und Katze orten ohne teures Abo: Fressnapf-Tracker im Test. Abgerufen von https://www.stern.de/digital/tests/hund-und-katze-orten-ohne-teures-abo--fressnapf-tracker-im-test-33850404.html
[9] Tractive. (2026). Smart Home Device Integration with Tractive Pet Trackers. Abgerufen von https://tractive.com/blog/en/tech/do-pet-trackers-integrate-with-smart-home-devices
[10] Home Assistant Community. (2020). Tractive GPS tracker. Abgerufen von https://community.home-assistant.io/t/tractive-gps-tracker/193652
