# Rechercheprotokoll: Nutzer-Notizen zum Notfallpass

**Datum:** 11.07.2026
**Anlass:** Rückfrage des Nutzers, dass die markierten Notfallpass-Themen bereits früher anhand eines Bildes mit Notizen besprochen wurden.

## Gesicherte Funde aus Bildern

| Datei | Beobachtung | Relevanz |
|:---|:---|:---|
| `/home/ubuntu/upload/1000171217.jpg` | Kein Fachinhalt zur App; zeigt nur Gerätebezeichnung „Galaxy S24 / SM-S921B/DS“. | Nicht relevant |
| `/home/ubuntu/upload/1000170663.jpg` | Screenshot der Manus-Kontoansicht. | Nicht relevant |
| `/home/ubuntu/upload/1000170719.jpg` | Screenshot der Manus-Kontoansicht. | Nicht relevant |
| `/home/ubuntu/upload/1000170743.jpg` | Screenshot der Manus-Kontoansicht. | Nicht relevant |
| `/home/ubuntu/upload/1000171333.jpg` | Handschriftliche Notizen mit direkter Relevanz zum Notfallpass. Lesbare Kernpunkte: „Tierarzt Datenfeld?“, „Impfstatus?“, „Medikation?“, „Vorerkrankungen?“, „Allergien?“, „Merkmale?“, „Chip Nummer?“ sowie Klammer/Zuordnung „wo Eingabe“. Oben zusätzlich u. a. „Wurmkur? (Tablette)“, „Zeckenbiss“, „Zecken & Flöhe? (Halsband)“. | Hoch relevant |

## Zwischenfazit

Die Notiz `1000171333.jpg` spricht **stark dafür**, dass die frühere Diskussion sich um die Frage drehte, **wo diese Informationen erfasst/eingegeben werden sollen**. Aus dem sichtbaren Text ergibt sich **noch kein eindeutiger Beleg**, dass die Felder zwingend **direkt im Notfallpass inline bearbeitbar** sein sollten. Die Formulierung „wo Eingabe“ deutet zunächst eher auf **Eingabeort / Datenquelle / Zuordnung** hin.

## Dokumentenabgleich

| Quelle | Befund |
|:---|:---|
| `ENTSCHEIDUNGSREGISTER.md` | E-23: „Allergien/Vorerkrankungen – Ein Bereich, zwei separate Titelfelder in Stammdaten“. Kein expliziter Beschluss zur Inline-Bearbeitung direkt im Notfallpass. |
| `IMPL_PLAN_v012.md` | Allergien/Vorerkrankungen wurden explizit in die Stammdaten (`pets`-Felder) gelegt; `passData.ts` liest diese für den Notfallpass aus. |
| `notfallpass_design_spezifikation.md` | „Besondere Erkennungsmerkmale“ sind fester Bestandteil der Stammdaten und erscheinen von dort automatisch im Notfallpass. Kein Hinweis auf Direktbearbeitung im Notfallpass. |

## Arbeitsannahme nach aktuellem Stand

Frühere Besprechung = wahrscheinlich: **Diese Inhalte sollen im Notfallpass sichtbar sein, stammen aber aus zentral gepflegten Stammdatenfeldern.**
Nicht belegt ist bisher: **antippbar + inline editierbar direkt auf dem Notfallpass-Screen**.

## Offene Prüfung

- Weitere hochwahrscheinliche Notizbilder im Upload-Verzeichnis prüfen, falls vorhanden.
- Danach Nutzer mit dem belegten Zwischenstand informieren.

## Weitere Bildfunde

| Datei | Beobachtung | Relevanz |
|:---|:---|:---|
| `/home/ubuntu/upload/1000171395.jpg` | Amazon-/Smartphone-Screenshot, kein Fachinhalt zur App. | Nicht relevant |
| `/home/ubuntu/upload/1000171230.jpg` | Tierakte-Screen von „Hanna“ mit Profilkarte. Sichtbar: `Chip-Nummer: Nicht angegeben`, `Merkmale: Keine besonderen Merkmale`, oben Stift-Symbol an der Profilkarte. | Relevant: zeigt, dass Chipnummer/Merkmale in der Tierakte bzw. den Stammdaten verortet sind |
| `/home/ubuntu/upload/1000171232.jpg` | Home-Screen, kein Zusatzhinweis zur Bearbeitung der Notfallpass-Felder. | Gering relevant |
| `/home/ubuntu/upload/1000171235.jpg` | Home-Screen mit zwei Tieren, kein Zusatzhinweis zur Bearbeitungslogik. | Gering relevant |
| `/home/ubuntu/upload/1000171237.jpg` | Tierakte-Screen von „Devi“; ebenfalls `Chip-Nummer: Nicht angegeben`, `Merkmale: Keine besonderen Merkmale`, mit Stift-Symbol an der Profilkarte. | Relevant: bestätigt die Stammdaten-Verortung dieser Felder |

## Präzisierter Zwischenstand

Die vorhandenen Protokoll-/Bildfunde sprechen derzeit am stärksten für folgende frühere Logik:

1. **Chip-Nummer** und **Merkmale / besondere Erkennungsmerkmale** gehören zur **Profilkarte / Tierakte / Stammdaten**.
2. **Allergien**, **Vorerkrankungen**, **Medikation** und **Impfstatus** waren in den Notizen als inhaltlich wichtige Felder markiert, zusammen mit der Frage **„wo Eingabe“**.
3. Damit ist die frühere Besprechung nach jetzigem Belegstand eher eine **Zuordnungs-/Eingabeort-Frage** als ein klar dokumentierter Beschluss für **Inline-Edit direkt im Notfallpass**.

## Aktuell belastbar formulierbarer Befund

- **Sichtbarkeit im Notfallpass:** ja, das war Gegenstand der Notizen.
- **Zentrale Pflege über Stammdaten/Tierakte:** dafür gibt es deutliche Indizien in Notiz + Screenshots + Dokumenten.
- **Direktes Antippen und Bearbeiten im Notfallpass selbst:** dafür liegt in den gefundenen Protokollen aktuell **kein eindeutiger schriftlicher Beschluss** vor.
