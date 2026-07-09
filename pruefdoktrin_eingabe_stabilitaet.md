# Prüfdoktrin: Eingabe-Stabilität (Null-Datenverlust-Regel)

**Datum:** 09.07.2026 (verbindliche Anweisung des Projektinhabers)
**Gilt für:** jeden Entwicklungs-Teilauftrag in Schritt 4, jede interne Prüfung, jede Auslieferung (Schritt 5 und alle späteren Releases)

## 1. Die Anweisung des Projektinhabers

> "Im Zweifel halt 3x mehr im Vorfeld auf Stabilität prüfen. Nichts ist schlimmer für den Nutzer, wenn er händisch was eingibt, dies mehrfach neu, im schlimmsten Fall alles neu beginnen muss – dann wird die App keine 15 Minuten auf dem Handy verweilen."

Diese Beobachtung ist durch unsere eigene Marktrecherche gedeckt: Technische Probleme (Crashes, Bugs, Datenverlust) sind der Abbruchgrund Nummer 1 bei Gesundheits-Apps, noch vor Datenschutz und Kosten (siehe Nutzerkonzept, Abschnitt 5). Verlorene Handeingaben sind die schwerste Form davon, weil sie die Arbeit des Nutzers entwerten – ein direkter Vertrauensbruch im Sinne der Doktrin.

## 2. Die Null-Datenverlust-Regel

**Kein händisch eingegebenes Zeichen darf jemals durch ein Verhalten der App verloren gehen.** Konkret heißt das: Rotation, App-Wechsel, eingehender Anruf, Sperrbildschirm, Speicherdruck (Android beendet die App im Hintergrund), Absturz oder versehentliches Zurück-Wischen – nach keinem dieser Ereignisse darf der Nutzer eine Eingabe neu beginnen müssen.

Daraus folgen drei Baupflichten für Schritt 4:

1. **Entwurfs-Sicherung (Draft-Autosave):** Jedes Formular sichert seinen Zustand fortlaufend lokal (bei jeder Feldänderung, spätestens alle 2 Sekunden). Wird die App unterbrochen oder beendet, bietet sie beim nächsten Öffnen an, den Entwurf fortzusetzen ("Du hattest einen Eintrag für Benno begonnen – fortsetzen oder verwerfen?"). Verwerfen tut nur der Nutzer, nie die App.
2. **Schutz vor versehentlichem Verwerfen:** Zurück-Geste oder Schließen eines Formulars mit ungespeicherten Änderungen fragt immer nach ("Eintrag verwerfen?") – einheitlich in der ganzen App.
3. **Speichern ist atomar:** Ein Eintrag ist entweder vollständig gespeichert oder gar nicht – keine halben Datensätze in der Datenbank (Transaktionen). Nach erfolgreichem Speichern erscheint eine sichtbare Bestätigung, damit der Nutzer nie rätselt, ob es geklappt hat.

## 3. Die 3-fach-Prüfregel (Prüfumfang vor jeder Auslieferung)

Die Anweisung "3x mehr prüfen" wird wie folgt operationalisiert. Eingabe-Stabilität wird auf **drei Ebenen** geprüft, und jede Prüfung wird in **drei Durchgängen** wiederholt (ein Fehler, der nur in 1 von 3 Läufen auftritt, ist ein Fehler):

**Ebene 1 – Automatisierte Tests (bei jedem Teilauftrag):** Unit-/Integrationstests für Draft-Autosave, Transaktions-Speicherung und Zustandserhalt bei Konfigurationswechsel (Rotation). Diese Tests laufen bei jeder internen Prüfung mit; ein roter Test blockiert die Auslieferung.

**Ebene 2 – Störfall-Matrix (vor jeder Auslieferung, dreifach durchlaufen):** Jedes Eingabeformular der App wird systematisch gegen jede Störung geprüft:

| Störung → / Formular ↓ | Rotation | App-Wechsel + Rückkehr | App gewaltsam beendet | Anruf/Unterbrechung | Zurück-Geste |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Tier anlegen | ☐☐☐ | ☐☐☐ | ☐☐☐ | ☐☐☐ | ☐☐☐ |
| Gewicht eintragen | ☐☐☐ | ☐☐☐ | ☐☐☐ | ☐☐☐ | ☐☐☐ |
| Symptom/Notiz | ☐☐☐ | ☐☐☐ | ☐☐☐ | ☐☐☐ | ☐☐☐ |
| Termin/Erinnerung anlegen | ☐☐☐ | ☐☐☐ | ☐☐☐ | ☐☐☐ | ☐☐☐ |
| Stammdaten bearbeiten | ☐☐☐ | ☐☐☐ | ☐☐☐ | ☐☐☐ | ☐☐☐ |
| Foto-Zuordnung (Erfassen) | ☐☐☐ | ☐☐☐ | ☐☐☐ | ☐☐☐ | ☐☐☐ |

Bestanden ist eine Zelle erst mit drei Häkchen (drei fehlerfreie Durchgänge). Die ausgefüllte Matrix wird bei jeder Auslieferung als Prüfnachweis ins Repository gelegt.

**Ebene 3 – Realbedingungs-Test (Schritt 5, durch den Projektinhaber):** Die Punkte 4b.3–4b.6 (Drehen mitten in Handlungen) und 2.6 (halb ausgefüllter Eintrag + Tierwechsel) des Nutzer-Prüfprotokolls decken die Praxisseite ab – draußen, nicht im Labor.

## 4. Auslieferungs-Kriterium

Eine Version verlässt die Entwicklung erst, wenn Ebene 1 grün ist und die Störfall-Matrix (Ebene 2) vollständig mit drei Durchgängen bestanden wurde. Dieses Kriterium ist Teil der internen Prüfung in Roadmap Schritt 4 (Punkt 5/6) und gilt unbefristet für alle späteren Releases.
