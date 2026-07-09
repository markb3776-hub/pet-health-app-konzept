# Zwischenanalyse simplyPet (Stand: 09.07.2026)

Dieses Dokument bietet eine ehrliche Bestandsaufnahme des Projekts "simplyPet". Es gleicht den aktuellen Code-Stand gegen die verabschiedeten Spezifikationen und die Doktrin ab, bewertet den Fortschritt der Roadmap und benennt gezielt übersehene oder noch offene Punkte, die vor der Prototyp-Auslieferung geklärt werden müssen.

## 1. Status der Roadmap

Das Projekt befindet sich exakt im Zeitplan. Die vorbereitenden und konzeptionellen Phasen sind vollständig abgeschlossen.

| Schritt | Inhalt | Status |
| :--- | :--- | :--- |
| **Schritt 1** | Arbeitstitel, MVP-Umfang (inkl. Foto-Ablage), Testgeräte-Definition | **Abgeschlossen** (08.07.2026) |
| **Schritt 2** | Technische Spezifikationen (Datenmodell, Screen-Flow, Offline-Strategie) | **Abgeschlossen** (08.07.2026) |
| **Schritt 3** | Projekt-Setup (Expo/React Native), Datenbank-Schema (Neon) | **Abgeschlossen** (08.07.2026) |
| **Schritt 4** | Entwicklung der App-Logik (in 4 Teilaufträgen empfohlen) | **Offen** (nächster Schritt) |
| **Schritt 5** | Auslieferung der APK und Test auf Zielgeräten | **Offen** |

Der Code liegt als Single Source of Truth im privaten GitHub-Repository (`markb3776-hub/pet-health-app-konzept`) im Unterordner `app/`. Die Kostenschätzung für den anstehenden Schritt 4 liegt bei ca. 10.500 bis 18.000 Credits, basierend auf dem gemessenen Verbrauch von Schritt 3 (3.224 Credits).

## 2. Abgleich: Code vs. Spezifikationen

Der aktuelle Code-Rahmen (Schritt 3) wurde gegen die Spezifikationen aus Schritt 2 geprüft. Das Fundament ist solide (TypeScript-Prüfung fehlerfrei, Expo-Doctor ohne Befund), jedoch wurden einige Abweichungen und Lücken identifiziert, die in Schritt 4 zwingend adressiert werden müssen.

### 2.1. Positiv umgesetzte Doktrin-Punkte
- **Offline-First:** Die lokale SQLite-Datenbank ist implementiert, inklusive `sync_status`-Flag und `deleted_at`-Feld (Soft-Delete) für den späteren Server-Abgleich.
- **Barrierefreiheit (EAA):** Große Schriftgrößen, kontrastreiche Farben (Signalrot reserviert) und minimale Touch-Targets (48px) sind im `theme.ts` verankert.
- **Tierarten-Konfiguration:** Das Modul `species.ts` enthält alle 14 definierten Tierarten und steuert die Sichtbarkeit von Modulen (z. B. kein Impf-Modul für Hamster).

### 2.2. Übersehene Punkte und Abweichungen (To-Dos für Schritt 4)
Bei der Prüfung fielen folgende Punkte auf, die von der Spezifikation abweichen oder noch fehlen:

1. **Zwei-Tap-Regel für den Notfallpass verletzt:** Laut Screen-Flow-Spezifikation (Abschnitt 1) muss der Notfallpass auf *jedem* Hauptbildschirm erreichbar sein. Aktuell ist der Notfall-Knopf im Code nur auf dem Startbildschirm (`HomeScreen.tsx`) eingebaut. Auf den Screens "Termine", "Erfassen" und "Mehr" fehlt er. **Muss in Schritt 4 korrigiert werden.**
2. **Tote Knöpfe im UI:** Die Menüpunkte im "Erfassen"-Dialog (`CaptureScreen`) und im "Mehr"-Bereich (`MoreScreen`) haben derzeit leere `onPress`-Handler. Sie sehen aus wie Knöpfe, tun aber nichts. Für den aktuellen Zwischenstand ist das normal, aber die Doktrin verbietet "Fake-Funktionen". **Vor der Auslieferung in Schritt 5 müssen diese entweder funktionieren oder visuell ehrlich als "kommt später" gekennzeichnet sein.**
3. **Erfassen-Dialog als Tab statt Modal:** Die Spezifikation verlangt für den zentralen Plus-Knopf ein Overlay (Modal/BottomSheet). Aktuell ist er als normaler Tab-Screen implementiert. **Wird in Teilauftrag 4.1 korrigiert.**

