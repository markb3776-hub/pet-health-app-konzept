# Prüfprotokoll: Nutzertest des Prototyps (Roadmap Schritt 5)

**Für:** den Projektinhaber (Tester)
**Zweck:** Dieses Dokument ist deine persönliche Checkliste für die Testphase des Prototyps auf deinen beiden Android-Geräten. Es hält fest, *was* du prüfst, *wie* du es prüfst und *wo* du deine Beobachtungen notierst. Besonderer Fokus liegt auf dem Verhalten beim **Tierwechsel** im Mehrarten-Haushalt (Festlegung vom 09.07.2026).

**So arbeitest du damit:** Jeden Punkt einmal in Ruhe durchspielen und den Status setzen: 🔴 = noch nicht getestet, 🟡 = getestet mit Auffälligkeit (bitte Notiz!), 🟢 = bestanden. Bei jeder Auffälligkeit kurz notieren: Was hast du getan? Was hast du erwartet? Was ist stattdessen passiert? Auf welchem Gerät?

## 1. Testaufbau (einmalig vorbereiten)

Lege auf **Gerät 1** einen Testhaushalt mit drei unterschiedlichen Tierarten an, damit die dynamische Modul-Zuschaltung maximal gefordert wird:

| Testtier | Art | Warum diese Art? |
| :--- | :--- | :--- |
| Tier A (z. B. "Benno") | Hund | Volles Programm: Impf-Modul, Gewicht, Dokumente |
| Tier B (z. B. "Krümel") | Hamster | Gegenprobe: **kein** Impf-Modul darf erscheinen |
| Tier C (z. B. "Becken 1") | Aquarium | Sonderfall: Wasserwerte statt Gesundheitsreiter, "Becken-Bezeichnung" statt Name |

Auf **Gerät 2** genügt zunächst ein einzelnes Tier (z. B. eine Katze) – es dient dem Vergleich: Läuft die App mit einem Tier genauso wie mit dreien? (Hinweis: Im Prototyp hält jedes Gerät seine eigenen lokalen Daten, es gibt noch keine Synchronisation.)

## 2. Prüfblock Tierwechsel (Kernfokus)

Der Wechsel zwischen den Akten ist der kritischste Moment im Mehrtier-Alltag. Genau hier entstehen bei schlechten Apps Datenvermischung, falsche Zuordnungen oder Abstürze.

| Nr. | Prüfpunkt | Erwartetes Verhalten | Status | Notiz |
| :--- | :--- | :--- | :--- | :--- |
| 2.1 | Startbildschirm → Tier A antippen → zurück → Tier B antippen | Jede Akte zeigt sofort die richtigen Daten (Name, Foto, Kennfarbe, Reiter) | 🔴 | |
| 2.2 | Schneller Wechsel: 10-mal zügig hintereinander zwischen allen drei Akten hin- und herwechseln | Kein Absturz, kein Einfrieren, keine falschen Daten, keine "Geister-Inhalte" vom vorherigen Tier | 🔴 | |
| 2.3 | Modul-Kontrolle beim Wechsel: Hund → Hamster | Beim Hamster verschwindet der Impf-Reiter vollständig (nicht nur leer, sondern gar nicht vorhanden) | 🔴 | |
| 2.4 | Modul-Kontrolle beim Wechsel: Hamster → Aquarium | Beim Aquarium erscheinen Wasserwerte, der Gesundheitsreiter fehlt, Beschriftung sagt "Becken-Bezeichnung" | 🔴 | |
| 2.5 | Eintrag unter Zeitdruck: Gewicht bei Tier A eintragen, sofort zu Tier B wechseln, dort Notiz eintragen | Jeder Eintrag landet beim richtigen Tier – im Verlauf von A nur das Gewicht, bei B nur die Notiz | 🔴 | |
| 2.6 | Halb ausgefüllter Eintrag + Wechsel: Bei Tier A einen Eintrag beginnen, NICHT speichern, zur Akte von B wechseln | Kein Absturz; der angefangene Eintrag erscheint keinesfalls bei Tier B (ob er verworfen oder gemerkt wird, notieren) | 🔴 | |
| 2.7 | Kennfarben beim Wechsel | Jede Akte zeigt durchgehend die beim Anlegen gewählte Kennfarbe, nie die Farbe des vorherigen Tieres | 🔴 | |
| 2.8 | Notfallpass-Wechsel: Notfallpass von A öffnen, schließen, Notfallpass von B öffnen | Jeder Pass zeigt ausschließlich die Daten des jeweiligen Tieres | 🔴 | |
| 2.9 | Wechsel im Flugmodus (offline) | Alles aus 2.1–2.8 funktioniert identisch ohne Internet | 🔴 | |

