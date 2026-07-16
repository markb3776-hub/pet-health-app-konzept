# Testgeräte-Matrix

Erstellt: 16.07.2026  
Zweck: Dokumentation aller Testgeräte, deren OS-Versionen und bekanntes Verhalten bei plattformspezifischen Features.

---

## Geräte

| Gerät | Modell | OS | UI-Version | DPI-Klasse | Besitzer |
|:---|:---|:---|:---|:---|:---|
| Samsung Galaxy S23 | SM-S911B | Android 16 | OneUI 8.5 | xxhdpi | Mark (Hauptgerät) |
| ZTE Blade A35e | ZTE Blade A35e | Android 15 | Stock-Android (ZTE) | hdpi | Mark (Testgerät) |
| Tablet K7 | K7 | Android 15 | BigdroidOS 3.5.5 | mdpi | Mark (Testgerät) |

---

## Notification-Icon Verhalten (Statusleiste)

### Wie Android Notification-SmallIcons rendert

Android verwendet für SmallIcons in der Statusleiste ausschließlich den **Alpha-Kanal** des Icons. Farbe wird ignoriert. Das bedeutet:
- Transparente Pixel = unsichtbar
- Nicht-transparente Pixel = weiß (oder Akzentfarbe je nach Hersteller-UI)

**Ausnahme Samsung OneUI:** Samsung rendert Notification-Icons in der Statusleiste farbig (nutzt `setColor()` oder das volle Icon).

### Verhalten pro Gerät

| Gerät | `R.mipmap.ic_launcher` | `R.drawable.ic_notification` (Monochrome-Pfote) | `setColor(0xFF2E9E83)` |
|:---|:---|:---|:---|
| Samsung S23 (OneUI 8.5) | Farbiges App-Icon (grün, korrekt) | Pfote in Akzentfarbe (grün) | Wird angewendet → grüne Pfote |
| ZTE Blade A35e (Stock) | Weißer Blob/Punkt (runde Form des Adaptive-Icons) | Weiße Pfoten-Silhouette | Wird NICHT in Statusleiste angewendet (nur im Notification-Drawer) |
| Tablet K7 (BigdroidOS) | Weißer Blob/Punkt | Weiße Pfoten-Silhouette | Wird NICHT in Statusleiste angewendet (nur im Notification-Drawer) |

### Korrekte Lösung (implementiert ab Commit 6379b4d)

```kotlin
.setSmallIcon(R.drawable.ic_notification)  // Monochrome Pfote (nur Alpha-Kanal)
.setColor(0xFF2E9E83.toInt())              // simplyPet-Grün für Samsung/Notification-Drawer
```

**Ergebnis:**
- Samsung OneUI: Grüne Pfote in Statusleiste ✓
- Stock-Android: Weiße Pfoten-Silhouette in Statusleiste ✓
- Notification-Drawer (alle Geräte): Grüne Pfote ✓

### Icon-Spezifikation

| DPI | Pixel-Größe | Datei |
|:---|:---|:---|
| mdpi | 24x24 | `assets/notification-icons/ic_notification_24.png` |
| hdpi | 36x36 | `assets/notification-icons/ic_notification_36.png` |
| xhdpi | 48x48 | `assets/notification-icons/ic_notification_48.png` |
| xxhdpi | 72x72 | `assets/notification-icons/ic_notification_72.png` |
| xxxhdpi | 96x96 | `assets/notification-icons/ic_notification_96.png` |

Quelle: `assets/notification-icon.png` (338x338, Pfote+Kreuz-Silhouette, weiß auf transparent, kein runder Hintergrund)

### Regeln für zukünftige Icon-Änderungen

1. **NIEMALS** `R.mipmap.ic_launcher` für Notifications verwenden → wird auf Stock-Android zum weißen Blob
2. **IMMER** ein dediziertes Monochrome-Icon ohne Hintergrund verwenden
3. **IMMER** `setColor()` setzen für die Akzentfarbe im Notification-Drawer
4. **IMMER** korrekte DPI-Varianten bereitstellen (24/36/48/72/96px)
5. Icon darf NUR weiße Pixel auf transparentem Hintergrund enthalten (kein Kreis, kein Rechteck drumherum)

---

## Hardware-Einschränkungen

| Gerät | RAM | CPU | Bekannte Probleme |
|:---|:---|:---|:---|
| Samsung S23 | 8 GB | Exynos 2200 | Keine |
| ZTE Blade A35e | 2+4 GB (virtuell) | SC9863A 8-Core 1.6GHz | Low-Memory, langsamer Start |
| Tablet K7 | unbekannt | unbekannt | BigdroidOS Custom-ROM, ggf. fehlende APIs |
