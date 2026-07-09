# Technische Spezifikation: Screen-Flow (simplyPet)

**Datum:** Juli 2026
**Autor:** Manus AI

Dieses Dokument definiert den vollständigen Screen-Flow der App. Es ergänzt die drei bestehenden Mockups (Startbildschirm, Tierakte, Notfallpass) um die fehlenden Bildschirme und definiert die Navigation.

## 1. Navigations-Architektur

Die App nutzt eine feste Bottom-Navigation (Tab-Bar) mit vier Bereichen, die von überall erreichbar sind:
1.  **Zuhause:** Startbildschirm (Status, Tiere, Notfallpass-Schnellzugriff)
2.  **Termine:** Chronologische Liste aller Erinnerungen
3.  **Erfassen:** Zentraler Aktions-Knopf (Modal/BottomSheet)
4.  **Mehr:** Einstellungen, Profil, Export

Der Notfallpass-Knopf ist auf *jedem* Hauptbildschirm als schwebender Button (FAB) oder in der Tab-Bar verankert (Zwei-Tap-Regel).

### 1.1. Volle Querformat-Unterstützung (verbindliche Entscheidung des Projektinhabers, 09.07.2026)

Die App unterstützt **beide Ausrichtungen (Hoch- und Querformat) auf allen Screens, über alle Ebenen hinweg**. Begründung des Projektinhabers: Die App wird draußen in der Realität genutzt, nicht im Labor – Nutzer drehen ihr Gerät ständig, gerade bei kleinen Bildschirmen, um Inhalte größer zu sehen (z. B. Eingabefelder, den Notfallpass beim Vorzeigen, Fotos von Dokumenten). Eine Hochformat-Sperre wäre eine künstliche Laborbedingung.

Daraus folgen verbindliche Bauregeln:

1. **Konfiguration:** `orientation: "default"` statt `"portrait"` – die App folgt der Gerätedrehung (respektiert aber die systemweite Rotationssperre des Nutzers, wenn er sie in Android aktiviert hat).
2. **Responsive statt fixe Layouts:** Kein Screen darf feste Bildschirmbreiten annehmen. Listen, Formulare, Kacheln und die Tab-Bar müssen sich flüssig an beide Ausrichtungen anpassen; im Querformat werden breite Layouts sinnvoll genutzt (z. B. Tier-Kacheln mehrspaltig, Formular-Felder nebeneinander statt untereinander, Passkarte und Datenblöcke im Notfallpass nebeneinander).
3. **Kein Zustandsverlust beim Drehen:** Die Rotation mitten in einer Handlung darf niemals Daten verwerfen – ein halb ausgefüllter Eintrag, ein geöffnetes Overlay, eine laufende Kamera-Aufnahme und die Scroll-Position bleiben beim Drehen vollständig erhalten. Dies ist ein häufiger Absturz- und Datenverlust-Punkt schlechter Apps und daher ausdrücklich testpflichtig.
4. **Zwei-Tap-Regel gilt in beiden Ausrichtungen:** Der Notfallpass-Zugriff und alle Kernfunktionen müssen im Querformat genauso erreichbar sein wie im Hochformat.
5. **Eingabefelder und künftige Unterschrift:** Großflächige Eingaben (Freitext, später das Unterschriftsfeld der Komfort-Option beim Sitter-Zettel) profitieren am stärksten: Beim Drehen ins Querformat vergrößert sich die Eingabefläche bildschirmfüllend.

**Ehrliche Aufwands-Kennzeichnung:** Diese Entscheidung verdoppelt die Layout-Testfläche (jeder Screen in zwei Ausrichtungen, zusätzlich kombiniert mit größter Schriftgröße). Der Mehraufwand in Schritt 4 und bei jeder internen Prüfung ist bewusst akzeptiert – Stabilität in der Realität geht vor Entwicklungsgeschwindigkeit.

## 2. Die Bildschirme (Screen-Flow)

### 2.1. Onboarding & Leerer Zustand (Neu-Installation)

Das Onboarding beginnt mit einem Begrüßungsbildschirm, der die Doktrin der App kommuniziert: "Willkommen bei simplyPet. Deine Daten gehören dir." Darauf folgt die Konto-Erstellung, bei der E-Mail, Passwort und der Name des Halters (wichtig für den Notfallpass) abgefragt werden. Im dritten Schritt legt der Nutzer sein erstes Tier an. Hierbei wählt er zunächst die Tierart, was das nachfolgende Formular dynamisch anpasst. Anschließend werden Name, Geburtsdatum und Geschlecht erfasst sowie ein Foto über die Kamera oder Galerie hinzugefügt. Als Ergebnis dieses Prozesses landet der Nutzer auf dem Startbildschirm. Im leeren Zustand zeigt dieser eine freundliche Anleitungskarte (z. B. "Lege einen Termin an") anstelle von leeren Tier-Kacheln.

### 2.2. Zuhause (Startbildschirm) - *Mockup existiert*