## 3. Prüfblock Termine & Erinnerungen im Mehrtier-Betrieb

| Nr. | Prüfpunkt | Erwartetes Verhalten | Status | Notiz |
| :--- | :--- | :--- | :--- | :--- |
| 3.1 | Je eine Erinnerung für alle drei Tiere am selben Tag anlegen | Terminliste zeigt alle drei, jede eindeutig mit Tiername, Tierart und Kennfarbe | 🔴 | |
| 3.2 | Erinnerung von Tier B abhaken | Nur der Eintrag von B gilt als erledigt; A und C bleiben offen | 🔴 | |
| 3.3 | Versehentliches Abhaken rückgängig machen | Abgehakter Termin ist in der "Erledigt"-Ansicht auffindbar und reaktivierbar (Rückgängig-Prinzip) | 🔴 | |
| 3.4 | Push-Nachrichten über mehrere Tage (beide Geräte, Akku-Sparmodus aktiv) | Jede Push-Nachricht nennt Name UND Tierart ("Benno (Hund): …"); Erinnerungen kommen zuverlässig trotz Sparmodus | 🔴 | |

## 4. Prüfblock Stabilität & Alltag

| Nr. | Prüfpunkt | Erwartetes Verhalten | Status | Notiz |
| :--- | :--- | :--- | :--- | :--- |
| 4.1 | App im Flugmodus starten | App startet vollständig, alle lokalen Daten da | 🔴 | |
| 4.2 | Zwei-Tap-Regel aus jedem Bereich | Notfallpass aus Zuhause, Terminen und Mehr mit maximal zwei Berührungen erreichbar | 🔴 | |
| 4.3 | Größte Systemschriftgröße einstellen | Kein Layout-Bruch, keine abgeschnittenen Texte – auch in allen drei Akten | 🔴 | |
| 4.4 | App gewaltsam beenden und neu öffnen (während Testhaushalt gefüllt ist) | Alle Daten aller drei Tiere unverändert vorhanden | 🔴 | |
| 4.5 | Foto-Ablage: Dokument bei Tier A fotografieren | Echte Kamera-Berechtigungskette, Foto landet nur in der Ablage von A, ehrlicher Hinweis zum späteren Auslesen erscheint | 🔴 | |
| 4.6 | Ein-Tier-Vergleich (Gerät 2) | Verhalten mit einem Tier genauso stabil wie mit dreien | 🔴 | |
| 4.7 | Mehrtägiger Alltagstest | App mindestens eine Woche wie ein echter Halter nutzen; alles Ungewöhnliche hier notieren | 🔴 | |

## 5. Beobachtungsjournal

Für alles, was in keine Checkliste passt (Bauchgefühl zählt – Bedienung, Verständlichkeit, Vertrauen):

| Datum | Gerät | Beobachtung |
| :--- | :--- | :--- |
| | | |

**Abgabekriterium:** Der Prototyp gilt erst als abgenommen, wenn alle Punkte 🟢 sind oder Auffälligkeiten (🟡) bewusst als "für den Prototyp akzeptiert" markiert wurden. Dieses Protokoll wird nach der Testphase ins Repository zurückgespielt und dient als Grundlage für die Fehlerkorrektur-Runde.
