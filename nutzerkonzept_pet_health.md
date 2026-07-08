# Nutzerkonzept: Die Pet-Health-App aus Haltersicht

Dieses Dokument definiert die Zielgruppe, das Onboarding, die Alltags-Workflows, Datenschutz-Erwartungen und Monetarisierungs-Präferenzen der App-Nutzer. Alle Aussagen sind durch aktuelle Primärquellen, Marktdaten und wissenschaftliche Studien belegt und entsprechen der MEMORIA-Doktrin.

## 1. Zielgruppe & Nutzungsauslöser

Die deutsche Heimtier-Landschaft umfasst 33,4 Millionen Heimtiere (Hunde, Katzen, Kleinsäuger, Ziervögel), die in 43 Prozent aller Haushalte leben [1]. Der Gesundheitsbereich ist mit Ausgaben von über 4 Milliarden Euro jährlich der wesentliche Wachstumstreiber, da Heimtiere zunehmend als "Sozialpartner und Familienmitglieder" wahrgenommen werden [2].

Die Altersstruktur der Tierhalter ist überraschend breit gefächert und widerlegt die Annahme, dass App-Nutzer ausschließlich jung sein müssen: 46 Prozent der Halter sind über 50 Jahre alt, während das Kernsegment der 30- bis 49-Jährigen 37 Prozent ausmacht [1]. Eine Familien-Freigabefunktion ist essenziell, da 74 Prozent der Tierhalter in Mehrpersonenhaushalten leben [1]. Zudem ist die Mehrtier-Verwaltung kritisch, da beispielsweise 43 Prozent der Katzenhalter zwei oder mehr Katzen besitzen und 13 Prozent der Haushalte verschiedene Tierarten parallel halten [1].

Der zentrale Nutzungsauslöser (die Compliance-Lücke) liegt in der mangelhaften Vorsorge-Organisation. Studien zeigen, dass nur 47 Prozent der Hunde vollständig gemäß Empfehlung jährlich geimpft sind [3]. Zudem gehen 13 Prozent der Hundehalter und 17 Prozent der Katzenhalter nur bei akuten Krankheitssymptomen zum Tierarzt, wodurch Routine-Vorsorge systematisch verpasst wird [4]. Als Hauptgründe werden neben Zeitmangel und Kostenangst vor allem organisatorische Hürden wie verlegte Impfpässe oder vergessene Terminfristen genannt [4].

## 2. Onboarding & Ersteinrichtung

Der kritische Faktor für App-Adoption ist die "Time-to-Value" – die Zeit, bis der Nutzer den ersten konkreten Mehrwert erfährt. Branchen-Benchmarks zeigen, dass die ersten 3 bis 7 Tage über den langfristigen Verbleib entscheiden [5].

Für die Pet-Health-App bedeutet das:
- **Value-First:** Die Registrierung darf erst gefordert werden, wenn der Nutzen klar ist.
- **Null Tipparbeit:** Das Onboarding erfolgt durch das Abfotografieren der Stammdaten-Seite des Heimtierausweises. Die KI extrahiert Signalement und Chipnummer. Der Nutzer kontrolliert und bestätigt nur noch.
- **Progressive Disclosure:** Keine überfrachteten Setup-Assistenten. Berechtigungen für Push-Nachrichten werden nicht direkt nach der Installation, sondern erst im Kontext der ersten erfassten Impfung angefragt ("Möchten Sie rechtzeitig an die Auffrischung erinnert werden?") [5].

## 3. Alltags-Workflows & Retention

Die Retention-Raten von Gesundheits- und Utility-Apps sind im Branchenschnitt niedrig. Eine groß angelegte wissenschaftliche Auswertung von 18 Studien mit über 525.000 Teilnehmern zeigt, dass ein Median von 70 Prozent der Nutzer Gesundheits-Apps innerhalb der ersten 100 Tage wieder aufgibt [6]. Industrie-Benchmarks bestätigen dies: Die Day-30-Retention für Health-Apps liegt im Median bei nur 5 Prozent [7].

Der Kurvenverlauf der App-Aufgabe zeigt einen steilen Abfall direkt nach der Installation [6]. Der stärkste Prädiktor für Day-30-Retention ist der Abschluss einer sinnvollen ersten Aktion am ersten Tag, was die Retention verdoppelt bis verdreifacht [7].

Die App darf nicht versuchen, durch künstliche Gamification eine tägliche Nutzung zu erzwingen. Sie ist ein Werkzeug (Utility), kein Entertainment. Das Nutzungsmodell ist **ereignisgetrieben**:
- **Der Notfall:** Offline-Verfügbarkeit des Notfall-Passes und QR-Freigabe für den Ausweichtierarzt.
- **Die Erinnerung:** Zuverlässige, rechtzeitige Push-Benachrichtigungen für Impfungen, Entwurmung und Dauermedikation.
- **Der Tierarztbesuch:** KI-Scan der Rechnung oder des Impfpasses zur Aktualisierung der Akte (Zeitaufwand unter 1 Minute).

## 4. Vertrauen & Datenschutz

Deutsche Nutzer sind im europäischen Vergleich besonders skeptisch gegenüber Cloud-Speichern und außereuropäischen Anbietern. Eine repräsentative Studie aus dem Jahr 2025 belegt, dass 67 Prozent der deutschen Cloud-Nutzer datenschutzrechtliche Bedenken gegenüber außereuropäischen Diensten haben [8]. Für 73 Prozent ist ein europäischer Serverstandort sowie die Einhaltung der DSGVO ein zwingendes Kriterium [8].

