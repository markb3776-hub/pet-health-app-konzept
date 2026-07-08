# App-Struktur-Konzept: Aufbau, Startbildschirm und Navigation

Dieses Dokument definiert, was der Nutzer beim Öffnen der App sieht und wie die Bereiche zueinander liegen. Es setzt die festgelegten Grundsätze um: menschlich intuitiv (fragen statt raten, Vorhersagbarkeit), Zwei-Tap-Regel für das Wichtigste, ruhiges Design ohne Werbedruck, und Eignung für die Kernzielgruppe (46 % der Tierhalter über 50 Jahre).

## 1. Der Startbildschirm ("Mein Zuhause")

Beim Öffnen erscheint immer derselbe Bildschirm – keine wechselnden Kampagnen-Screens, keine Splash-Werbung. Er ist von oben nach unten in drei feste Zonen gegliedert.

### Zone 1: Was jetzt wichtig ist (oben)

Ganz oben steht die Handlungszone – sie beantwortet die Frage "Muss ich mich heute um etwas kümmern?" ohne einen einzigen Tap:

- **Alles ruhig:** Eine ruhige Statuszeile: "Alles versorgt – nächster Termin: Bennos Impfung in 3 Wochen." Kein künstlicher Alarm, wenn nichts ansteht.
- **Etwas ist offen:** Die offenen Aufgaben als klare Karten, wichtigste zuerst: "Heute: Luna – Tablette 18 Uhr [Erledigt-Knopf]", "Offen: Bennos Impftermin vereinbaren [Termin eingetragen / Später]". Jede Karte trägt Tiername + Tierart + Foto-Miniatur und ist direkt auf der Karte abhakbar – ohne in Untermenüs zu müssen.

### Zone 2: Meine Tiere (Mitte, das Herzstück)

Die Tierfamilie als große, klar unterscheidbare Kacheln mit Passfoto, Name und Tierart – bei Nutzer XY also: Benno (Hund), Luna (Katze), Mila (Katze), Wohnzimmer-Aquarium. Jede Kachel zeigt maximal eine Statuszeile (z. B. "Impfung in 12 Tagen"), nicht mehr – keine Zahlenfriedhöfe. Ein Tap öffnet die Tierakte. Am Ende der Reihe steht dezent "+ Tier hinzufügen".

### Zone 3: Der Notfall-Knopf (unten, immer sichtbar)

Fest verankert am unteren Rand, farblich ruhig aber unübersehbar: **"Notfall-Pass"**. Ein Tap öffnet die Tierauswahl (bei einem Tier direkt den Pass), der zweite Tap zeigt den Pass mit QR-Freigabe – die Zwei-Tap-Regel ist damit baulich garantiert. Dieser Knopf ist auf jedem Bildschirm der App vorhanden, nicht nur auf dem Start.

## 2. Die Navigation: vier Bereiche, nicht mehr

Am unteren Bildschirmrand liegt eine feste Leiste mit vier Bereichen. Vier, nicht fünf oder sieben – jeder Bereich beantwortet eine menschliche Frage:

| Bereich | Menschliche Frage | Inhalt |
| :--- | :--- | :--- |
| **Zuhause** | "Was ist heute wichtig?" | Startbildschirm wie oben beschrieben |
| **Termine** | "Was steht an?" | Alle Erinnerungen und Fälligkeiten aller Tiere chronologisch; hier wird bestätigt, verschoben, eingestellt; Kalender-Export |
| **Erfassen** (zentraler Knopf) | "Ich habe etwas Neues" | Der Plus-Knopf in der Mitte: Dokument scannen, Gewicht eintragen, Symptom notieren, Sprachnotiz – die vier häufigsten Eingaben, direkt erreichbar |
| **Mehr** | "Alles andere" | Einstellungen, Familien-Freigabe, Datenexport, Hilfe & menschlicher Support, rechtliche Infos |

Die Tierakten selbst haben bewusst keinen eigenen Navigationspunkt – sie sind über die Kacheln auf "Zuhause" erreichbar, denn so denkt der Halter: erst das Tier, dann die Akte.

## 3. Die Tierakte (nach Tap auf eine Tier-Kachel)

Die Akte eines Tieres ist wie eine gut geführte Patientenmappe aufgebaut – oben die Identität, darunter die Register:

1. **Kopf:** Die Passkarte (Foto, Name, Signalement, Chipnummer, besondere Erkennungsmerkmale) – identisch mit dem Notfall-Pass-Kopf, eine Quelle.
2. **Register-Reiter** (je nach Tierart automatisch zusammengestellt, gemäß Tierarten-Matrix):
   - **Gesundheit:** Impfungen (mit Fälligkeiten), Entwurmung/Prophylaxe, Medikamente, Vorerkrankungen, Allergien
   - **Verlauf:** Chronologisches Tagebuch – Tierarztbesuche, Symptome, Gewichtskurve, Sprachnotizen; neuestes zuerst
   - **Dokumente:** Alle Scans und PDFs (Rechnungen, Befunde, Impfpass-Seiten, CITES-Nachweis beim Reptil, Equidenpass-Ablage beim Pferd), durchsuchbar
   - **Teilen:** Praxis-Freigabe (QR/Kurzcode/E-Mail), PDF-Export, Familien-Zugriff für dieses Tier
