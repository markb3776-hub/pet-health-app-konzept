# simplyPet – Prototyp

Die ehrliche, einfache Gesundheitsakte für Tiere. Dieses Verzeichnis enthält den App-Prototyp (Roadmap Schritt 3: Projektbasis). Die zugrunde liegenden Konzepte und Spezifikationen liegen im selben Repository eine Ebene höher.

## Technischer Rahmen

Die App basiert auf **Expo SDK 57 / React Native 0.86 / TypeScript** und zielt auf **Android (targetSdk 35, minSdk 29)**. Die Architektur folgt der Offline-Strategie aus Roadmap Schritt 2: Die App liest und schreibt immer zuerst in eine lokale SQLite-Datenbank (`src/db/database.ts`); ein Sync-Prozess zur Server-Datenbank folgt in Schritt 4. Das Server-Schema liegt unter `server/migrations/001_initial_schema.sql` und ist in der Neon-Testdatenbank eingespielt (7 Tabellen: users, pets, health_records, vaccinations, medications, documents, reminders).

| Verzeichnis | Inhalt |
| --- | --- |
| `src/config/species.ts` | Tierarten-Konfiguration (14 Arten) – steuert, welche Module pro Tierart aktiv sind |
| `src/db/database.ts` | Lokale SQLite-Datenbank (Offline-First, Soft-Delete, Sync-Flag) |
| `src/theme/theme.ts` | Farbsystem (reserviertes Signalrot, kuratierte Tierfarben-Palette), große Schrift für Zielgruppe 50+ |
| `src/navigation/AppNavigator.tsx` | Vier Bereiche (Zuhause, Termine, Erfassen, Mehr) plus Notfallpass-Stack |
| `src/screens/` | Grundgerüste aller MVP-Screens gemäß Screen-Flow-Spezifikation |
| `server/migrations/` | PostgreSQL-Schema für die Server-Datenbank |

## Wichtiger Hinweis: Testdatenbank in den USA (temporärer Kompromiss)

Die aktuelle Testdatenbank (Neon-Projekt `simplypet-test`) liegt in **us-east-1 (USA)**, weil die Anbindung keine Regionswahl erlaubte und der EU-Konsolen-Login zum Zeitpunkt der Einrichtung nicht möglich war (dokumentiert am 08.07.2026, mit Freigabe des Projektinhabers). Das ist vertretbar, weil dort **ausschließlich erfundene Testdaten** liegen – keine echten Nutzer- oder Tierdaten.

> **Verbindliche Auflage:** Vor der Eingabe jeglicher echter Daten muss die Datenbank auf EU-Infrastruktur umziehen (Neon Frankfurt eu-central-1 oder eigener Server gemäß Infrastruktur-Konzept). Der Umzug ist ein einfacher Schema-Import (`001_initial_schema.sql`) plus Anpassung der `DATABASE_URL`.

## Entwicklung

```bash
pnpm install        # Abhängigkeiten installieren
npx tsc --noEmit    # Typprüfung (muss fehlerfrei sein)
npx expo start      # Entwicklungsserver starten
```

Die Datei `.env.example` zeigt die erwarteten Umgebungsvariablen. Der echte Connection-String wird nicht committet.

## Doktrin-Regeln im Code

Der Code setzt die Projekt-Doktrin baulich um: Es gibt **keinen toten Knopf** (die Foto-Ablage sagt ehrlich, dass automatisches Auslesen später kommt), der **Notfallpass funktioniert vollständig offline** und ist in maximal zwei Berührungen erreichbar, das **Signalrot ist reserviert** für Warnhinweise und als Tierfarbe nicht wählbar, und Tiere ohne Impfempfehlung (z. B. Hamster) bekommen **kein Impf-Modul** angezeigt.
