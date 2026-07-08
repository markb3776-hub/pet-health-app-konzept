# Blindspot-Check: Lückenliste (Bestandsaufnahme)

**Basis:** 20 Konzept-/Analysedokumente vom 08.07.2026. Abgedeckt sind: Marktanalyse, Doktrin-Bauprinzipien, Praxis-Integration (Sync, QR, Datenübernahme, Praxissuche), Datenkatalog/Erfassung, Wettbewerb (12 Apps), Nutzerseite (Zielgruppe, Onboarding, Retention, Datenschutz-Erwartung), Tierarten-Matrix, Notfall-Pass, Erinnerungssystem, Vertrauen/UX, App-Struktur/Farben, Berechtigungen, Mockups, Serverwahl (grob).

## Identifizierte Lücken (vor Recherche, nach Kategorie)

### A. Rechtlich (potenziell projektkritisch)
1. **DSGVO-Betrieb konkret:** AV-Verträge, Datenschutzerklärung, Verzeichnis der Verarbeitungstätigkeiten, Auskunfts-/Löschprozesse. Halterdaten sind personenbezogen (Name, Adresse, E-Mail) – Tierdaten selbst nicht, aber die Verknüpfung schon.
2. **KI-Verarbeitung & DSGVO/AI Act:** Dokumenten-Scan schickt Fotos (mit personenbezogenen Daten der Rechnung!) an ein KI-Modell – wohin? EU-Hosting des Modells? AI-Act-Einstufung?
3. **Haftungsfrage:** Was, wenn eine falsche Erinnerung/falsch extrahierte Dosierung zu einem Schaden am Tier führt? AGB, Haftungsausschluss, Versicherung.
4. **Impressum/AGB/Widerruf** bei In-App-Käufen (Verbraucherrecht).
5. **Markenrecht:** App-Name muss geprüft werden (DPMA-Recherche), Domain-Verfügbarkeit.
6. **Abgrenzung Medizinprodukt:** Gesundheits-App für TIERE ist kein Medizinprodukt (MDR gilt nur Humanmedizin) – aber Werbeaussagen dürfen keine Heilversprechen enthalten (HWG-Analogie, UWG).

### B. Play-Store / Plattform (release-kritisch)
7. **Google Play Anforderungen 2026 im Detail:** Target-API-Level-Pflicht, Data Safety Section, Konto-Löschung-in-App-Pflicht (seit 2024 verpflichtend!), Testanforderungen für neue Entwicklerkonten (20 Tester, 14 Tage geschlossener Test).
8. **iOS-Frage:** Bisher nur Play Store besprochen – kommt App Store später? (Expo/React Native kann beides, aber Apple-Konto 99 USD/Jahr.)

### C. Betrieb & Organisation
9. **Support-Organisation:** Wir versprechen "erreichbaren menschlichen Support" als USP – wer leistet ihn, in welchen Zeiten, mit welchem Tool? Als Solo-Betreiber realistisch?
10. **Konto-/Daten-Lebenszyklus:** Tod des Tieres (Akte archivieren statt löschen – emotional wichtig!), Tierabgabe/Besitzerwechsel (Akte übertragen?), Tod des Halters, Konto-Löschung mit Frist.
11. **Backup/Notfallwiederherstellung serverseitig, Monitoring, Update-Prozess ohne Regressionen (Wettbewerber-Kernfehler!).**

### D. Technik & Kosten
12. **KI-Kosten pro Scan:** Multimodale KI kostet pro Aufruf – bei Gratis-Scans im Free-Tier: Kostenfalle? Limits nötig?
13. **Offline-Sync-Konflikte:** Zwei Familienmitglieder ändern offline dieselbe Akte – Konfliktlösung?
14. **Push-Zuverlässigkeit technisch:** Android Doze-Mode killt Alarme – genau unser kritischstes Feature. Exakte Alarm-Berechtigung.
15. **StIKo-Vet-Richtlinien-Pflege:** Impfempfehlungen ändern sich (neue Auflagen) – wer aktualisiert die Impf-Engine-Regeln? Prozess nötig.
16. **UPD-API-Zugang konkret:** Registrierung, Rate-Limits, tatsächliche Datenqualität der Gegenanzeigen-Felder.

### E. Geschäft & Markt
17. **Unternehmensform & Kosten:** Einzelunternehmen vs. UG/GmbH (Haftung!), Gewerbeanmeldung, Steuern auf In-App-Umsätze, Google-Provision (15 % bis 1 Mio. USD).
18. **Tierkrankenversicherungen:** Partner-Potenzial (AGILA, Uelzener etc. haben eigene Verzeichnisse/Apps) oder Konkurrenz? Erstattungs-Workflow (Rechnung ist schon gescannt → Einreichung bei Versicherung als Feature?).
19. **Name & Branding:** Noch kein Arbeitstitel festgelegt.
20. **Barrierefreiheit:** Zielgruppe 50+ – European Accessibility Act (EAA) gilt seit Juni 2025 auch für Apps! Rechtlich UND strategisch relevant.
21. **Internationalisierung:** DACH-Markt (AT/CH) – andere Register, andere GOT, andere Notdienste. Bewusst Deutschland-first?

## Priorisierung für Recherche (Phase 2)
- **P1 (projektkritisch, recherchieren):** 7 (Play-Store-Pflichten 2026), 2 (KI/DSGVO), 20 (EAA-Pflicht für Apps), 10 (Datenlebenszyklus-Standards), 18 (Versicherungs-Ökosystem)
- **P2 (wichtig, teils ohne Recherche beantwortbar):** 1, 3, 9, 12, 14, 17
- **P3 (später, vormerken):** 4, 5, 6, 8, 11, 13, 15, 16, 19, 21
