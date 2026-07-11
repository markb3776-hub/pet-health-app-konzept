# v0.1.4 Änderungsliste (Arbeitsdokument)

**Stand:** 11.07.2026

## Geplante Änderungen

| Nr. | Änderung | Quelle | Status |
|:---|:---|:---|:---|
| 1 | App-Shortcut: Lang drücken → "Notfallpass" | E-61 | ✅ |
| 2 | Permanente Notification (Opt-in, Lockscreen) | E-62 | ✅ (aber Bug: nicht permanent) |
| 3 | app.json Version auf 0.1.4, versionCode 4 | - | ✅ |
| 4 | TypeScript-Check + Build | - | ✅ |
| 5 | **FIX:** Notification als Foreground Service (nicht wegwischbar) | E-73 | ⏳ |
| 6 | Hilfe-Fragezeichen (?) bei Notfallpass-Bereichen (nur in App, nicht im Export) | E-77 | ⏳ |
| 7 | Reihenfolge Notfallpass: Allergien + Vorerkrankungen direkt untereinander | E-78 | ⏳ |

---

## Technische Details

### 1. App-Shortcut (E-61)

**Ziel:** Nutzer drückt lang auf das App-Icon → Kontextmenü zeigt "Notfallpass" → Tipp öffnet direkt den Notfallpass-Screen.

**Umsetzung:**
- Expo unterstützt keine nativen App-Shortcuts direkt über app.json
- Lösung: Expo Config Plugin erstellen, das nach Prebuild die `shortcuts.xml` und AndroidManifest-Einträge injiziert
- Alternative: Manuell nach Prebuild in `android/app/src/main/res/xml/shortcuts.xml` anlegen und AndroidManifest patchen

**Dateien:**
- `plugins/withAndroidShortcuts.js` – Expo Config Plugin
- `android/app/src/main/res/xml/shortcuts.xml` – Shortcut-Definition (nach Prebuild)
- `android/app/src/main/res/drawable/ic_shortcut_emergency.xml` – Monochrom-Icon für Shortcut

**Deep-Link:**
- Shortcut öffnet Intent mit Action `de.simplypet.app.OPEN_EMERGENCY`
- App.tsx fängt den Intent ab und navigiert zu `Notfallpass`

### 2. Permanente Notification (E-62)

**Ziel:** Opt-in Notification in der Statusleiste. Beim Tippen → Notfallpass öffnet sich OHNE Entsperren.

**Umsetzung:**
- Notification-Channel "Notfallpass" mit Priorität LOW (kein Sound/Vibration)
- Foreground-Service NICHT nötig – eine persistente Notification reicht (ongoing: true)
- Show-on-Lock-Screen: Activity-Flag `showWhenLocked` + `turnScreenOn`
- Opt-in Toggle im "Mehr"-Screen (AsyncStorage-Key: `simplypet.persistent_notification`)
- Beim App-Start: Prüfen ob aktiviert → Notification setzen/entfernen

**Dateien:**
- `src/services/persistentNotification.ts` – Service-Logik (setzen/entfernen)
- `src/screens/MoreScreen.tsx` – Toggle hinzufügen
- `App.tsx` – Beim Start prüfen und ggf. Notification setzen
- `plugins/withShowOnLockScreen.js` – Config Plugin für Activity-Flags

**Einschränkung:**
- Show-on-Lock-Screen erfordert native Activity-Flags die über Expo allein schwer zu setzen sind
- Pragmatischer Ansatz v0.1.4: Notification öffnet App normal (Entsperren nötig)
- Show-on-Lock-Screen wird als Verbesserung für v0.1.5 markiert (benötigt nativen Kotlin-Code)

---

## Entscheidung: Show-on-Lock-Screen verschoben

E-62 beschreibt "öffnet sich OHNE Entsperren". Dies erfordert:
1. Eine separate Activity mit `showWhenLocked=true` und `turnScreenOn=true`
2. Nativen Kotlin/Java-Code der nicht über Expo-JS steuerbar ist
3. Einen Config Plugin der die Activity in AndroidManifest registriert

**Pragmatischer Ansatz für v0.1.4:**
- Permanente Notification: JA (implementierbar)
- Tipp öffnet Notfallpass: JA (über Notification-Response-Handler)
- OHNE Entsperren: NEIN (verschoben auf v0.1.5, benötigt nativen Code)

Der Nutzer wird informiert dass die Notification den Notfallpass öffnet, aber das Gerät erst entsperrt werden muss. Dies ist ein akzeptabler Kompromiss für den Prototyp.
