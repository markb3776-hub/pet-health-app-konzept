# simplyPet – Offizielle Farbpalette & UI-Regeln

## App-Farben (In-App UI)

| Bezeichnung | Hex-Code | Verwendung |
|:---|:---|:---|
| **Primary (Teal-Grün)** | `#2E9E83` | Buttons, aktive Tabs, Akzente, Header |
| **Primary Light** | `#4DB89A` | Gradient-Ende, Hover-States, Karten-Akzente |
| **Primary Dark** | `#1F7A64` | Pressed-States, Schatten |
| **Background** | `#FFFFFF` | App-Hintergrund |
| **Surface/Card** | `#F8F9FA` | Karten, Eingabefelder |
| **Text Primary** | `#1A1A2E` | Haupttext |
| **Text Secondary** | `#6B7280` | Untertitel, Hinweise |
| **Error/Überfällig** | `#DC2626` | Überfällig-Badges, Fehlermeldungen |
| **Success** | `#16A34A` | Bestätigungen, aktive Status |

## Store-Screenshot Hintergrund

| Bezeichnung | Hex-Code | Verwendung |
|:---|:---|:---|
| **Screenshot-BG** | `#1A1A2E` | Einheitlicher dunkler Hintergrund für alle Store-Screenshots |

---

## VERBINDLICHE UI-REGELN

### Regel 1: Grünes Kreuz = AUSSCHLIESSLICH Notfall (ISO 7010)

> **Ein Kreuz-Symbol (+) in Verbindung mit der Farbe Grün darf in der gesamten App NUR für den Notfallpass verwendet werden.**

- Das grüne ISO-Erste-Hilfe-Kreuz erscheint **nur** an diesen Stellen:
  - Notfall-Tab in der Navigation (5. Tab)
  - Notfallpass-Notification (permanente Benachrichtigung)
  - Notfallpass-Screen Header
- **Kein anderer Button, kein anderes Icon, kein anderes UI-Element** darf ein grünes Kreuz zeigen.
- Begründung: Nutzer soll das grüne Kreuz sofort und eindeutig mit "Notfall" assoziieren. Mehrere grüne Kreuze verwirren und verwässern die Bedeutung.

### Regel 2: Einheitlicher App-Hintergrund

- Der App-Hintergrund ist **immer weiß** (#FFFFFF).
- Kein Screen hat einen dunklen, farbigen oder wechselnden Hintergrund.
- Karten und Eingabefelder nutzen #F8F9FA (leichtes Grau) zur Abgrenzung.

### Regel 3: Konsistenz der Navigation

- Die Bottom-Navigation zeigt auf **jedem Screen** die gleichen 5 Tabs mit identischen Icons.
- Der aktive Tab wird durch die Primary-Farbe (#2E9E83) hervorgehoben.
- Der Notfall-Tab zeigt das grüne ISO-Kreuz – dieses Icon ändert sich NICHT je nach aktivem Tab.

---

## Notizen

- Die App-Farbe `#2E9E83` (Teal-Grün) ist die Markenfarbe und darf NICHT als Screenshot-Hintergrund verwendet werden, damit die App-UI sich klar davon abhebt.
- Der dunkle Hintergrund `#1A1A2E` sorgt dafür, dass die hellen App-Screens und das Teal-Grün der UI maximal hervorstechen.