## 3. Offene Entscheidungen (Blocker für Schritt 4)

Bevor die eigentliche Entwicklung (Schritt 4) starten kann, müssen zwei strategische Fragen geklärt werden, die in den Konzepten bisher widersprüchlich oder unvollständig definiert sind:

### Blocker A: Die Authentifizierungs-Strategie (Konto-Erstellung)
Die Screen-Flow-Spezifikation (Abschnitt 2.1) verlangt ein Onboarding mit Konto-Erstellung (E-Mail, Passwort). Es existiert jedoch bisher **kein Backend-Server** für die Authentifizierung – die Architektur sieht lediglich eine direkte Synchronisation mit der Neon-Datenbank vor, was aus Sicherheitsgründen (Datenbank-Passwort in der App) nicht für echte Nutzerkonten taugt.
**Empfehlung für den Prototyp:** Wir streichen die Konto-Erstellung vorerst komplett. Die App startet lokal auf dem Gerät (Local-Only), der Nutzer gibt im Onboarding nur seinen Namen (für den Notfallpass) ein. Der Server-Sync und das Login-System werden erst nach der Prototyp-Abnahme gebaut.

### Blocker B: Der US-Datenbank-Kompromiss
Die Neon-Testdatenbank liegt in den USA (us-east-1). Dies wurde am 08.07.2026 als temporärer Kompromiss für Testdaten dokumentiert.
**Erinnerung:** Vor der Eingabe jeglicher *echter* Daten (auch eigener Tiere) muss die Datenbank zwingend auf EU-Infrastruktur umziehen (Neon Frankfurt oder Kellerserver), um die Doktrin nicht zu verletzen.

## 4. Status der Blindspots (Lückenliste)

Die ursprüngliche Liste umfasste 21 Blindspots. Die kritischen Punkte (P1) wurden bereits recherchiert und in die Strategie integriert:
- **KI & DSGVO (CLOUD Act):** Gelöst durch die verbindliche Entscheidung zum Selbst-Hosting auf dem Kellerserver (Start der App ohne KI-Scan).
- **Play-Store-Pflichten:** Die Anforderung von 12 bzw. 20 Testern über 14 Tage ist dokumentiert, wird aber erst nach dem Prototyp relevant (Prototyp läuft via APK-Direktinstallation).
- **European Accessibility Act (EAA):** Seit Juni 2025 auch für Apps verpflichtend. Wird durch große Schriften und Kontraste im Code bereits aktiv adressiert.

**Noch offene Blindspots (Auswahl):**
- Markenrechtliche Prüfung des Namens "simplyPet" (aktuell nur Arbeitstitel).
- Rechtliche Texte (Impressum, AGB, DSGVO-Erklärung) für den späteren Store-Release.
- StIKo-Vet-Pflegeprozess: Wer hält die Impfregeln in der App aktuell?

## 5. Fazit und nächste Schritte

Wir haben nichts Kritisches übersehen, das den Prototyp gefährdet. Die Basis ist sauber. Die identifizierten Lücken (Zwei-Tap-Regel, tote Knöpfe) sind typische Zwischenstands-Artefakte, die im nächsten Schritt systematisch abgearbeitet werden.

**Nächste Aktion (sobald gewünscht):**
Freigabe der Empfehlung zu Blocker A (Onboarding ohne Konto-Erstellung für den Prototyp, rein lokal) und anschließender Start von **Teilauftrag 4.1 (Fundament + Kern-Screens)**.
