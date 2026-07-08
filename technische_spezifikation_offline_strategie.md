# Technische Spezifikation: Offline-Strategie & Sync (simplyPet)

**Datum:** Juli 2026
**Autor:** Manus AI

Dieses Dokument definiert die Offline-Strategie für die Pet-Health-App "simplyPet" (Roadmap Schritt 2). Gemäß der MEMORIA-Doktrin und den Vorgaben für den Notfallpass muss die App primär offline funktionieren (Local-First-Resilienz), um in Kliniken ohne Netzabdeckung verlässlich zu sein.

## 1. Grundprinzip: Local-First (Offline-First)

Die App kommuniziert nicht direkt mit dem Backend (Neon PostgreSQL). Sie liest und schreibt *immer* in eine lokale Datenbank auf dem Gerät (z. B. WatermelonDB oder Expo SQLite). Ein Hintergrund-Prozess synchronisiert diese lokale Datenbank asynchron mit dem Server, sobald eine Internetverbindung besteht.

### 1.1. Was MUSS offline verfügbar sein?

Um im Notfall verlässlich zu sein, müssen kritische Daten zwingend offline verfügbar sein. Dazu gehört der komplette Notfallpass mit Signalement, Chipnummer, Besonderen Merkmalen, Dauermedikation, Allergien, Vorerkrankungen und den letzten Impfungen. Ebenso müssen die Stammdaten der Tiere (Fotos, Namen, Tierart) sowie anstehende Termine und Erinnerungen für den aktuellen und die kommenden Tage lokal vorgehalten werden.

### 1.2. Was DARF online-only sein (Graceful Degradation)?

Bestimmte Funktionen dürfen eine Internetverbindung voraussetzen. Die Erzeugung eines neuen Freigabe-Links (QR-Code) für die Praxis erfordert einen Server-Aufruf. Ist das Gerät offline, zeigt die App einen ehrlichen Hinweis: "Für die digitale Freigabe wird Internet benötigt. Bitte zeige der Praxis diesen Bildschirm." Der Pass selbst bleibt als Bildschirm-Ansicht sichtbar. Der für spätere Phasen geplante KI-Dokumenten-Scan speichert im Offline-Modus das Foto nur lokal und lädt es später zur Auswertung hoch. Beim vollständigen Dokumenten-Archiv werden Thumbnails lokal gespeichert, während hochauflösende Original-PDFs zur Speicherplatzschonung online-only sein können, sofern sie nicht explizit für den Offline-Gebrauch markiert wurden.

## 2. Sync-Verfahren und Konfliktlösung

Da im Prototyp (Schritt 1 & 2) noch keine Familien-Freigabe (Mehrgeräte-Sync derselben Akte) umgesetzt wird, ist das Sync-Verfahren zunächst auf den Single-User-Fall optimiert.

### 2.1. Der Sync-Zyklus

Der Sync-Zyklus beginnt mit einer lokalen Änderung, beispielsweise wenn der Nutzer ein neues Gewicht einträgt. Der Datensatz erhält lokal einen Zeitstempel (`updated_at`) und ein Flag `is_synced = false`. Sobald die App eine Netzwerkverbindung erkennt, erfolgt ein Push: Alle Datensätze mit `is_synced = false` werden an die Neon-Datenbank gesendet. Anschließend führt die App einen Pull durch und fragt den Server nach Änderungen seit dem letzten erfolgreichen Sync, was insbesondere für die spätere Multi-Device-Nutzung relevant ist.

### 2.2. Konfliktlösung (Vorbereitung für Familien-Sync)

Um den Blindspot C.15 ("Offline-Sync & Konfliktlösung") strukturell vorzubereiten, wird serverseitig eine Last-Writer-Wins (LWW)-Strategie auf Feldebene implementiert. Hierfür benötigt jeder Datensatz eine `updated_at`-Spalte. Empfängt der Server einen Datensatz, vergleicht er den Zeitstempel. Ist der eingehende Zeitstempel neuer als der in der Datenbank, wird das Feld überschrieben. Eine Ausnahme bilden kritische Löschungen (z.B. das Löschen einer Tierakte): Hier wird ein Soft-Delete (`deleted_at`) verwendet, um versehentliche Datenverluste durch asynchrone Syncs zu verhindern.

## 3. Daten-Lebenszyklus & Backup

Der Daten-Lebenszyklus berücksichtigt auch den Tod eines Tieres (Blindspot C.12). In diesem Fall wird die Akte nicht gelöscht, sondern archiviert (`archived`). Sie verschwindet aus der täglichen Ansicht und den Erinnerungen, bleibt aber für den Halter lesbar. Um Datenverlust bei Server-Ausfällen zu verhindern (Blindspot C.16), führt die Neon-Test-Datenbank (und später der Produktionsserver) tägliche, automatisierte Backups durch.

## 4. Testpflichtige Punkte (Produktions-Protokoll)

Vor dem Release des Prototyps (Schritt 5) müssen mehrere Offline-Szenarien zwingend getestet werden. Die App muss sich im Flugmodus starten lassen, und der Startbildschirm muss vollständig laden. Es ist zu prüfen, ob sich der Notfallpass mit Foto in unter zwei Taps öffnen lässt und alle medizinischen Daten korrekt anzeigt. Schließlich muss ein Eintrag (z.B. Gewicht) offline erfasst werden; nach Beenden des Flugmodus ist zu verifizieren, ob der Eintrag erfolgreich im Backend ankommt.
