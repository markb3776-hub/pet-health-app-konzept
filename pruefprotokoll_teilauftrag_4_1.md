# Prüfprotokoll: Teilauftrag 4.1 (Fundament + Kern-Screens)

**Datum:** 09.07.2026
**Prüfumfang:** Interne Selbstprüfung vor Auslieferung gemäß Projektauflage (Fehler-Minimierung, Selbstüberprüfung auf Funktion, selbständige Fehlerkorrektur) und `pruefdoktrin_eingabe_stabilitaet.md` (Ebene 1, soweit ohne Gerät prüfbar).

## 1. Automatisierte Prüfungen

| Prüfung | Werkzeug | Ergebnis |
| :--- | :--- | :--- |
| TypeScript-Typprüfung (gesamtes Projekt) | `npx tsc --noEmit` | Bestanden, 0 Fehler |
| Projekt-Gesundheit | `npx expo-doctor` | Bestanden, 20/20 Checks |
| Produktions-Bundle (Android) baubar | `npx expo export --platform android` | Bestanden, Bundle 2,1 MB erzeugt |
| Zeit-Modul-Kernlogik (formatDate TT.MM.JJJJ, Sortierung Neuestes-zuerst, Nachtrag-Erkennung, DateKey-Roundtrip, UTC-Lokal-Kante) | Testskript mit 8 Assertions | Bestanden, alle Assertions grün |

## 2. Spezifikations-Abgleich (Code-Nachweis per Suchlauf)

| Anforderung (Quelle) | Nachweis im Code | Ergebnis |
| :--- | :--- | :--- |
| Erfassen als Overlay/BottomSheet, KEIN eigener Tab (Screen-Flow 2.4) | `AppNavigator.tsx`: Erfassen-Tab rendert nur `CaptureSheet`-Overlay über `tabBarButton`, wechselt nie den Bildschirm; alter `CaptureScreen.tsx` entfernt | Erfüllt |
| Zwei-Tap-Regel auf JEDEM Hauptbildschirm (Screen-Flow Abschn. 1) | Zuhause: fester Notfall-Knopf (Zone 3); Termine + Mehr: `EmergencyFab` fest verankert | Erfüllt |
| Kontoloses Onboarding: NUR Halter-Name, kein E-Mail/Passwort (Freigabe 09.07.2026) | `OnboardingScreen.tsx` + `profileStore.ts`; Suchlauf nach email/passwort findet nur erklärende Kommentare, keine Eingabefelder | Erfüllt |
| Onboarding-Fluss Begrüßung → Name → erstes Tier → Start (Screen-Flow 2.1) | Begrüßung mit Doktrin-Satz "Deine Daten gehören dir." → Namensschritt → Startbildschirm-Anleitungskarte "Erstes Tier anlegen" (`firstPet`-Route) | Erfüllt |
| Datums-Regeln: Kalender-Picker only, Chips Heute/Gestern/Vorgestern, TT.MM.JJJJ, Zukunft gesperrt (Screen-Flow 1.2) | `DateField.tsx`: nativer Picker, `maximumDate` sperrt Zukunft (außer `allowFuture`), Chips gesetzt; kein Freitext-Datumsfeld in der App | Erfüllt |
| Eine Zeitquelle, UTC intern, lokale Anzeige (Offline-Strategie 2.3) | `timeModule.ts` zentral; Suchlauf: kein `new Date(`/`toLocaleDateString` in Screens/Komponenten außerhalb des Zeit-Moduls | Erfüllt |
| Kein stiller Drift: Neuberechnung bei Foreground/App-Start (Offline-Strategie 2.3.4) | `useTodayKey`: AppState-Listener + Minuten-Intervall; Home und Termine hängen daran | Erfüllt |
| Sortierung Neuestes zuerst nach Ereignis-Datum + "Nachgetragen am …" (Screen-Flow 1.2.4) | `PetFileScreen.tsx`: `compareDateKeysDesc` auf Ereignis-Datum; `isBackdated` blendet Nachtrag-Vermerk ein | Erfüllt |
| Draft-Autosave, Fortsetzen-Dialog, Verwerfen-Nachfrage, atomares Speichern (Prüfdoktrin Baupflichten 1–3) | `draftStore.ts` (Autosave ≤ 2 s, Unmount-Sicherung); AddPet: `offerDraftResume`, `useUnsavedChangesGuard`, EIN atomarer INSERT, sichtbare Bestätigung, Eingaben bleiben bei Speicherfehler erhalten | Erfüllt |
| Querformat: responsive Layouts, kein Zustandsverlust (Screen-Flow 1.1) | `orientation: "default"`; `useWindowDimensions` in Home (Kacheln mehrspaltig), Tierakte (Passkarte + Inhalt nebeneinander), AddPet (Formular-Spalten), Onboarding, CaptureSheet (Optionen zweispaltig); Formularzustand liegt in React-State + Draft (übersteht Rotation und App-Neustart) | Erfüllt |
| Keine toten Knöpfe – ehrliche Kennzeichnung (Doktrin) | Suchlauf: keine leeren `onPress`; alle noch nicht gebauten Ziele (Eintrags-Formulare, Stammdaten-Bearbeiten, Mehr-Unterseiten, QR-Freigabe) zeigen ehrliche "Kommt in Schritt 4.x"-Hinweise | Erfüllt |
| Tierarten-übergreifend, nicht Hund/Katze-lastig | Tierakte-Reiter dynamisch aus `species.ts` (Aquarium: "Wasserwerte" statt Gesundheits-Reiter, kein Geburtsdatum/Geschlecht für Behältnisse, Feldname "Becken-Bezeichnung"); Notfallpass mit Tier-Umschaltung für Mehrtier-Haushalte | Erfüllt |

## 3. Ehrliche Abgrenzung (was 4.1 bewusst NICHT enthält)

Die Störfall-Matrix (Ebene 2 der Prüfdoktrin, 90 Durchgänge) und der Realbedingungs-Test (Ebene 3) erfordern ein physisches Gerät bzw. einen Emulator mit echter Rotation, App-Kill und Anruf-Unterbrechung – sie sind laut Doktrin **vor jeder Auslieferung an den Nutzer** (Schritt 4.4/5, APK) fällig, nicht je Teilauftrag; die bauliche Grundlage (Draft-Autosave, Guards, atomares Speichern) ist in 4.1 gelegt und code-geprüft. Die Eintrags-Formulare (Gewicht, Symptom, Impfung, Dokument-Foto mit Kamera-Kette), die Ein-Tap-Checkbox in Terminen sowie Stammdaten-Bearbeiten folgen in Teilauftrag 4.2, der QR-Code in 4.3 – alle Zugriffspunkte dafür existieren bereits und sind ehrlich beschriftet.

## 4. Ergebnis

Alle in Teilauftrag 4.1 vereinbarten Punkte sind umgesetzt und intern geprüft. Keine offenen Fehler. Auslieferung freigegeben.
