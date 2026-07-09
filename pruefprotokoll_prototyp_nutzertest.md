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

## 4b. Prüfblock Querformat & Drehen (Festlegung vom 09.07.2026)

Die App muss in beiden Ausrichtungen einwandfrei funktionieren – über alle Ebenen hinweg. Beim Testen das Gerät bewusst häufig drehen, auch mitten in Handlungen.

| Nr. | Prüfpunkt | Erwartetes Verhalten | Status | Notiz |
| :--- | :--- | :--- | :--- | :--- |
| 4b.1 | Jeden Hauptbereich (Zuhause, Termine, Erfassen, Mehr) einmal im Querformat ansehen | Layout passt sich sinnvoll an, nichts abgeschnitten, nichts überlappt, Tab-Bar bedienbar | 🔴 | |
| 4b.2 | Notfallpass im Querformat vorzeigen | Pass gut lesbar, größere Darstellung wird genutzt, QR-Code/Foto korrekt | 🔴 | |
| 4b.3 | Drehen mitten in der Eingabe: Eintrag halb ausfüllen, Gerät drehen, weiterschreiben | Kein Datenverlust, Cursor und Text bleiben erhalten, kein Absturz | 🔴 | |
| 4b.4 | Drehen im geöffneten Erfassen-Overlay | Overlay bleibt offen und bedienbar, keine Fehldarstellung | 🔴 | |
| 4b.5 | Drehen während Kamera-Aufnahme (Dokument fotografieren) | Kamera läuft weiter, Foto landet korrekt beim richtigen Tier | 🔴 | |
| 4b.6 | Schnelles mehrfaches Drehen hintereinander (Stresstest) | Kein Einfrieren, kein Absturz, keine "zerrissenen" Layouts | 🔴 | |
| 4b.7 | Querformat kombiniert mit größter Systemschrift | Auch in dieser Kombination kein Layout-Bruch | 🔴 | |
| 4b.8 | Systemweite Rotationssperre in Android aktivieren | App respektiert die Sperre und bleibt im Hochformat | 🔴 | |

## 4c. Prüfblock Datum & Nachtragen (Festlegung vom 09.07.2026)

Vergangene Ereignisse müssen sich nachtragen lassen und korrekt in die Chronologie einsortieren. Datumseingabe immer über den Kalender, Anzeige immer TT.MM.JJJJ.

| Nr. | Prüfpunkt | Erwartetes Verhalten | Status | Notiz |
| :--- | :--- | :--- | :--- | :--- |
| 4c.1 | Medikamentengabe von vor 3 Tagen nachtragen (Chip "Vorgestern" bzw. Kalender) | Eintrag sortiert sich an die richtige Stelle der Timeline, nicht nach oben | 🔴 | |
| 4c.2 | Timeline-Sortierung prüfen (Verlauf + Medikamente) | Neuester Eintrag steht immer oben, absteigend nach Ereignis-Datum | 🔴 | |
| 4c.3 | Detail-Ansicht eines nachgetragenen Eintrags öffnen | Dezenter Vermerk "Nachgetragen am …" sichtbar | 🔴 | |
| 4c.4 | Versuchen, ein Zukunftsdatum zu wählen (z. B. nächste Woche) | Bei Ereignis-Einträgen gesperrt; nur bei Terminen erlaubt | 🔴 | |
| 4c.5 | Schnellwahl-Chips "Heute / Gestern / Vorgestern" prüfen | Jeder Chip setzt exakt das richtige Datum | 🔴 | |
| 4c.6 | Weiter zurückliegendes Datum wählen (z. B. 3 Monate, alte Impfung übertragen) | Kalender blättert frei zurück, keine künstliche Sperre | 🔴 | |
| 4c.7 | Datumsanzeige quer durch die App prüfen | Überall einheitlich TT.MM.JJJJ (z. B. 23.07.2026) | 🔴 | |
| 4c.8 | Medikament mit 2× täglicher Dosierung anlegen | Uhrzeitfelder erscheinen nur hier; bei Gewicht/Symptom keine Uhrzeit-Abfrage | 🔴 | |
| 4c.9 | Vorfall erfassen (z. B. "von fremder Katze gebissen", rückdatiert) | Eigener Eintragstyp mit Was/Verursacher/Körperstelle/Foto, korrekt in Timeline einsortiert | 🔴 | |
| 4c.10 | Pflege-Aufgabe mit Saisonfenster anlegen (z. B. "Ohren eincremen", 2× täglich, April–September) | Erinnerung erscheint mit Hinweistext ("Bei Sonnenschein"); außerhalb der Saison keine Fälligkeit | 🔴 | |

## 4d. Prüfblock Tageswechsel – „Heute fällig“ bleibt aktuell (Festlegung vom 09.07.2026)

Die App fragt für „Heute fällig“ ausschließlich die Telefon-Uhr ab — es werden nie Daten verändert, nur die Einsortierung (Überfällig/Heute/Demnächst) folgt dem tatsächlichen Kalendertag. Diese Prüfung stellt sicher, dass die Anzeige nie auf einem veralteten „Gestern“-Stand hängen bleibt.

| Nr. | Prüfpunkt | Erwartetes Verhalten | Status | Notiz |
| :--- | :--- | :--- | :--- | :--- |
| 4d.1 | Termin für morgen anlegen, App offen über Mitternacht laufen lassen (oder Geräte-Uhr testweise vorstellen) | Spätestens nach 1 Minute springt die Anzeige um: Der Termin erscheint unter „Heute“ | 🔴 | |
| 4d.2 | Termin für heute offen lassen, Tageswechsel abwarten | Der Termin wandert automatisch zu „Überfällig“ (rot), ohne App-Neustart | 🔴 | |
| 4d.3 | App abends in den Hintergrund legen, morgens zurückholen | Startbildschirm und Termine zeigen sofort den neuen Tag — kein veralteter Stand | 🔴 | |
| 4d.4 | Geräte-Uhrzeit/Zeitzone bei laufender App manuell ändern, danach zurücksetzen | Anzeige folgt der Systemuhr; alle gespeicherten Einträge und Fälligkeitsdaten bleiben UNVERÄNDERT | 🔴 | |
| 4d.5 | Nach jedem der Punkte 4d.1–4d.4: Tierakte stichprobenartig öffnen | Ereignis-Daten (Gewicht, Impfung usw.) zeigen weiterhin das ursprüngliche Datum TT.MM.JJJJ — nichts wurde „mitverschoben“ | 🔴 | |

## 5. Beobachtungsjournal

Für alles, was in keine Checkliste passt (Bauchgefühl zählt – Bedienung, Verständlichkeit, Vertrauen):

| Datum | Gerät | Beobachtung |
| :--- | :--- | :--- |
| | | |

**Abgabekriterium:** Der Prototyp gilt erst als abgenommen, wenn alle Punkte 🟢 sind oder Auffälligkeiten (🟡) bewusst als "für den Prototyp akzeptiert" markiert wurden. Dieses Protokoll wird nach der Testphase ins Repository zurückgespielt und dient als Grundlage für die Fehlerkorrektur-Runde.
