# SimplyPet – Schritt-für-Schritt-Anleitung Google Play Console

*Alle in diesem Dokument enthaltenen Daten (Paketnamen, URLs, Texte) wurden am 26.07.2026 direkt aus dem Quellcode (app.json) und dem Repository gegengeprüft und sind zu 100 % korrekt.*

---

## 1. Vorbereitung: Alte App löschen & neu anlegen

Da die bisherige App in der Console den falschen Paketnamen (`com.simplydevapps.simplypet`) hatte, muss sie gelöscht und neu angelegt werden, damit sie mit der AAB-Datei (`de.simplypet.app`) übereinstimmt.

1. **Alte App löschen:**
   - Gehe im linken Menü der Play Console auf **Einstellungen → Erweiterte Einstellungen** (oder scrolle ganz nach unten).
   - Klicke auf **App löschen** (oder "App dauerhaft löschen") und bestätige.

2. **Neue App erstellen:**
   - Klicke oben rechts auf **App erstellen**.
   - Fülle das Formular wie folgt aus:
     - **App-Name:** `SimplyPet`
     - **Standardsprache:** `Deutsch – de-DE`
     - **App oder Spiel:** `App`
     - **Kostenlos oder kostenpflichtig:** `Kostenpflichtig`
     - **Paketname (SEHR WICHTIG!):** `de.simplypet.app`
   - Setze die 3 Häkchen unten (Programmrichtlinien, App-Signatur, US-Exportbestimmungen) und klicke auf **App erstellen**.

---

## 2. App-Inhalte (Die 7 Formulare)

Gehe im linken Menü auf **App-Inhalte** und arbeite die Liste von oben nach unten ab. Klicke bei jedem Punkt auf "Starten" oder "Erklärung beginnen".

### 2.1 Datenschutzerklärung
- **URL:** `https://markb3776-hub.github.io/pet-health-app-konzept/privacy.html`
- Eintragen und auf **Speichern** klicken.

### 2.2 Werbe-ID
- **Verwendet deine App eine Werbe-ID?** `Nein`
- Speichern.

### 2.3 Anmeldedaten
- **Auswahl:** `Alle Funktionen sind ohne spezielle Zugriffsrechte verfügbar` (Die App hat keinen Login).
- Speichern.

### 2.4 Datensicherheit
1. **Werden Nutzerdaten erhoben oder geteilt?** `Nein` (Die App speichert alles nur lokal).
2. Auf **Weiter** klicken.
3. Auf **Speichern** klicken.

### 2.5 Einstufung des Inhalts (IARC)
1. E-Mail eintragen: `simplypet.app@gmail.com`
2. Kategorie wählen: `Alle anderen App-Typen` (ganz unten).
3. **Alle Fragen mit "Nein" beantworten** (Gewalt, Schimpfwörter etc.).
4. Auf **Speichern** und **Weiter** klicken.
5. Ergebnis (USK 0) bestätigen.

### 2.6 Zielgruppe und Inhalte
1. **Zielalter:** Nur das Häkchen bei `18 Jahre und älter` setzen.
2. Auf **Weiter** klicken.
3. **Könnte die App unbeabsichtigt Kinder anziehen?** `Nein`
4. Speichern.

### 2.7 Finanzfunktionen
- Ganz nach unten scrollen und das Häkchen setzen bei: `Meine App bietet keine Finanzfunktionen`.
- Speichern.

### 2.8 Gesundheits-Apps
- **Auswahl:** `Meine App ist keine Gesundheits-App` (Tier-Gesundheit zählt für Google nicht als Gesundheits-App).
- Speichern.

---

## 3. Store-Eintrag einrichten

Gehe im linken Menü auf **Wachstum → Store-Präsenz → Haupt-Store-Eintrag**.

### 3.1 Texte eintragen
Kopiere diese exakten Texte:

**App-Name:**
```text
SimplyPet
```

**Kurzbeschreibung:**
```text
Der 100% offline Notfall-Pass für all deine Tiere. Privat & sicher.
```

