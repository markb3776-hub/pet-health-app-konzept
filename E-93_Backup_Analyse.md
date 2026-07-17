# Problemanalyse und Lösungsvorschläge: Backup-System (E-93)

## 1. Problemanalyse

### Problem A: "Noch keine Sicherung erstellt" wird angezeigt, obwohl ein manueller Export stattfand
**Ursache:**
Die Funktion `getLastBackupDate()` in `backupService.ts` sucht **ausschließlich** nach der Datei `simplypet_auto_backup.simplypet`.
Beim manuellen Export wird jedoch eine Datei mit Datum im Namen generiert (z.B. `Backup_003_2026-07-17.simplypet`). Diese Datei wird von der Status-Anzeige ignoriert. 
Zudem aktualisiert `exportBackup()` das Auto-Backup nicht, weshalb die Anzeige leer bleibt, wenn noch nie ein Auto-Backup (z.B. durch Speichern eines Eintrags) getriggert wurde.

### Problem B: Backup-Anzeige verschwindet nach App-Update
**Ursache:**
App-Updates via APK (mit gleichem Package-Namen, aber höherem VersionCode) leeren in Expo unter Android unter bestimmten Umständen das `documentDirectory` (wo das Auto-Backup liegt) oder den Cache. Da die App das Datum des letzten Backups *direkt* aus der Existenz und dem Änderungsdatum der Datei `simplypet_auto_backup.simplypet` im lokalen Speicher abliest, verschwindet die Anzeige, sobald diese Datei gelöscht wird.

### Problem C: Lokales Speichern unter "Dateien" (Feature-Wunsch)
**Ursache/Situation:**
Derzeit wird nur `expo-sharing` (Share-Intent) genutzt. Das bietet zwar Drive und andere Apps an, aber je nach Android-Version ist es nicht immer intuitiv, die Datei einfach lokal in den Download- oder Dokumenten-Ordner des Handys zu speichern. 
Zudem ist die Datei im internen App-Speicher (`documentDirectory`) für den Nutzer unsichtbar und bei Deinstallation der App weg.

---

## 2. Lösungsvorschläge

### Lösungsvorschlag 1: Storage Access Framework (SAF) & AsyncStorage (Empfohlen)
**So funktioniert es:**
1. **Status-Fix:** Wir speichern das Datum des letzten manuellen Exports zusätzlich in `AsyncStorage` (z.B. `KEY_LAST_BACKUP_DATE`). Die Anzeige prüft dann sowohl die Auto-Backup-Datei als auch diesen Key und zeigt das neuere Datum an. `AsyncStorage` überlebt App-Updates zuverlässig.
2. **Lokales Speichern:** Wir ersetzen oder ergänzen den Share-Dialog (`expo-sharing`) durch `expo-file-system/StorageAccessFramework`. Damit öffnet sich der native Android-Dateipicker im "Speichern unter..."-Modus. Der Nutzer kann dann explizit einen Ordner auf seinem Handy (z.B. "Downloads" oder "Dokumente") auswählen, und die Datei wird dort sicher abgelegt.

**Vorteile:** Löst alle drei Probleme. Der Nutzer hat volle Kontrolle über den Speicherort auf dem Gerät.

### Lösungsvorschlag 2: MediaLibrary / Download-Ordner & Status-Fix
**So funktioniert es:**
1. **Status-Fix:** Wie bei Vorschlag 1 (Speichern in `AsyncStorage`).
2. **Lokales Speichern:** Wir nutzen `expo-media-library` (oder direkte FileSystem-Pfade für Android Downloads), um die Backup-Datei *automatisch* ohne weiteren Dialog in den "Downloads"-Ordner des Handys zu kopieren, und bieten danach *optional* noch den Teilen-Dialog für Google Drive an.

**Vorteile:** Sehr schnell, ein Klick speichert lokal und bietet Teilen an.
**Nachteile:** Braucht ggf. zusätzliche Android-Berechtigungen (`WRITE_EXTERNAL_STORAGE` / Media), was bei Android 13+ restriktiver ist.

### Lösungsvorschlag 3: Nur Bugfixes (Minimal-Invasiv)
**So funktioniert es:**
1. **Status-Fix:** Wir passen `exportBackup()` so an, dass es nach dem Teilen *zusätzlich* ein unsichtbares `autoBackup()` ausführt. So existiert die Datei `simplypet_auto_backup.simplypet` und die Anzeige stimmt.
2. **Lokales Speichern:** Wird nicht implementiert. Der Nutzer muss im Share-Dialog eine App wie "Dateien" (Files by Google) auswählen, um es lokal zu speichern.

**Vorteile:** Sehr wenig Code-Änderung, keine neuen Berechtigungen.
**Nachteile:** Erfüllt nicht deinen Wunsch nach einem einfachen, direkten lokalen Speichern.

---

**Meine Empfehlung:** Ich empfehle **Lösungsvorschlag 1**. Das Storage Access Framework ist der saubere Android-Weg, um Dateien für den Nutzer zugänglich auf dem Gerät zu speichern, ohne Konflikte mit Berechtigungen zu riskieren. Gleichzeitig fixen wir die Anzeige via AsyncStorage.
