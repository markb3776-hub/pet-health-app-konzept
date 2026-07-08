# Berechtigungs-Konzept – Pet-Health-App

**Status:** Konzeptphase · Teil der verbindlichen Projektunterlagen
**Grundsatz:** Datenminimierung (DSGVO Art. 5), Anfrage im Moment des Bedarfs, ehrliche Begründung vor jedem System-Dialog. Keine Berechtigung wird „auf Vorrat" angefragt. Die App bleibt ohne jede erteilte Berechtigung grundlegend nutzbar.

---

## 1. Übersicht: Welche Berechtigungen die App braucht

| Berechtigung (Android) | Wofür | Wann angefragt | Pflicht? |
| :--- | :--- | :--- | :--- |
| Kamera | Tierfoto aufnehmen, Impfpass/Rechnung scannen | Beim ersten Tippen auf „Foto aufnehmen" oder „Scannen" | Nein – Alternative: Galerie-Auswahl oder manuelle Eingabe |
| Fotos/Medien (Auswahl) | Vorhandenes Tierfoto oder Dokument aus der Galerie wählen | Beim ersten Tippen auf „Aus Galerie wählen" | Nein – moderner Foto-Picker, kein Vollzugriff auf die Galerie |
| Benachrichtigungen | Erinnerungs-Push (Impfung, Medikament, Termin) | Bei Aktivierung der ersten Erinnerung | Nein – aber Kernfunktion; Ablehnung wird respektiert und ehrlich erklärt, was dann nicht funktioniert |
| Standort (ungefähr/genau, nur bei Nutzung) | Praxis-/Klinik-Suche in der Nähe, Notdienst-Suche | Beim ersten Tippen auf „In meiner Nähe suchen" | Nein – Alternative: PLZ/Ort von Hand eingeben |
| Mikrofon | Sprachnotiz („Habe Balou heute entwurmt") | Beim ersten Tippen auf das Mikrofon-Symbol | Nein – Alternative: Texteingabe |
| Kalender (schreiben) | Optionaler Termin-Export in den Gerätekalender | Bei Aktivierung des Kalender-Syncs in den Einstellungen | Nein – reines Opt-in-Komfortfeature |

**Bewusst NICHT angefragt werden:** Kontakte, Telefon, SMS, Hintergrund-Standort, Bluetooth, Aktivitätsdaten, Werbe-ID-Tracking. Die App hat dafür keinen legitimen Bedarf – und genau das kommunizieren wir auch als Vertrauensmerkmal (Gegenentwurf zum dokumentierten LennLu-Problem: App-übergreifendes Tracking trotz Gesundheitsdaten).

---

## 2. Die drei Regeln der Berechtigungs-Anfrage

### Regel 1: Kontext vor System-Dialog
Vor jedem System-Berechtigungsdialog zeigt die App einen eigenen, menschlich formulierten Hinweis, warum sie die Berechtigung jetzt braucht:
> „Um den Impfpass zu scannen, braucht die App Zugriff auf deine Kamera. Das Foto bleibt in deiner Akte – es wird nur zur Texterkennung verarbeitet."

Erst nach diesem Kontext-Bildschirm kommt der System-Dialog. Grund: Der System-Dialog darf nur einmal abgelehnt werden, bevor Android ihn dauerhaft sperrt – eine unvorbereitete Anfrage verbrennt diese Chance.

### Regel 2: Ablehnung ist ein gültiger Zustand
Lehnt der Nutzer ab, funktioniert die App weiter – mit ehrlich benanntem Funktionsverzicht statt Nörgel-Schleife:
- Ohne Kamera: manuelle Eingabe + Galerie-Import bleiben voll nutzbar
- Ohne Standort: PLZ-Suche liefert dieselben Ergebnisse
- Ohne Benachrichtigungen: Aufgaben bleiben in App und Widget sichtbar; die App zeigt einmalig (nicht wiederholt): „Ohne Benachrichtigungen können wir dich nicht an Bennos Impfung erinnern – du findest fällige Aufgaben weiterhin auf dem Startbildschirm."

### Regel 3: Minimal-Variante bevorzugen
- **Fotos:** Es wird der system-eigene Foto-Picker verwendet (Photo Picker API) – die App erhält nur die konkret ausgewählten Bilder, niemals Vollzugriff auf die Galerie.
- **Standort:** Nur „bei Nutzung der App", niemals Hintergrund-Standort. Für die Praxis-Suche genügt der ungefähre Standort; der genaue wird nur angeboten, wenn der Nutzer die Entfernungs-Sortierung präzisieren will. Der Standort wird für die Suche verwendet und nicht gespeichert – kein Bewegungsprofil.
- **Kalender:** Schreibzugriff nur auf den vom Nutzer gewählten Kalender; die App liest keine fremden Termine (nur die selbst erstellten Einträge zur Aktualisierung/Entfernung).

---

## 3. Standort im Detail: Praxis-/Klinik-Suche

Der Anwendungsfall: „Sonntag, Notfall, Stammtierarzt zu – wo ist die nächste erreichbare Klinik?"

- **Anfragezeitpunkt:** Erst beim Tippen auf „Notdienst/Praxis in meiner Nähe suchen" – nicht beim Onboarding, nicht beim App-Start.
- **Fallback ohne Berechtigung:** Eingabefeld für PLZ/Ort, gleiche Ergebnisliste. Niemand wird zur Standortfreigabe gezwungen, um im Notfall Hilfe zu finden – das wäre ein Doktrin-Verstoß (Druck in einer Stresssituation).
- **Transparenz:** In den Einstellungen unter „Deine Daten" steht sichtbar, dass Standortdaten nur bei aktiver Suche verwendet und nicht gespeichert werden.
- **Notfall-Kontext:** Im Notfall-Pass-Bereich gibt es den Schnellzugriff „Notdienst finden" – auch hier gilt: Standort optional, PLZ-Weg immer verfügbar.

## 4. Kamera/Fotos im Detail: Tierfoto und Dokumenten-Scan

- **Tierfoto (Passbild):** Kamera ODER Galerie – beides gleichwertig angeboten. Zuschneide-Rahmen danach. Das Foto bleibt in der Akte des Nutzers (EU-Server, verschlüsselt) und wird nicht für andere Zwecke verwendet.
- **Dokumenten-Scan (Impfpass, Rechnung):** Kamera für den Schnappschuss, danach KI-Extraktion mit Bestätigungspflicht (wie im Datenkatalog festgelegt). Das Originalbild wird als Beleg in der Akte gespeichert – der Nutzer kann es jederzeit löschen.
- **Play-Store-Relevanz:** Google prüft Gesundheits- und Foto-Berechtigungen streng. Unsere Datenminimierung (Photo Picker statt Speicher-Vollzugriff, kein Hintergrund-Standort) ist zugleich die beste Absicherung gegen Store-Ablehnungen.

---

## 5. Play-Store-Deklaration (Vorausschau)

Für den Release müssen alle Berechtigungen und Datenverwendungen in der **Data Safety Section** des Play Store deklariert werden. Unsere Deklaration wird kurz und sauber:
- Erhoben: Konto-E-Mail, Tierakten-Daten (nutzergeneriert), Fotos (nutzergeneriert)
- Nicht erhoben: Standortverlauf, Kontakte, Werbe-Identifikatoren
- Keine Datenweitergabe an Dritte zu Werbezwecken; keine Drittanbieter-Tracker im Code (Gegenentwurf zu LennLu)

**Testpflicht (Produktions-Protokoll):** Jeder Berechtigungs-Fluss wird in beiden Zuständen getestet – erteilt UND abgelehnt. Eine App, die bei abgelehnter Berechtigung abstürzt oder in eine Anfrage-Schleife gerät, gilt als nicht release-fähig.
