# TODO: Nächster Release – Google Play Console Warnungen

> **Erstellt:** 30.07.2026  
> **Priorität:** Mittel (kein Blocker, aber für nächsten Release empfohlen)  
> **Quelle:** Play Console Warnungen für simplyPet_v1.0.0

---

## Warnung 1: Randlose Anzeige (Edge-to-Edge) – Android 15+

### Was Google sagt:
> "Deine App verwendet nicht mehr unterstützte APIs oder Parameter für die randlose Anzeige"

### Was das bedeutet:
Ab Android 15 (targetSdk 35+) ist Edge-to-Edge Standard. Die Statusbar und Navigationsbar sind transparent, die App zeichnet dahinter. Alte APIs wie `StatusBar.setBackgroundColor` oder `systemUiVisibility` Flags sind deprecated.

### Unser aktueller Stand:
- **Expo SDK 57**, **React Native 0.86**, **targetSdkVersion 36**
- `react-native-safe-area-context` 5.7.0 ist installiert ✅
- `edgeToEdgeEnabled` ist NICHT explizit in app.json gesetzt
- Kein `react-native-edge-to-edge` Package installiert

### Was zu tun ist:

1. **`edgeToEdgeEnabled: true` in app.json setzen:**
   ```json
   {
     "expo": {
       "android": {
         "edgeToEdgeEnabled": true
       }
     }
   }
   ```

2. **Alle Screens auf Android 15+ Gerät/Emulator testen:**
   - Prüfen ob Header unter Statusbar rutscht
   - Prüfen ob Bottom-Navigation unter Gesture-Bar rutscht
   - Prüfen ob Modals korrekt angezeigt werden

3. **Falls Probleme auftreten:**
   - `useSafeAreaInsets()` Hook verwenden statt hardcodierter Paddings
   - `KeyboardAvoidingView` mit `behavior="padding"` auf Android
   - Bei Modals: `statusBarTranslucent={true}` und `navigationBarTranslucent={true}` setzen

4. **Optional: `react-native-keyboard-controller` installieren** (besseres Keyboard-Handling mit Edge-to-Edge)

### Risiko wenn nicht gefixt:
- Auf Android 15/16 Geräten können UI-Elemente unter der Statusbar/Navigationsbar verschwinden
- Kein Store-Rejection, aber schlechte UX für Nutzer mit neueren Geräten

---

## Warnung 2: Größenänderung/Ausrichtung – Foldables & Tablets (Android 16)

### Was Google sagt:
> "Einschränkungen für die Größenänderung und Ausrichtung in deiner App entfernen, um Geräte mit großen Displays zu unterstützen"

### Was das bedeutet:
Ab Android 16 ignoriert das System auf **großen Displays** (Foldables, Tablets) die Einstellungen:
- `android:screenOrientation="portrait"` → wird ignoriert
- `android:resizeableActivity="false"` → wird ignoriert

Die App wird auf diesen Geräten zwangsweise im Landscape und auf dem vollen Screen dargestellt.

### Unser aktueller Stand:
- `"orientation": "portrait"` ist in app.json gesetzt
- Auf **Phones** wird Portrait weiterhin erzwungen (kein Problem)
- Auf **Tablets/Foldables** wird die Orientierung ab Android 16 ignoriert

### Was zu tun ist:

1. **Entscheidung treffen:** Wollen wir Tablets/Foldables aktiv unterstützen?
   - **Wenn NEIN:** Nichts tun. Die Warnung ist informativ, kein Blocker. Die App wird auf Tablets etwas komisch aussehen (gestreckt), aber sie wird nicht rejected.
   - **Wenn JA:** Responsive Layouts implementieren (Flexbox-Anpassungen für breitere Screens)

2. **Falls wir Tablets unterstützen wollen (Zukunft):**
   - Layouts mit `useWindowDimensions()` oder `react-native-responsive-screen` anpassen
   - Landscape-Modus testen
   - Eventuell 2-Spalten-Layout für breite Screens

### Risiko wenn nicht gefixt:
- **Kein Store-Rejection** – Google sagt explizit: "This warning will not cause Play Store rejection"
- Auf Tablets/Foldables sieht die App gestreckt/unoptimiert aus
- Auf normalen Phones: kein Effekt, Portrait bleibt erzwungen

---

## Empfohlene Reihenfolge:

| # | Aufgabe | Aufwand | Priorität |
|:--|:--------|:--------|:----------|
| 1 | Edge-to-Edge aktivieren + testen | 2-4 Stunden | Hoch (nächster Release) |
| 2 | Tablet/Foldable-Support | 1-2 Tage | Niedrig (optional, kein Blocker) |

---

## Quellen:

- [Expo Blog: Edge-to-Edge display](https://expo.dev/blog/edge-to-edge-display-now-streamlined-for-android)
- [72Technologies: Android 15 Edge-to-Edge in React Native](https://www.72technologies.com/blog/android-15-edge-to-edge-react-native-expo)
- [Android Developers: Behavior changes Android 16](https://developer.android.com/about/versions/16/behavior-changes-16)
- [Medium: Android 16 Resizability/Orientation](https://medium.com/@shanavascruise/android-16-remove-resizability-and-orientation-restrictions-in-your-app-to-support-large-screen-d649d23a92d8)