**Ausführliche Beschreibung:**
```text
SimplyPet – Der digitale Notfall-Pass für deine Tiere

Alle wichtigen Daten deiner Haustiere an einem Ort. 100% offline. 100% privat. Keine Cloud, kein Konto, keine Werbung.

HAUPTFUNKTIONEN:

🐾 Notfall-Pass mit QR-Code
Erstelle für jedes Tier einen digitalen Notfall-Pass mit allen wichtigen Daten. Teile ihn als PDF oder zeige den QR-Code – z.B. beim Tierarzt oder Tiersitter.

🐾 Sitter-Modus mit Vollmacht
Generiere eine Tierarzt-Vollmacht mit digitaler Unterschrift für Tiersitter, Nachbarn oder Familie.

🐾 Gesundheitstagebuch
Dokumentiere Gewicht, Medikamente, Parasitenschutz, Impfungen, Beobachtungen und Tierarztbesuche.

🐾 Termine & Erinnerungen
Verpasse keine Impfung, keine Wurmkur und keinen Tierarzttermin mehr.

🐾 Für ALLE Tierarten
Hund, Katze, Pferd, Vogel, Reptil, Fisch, Kleintier – SimplyPet funktioniert für jedes Haustier.

🐾 Datensicherung & Wiederherstellung
Erstelle lokale Backups deiner Daten und stelle sie bei Gerätewechsel wieder her.

WARUM SIMPLYPET?

✓ 100% OFFLINE – Funktioniert ohne Internet
✓ 100% PRIVAT – Keine Daten verlassen dein Gerät
✓ KEINE WERBUNG – Niemals
✓ KEIN KONTO – Keine Registrierung nötig
✓ EINMALKAUF – Keine Abos, keine In-App-Käufe

Deine Daten gehören dir. Nicht uns. Nicht der Cloud. Nur dir.

Entwickelt von Simply DevApps.
```

### 3.2 Grafiken hochladen
Lade die Bilder von deinem PC in die entsprechenden Felder hoch:

1. **App-Symbol (512x512):** Lade die Datei `icon_512x512.png` hoch.
2. **Vorstellungsgrafik (1024x500):** Lade die Datei `feature_graphic_1024x500.png` hoch.
3. **Screenshots:** Lade mindestens diese 5 Dateien hoch (in dieser Reihenfolge):
   - `01_homescreen_meine_tiere.jpg`
   - `02_termine_bald_faellig.jpg`
   - `08_notfallpass_profil.jpg`
   - `10_notfallpass_qrcode.jpg`
   - `12_mehr_screen.jpg`

Auf **Speichern** klicken.

---

## 4. App-Kategorie und Kontaktdaten

Gehe im linken Menü auf **Wachstum → Store-Präsenz → Store-Einstellungen**.

1. **App-Kategorie:**
   - App oder Spiel: `App`
   - Kategorie: `Lifestyle`
2. **Kontaktdaten:**
   - E-Mail-Adresse: `simplypet.app@gmail.com`
   - Website: `https://markb3776-hub.github.io/pet-health-app-konzept/privacy.html`
3. Auf **Speichern** klicken.

---

## 5. Preis festlegen

Gehe im linken Menü auf **Monetarisierung → App-Preise**.

1. Suche ganz oben das Feld für den **Standardpreis** (oder Basispreis).
2. Trage ein: `2,99 €` (oder deinen Wunschpreis).
3. Klicke auf den Button **"Preise aktualisieren"** oder **"Preise für alle Länder übernehmen"**. (Google rechnet den Preis dann automatisch für alle Länder um).
4. Auf **Speichern** klicken.

---

## 6. Geschlossener Test & AAB hochladen

Gehe im linken Menü auf **Testen → Geschlossener Test**.

1. Klicke oben rechts auf **Track erstellen** (Name z.B. "Alpha-Test").
2. Klicke auf den Tab **Tester**:
   - Wähle **E-Mail-Listen**.
   - Erstelle eine Liste und trage die 12+ Gmail-Adressen deiner Tester ein.
   - Speichere die Liste.
3. Klicke auf den Tab **Releases**:
   - Klicke auf **Neuen Release erstellen**.
   - Klicke im Kasten "App Bundles" auf **Hochladen**.
   - Wähle die Datei `simplyPet_v0.1.8.aab` von deinem PC aus.
   - Trage bei Release-Hinweise ein: `Erste Testversion`
   - Klicke auf **Speichern** und dann auf **Release überprüfen**.
   - Klicke auf **Rollout starten**.

---

## 7. Der Test beginnt

1. Gehe im geschlossenen Test zurück auf den Tab **Tester**.
2. Scrolle nach unten zum Bereich "Wie Tester teilnehmen können".
3. Dort findest du den **Teilnahmelink (Opt-in-Link)**.
4. Kopiere diesen Link und schicke ihn an deine Tester (z.B. per WhatsApp).
5. Die Tester müssen den Link anklicken, zustimmen und die App installieren.
6. **14 Tage warten.** Danach kannst du im Dashboard den Produktionszugriff beantragen.
