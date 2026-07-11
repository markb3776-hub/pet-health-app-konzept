# v0.1.3 Änderungsliste (Arbeitsdokument)

**Stand:** 11.07.2026

## Bereits implementiert in dieser Session

| Nr. | Änderung | Status |
|:---|:---|:---|
| 1 | Theme: Primary-Farbe auf Teal #2E9E83 (E-70) | ✅ |
| 2 | Theme: Emergency-Farbe auf ISO-Grün #237F52 (E-69) | ✅ |
| 3 | Navigation: 5. Tab "Notfall" mit ISO-Kreuz (E-58) | ✅ |
| 4 | Navigation: Erfassen-Tab Icon von ＋ auf ✎ (E-69) | ✅ |
| 5 | HomeScreen: Plus aus "Erstes Tier anlegen"-Button entfernt (E-69) | ✅ |
| 6 | HomeScreen: Emergency-Button entfernt (ersetzt durch 5. Tab) | ✅ |
| 7 | EmergencyFab aus allen Screens entfernt (ersetzt durch 5. Tab) | ✅ |
| 8 | Überfällig-Karte navigiert zum Termine-Tab (Nr. 35) | ✅ |
| 9 | App-Icon: Pfote+Kreuz auf Teal generiert (icon.png, foreground, splash) | ✅ |

## Noch offen

| Nr. | Änderung | Quelle |
|:---|:---|:---|
| 10 | Android-Icon-Background: einfarbig Teal (#2E9E83) | E-70 |
| 11 | Android-Icon-Monochrome: weiße Pfote auf transparent | Android 13+ |
| 12 | Tier-Kacheln kompakter (weniger Padding) | Nr. 36 |
| 13 | App-Shortcut "Notfallpass" (lang drücken) | Nr. 37 |
| 14 | QR-Änderungshinweis | Nr. 38 |
| 15 | QR-Druckdatum auf PDF | Nr. 39 |
| 16 | Notfallpass-Tipp (neutral) | Nr. 40 |
| 17 | App-Beschreibung "Pocket-Tool" | Nr. 41 |
| 18 | Bug-Fix: Tierverwaltung Layout (vertikal) | Nr. 42 |
| 19 | Permanente Notification (Opt-in, Lockscreen) | Nr. 43 / E-62 |
| 20 | app.json Version auf 0.1.3 aktualisieren | - |
| 21 | Build + Selbsttest | - |

## Icon-Status

Das Haupt-Icon (icon.png) ist generiert und sieht gut aus. Die Foreground- und Splash-Icons haben Transparenz-Probleme (rosa Ränder/Outlines statt sauberer Transparenz). Diese müssen per Python (PIL) nachbearbeitet werden: einfarbige Teal-Fläche als Background, weiße Pfote programmatisch extrahiert.