Der Startbildschirm ist in drei klare Zonen unterteilt. Die oberste Zone enthält Status-Karten, die den Nutzer über anstehende Aufgaben informieren (z. B. "Heute fällig: ..."). Ein Tap auf eine solche Karte öffnet direkt die Detail- oder Bestätigungsansicht. In der mittleren Zone befinden sich die Tier-Kacheln, die Foto, Name und einen kurzen Status des jeweiligen Tieres anzeigen. Ein Tap auf eine Kachel öffnet die zugehörige Tierakte, während eine spezielle Plus-Kachel am Ende der Liste das Anlegen eines weiteren Tieres ermöglicht. Die unterste Zone ist fest dem Notfallpass-Knopf vorbehalten, dessen Betätigung sofort den Notfallpass öffnet.

### 2.3. Tierakte - *Mockup existiert*

Die Tierakte präsentiert sich im Kopfbereich mit einer Passkarte, die das Foto, das Signalement, die Chipnummer und besondere Erkennungsmerkmale des Tieres bündelt. Darunter befinden sich dynamische Reiter, die je nach Tierart variieren. Der Reiter "Gesundheit" listet Impfungen und Medikamente auf, wobei ein Tap auf einen Eintrag die Detail-Ansicht öffnet. Der Reiter "Verlauf" dient als chronologisches Tagebuch für Symptome und Notizen. Im Reiter "Dokumente" findet sich eine Galerie der Scans, die bei einem Tap im Vollbild angezeigt werden. Zusätzlich bietet die Akte einen Bearbeiten-Stift, um die Stammdaten jederzeit anpassen zu können.

### 2.4. Erfassen-Dialog (Der zentrale Plus-Knopf)

Ein Tap auf den zentralen Plus-Knopf in der Navigation öffnet ein Overlay (Modal oder BottomSheet) über dem aktuellen Bildschirm. Hier wählt der Nutzer die gewünschte Aktion aus: Dokument scannen (z. B. Impfpass oder Rechnung), Gewicht eintragen oder ein Symptom bzw. eine Notiz erfassen. 

Für den MVP-Umfang ist der Flow "Dokument scannen" wie folgt definiert: Zunächst erscheint eine ehrliche Berechtigungs-Erklärung ("Wir brauchen die Kamera für das Foto."), gefolgt vom System-Dialog zur Kamera-Freigabe. Nach dem Auslösen im Kamera-Sucher ordnet der Nutzer das Foto einem Tier zu. Abschließend erfolgt eine Bestätigung mit dem Hinweis: "Foto gespeichert. Automatisches Auslesen kommt in einer späteren Version." Das Foto wird sicher in der Dokumenten-Ablage des Tieres gespeichert.

### 2.5. Termine (Erinnerungs-Liste)

Der Bereich "Termine" bietet eine chronologische Liste aller offenen und anstehenden Aufgaben. Diese Liste ist übersichtlich in die Kategorien "Überfällig", "Heute" und "Demnächst" gruppiert. Um Verwechslungen in Mehrtier-Haushalten auszuschließen, zeigt jeder Eintrag die gewählte Tier-Farbe, das Tier-Foto und den Tier-Namen an (z. B. "Balou (Hund): Tablette"). Die Bestätigung einer Aufgabe erfolgt effizient über eine Checkbox direkt auf dem Listeneintrag (Ein-Tap-Bestätigung).

### 2.6. Notfallpass - *Mockup existiert*

Der Notfallpass wird als Vollbild-Ansicht im etablierten Pass-Design dargestellt. Er enthält alle kritischen medizinischen Daten und bietet die Funktion, einen QR-Code für die schnelle und sichere Praxis-Freigabe zu generieren.

### 2.7. Mehr (Einstellungen & Profil)

Im Bereich "Mehr" sind alle weiteren Funktionen gebündelt. Hier kann der Nutzer sein Profil und die Halter-Daten bearbeiten. Der Punkt "Daten & Export" ermöglicht den vollständigen Download aller Daten als ZIP-Datei. In den App-Einstellungen lässt sich der Kalender-Sync als Opt-in-Funktion aktivieren. Zudem steht hier ein Kontaktformular für den menschlichen Support zur Verfügung.

## 3. Testpflichtige UX-Punkte

Vor der Veröffentlichung müssen drei zentrale UX-Punkte getestet werden. Erstens die Zwei-Tap-Regel: Der Notfallpass muss aus jedem der Haupt-Tabs (Zuhause, Termine, Mehr) mit maximal zwei Taps erreichbar sein. Zweitens das Rückgängig-Prinzip: Abgehakte Termine müssen in einer separaten "Erledigt"-Liste kurzzeitig sichtbar bleiben, um sie bei Fehlklicks reaktivieren zu können. Drittens die Barrierefreiheit: Die Skalierung der Schriftgröße darf das Layout der Tier-Kacheln nicht zerstören, und die Kontraste der gewählten Tier-Farben müssen auch bei Sehschwächen lesbar bleiben.
