# Roadmap: Von heute bis zum ersten testbaren Prototyp

Dieses Dokument definiert den ehrlichen, schrittweisen Weg von den fertigen Konzepten (Stand 08.07.2026) bis zu einer ersten überprüfbaren App auf deinem Smartphone. Es grenzt bewusst ab, was für den Prototyp zwingend nötig ist und was erst später (für Launch oder Beta) gebraucht wird.

## 1. Bestandsaufnahme: Was haben wir?

Die Konzeptphase ist vollständig abgeschlossen. Das bedeutet, wir wissen exakt, was wir bauen wollen und wie es funktionieren soll.
- **Gesichert (GitHub):** 46 Dokumente (App-Struktur, Datenkatalog, Nutzerkonzept, Doktrin, Blindspot-Bericht).
- **Entschieden:** KI-Scan läuft nur selbst gehostet (Start ohne KI), Kellerserver-Strategie, Offline-First-Ansatz, Android-API-Level 35.
- **Design:** Drei Kern-Mockups (Startbildschirm, Tierakte, Notfallpass) existieren.
- **Werkzeuge (verbunden):** GitHub (für Code), Neon EU (als Test-Datenbank).

## 2. Definition: Was ist der "erste überprüfbare Prototyp"?

Ein Prototyp ist nicht die fertige App. Er ist die kleinste Version, an der wir die Kernversprechen der Doktrin praktisch auf dem Handy testen können.
- **Was er KANN:** Starten (auch offline), ein Tier manuell anlegen, die Tierakte anzeigen, manuelle Einträge (Gewicht, Notiz) speichern, den Notfallpass mit QR-Code anzeigen, **Dokumente fotografieren und in der Akte ablegen (mit echter Kamera-Berechtigungs-Abfrage — bestätigte Erweiterung vom 08.07.2026)**.
- **Was er NOCH NICHT kann:** KI-Auswertung der fotografierten Dokumente (der Foto-Weg selbst ist drin, nur das automatische Auslesen fehlt), Familien-Synchronisation, UPD-Medikamentenabgleich, Versicherungs-Weiterleitung. Diese komplexen Themen werden isoliert hinzugefügt, sobald das Fundament stabil steht.
- **Wie er getestet wird:** Du bekommst eine APK-Datei, die du direkt auf deinem Android-Handy installierst (oder nutzt die "Expo Go"-App). Es braucht dafür noch keinen Google Play Store.

## 3. Die 5 Schritte bis zum Prototyp

### Schritt 1: Deine Entscheidungen (Vorarbeiten) — ✅ ABGESCHLOSSEN am 08.07.2026
- **Arbeitstitel festgelegt: "simplyPet"** (vom Projektinhaber bestätigt). Rein interner Name für Code, GitHub und Test-Symbol; der endgültige App-Name folgt später nach Namensfindung mit Markenprüfung (offener Blindspot 19).
- **MVP-Umfang bestätigt — mit einer Erweiterung:** Der Scan-/Einlese-Knopf ist im Prototyp bereits enthalten und löst die echte Berechtigungs-Kette aus (Android-Kamera-Freigabe, Nutzer-Einwilligung). Das Foto wird real in der Dokumenten-Ablage des Tieres gespeichert; nur die automatische KI-Auswertung fehlt noch, und die App sagt das ehrlich ("Foto gespeichert. Automatisches Auslesen kommt in einer späteren Version."). Kein toter Knopf, kein falsches Versprechen — und der komplette Weg (Knopf → Freigabe → Foto → Ablage) ist bereits gebaut und getestet, wenn später der selbst gehostete KI-Scan ergänzt wird.
- **Zielgeräte definieren:** Auf welchen Android-Geräten wird getestet? **Festgelegt (08.07.2026): Es stehen zwei Android-Telefone als Testgeräte zur Verfügung.** Das ist ein echter Vorteil: Zwei Geräte (idealerweise verschiedener Hersteller) decken Layout-Unterschiede, abweichende Android-Oberflächen und vor allem das kritische Push-Erinnerungs-Verhalten unter herstellerspezifischen Akku-Sparmodi ab (Blindspot C.14). Später dienen beide Geräte zudem als Testaufbau für die Familien-Freigabe. Hinweis: Im Prototyp-Stadium hält jedes Gerät seine eigenen lokalen Daten (noch keine Synchronisation); die Installation erfolgt per APK-Direktinstallation auf beiden Geräten, ohne Play Store und ohne Kosten.

