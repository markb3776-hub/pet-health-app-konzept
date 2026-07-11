# Audit-Bericht: Verstöße gegen E-69 (Kreuz/Plus + Grünspektrum)

**Datum:** 11.07.2026
**Prüfung:** App-Quellcode (v0.1.2)
**Regel:** Kreuz/Plus (+) in Verbindung mit jeglicher Grün-Variante ist STRIKT UNTERSAGT (außer Notfallpass).

## Gefundene Verstöße im App-Code

### 1. Erfassen-Tab (AppNavigator.tsx)
- **Ort:** `app/src/navigation/AppNavigator.tsx`, Zeile 135
- **Code:** `<Text style={{ color, fontSize: 22 }}>＋</Text>`
- **Problem:** Das Icon ist ein Plus. Wenn der Tab aktiv ist, wird `color` auf `colors.primary` (#3E6B4F, Grün) gesetzt.
- **Verstoß:** Grünes Plus.
- **Lösung für v0.1.3:** Das Plus-Symbol durch ein Stift-Symbol (✎) ersetzen.

### 2. "Erstes Tier anlegen"-Button (HomeScreen.tsx)
- **Ort:** `app/src/screens/HomeScreen.tsx`, Zeile 199
- **Code:** `<Text style={styles.guideButtonText}>＋ Erstes Tier anlegen</Text>`
- **Problem:** Der Button hat den Style `guideButton` mit `backgroundColor: colors.primary` (#3E6B4F, Grün). Der Text ist weiß.
- **Verstoß:** Plus-Zeichen auf grünem Hintergrund.
- **Lösung für v0.1.3:** Das Plus-Zeichen aus dem Text entfernen.

## Gefundener Anpassungsbedarf (Theme)

### 3. Notfallpass-Farbe (theme.ts)
- **Ort:** `app/src/theme/theme.ts`, Zeile 21
- **Code:** `emergency: '#B4532A'` (Orange-Braun)
- **Problem:** Entspricht nicht der neuen ISO-Vorgabe.
- **Lösung für v0.1.3:** Farbe auf ISO-Grün `#237F52` ändern.

---

**Status:** Diese Punkte werden im anstehenden Software-Update v0.1.3 behoben.
