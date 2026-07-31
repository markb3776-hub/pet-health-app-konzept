# E-114 Implementation Notes

## DailyTriggerInput (expo-notifications)
```typescript
type DailyTriggerInput = {
  type: SchedulableTriggerInputTypes.DAILY;
  channelId?: string;
  hour: number;   // 0-23
  minute: number; // 0-59
};
```

## Dateien die geändert werden müssen:

### 1. database.ts ✅ DONE
- `reminder_hour INTEGER NOT NULL DEFAULT 9`
- `reminder_minute INTEGER NOT NULL DEFAULT 0`

### 2. notificationService.ts ✅ DONE
- Neue Funktion `scheduleDailyNotification(reminderId, title, body, hour, minute)`
- `scheduleReminderNotification` bleibt für einmalige Termine
- `calculateTriggerDate` bekommt `minute` Parameter

### 3. MedicationEntryScreen.tsx – TODO
- Draft-Interface: `reminderHour: number` (default 9), `reminderMinute: number` (default 0)
- Save: INSERT bekommt `reminder_hour, reminder_minute` Spalten
- Save: Statt `scheduleReminderNotification(...)` → `scheduleDailyNotification(reminderId, title, body, hour, minute)`
- UI: Uhrzeit-Picker nach "Tägliche Erinnerung? Ja" (einfaches Textfeld "09:00" oder DateTimePicker mode="time")
- @react-native-community/datetimepicker ist bereits installiert (in package.json)

### 4. VaccinationEntryScreen.tsx – TODO
- Impfungen sind NICHT täglich → bleiben bei `scheduleReminderNotification` (DateTrigger)
- ABER: `calculateTriggerDate` bekommt jetzt `minute` Parameter → Aufruf anpassen
- Uhrzeit-Picker OPTIONAL (erstmal Standard 09:00 für Impfungen, kann später kommen)
- DB-Insert: `reminder_hour, reminder_minute` mit Defaults einfügen

### 5. AppointmentsScreen.tsx – TODO
- `ReminderRow` Interface: `reminder_hour: number; reminder_minute: number;` hinzufügen
- Reschedule-Block (Zeile 100-116): ENTFERNEN – DailyTrigger braucht kein Reschedule!
- `complete()` (Zeile 170-175): Für tägliche → `scheduleDailyNotification` statt `scheduleReminderNotification`
- `undo()` (Zeile 206-213): Für tägliche → `scheduleDailyNotification`
- `toggleReminder()` (Zeile 235-241): AN → `scheduleDailyNotification` mit gespeicherter Uhrzeit; AUS → cancel
- Optional: Uhrzeit in der Card anzeigen (z.B. "🔔 09:00")

### 6. Toggle-Logik (AppointmentsScreen):
- Toggle AN: `scheduleDailyNotification(r.id, r.title, body, r.reminder_hour, r.reminder_minute)`
- Toggle AUS: `cancelReminderNotification(r.id)`
- Für nicht-tägliche Termine: weiterhin `scheduleReminderNotification` mit DateTrigger