### Schritt 2: Technische Spezifikation (Das "Bauplan"-Detail)
*Diese Arbeit übernimmt die Entwicklung (Agent/Programmierer) auf Basis der Konzepte:*
- **Datenmodellierung:** Die Konzepte in echte Datenbank-Tabellen übersetzen.
- **Screen-Flow komplettieren:** Wir haben 3 Mockups, die App braucht aber ca. 10 Bildschirme (z. B. "Neues Tier anlegen", "Eintrag erfassen"). Diese fehlenden Bildschirme müssen logisch verknüpft werden.
- **Offline-Strategie festlegen:** Wie genau speichert die App Daten, wenn das Internet weg ist? (Beantwortung von Blindspot C.15).

### Schritt 3: Projekt-Setup & Infrastruktur
- **Code-Basis initialisieren:** Ein "React Native / Expo"-Projekt anlegen (zwingend mit API-Level 35 für Android 15).
- **GitHub-Anbindung:** Den Code-Rahmen in dein vorhandenes privates Repository pushen.
- **Datenbank-Anbindung:** Die Neon-Test-Datenbank anbinden (für die ersten Tests völlig ausreichend, der Kellerserver wird hierfür noch nicht zwingend gebraucht).

### Schritt 4: Die eigentliche Entwicklung (Iterativ)
*Hier entsteht der Code, Schritt für Schritt:*
1. **Das Fundament:** Lokale Speicherung und das Datenmodell einbauen.
2. **Die Kern-Screens:** Onboarding → Tier anlegen → Startbildschirm → Tierakte.
3. **Die Funktionen:** Manuelle Einträge ermöglichen.
4. **Der Notfallpass:** Generierung und Anzeige des QR-Codes (die Machbarkeit ist bereits getestet).
5. **Interne Prüfung:** Ein automatisierter Test gegen die "Testpflichtigen Punkte" aus dem Strukturkonzept (Zwei-Tap-Regel, Offline-Start, große Schrift).

### Schritt 5: Auslieferung & Überprüfung
- Die App wird als Testversion (APK oder via Expo) an dich übergeben.
- Du testest sie auf **beiden Android-Geräten** auf Herz und Nieren (Funktion, Bedienbarkeit, Doktrin-Treue) — insbesondere: Erinnerungen über mehrere Tage auf beiden Geräten (Akku-Sparmodus-Test), Layout bei größter Schriftgröße auf beiden Bildschirmgrößen, Zwei-Tap-Notfallpass.

## 4. Kostenschätzung & Ausblick

**Für die Prototyp-Phase:**
- **Externe Werkzeuge:** 0 € (GitHub, Neon, Expo sind in den benötigten Basis-Stufen kostenlos).
- **Google Play Registrierung:** 25 $ (einmalig), aber erst nötig, wenn die App in einen offiziellen Beta-Test geht. Für den Prototyp nicht erforderlich.
- **Server:** Der Kellerserver (150–300 €) wird erst relevant, wenn wir nach dem Prototyp mit den KI-OCR-Tests beginnen.
- **Arbeitskosten (Agent-Credits):** Die Entwicklung (Schritt 2 bis 4) ist der ressourcenintensivste Teil. Empfehlung: Diese Schritte einzeln und klar umrissen beauftragen, um Kosten zu kontrollieren.

**Zusammenfassung:** Alles Konzeptionelle ist fertig und Schritt 1 ist seit dem 08.07.2026 abgeschlossen (Arbeitstitel "simplyPet", MVP-Umfang inkl. Foto-Ablage bestätigt, zwei Testgeräte benannt). Der nächste logische Schritt bei Reaktivierung ist **Schritt 2 (Technische Spezifikation)**.
