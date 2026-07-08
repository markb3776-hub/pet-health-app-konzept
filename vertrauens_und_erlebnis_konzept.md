# Vertrauens- und Erlebnis-Konzept

**Leitsatz: Vertrauen ist nicht ein Feature neben anderen, sondern das eigentliche Produkt.** Die Akte, der Notfall-Pass und die Erinnerungen sind nur die Träger. Was der Nutzer wirklich behält, ist das Gefühl: Hier ist jemand, der es gut mit mir und meinem Tier meint, mich nicht austrickst und mich nicht allein lässt. Dieses Dokument bündelt die Erinnerungs-Logik, die Bedienbarkeits-Grundsätze und die emotionale Ebene zu einem verbindlichen Leitfaden für Design und Entwicklung. Es steht in direkter Linie zur Projektdoktrin (Wahrheit, Belegpflicht, Funktion vor Blendwerk) und zu den dokumentierten Marktdefiziten: Kundensupport als Beschwerde Nr. 1 in allen Kategorien, Monetarisierungs-Frust und unzuverlässige Kernfunktionen bei den Wettbewerbern.

## 1. Das Erinnerungssystem: zustandsbasiert statt zeitbasiert

Eine einzelne Push-Nachricht ist flüchtig; nach wenigen Stunden Alltag ist sie mental gelöscht. Ein Erinnerungssystem, das mit dem Absenden der Nachricht endet, ist deshalb keines. Es gelten folgende verbindliche Regeln.

### Eskalationsketten mit Vorlauf

Termine mit Vorlauf (Impfung, Wurmkur, Kontrolltermin) lösen keine Einzelnachricht aus, sondern eine gestaffelte Sequenz: erste Vorankündigung 4 Wochen vorher, Wiederholungen 2 Wochen und 1 Woche vorher, am Vortag und am Tag selbst. Tägliche Medikamenten-Erinnerungen laufen ohne Vorlaufkette. Die Staffelung ist je Ereignistyp dosiert und vom Nutzer je Erinnerungstyp einstellbar (sanft / normal / hartnäckig).

### Die Erinnerung endet mit der Bestätigung, nicht mit dem Absenden

Solange der Nutzer nicht "erledigt" oder "Termin vereinbart" bestätigt hat, bleibt die Aufgabe offen und die Kette läuft weiter. Der Zustand führt, die Zeit ist nur der Taktgeber. Damit ist das Vergessen einer einzelnen Nachricht kein Systemversagen mehr. Dies ist die direkte Antwort auf die dokumentierten Wettbewerber-Fehler (PetDesk: Erinnerungen an Erledigtes; Petleo: Erinnerungen werden nicht aktualisiert).

### Zwei-Stufen-Logik bei Terminen

Bei Ereignissen wie Impfungen existieren zwei getrennte Aufgaben: erst "Termin vereinbaren" (mit Vorlauf), dann "Termin wahrnehmen". Bestätigt der Nutzer "Termin vereinbart am TT.MM.", verstummt die Vereinbarungs-Kette und die Termin-Erinnerung (Vortag + Termintag) übernimmt.

### Offene Aufgaben haben dauerhafte Orte

Da Push flüchtig ist, bleibt jede offene Aufgabe an drei nicht verschwindenden Orten sichtbar: im Homescreen-Widget ("Offen: Bennos Impftermin vereinbaren"), als Banner in der App beim nächsten Öffnen und optional als Kalendereintrag. Die Push-Nachricht ist nur der Anstupser.

### Ein-Tap-Bestätigung direkt in der Nachricht

Jede Erinnerungs-Push trägt direkte Antwortknöpfe ("Ja, erledigt" / "Termin ist vereinbart" / "Später"), ohne dass die App geöffnet werden muss. Ein "Fehler" des Nutzers (z. B. gelöschter Kalendereintrag) kostet ihn eine Sekunde, keinen Ärger.

### Kalender-Regeln (Konsistenz-Loch geschlossen)

Der Kalender-Export ist Opt-in. Jeder exportierte Eintrag trägt den Hinweis "Erledigt? In der Tier-App abhaken" mit direktem Link an die richtige Stelle der App. Die App liest Kalender-Löschungen bewusst NICHT zurück: Rücklesen ist plattformabhängig unzuverlässig, erfordert tiefe Berechtigungen und eine Löschung ist mehrdeutig (erledigt? verschoben? versehentlich?). Eine Gesundheitsakte darf keine geratenen Einträge enthalten. Stattdessen gilt: Der Kalender ist Anzeigetafel, die App ist das Original – dies wird dem Nutzer bei Aktivierung in einem Satz gesagt. Liegt ein vermuteter Termin in der Vergangenheit, wechselt der Ton automatisch von "vereinbaren!" zu einer einzelnen, milden Nachfrage.

### Respektvolle Grenzen

Mehrere fällige Ereignisse werden in eine Nachricht gebündelt statt Dauerfeuer. Ketten sind pausierbar ("Ich kümmere mich nächste Woche" = schlummern statt löschen). Erinnerungen enthalten niemals Werbung – der Kanal bleibt sauber, sonst stumpft er ab.

