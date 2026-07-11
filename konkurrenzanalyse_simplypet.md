# Konkurrenzanalyse: Tiergesundheits-Apps vs. simplyPet

## Untersuchte Apps (Spektrum von groß bis klein)

| App | Plattform | Downloads | Modell | Kern-Ansatz |
|:---|:---|:---|:---|:---|
| 11pets | Android + iOS | 500.000+ | Freemium (1 Tier gratis, Abo für mehr) | Umfassende Pflege-Plattform |
| vetevo | Android + iOS | 100.000+ | Freemium + Shop (Produkte verkaufen) | Gesundheit + Ernährung + Produkte |
| petsXL | Android + iOS | Unbekannt (Chart #17 Medizin iOS) | Kostenlos (Tierarzt-Anbindung) | Praxis-Kommunikation + Akte |
| PetNoter | Android + iOS | 10.000+ | Freemium + Werbung | Digitale Krankenakte |
| eltiga | Android + iOS | Unbekannt | Kostenlos (Tierarzt-gebunden) | Praxis-Kommunikation |
| dog-stories | iOS only | Neu (Juni 2026) | Einmalkauf (2,99€ Pro) | Privat, offline-first, nur Hunde |
| Pawza | iOS only | Neu (Juni 2026) | Abo (2,99$/Monat oder 39,99$ Lifetime) | AI-Dokumentenscan, iCloud-Sync |
| PetDesk | Android + iOS | Groß (US-Markt) | Kostenlos (Tierarzt-gebunden) | Praxis-Terminbuchung + Erinnerungen |
| DogLog | iOS | Mittel | Kostenlos | Multi-User Koordination (Familie) |
| Medika | Android + iOS | Klein | Freemium | Medizinische Akte |

---

## Systematische Auswertung: Was Nutzer BEMÄNGELN

### 1. Datenverlust / Server-Abhängigkeit (Häufigster Kritikpunkt)

**Betroffene Apps:** 11pets, Pet Health, petsXL, vetevo

Zitate:
- "updates wiped all of my pets details, vaccine and medication history" (Pet Health, App Store)
- "Medikamente nach Update verschwunden" (11pets, 32 Personen fanden hilfreich)
- "funktioniert nur online, keine Daten offline gespeichert" (petsXL)
- "Login ging über mehrere Tage nicht" → kein Zugriff auf eigene Daten (11pets)

**Muster:** Cloud-basierte Apps verlieren Daten bei Server-Problemen oder Updates. Nutzer fühlen sich machtlos.

---

### 2. Abo-Zwang / Paywall-Frust

**Betroffene Apps:** 11pets, Hundeo, Pawza, diverse

Zitate:
- "nur noch ein Tier in der freien Version möglich. Man muss sich für eines entscheiden" (11pets)
- "fast alle Tricks kosten was. Und die Tricks die nichts kosten kann mein Hund schon" (Hundeo)
- "Pointless paying for a subscription if the app can't even keep my data" (Pet Health)

**Muster:** Nutzer akzeptieren Einmalkauf, hassen Abos – besonders wenn Basisfunktionen eingeschränkt werden.

---

### 3. Performance-Probleme / Freezes / Abstürze

**Betroffene Apps:** 11pets, PetDesk

Zitate:
- "Aktuell totaler Kernschrott. Läuft nicht flüssig, manche Funktionen führen zum Freeze" (11pets, Mai 2026)
- "es funktioniert gar nichts mehr. Ständig Fehlermeldung" (11pets, Juni 2026)
- "Too many holes in this app to actually make it worth using" (PetDesk)

**Muster:** Aufgeblähte Apps mit vielen Features werden instabil.

---

### 4. Unklare Navigation / UX-Probleme

**Betroffene Apps:** PetNoter, 11pets, petsXL

Zitate:
- "Bad user interface" (PetNoter, App Store)
- "Erinnerung wollte ich entfernen und hab dazu einfach keine Möglichkeit" (petsXL)
- "Behavior tracking limited to 6 generic things you cannot edit" (11pets)
- "It does seem a little difficult to maneuver through the app at times" (11pets)

**Muster:** Features existieren, aber Nutzer finden sie nicht oder können sie nicht anpassen.

---

### 5. Datenschutz-Bedenken

**Betroffene Apps:** vetevo, petsXL, PetDesk

Erkenntnisse:
- vetevo: "Diese App kann Datentypen an Dritte weitergeben: App-Aktivitäten, Geräte-IDs"
- vetevo: "Personenbezogene Daten, Fotos und Videos" werden erhoben
- petsXL: "Finanzinformationen, Standort, Kontaktinformationen, Benutzerinhalte, Kennungen" werden mit Identität verknüpft
- dog-stories: Enthält TelemetryDeck + PostHog Analytics (trotz "privat"-Versprechen)

**Muster:** Fast alle Apps sammeln Daten – selbst die, die sich "privat" nennen, haben Analytics.

---

### 6. Tierarzt-Bindung als Hürde

**Betroffene Apps:** petsXL, eltiga, PetDesk

Zitate:
- "Lade die App herunter und nutze den Standortfinder, um dich mit einer Tierarztpraxis zu verbinden" (petsXL)
- eltiga funktioniert nur mit teilnehmenden Praxen

**Muster:** Viele Apps sind an Tierarztpraxen gebunden – wechselt man den Arzt, verliert man den Zugang.

---

### 7. Datums-/Zeitprobleme

**Betroffene Apps:** PetNoter, PetDesk

Zitate:
- "Any day you enter will enter a day behind" (PetNoter)
- "reminders that didn't clear after the appointments" (PetDesk)

**Muster:** Zeitlogik ist ein häufiger Bug-Herd in Pet-Apps.

---

## Systematische Auswertung: Was Nutzer LOBEN

### 1. Erinnerungen die funktionieren
- "Durch die App wirst du an deine Termine erinnert" (vetevo, positiv)
- "reminders for vet visits, vaccines, deworming" (meistgenanntes Feature in Umfragen)
- "Mark Tasks from Notifications" – direkt aus der Benachrichtigung erledigen (EveryWag)

### 2. Alles an einem Ort
- "Have all my information (vaccines, medicine, etc) in hand at all times" (11pets, positiv)
- "Alle Daten zu meinem Hund habe ich jetzt immer dabei" (petsXL)
- "I can't keep all my records organized, especially with multiple pets" (Nutzerforschung)

### 3. Schneller Support / Reaktive Entwickler
- "schreibe eine Nachricht an die Entwickler und bekomme oft noch am selben Tag Hilfestellung" (petsXL, 5 Sterne)

### 4. Einfachheit
- "Data entry feels overwhelming, so I just don't do it" (Nutzerforschung – Einfachheit ist entscheidend)
- "Pet parents don't need more features, they need less friction" (EveryWag-Erkenntnis)

### 5. Offline-Verfügbarkeit / Datenschutz
- Pawza wirbt explizit: "No account. No server. No tracking. No analytics"
- dog-stories: "Keine Konten. Keine Server. Deine Daten bleiben auf deinem Gerät"
- Beide sind NEUE Apps (Juni 2026) → Trend zu Privacy-First

---

## Markt-Trends 2026

1. **Privacy-First wird Verkaufsargument** – Neue Apps (Pawza, dog-stories) werben explizit mit Offline/No-Account
2. **Einmalkauf statt Abo** – dog-stories (2,99€ Lifetime Pro) als Gegenmodell zu Abo-Müdigkeit
3. **AI-Dokumentenscan** – Pawza nutzt Apple Intelligence zum Scannen von Tierarzt-Dokumenten
4. **Gewichts-Tracking mit Rasse-Referenz** – Pawza hat 500+ Rassen mit gesundem Gewichtsbereich
5. **Multi-Spezies** – Die meisten Apps beschränken sich auf Hund/Katze, wenige unterstützen Pferde/Vögel/Reptilien

---

## Differenzierungspotenziale für simplyPet

### Wo simplyPet JETZT SCHON besser ist:

| Differenzierung | simplyPet | Konkurrenz |
|:---|:---|:---|
| **Echte Offline-Garantie** | Keine INTERNET-Permission, technisch unmöglich online zu gehen | Selbst "offline-first" Apps haben Analytics (dog-stories: PostHog) |
| **Kein Account** | Nur Halter-Name für Notfallpass | Die meisten brauchen E-Mail + Passwort |
| **Kein Abo, kein Einmalkauf** | Komplett kostenlos | Alle Konkurrenten haben Paywall oder Abo |
| **14 Tierarten** | Hund bis Schildkröte | Die meisten: nur Hund + Katze (+ ggf. Pferd) |
| **Kein Datenverlust durch Server** | SQLite lokal, Daten überleben Updates | Häufigster 1-Stern-Grund bei Konkurrenz |
| **Notfallpass mit QR** | Offline-QR im Klartext, PDF-Export | Wenige haben das, keine offline |
| **Keine Tierarzt-Bindung** | Unabhängig von jeder Praxis | petsXL/eltiga/PetDesk nur mit Praxis nutzbar |

### Wo simplyPet noch PUNKTEN KÖNNTE (Ideen aus der Analyse):

| Feature-Idee | Quelle | Aufwand | Priorität |
|:---|:---|:---|:---|
| **Gewichtsverlauf als Diagramm** | Pawza, EveryWag, PetNoter – alle haben Charts | Mittel | Hoch – visuell, sofort nützlich |
| **Aufgabe direkt aus Notification erledigen** | EveryWag – "Mark Tasks from Notifications" | Mittel | Hoch – spart App-Öffnen |
| **Mehrere Tiere gleichzeitig behandeln** | EveryWag – "Assign events to multiple pets" | Mittel | Mittel – relevant für Multi-Tier-Halter |
| **Teilen mit Tierarzt/Tiersitter** | Nutzerforschung: "Sharing info with new vets is a huge pain" | Mittel | Mittel – PDF-Export ist Anfang |
| **Foto-Tagebuch / Meilensteine** | dog-stories, Pawza – Erinnerungen + Fotos | Klein | Niedrig – nice-to-have |
| **Futter-/Kostentracking** | dog-stories, EveryWag | Mittel | Niedrig – nicht Kern-Mission |
| **Familien-Koordination** | DogLog – "wer hat gefüttert/Gassi?" | Hoch | Niedrig – braucht Multi-User |
| **Symptom-Log mit Körperregion** | Pawza – "severity, body region, linked photos" | Klein | Mittel – wertvoll für Tierarzt-Besuch |
| **Export als CSV/JSON** | Pawza – "your data is yours, you can leave whenever" | Klein | Mittel – Vertrauens-Signal |
| **Onboarding-Tooltips** | Nutzerforschung: "Data entry feels overwhelming" | Klein | Hoch – löst UX-Problem |

---

## Zentrale Erkenntnis für simplyPet

> **"Pet parents don't need more features, they need less friction."**
> — EveryWag Nutzerforschung (Medium, Juli 2026)

Die erfolgreichsten neuen Apps (Pawza, dog-stories) gewinnen nicht durch mehr Features, sondern durch:
1. Weniger Hürden (kein Account, kein Abo)
2. Sofortige Nützlichkeit (Erinnerungen, die funktionieren)
3. Vertrauen (Daten bleiben lokal)
4. Klarheit (man findet sofort, was man sucht)

simplyPet hat die Punkte 1–3 bereits gelöst. **Punkt 4 (Klarheit/Navigation) ist das Hauptproblem**, das auch dein Tester bestätigt hat. Das ist gleichzeitig der häufigste Kritikpunkt bei der Konkurrenz – wer das löst, gewinnt.
