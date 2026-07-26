# Play Store Einrichtung – Schritt-für-Schritt-Anleitung

> **Für Mark** – Alles was du nach der Google-Identitätsprüfung tun musst.
> Erstellt: 26.07.2026 | Alle Vorbereitungen sind erledigt, du musst nur noch diese Schritte abarbeiten.

---

## VORAUSSETZUNG: Google hat deine Identität bestätigt

Du bekommst eine E-Mail von Google an `simplypet.app@gmail.com` mit der Bestätigung.
Erst danach kannst du die folgenden Schritte durchführen.

---

## SCHRITT 1: Kontakttelefon bestätigen (2 Minuten)

1. Öffne https://play.google.com/console
2. Gehe zu **Einstellungen** (Zahnrad links unten)
3. Unter **Entwicklerkonto** → **Kontaktinformationen**
4. Klicke auf **Telefonnummer bestätigen**
5. Du bekommst eine SMS mit einem Code → eingeben → fertig

---

## SCHRITT 2: Datenschutzerklärung hosten (5 Minuten)

Die Datenschutzerklärung muss als öffentliche Webseite erreichbar sein.

**Option A: GitHub Pages (empfohlen, kostenlos):**
1. Gehe zu https://github.com/markb3776-hub/pet-health-app-konzept/settings/pages
2. Unter "Source" wähle: **Deploy from a branch**
3. Branch: **main**, Ordner: **/ (root)**
4. Klicke **Save**
5. Warte 1-2 Minuten
6. Deine Datenschutzerklärung ist dann erreichbar unter:
   `https://markb3776-hub.github.io/pet-health-app-konzept/PRIVACY_POLICY`

**Option B: Eigene Domain (simplypet.de):**
- Nur nötig wenn du die Domain bereits hast
- Ansonsten reicht GitHub Pages völlig aus

**Merke dir die URL** – du brauchst sie in Schritt 4!

---

## SCHRITT 3: App in Play Console anlegen (5 Minuten)

1. Öffne https://play.google.com/console
2. Klicke **"App erstellen"** (blauer Button oben rechts)
3. Fülle aus:
   - **App-Name:** `SimplyPet`
   - **Standardsprache:** Deutsch
   - **App oder Spiel:** App
   - **Kostenlos oder kostenpflichtig:** Kostenpflichtig
4. Haken setzen bei den Erklärungen (Programmrichtlinien etc.)
5. Klicke **"App erstellen"**

---

## SCHRITT 4: Store-Listing ausfüllen (15 Minuten)

Gehe in der linken Navigation zu **Store-Präsenz** → **Haupt-Store-Eintrag**

### Texte eintragen:
Alle Texte stehen in der Datei `STORE_LISTING.md` im Repository.

| Feld | Was eintragen |
|:---|:---|
| **App-Name** | SimplyPet |
| **Kurzbeschreibung** | Dein unabhängiges Pocket-Tool für deine Liebsten. 100% offline, 100% privat. |
| **Ausführliche Beschreibung** | Den langen Text aus `STORE_LISTING.md` Abschnitt 1 kopieren |

### Grafiken hochladen:
| Was | Datei | Wo im Repo |
|:---|:---|:---|
| **App-Symbol** | `simply_devapps_icon_512x512.jpg` | Hauptordner |
| **Feature Graphic** | `feature_graphic_1024x500.png` | Hauptordner |
| **Screenshots** (min. 2, empfohlen 5) | Siehe unten | Ordner `screenshots/` |

### Screenshots hochladen (empfohlene Reihenfolge):
1. `screenshots/01_homescreen_meine_tiere.jpg`
2. `screenshots/02_termine_bald_faellig.jpg`
3. `screenshots/08_notfallpass_profil.jpg`
4. `screenshots/10_notfallpass_qrcode.jpg`
5. `screenshots/07_datensicherung.jpg`

### Kontaktdaten:
| Feld | Eintragen |
|:---|:---|
| **E-Mail** | simplypet.app@gmail.com |
| **Telefon** | (optional, kannst du leer lassen) |
| **Website** | (optional, die GitHub Pages URL von Schritt 2) |

### Kategorie:
- **App-Kategorie:** Lifestyle
- **Tags:** Haustiere, Gesundheit, Organisation

### Datenschutzerklärung:
- Die URL aus Schritt 2 eintragen (z.B. `https://markb3776-hub.github.io/pet-health-app-konzept/PRIVACY_POLICY`)

→ **Speichern**

---

## SCHRITT 5: App-Inhalte & Richtlinien (10 Minuten)

Gehe in der linken Navigation zu **Richtlinien** → **App-Inhalte**

### 5a) Datenschutzerklärung
- URL eintragen (gleiche wie in Schritt 4)

### 5b) App-Zugang
- Wähle: **"Alle Funktionen sind ohne Einschränkungen verfügbar"**
- (Kein Login, keine Paywall, keine Altersbeschränkung)

### 5c) Anzeigen
- Wähle: **"Nein, meine App enthält keine Werbung"**

### 5d) Content Rating (Altersfreigabe)
- Klicke **"Fragebogen starten"**
- E-Mail: `simplypet.app@gmail.com`
- Kategorie: **"Dienstprogramm, Produktivität, Kommunikation oder Sonstiges"**
- Alle Fragen mit **"Nein"** beantworten:
  - Gewalt? Nein
  - Sexuelle Inhalte? Nein
  - Sprache? Nein
  - Kontrollierte Substanzen? Nein
  - Glücksspiel? Nein
- Ergebnis: **USK 0 / PEGI 3 / Everyone**
- Bestätigen

### 5e) Zielgruppe
- Wähle: **"Alle Altersgruppen"** (NICHT "Kinder" – das löst strengere Prüfungen aus)
- "Richtet sich die App an Kinder?" → **Nein**