## 2. Bedienbarkeits-Grundsätze: menschlich intuitiv, nicht KI-intuitiv

KI-intuitiv bedeutet: Die App rät, was der Nutzer gemeint haben könnte, handelt still im Hintergrund und überrascht mit Zuständen, die niemand angeordnet hat. Menschlich intuitiv bedeutet das Gegenteil: Die App verhält sich wie ein verlässlicher, mitdenkender Assistent, der fragt statt rät, und dessen Verhalten vorhersagbar ist.

| Grundsatz | Konkrete Regel |
| :--- | :--- |
| Fragen statt raten | Jede Automatik endet in einer sichtbaren Frage, nie in einer stillen Handlung. Der Scan schlägt vor, der Nutzer bestätigt. |
| Vorhersagbarkeit | Gleiche Aktion, gleiches Ergebnis – immer. Keine sich "schlau" umsortierenden Menüs, keine wechselnden Ansichten. |
| Eine Wahrheit | Was in der Akte steht, hat der Nutzer bestätigt. Es gibt keinen zweiten, versteckten Datenbestand aus KI-Vermutungen. |
| Menschliche Sprache | "Bennos Impfung ist fällig", nicht "Ihr Vorsorge-Score wurde aktualisiert". Sprache wie am Praxistresen, ohne Fachjargon und ohne Marketing-Sprech. |
| Rückgängig statt Warnstufen | Jede Aktion ist mit einem Tap umkehrbar. Das erlaubt angstfreies Bedienen – zentral für die Kernzielgruppe (46 % der Tierhalter sind über 50). |
| Zwei-Tap-Regel für das Wichtigste | Notfall-Pass und nächste fällige Aufgabe sind vom Startbildschirm aus mit maximal zwei Taps erreichbar – auch unter Stress. |

## 3. Die emotionale Ebene: wohl, aufgehoben und verstanden

Funktionale Korrektheit allein erzeugt noch kein Vertrauen. Die folgenden Gestaltungsprinzipien übersetzen "sich wohl, aufgehoben und verstanden fühlen" in überprüfbare Produkteigenschaften.

### Verstanden fühlen

Die App spricht die Situation des Halters aus, bevor sie Funktionen anbietet. Im Notfall-Modus heißt es "Gute Besserung für Balou" statt einer Feature-Tour. Nach dem Eintrag einer schweren Diagnose fragt die App nicht sofort nach dem nächsten Feature, sondern hält sich zurück (kein "Bewerte uns!"-Dialog in sensiblen Momenten). Tierartspezifische Details (der vogelkundige Tierarzt, die Vitamin-C-Sparte beim Meerschweinchen) zeigen dem Halter: Diese App kennt mein Tier wirklich.

### Aufgehoben fühlen

Nichts geht verloren, und der Nutzer weiß das: automatische Sicherung, sichtbarer "Zuletzt gesichert"-Status, kostenloser Export jederzeit, Wiederherstellung bei Handyverlust. Fehler des Nutzers sind folgenlos (Rückgängig-Prinzip). Der Support ist erreichbar und menschlich – als direkte Antwort auf die Beschwerde Nr. 1 aller App-Kategorien: ein echtes Kontaktformular mit zugesagter und eingehaltener Antwortzeit statt Chatbot-Sackgassen und FAQ-Labyrinth.

### Wohl fühlen

Ruhiges, aufgeräumtes Design ohne Werbebanner, ohne Countdown-Timer, ohne künstliche Dringlichkeit. Die App drängt nie: keine Trial-Fallen, keine Paywall auf eigene Daten, Premium wird erst erwähnt, wenn der Nutzer eine Premium-Funktion tatsächlich berührt. Push-Berechtigungen werden im Moment des Bedarfs erklärt und erfragt, nicht beim ersten Start erzwungen.

### Vertrauen als messbare Größe

Vertrauen wird nicht behauptet, sondern an überprüfbaren Zusagen festgemacht, die die App aktiv kommuniziert und einhält: Daten auf EU-Servern unter DSGVO (kaufentscheidend für 73 % der deutschen Nutzer), Benachrichtigung bei jedem Zugriff auf Freigabe-Links, Export ohne Bedingungen, Löschung ohne Hürden, keine Datenweitergabe an Dritte. Jede dieser Zusagen ist ein Testfall im Produktions-Protokoll: Was zugesagt ist, wird vor Release nachgewiesen.

## 4. Verbindlichkeit

Dieses Konzept ist Teil der Projektdoktrin. Jedes künftige Feature wird vor der Umsetzung gegen die drei Ebenen geprüft: Hält es die Erinnerungs-Logik ein? Verletzt es einen Bedienbarkeits-Grundsatz? Stärkt oder schwächt es das Gefühl, aufgehoben zu sein? Ein Feature, das funktional glänzt, aber Vertrauen kostet (z. B. aggressives Upselling im Erinnerungskanal), wird verworfen – unabhängig von seinem Umsatzpotenzial.