3. **Beim Aquarium** ersetzen die Register Wasserwerte, Besatz und Wartung die Gesundheits-Reiter – gleiche Struktur, fachlich richtige Inhalte.

## 4. Was der Nutzer NIE sieht

Genauso wichtig wie der Aufbau ist das bewusste Weglassen: keine Werbebanner, kein "Feed" mit Content-Häppchen, keine Gamification-Abzeichen, keine Shop-Kacheln (der dokumentierte vetevo-Fehler: Gesundheitsakte als Shop-Frontend), keine Pop-ups beim Start, keine Bewertungs-Aufforderungen in sensiblen Momenten. Der leere Zustand einer neuen App zeigt freundliche Anleitung ("Lege dein erstes Tier an – so geht's"), niemals Beispiel-Fake-Daten.

## 5. Das Farbsystem: freie Farbwahl pro Tier

Jedes Tier erhält eine eigene Kennfarbe – und **der Nutzer wählt sie frei**. Beim Anlegen zeigt die App die volle kuratierte Farbpalette; der automatische Vorschlag (eine noch nicht vergebene Farbe, tierart-basierter Startbereich) ist nur eine unverbindliche Vorbelegung und mit einem Tap überschreibbar. Die Farbwahl ist jederzeit später im Tierprofil änderbar; die Farbe ist reine Darstellung und niemals Datenträger – eine Änderung hat keinerlei Auswirkung auf die Akte.

Die gewählte Farbe zieht sich konsequent durch alle Ansichten: Tier-Kachel, Rand der Aufgaben-Karten, Einträge der Terminliste, Widget-Zeilen und Gewichtskurven im Vergleich. Farbe ist dabei immer Zusatz, nie einzige Information: Jede farbige Markierung trägt zusätzlich Foto, Name und ein einheitliches Tierart-Piktogramm (relevant auch wegen Rot-Grün-Sehschwäche bei ca. 8–9 % der Männer). Die Palette ist so kuratiert, dass sich Farben auch in der Helligkeit unterscheiden und genügend Abstufungen für große Mehrtier-Haushalte vorhanden sind.

Zwei Schutzregeln begleiten die freie Wahl: Erstens sind doppelte Farben erlaubt – die App weist nur einmal transparent darauf hin ("Mila hat dieselbe Farbe wie Luna – zur Unterscheidung dienen dann Foto und Name"). Zweitens bleibt ein einziges reserviertes Signalrot für Warnhinweise gesperrt, mit ehrlicher Begründung direkt in der Palette; Sicherheitsfarben und Tierfarben dürfen nie kollidieren. Im Gesamtbild wirken die Farben als ruhige Akzente (Kachelrand, Kartenstreifen, Symbolhintergrund), nicht als vollflächige Gestaltung – der Grundton der App bleibt neutral.

## 6. Sonderzustände

- **Erster Start:** Statt des Startbildschirms das Onboarding (Begrüßung → Konto → erstes Tier → Notfall-Pass als Sofort-Ergebnis), wie im Onboarding-Konzept definiert.
- **Offline:** Der Startbildschirm funktioniert vollständig offline (lokale Daten); nicht verfügbare Funktionen (Freigabe-Link erzeugen) sagen ehrlich "Dafür wird Internet gebraucht" statt endlos zu laden.
- **Stress-/Notfallnutzung:** Vom Sperrbildschirm-Widget führt ein direkter Pfad zum Notfall-Pass, ohne Anmeldung-Hürden (der Pass ist bewusst ohne erneute PIN-Eingabe erreichbar – eine bewusste, dem Nutzer transparent gemachte Abwägung zugunsten der Notfalltauglichkeit, abschaltbar für wen Privatsphäre wichtiger ist).

## 7. Testpflichtige Punkte (Produktions-Protokoll)

Vor Release nachzuweisen: Zwei-Tap-Erreichbarkeit des Notfall-Passes aus jedem Bildschirm; Lesbarkeit und Bedienbarkeit der Kacheln und Knöpfe bei größter System-Schriftgröße (Zielgruppe 50+); vollständige Offline-Funktion des Startbildschirms; korrekte tierartspezifische Registerbildung für alle 14 Tierarten-Konfigurationen der Matrix; Verhalten des leeren Zustands (neue Installation) und des Maximal-Zustands (10+ Tiere) ohne Layout-Brüche; Farbsystem: Unterscheidbarkeit der Palette bei Graustufen-Darstellung und simulierter Rot-Grün-Sehschwäche, korrekte Durchgängigkeit der Tierfarbe in allen Ansichten nach Farbwechsel, Nicht-Wählbarkeit des reservierten Warnrots.
