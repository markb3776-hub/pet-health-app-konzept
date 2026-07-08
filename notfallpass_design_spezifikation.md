# Design-Spezifikation: Der Notfall-Pass mit Pass-Charakteristik

Der Notfall-Pass ist das Herzstück der App und ihr sichtbarstes Alleinstellungsmerkmal. Er wird bewusst als digitales Dokument mit Pass-Charakteristik gestaltet – nicht als beliebige App-Ansicht. Diese Entscheidung hat drei Begründungen: Wiedererkennung (Halter und Praxispersonal kennen das Format des EU-Heimtierausweises), Vertrauen (ein Pass wirkt offiziell und sorgfältig geführt) und Funktion (das Tierfoto ist im Notfall ein echtes Identifikationsmerkmal).

## 1. Aufbau des Passes (Bildschirm-Ansicht)

Der Pass ist als Karte im Hochformat gestaltet, angelehnt an die vertraute Optik amtlicher Dokumente, ohne ein amtliches Dokument zu imitieren oder zu ersetzen.

### Kopfbereich (die "Passkarte")

| Element | Inhalt | Gestaltung |
| :--- | :--- | :--- |
| **Tierfoto** | Vom Halter hinzugefügtes Foto | Rundes oder abgerundetes Porträtfeld links oben, wie ein Passbild. Tap auf das Foto zeigt es bildschirmfüllend. |
| **Name und Tierart** | z. B. "Balou – Hund, Labrador-Mischling" | Große, klare Typografie direkt neben dem Foto |
| **Signalement** | Geburtsdatum, Geschlecht, Kastrationsstatus, Rasse, Fellfarbe | Kompakte Zeilen unter dem Namen |
| **Besondere Erkennungsmerkmale** | Eigene Sparte: Narben, Fellzeichnungen, Ohrkerben/Tätowierungen, Fehlstände, Heterochromie (verschiedenfarbige Augen), fehlende Kralle/Zehe etc. | Fester eigener Abschnitt direkt unter dem Signalement, mit optionalen Detail-Fotos je Merkmal |
| **Chipnummer** | 15-stellige Transponder-Nummer | Eigene, klar abgesetzte Zeile mit Kopier-Symbol – das wichtigste Identifikationsmerkmal neben dem Foto |
| **Statusleiste** | "Zuletzt aktualisiert: TT.MM.JJJJ" | Klein, aber sichtbar – Ehrlichkeit über die Aktualität der Daten |

### Medizinischer Kernteil (der "Notfall-Block")

Direkt unter der Passkarte folgen die im Notfall kritischen Blöcke in fester Reihenfolge, farblich ruhig, aber klar getrennt: Allergien und Unverträglichkeiten, Dauermedikation (Präparat, Dosis, seit wann), Vorerkrankungen, Impfstatus (letzte Impfungen mit Datum), letzte bekannte Werte (Gewicht mit Datum). Bei Tierarten mit Spezialisten-Bedarf (Vogel, Kaninchen, Reptil) erscheint zusätzlich der hinterlegte fachkundige Tierarzt mit Telefonnummer.

### Fußbereich (Kontakt und Freigabe)

Halter-Kontakt (Name, Telefonnummer), Stammtierarzt (Praxis, Telefonnummer) sowie die beiden Aktions-Schaltflächen: "Für Praxis freigeben" (QR-Code/Kurzcode erzeugen) und "Als PDF teilen".

## 2. Das Tierfoto: Funktion über die Optik hinaus

Das Foto ist nicht nur gestalterisches Element, sondern erfüllt drei praktische Zwecke. Erstens die **Identifikation im Notfall**: In einer vollen Notfallklinik mit mehreren wartenden Tieren stellt das Foto zusammen mit der Chipnummer sicher, dass die richtige Akte zum richtigen Tier gehört – besonders relevant bei Mehrtier-Haushalten mit ähnlichen Tieren (zwei schwarze Katzen). Zweitens der **Fundfall**: Der Pass mit Foto kann als Suchgrundlage geteilt werden, wenn das Tier entläuft. Drittens die **emotionale Bindung**: Das eigene Tier im Pass zu sehen, macht die App persönlich und erhöht nachweislich die Pflege-Motivation der Akte.

### Regeln für das Foto

Das Foto ist optional, wird aber im Onboarding aktiv angeboten ("Füge ein Foto von Balou hinzu – es hilft der Praxis, ihn sofort zuzuordnen"). Der Halter kann es jederzeit ändern; ein einfacher Zuschneide-Rahmen sorgt für ein brauchbares Porträtformat. Ohne Foto zeigt der Pass einen neutralen Tierart-Platzhalter (Silhouette), niemals ein fremdes Beispielbild – ein Pass mit falschem Foto wäre schlimmer als einer ohne. Mehrere Fotos sind möglich, das Hauptfoto bleibt das Passbild.

## 2a. Die Sparte "Besondere Erkennungsmerkmale" (Stammdaten-Bestandteil, nicht nur Pass)