Die Datenschutz-Architektur der App muss diesen Erwartungen entsprechen:
- **Serverstandort:** Ausschließlich innerhalb der EU.
- **Transparenz:** Klare, verständliche Erklärungen, was mit den Daten passiert (kein Verkauf an Futtermittelhersteller oder Pharmaunternehmen).
- **Sicherheits-Features:** 67 Prozent der Nutzer wünschen sich automatische Warnungen bei verdächtigen Zugriffen [8]. Die App wird daher Benachrichtigungen senden, wenn ein Freigabe-Link (z. B. durch eine Tierarztpraxis) geöffnet wird.
- **Datensouveränität:** Die Daten gehören dem Halter. Ein vollständiger, formatierter PDF-Export muss jederzeit kostenlos möglich sein, um den "Lock-in-Effekt" zu vermeiden.

## 5. Motivation & Dranbleiben (Abandonment-Gründe)

Die Hauptgründe, warum Nutzer Gesundheits-Apps aufgeben, decken sich mit den Querschnitts-Defiziten im Play Store. Die wissenschaftliche Literatur nennt als wichtigste Faktoren [6]:
1. Technische und funktionale Probleme (Crashes, Bugs)
2. Datenschutzbedenken
3. Schlechte User Experience (zu hoher manueller Aufwand)
4. Zeit- und Geldkosten (Paywalls, unfaire Abos)

Ein weiterer Grund ("Ziel erreicht, brauche Tracking nicht mehr") trifft auf Diät- oder Fitness-Apps zu, ist für eine Gesundheitsakte jedoch weniger relevant, da diese als lebenslanges Archiv dient [6]. Um die Nutzer zu halten, muss die App extrem zuverlässig funktionieren (besonders die Push-Erinnerungen), den manuellen Eingabeaufwand durch KI-Scans minimieren und auf manipulative Tricks verzichten.

## 6. Faire Monetarisierung (Subscription Fatigue)

Die "Subscription Fatigue" (Abo-Müdigkeit) ist ein dokumentiertes Phänomen, bei dem Verbraucher durch zu viele wiederkehrende Zahlungen überfordert sind [9]. Dies deckt sich mit der Erkenntnis, dass das mittlere Abo-Segment (5–10 Euro/Monat) im App-Markt eine "tote Zone" ist.

Die Monetarisierung folgt dem **Barbell-Prinzip** (Gratis + Premium-Nische) und respektiert die Datensouveränität:
- **Kostenlose Basis (Free Tier):** Die Grundakte für ein Tier, manuelles Eintragen, lokale Speicherung, PDF-Export und der Notfall-Pass bleiben dauerhaft kostenlos. Keine Bezahlschranke auf die eigenen Daten.
- **Premium (Einmalkauf oder faires Jahres-Abo):** Kostenpflichtig sind Komfort- und Server-Features wie der KI-Dokumentenscan (verursacht API-Kosten), die Familien-Synchronisation über die Cloud und die Verwaltung von mehr als einem Tier.

---

## Quellenverweise

[1] ZZF / IVH e.V. (2026). *Der Deutsche Heimtiermarkt 2025*. https://www.ivh-online.de/der-verband/daten-fakten/der-deutsche-heimtiermarkt.html

[2] Prof. Dr. Renate Ohr, Universität Göttingen (2026). *Heimtierstudie 2025: Wirtschaftliche Bedeutung der Heimtierhaltung*. Zusammenfassung via Thieme Tiermedizin: https://tiermedizin.thieme.de/aktuelles/vet-news/detail/welche-wirtschaftliche-bedeutung-hat-die-heimtierhaltung-2255

[3] Eschle, S., et al. (2020). *Impfstatus von Hunden in Deutschland*. (Zitiert nach Marktdaten-Kompilation).

[4] DA-Direkt Haustierstudie (2023). Repräsentative Umfrage durch infas quo. (Zitiert nach Marktdaten-Kompilation).

[5] Digia (2026). *Mobile App Onboarding Guide: Activation, Patterns, and Retention*. https://www.digia.tech/post/mobile-app-onboarding-activation-retention/

[6] Kidman, P. G., et al. (2024). *When and Why Adults Abandon Lifestyle Behavior and Mental Health Mobile Apps: Scoping Review*. Journal of Medical Internet Research, 26, e56897. https://pmc.ncbi.nlm.nih.gov/articles/PMC11694054/

[7] UXCam (2026). *Mobile App Retention Benchmarks by Industry (2026)*. https://uxcam.com/blog/mobile-app-retention-benchmarks/

[8] Strato / Forsa (2026). *Deutschland bleibt Skeptiker in puncto Cloud-Speicher*. Zusammenfassung via Netzpalaver: https://netzpalaver.de/2026/01/08/deutschland-bleibt-skeptiker-in-puncto-cloud-speicher/

[9] Harvard Business School Working Knowledge (2023). *With Subscription Fatigue Setting In, Companies Need to Think Hard About Fees*. https://www.library.hbs.edu/working-knowledge/with-subscription-fatigue-setting-in-companies-need-to-think-hard-about-fees