### 5f) Data Safety Formular
- **"Übersicht"** → Weiter
- "Sammelt oder teilt deine App Nutzerdaten?" → **Ja**
- "Werden alle erfassten Nutzerdaten verschlüsselt übertragen?" → **Nicht zutreffend** (keine Übertragung)
- "Bietest du eine Möglichkeit zur Datenlöschung?" → **Ja** (App deinstallieren)
- **Datentypen:**
  - Fotos und Videos → **Erfasst** (Tier-Fotos), **NICHT geteilt**
  - Dateien und Dokumente → **Erfasst** (Backup-Dateien), **NICHT geteilt**
  - Alle anderen Kategorien → **Nicht erfasst**
- Für erfasste Daten jeweils angeben:
  - Wird geteilt? → **Nein**
  - Ist die Erfassung optional? → **Ja** (Nutzer muss kein Foto machen)
  - Zweck: **App-Funktionalität**
- → **Speichern und zur Überprüfung einreichen**

---

## SCHRITT 6: AAB hochladen (5 Minuten)

### 6a) AAB herunterladen:
1. Gehe zu https://github.com/markb3776-hub/pet-health-app-konzept/actions
2. Klicke auf den letzten erfolgreichen **"Build AAB"** Workflow-Run
3. Scrolle runter zu **"Artifacts"**
4. Lade `simplyPet_v0.1.8_AAB` herunter (ZIP-Datei)
5. Entpacke die ZIP → darin ist die `.aab`-Datei

### 6b) Geschlossenen Test anlegen:
1. In der Play Console: Linke Navigation → **Testen** → **Geschlossener Test**
2. Klicke **"Neuen Track erstellen"** (oder nutze den Standard-Track "Geschlossener Test")
3. Klicke **"Neue Release erstellen"**
4. **Play App Signing:** Wenn gefragt, aktiviere "Google Play App Signing" → **Weiter**
5. **AAB hochladen:** Ziehe die `.aab`-Datei in das Upload-Feld
6. **Release-Name:** `v0.1.8`
7. **Release-Hinweise:** `Erste Testversion – Haustier-Gesundheits-App mit Notfallpass, Terminen, Dokumentenscan und Backup.`
8. Klicke **"Überprüfen"** → **"Rollout starten"**

### 6c) Tester hinzufügen:
1. Unter **Geschlossener Test** → **Tester verwalten**
2. Klicke **"E-Mail-Liste erstellen"**
3. Name: `SimplyPet Tester`
4. Trage alle Gmail-Adressen ein (mindestens 12!)
5. **Speichern**
6. Kopiere den **Opt-in-Link** (wird angezeigt)
7. Schicke den Link an alle Tester (WhatsApp, E-Mail)

---

## SCHRITT 7: Tester informieren (5 Minuten)

Schicke folgende Nachricht an deine 12+ Tester:

> **Hallo! 👋**
>
> Ich entwickle eine Haustier-App (SimplyPet) und brauche deine Hilfe als Tester.
>
> Was du tun musst:
> 1. Klicke auf diesen Link: [OPT-IN-LINK HIER EINFÜGEN]
> 2. Akzeptiere die Einladung
> 3. Installiere die App über den Play Store
>
> Du musst die App nicht jeden Tag nutzen – es reicht wenn du sie installiert lässt.
> Nach 14 Tagen kann ich die App für alle veröffentlichen.
>
> Danke! 🙏

---

## SCHRITT 8: Warten (14 Tage)

- Google prüft die App (1-3 Tage nach Upload)
- Tester müssen 14 Tage lang opted-in bleiben
- Du kannst den Status in der Play Console unter **Testen** → **Geschlossener Test** sehen
- Nach 14 Tagen erscheint der Button **"Produktion beantragen"**

---

## SCHRITT 9: Produktion beantragen (nach 14 Tagen)

1. In der Play Console: **Produktion** → **"Neuen Release erstellen"**
2. Gleiche AAB verwenden (oder neue Version bauen)
3. Preis festlegen: **2,99 €**
4. Länder auswählen: **Deutschland** (+ optional Österreich, Schweiz)
5. **"Überprüfen"** → **"Rollout starten"**
6. Google Review: ca. 7 Tage
7. Danach ist SimplyPet im Play Store für alle sichtbar! 🎉

---

## ZUSAMMENFASSUNG: Zeitaufwand

| Schritt | Dauer | Wann |
|:---|:---|:---|
| Schritt 1-6 | ca. 45 Minuten | Sobald Identitätsprüfung durch ist |
| Schritt 7 | 5 Minuten | Direkt danach |
| Schritt 8 | 14 Tage warten | Automatisch |
| Schritt 9 | 10 Minuten | Nach den 14 Tagen |

**Gesamtaufwand für dich: ca. 1 Stunde aktive Arbeit + 14 Tage Wartezeit.**

---

## CHECKLISTE ZUM ABHAKEN

- [ ] Kontakttelefon bestätigt
- [ ] GitHub Pages aktiviert (Datenschutzerklärung online)
- [ ] App in Play Console angelegt
- [ ] Store-Listing ausgefüllt (Texte + Grafiken + Screenshots)
- [ ] App-Inhalte & Richtlinien komplett (Datenschutz, Zugang, Anzeigen, Rating, Zielgruppe, Data Safety)
- [ ] AAB heruntergeladen und entpackt
- [ ] Geschlossenen Test erstellt + AAB hochgeladen
- [ ] Play App Signing aktiviert
- [ ] Tester-Liste erstellt (12+ Gmail-Adressen)
- [ ] Opt-in-Link an Tester geschickt
- [ ] 14 Tage gewartet
- [ ] Produktion beantragt