Die besonderen Erkennungsmerkmale sind kein exklusives Pass-Element, sondern ein **fester Bestandteil der Stammdaten jedes Tierprofils** – sie gehören zur grundlegenden Charakterisierung des Tieres wie Name, Rasse und Geburtsdatum. Erfasst wird die Sparte einmal zentral im Tierprofil (beim Onboarding aktiv angeboten, jederzeit erweiterbar) und erscheint von dort automatisch überall, wo das Tier dargestellt wird: in der Profil-Ansicht des Tieres (eigener Abschnitt "Erkennungsmerkmale" direkt bei den Stammdaten), im Notfall-Pass, in der Browser-Freigabe für Praxen, im PDF-Export und in jeder künftigen Teil-Ansicht (z. B. Tiersitter-Freigabe). Es gilt das Prinzip der einen Quelle: Eine Änderung im Profil aktualisiert alle Darstellungen – es gibt keine getrennten, auseinanderlaufenden Kopien.

Inhaltlich ist die Sparte analog zum Feld "besondere Kennzeichen" in amtlichen Ausweisdokumenten aufgebaut. Hier dokumentiert der Halter alles, was das Tier eindeutig unterscheidbar macht: Narben und deren Position, markante Fellzeichnungen oder Abzeichen, Tätowierungen (bei älteren Tieren noch verbreitet), Ohrkerben (bei kastrierten Freigängerkatzen üblich), Heterochromie (verschiedenfarbige Augen), fehlende Krallen oder Zehen, Knickohr, Knickrute oder ähnliche anatomische Besonderheiten.

Jedes Merkmal besteht aus einer Kurzbeschreibung mit Positionsangabe (z. B. "Narbe, ca. 3 cm, linke Flanke") und optional einem eigenen Detail-Foto. Die Sparte erfüllt drei Zwecke: Im **Notfall** erlaubt sie der Praxis die zweifelsfreie Zuordnung, wenn die Chipnummer nicht sofort ausgelesen werden kann oder das Tier nicht gechipt ist (bei Kleinsäugern, Vögeln und Reptilien die Regel – für diese Tierarten ist die Sparte oft das EINZIGE Identifikationsmerkmal neben dem Foto). Im **Fundfall** ist sie das entscheidende Abgleichkriterium, mit dem der rechtmäßige Halter sein Tier zweifelsfrei beschreiben kann – Details wie eine Narbe an der linken Flanke kennt nur, wer das Tier wirklich kennt. Und bei der **Verwechslungsprävention** in Mehrtier-Haushalten mit ähnlichen Tieren macht sie den Unterschied sichtbar, den ein Passfoto allein nicht zeigt.

Die Sparte erscheint in allen drei Ausgabeformen (App, Browser-Freigabe, PDF), in der Praxis-Ansicht direkt unter der Passkarte. Ist kein Merkmal erfasst, zeigt der Pass ehrlich "Keine besonderen Merkmale erfasst" statt die Sparte zu verstecken – so weiß die Praxis, dass die Angabe bewusst leer ist und nicht vergessen wurde.

## 3. Pass-Charakteristik in allen drei Ausgabeformen

Die Pass-Optik bleibt über alle drei Wege konsistent, damit die Wiedererkennung funktioniert:

1. **In der App (Halter-Ansicht):** Wie oben beschrieben, offline verfügbar, vom Startbildschirm mit maximal zwei Taps erreichbar.
2. **Browser-Ansicht (Praxis-Freigabe):** Dieselbe Passkarte mit Foto erscheint oben auf der Freigabe-Seite, darunter die Datenblöcke mit Kopier-Schaltflächen. Das Praxispersonal sieht auf einen Blick, welches Tier vor ihm steht.
3. **PDF-Export:** Einseitiges Dokument im Pass-Layout – Foto oben links, Signalement daneben, Notfall-Blöcke darunter. Druckbar und als E-Mail-Anhang geeignet, damit es wie jeder Laborbefund an die Praxisakte angehängt werden kann.

## 4. Ehrliche Abgrenzung (Doktrin)

Der Notfall-Pass ist ein privates Dokument des Halters und ersetzt keine amtlichen Dokumente. Diese Abgrenzung steht als fester, dezenter Hinweis im PDF-Export: Er ersetzt nicht den EU-Heimtierausweis (bei Reisen), nicht den Equidenpass (gesetzliches Pflichtdokument beim Pferd) und keine amtliche Registrierung (TASSO, FINDEFIX). Die App gestaltet den Pass deshalb bewusst eigenständig – vertraut in der Anmutung, aber nicht als Imitat eines Behördendokuments, um jede Verwechslung auszuschließen.

## 5. Testpflichtige Punkte vor Umsetzung

Nach Produktions-Protokoll gilt auch hier der dreistufige Funktionsnachweis. Konkret testpflichtig sind: die Lesbarkeit des Pass-Layouts auf kleinen Bildschirmen und im PDF-Ausdruck (inklusive Graustufen-Druck in der Praxis), die Foto-Darstellung bei unterschiedlichen Seitenverhältnissen und Lichtverhältnissen der Halter-Fotos, sowie die Offline-Verfügbarkeit des Passes inklusive Foto bei fehlender Netzverbindung (Notfall-Szenario in Kliniken mit schlechtem Empfang).
