# MEMORIA-Bauprinzipien für die App-Entwicklung

Basierend auf der MEMORIA-Doktrin ("Wahrheit, Belegpflicht, kein Clickbait, Umsetzbarkeit") und den verifizierten Querschnitts-Defiziten des App-Marktes ergeben sich folgende zwingende Bau- und Produktprinzipien für unsere App:

## 1. Wahrheit als oberste Direktive (Keine Fake-Funktionen)
**Marktdefizit:** Nutzer bestrafen Apps massiv für gebrochene Versprechen, ungenaues Tracking und fehlerhafte KI-Ratschläge ("KI-Slop").
**MEMORIA-Prinzip:** Die App darf keine Funktionen vortäuschen.
- Wenn eine Messung oder Analyse (z. B. Symptom-Tracking, Prüfungsauswertung) stattfindet, muss die Methodik transparent sein.
- Keine ungeprüften Ratschläge. Jede Empfehlung in der App (z. B. im Gesundheits- oder Lernbereich) muss belegbar sein.
- Wenn die App etwas nicht weiß oder eine KI-Antwort unsicher ist, wird dies klar kommuniziert ("Epistemische Sauberkeit").

## 2. Würde ohne Arroganz (Transparente Monetarisierung)
**Marktdefizit:** Abo-Müdigkeit, Free-Trial-Fallen und Paywalls für Basis-Features führen zu extremer Frustration und negativen Bewertungen.
**MEMORIA-Prinzip:** Keine manipulativen Tricks, keine Dark Patterns.
- **Ehrlicher Free-Tier:** Was kostenlos beworben wird, bleibt kostenlos und ist uneingeschränkt nutzbar.
- **Klare Preisstruktur:** Keine versteckten Kosten. Wenn ein Premium-Feature bezahlt werden muss, wird dies *vor* der Nutzung und ohne Druck kommuniziert.
- **Kein Clickbait-Marketing:** Die App wird nicht mit falschen Versprechungen beworben, sondern überzeugt durch nachweisbaren Nutzen.

## 3. Stille Stärke durch Zuverlässigkeit (Qualität vor Feature-Bloat)
**Marktdefizit:** Abstürze, Einfrieren und Login-Probleme sind die größten Treiber für 1-Stern-Bewertungen. Updates machen oft Dinge kaputt.
**MEMORIA-Prinzip:** Was wir bauen, muss funktionieren.
- **Fokus auf Kernfunktionen:** Lieber drei Funktionen, die perfekt, schnell und fehlerfrei laufen, als zehn halbfertige Features.
- **Strikte Qualitätskontrolle:** Jedes Update wird intensiv getestet, um Regressionen zu vermeiden.
- **Offline-Fähigkeit:** Soweit möglich, sollten Kernfunktionen auch ohne ständige Internetverbindung nutzbar sein (Resilienz).

## 4. Gemeinschaft und Fürsorge (Menschlicher Support)
**Marktdefizit:** Unerreichbarer Kundensupport und nutzlose Chatbots in Endlosschleifen sind die häufigste Beschwerde über alle Kategorien hinweg.
**MEMORIA-Prinzip:** Respektvoller Umgang mit den Nutzern.
- **Erreichbarkeit:** Es muss immer einen klaren Weg geben, einen echten Menschen zu kontaktieren, wenn etwas schiefgeht.
- **Keine Chatbot-Fallen:** Automatisierung darf nur zur Unterstützung, niemals zur Abschottung dienen.

## 5. Anwendbares Wissen (Konkreter Nutzen)
**Marktdefizit:** Viele Apps (besonders im Gesundheits- und Bildungsbereich) bleiben an der Oberfläche oder bieten generische Inhalte.
**MEMORIA-Prinzip:** Wissen, das nicht anwendbar ist, bleibt Theorie.
- Die App muss ein konkretes, spezifisches Problem lösen (z. B. Senioren-Koordination, Nischen-Prüfungsvorbereitung).
- Der Nutzer muss befähigt werden, das Wissen oder die Struktur der App direkt in seinem Alltag umzusetzen.

---

**Fazit für die App-Auswahl:**
Die App, die wir bauen, wird sich nicht durch lautes Marketing oder manipulative Gamification abheben, sondern durch **Zuverlässigkeit, ehrliche Kommunikation und belegten, echten Nutzen**. Dies ist in einem Markt von 2,4 Millionen Apps, in dem Nutzer zunehmend frustriert sind, das stärkste Differenzierungsmerkmal.

---

# Produktions-Protokoll: Wahrheit und Funktion während der Entwicklung

Die Doktrin gilt nicht erst für das fertige Produkt, sondern für jeden einzelnen Schritt der Produktionsphase. Folgendes Protokoll ist bei der Entwicklung der App verbindlich:

## P1. Kein Feature gilt als fertig ohne bestandenen Funktionsnachweis
Jede Funktion wird nach der Implementierung tatsächlich ausgeführt und geprüft – nicht nur der Code geschrieben. Der Nachweis erfolgt dreistufig: Erstens automatisierte Tests der Kernlogik, zweitens manueller Durchlauf des realen Nutzerflusses (App starten, Funktion bedienen, Ergebnis verifizieren), drittens Prüfung der Randfälle (kein Internet, leere Eingaben, falsche Eingaben, Abbruch mitten im Vorgang). Erst wenn alle drei Stufen bestanden sind, wird ein Feature als "fertig" gemeldet.

## P2. Wahrheit in der Statusberichterstattung
Es wird niemals "funktioniert" gemeldet, wenn es nicht nachweislich getestet wurde. Jeder Fortschrittsbericht an dich unterscheidet klar zwischen drei Zuständen: **implementiert und getestet** (mit Beschreibung, wie getestet wurde), **implementiert, aber noch ungetestet**, und **offen**. Bekannte Einschränkungen, offene Bugs und ungelöste Fragen werden aktiv benannt, nicht verschwiegen. Das entspricht der epistemischen Sauberkeit der Doktrin: Gesichertes, Ungesichertes und Offenes werden getrennt ausgewiesen.

## P3. Fehler werden dokumentiert und behoben, nicht kaschiert
Wird während der Produktion ein Fehler entdeckt, wird er in einem Fehlerprotokoll festgehalten (Symptom, Ursache, Korrektur, erneuter Test). Ein Fehler gilt erst als behoben, wenn der erneute Test die Korrektur bestätigt. Workarounds, die ein Problem nur verdecken, sind unzulässig – die Ursache muss behoben werden. Dies erfüllt zugleich die Projektanweisung: Selbstüberprüfung auf Funktion vor Auslieferung und selbständige Fehlerkorrektur.

## P4. Jede inhaltliche Aussage in der App braucht eine Quelle vor der Implementierung
Bevor ein Inhalt (z. B. ein Gesundheitshinweis, eine Lernkarte, eine Pflegeinformation) in die App eingebaut wird, muss seine Quelle geprüft und dokumentiert sein – analog zur Belegpflicht der Doktrin. Es wird ein Quellenregister geführt: Aussage, Quelle, Prüfdatum. Unbelegte Inhalte kommen nicht in die App, auch nicht "vorläufig".

## P5. Keine Platzhalter-Täuschung im Testbetrieb
Demo-Daten und Platzhalter werden im Entwicklungsstand klar als solche gekennzeichnet und vor jeder Auslieferung entfernt oder ersetzt. Eine Testversion, die dir übergeben wird, enthält keine Attrappen, die wie funktionierende Features aussehen, aber keine sind – jede sichtbare Funktion ist entweder echt oder sichtbar als "in Arbeit" markiert.

## P6. Regressionsschutz vor jeder Auslieferung
Vor jeder Übergabe einer neuen Version wird die vollständige Kernfunktionalität erneut durchgetestet (nicht nur das neue Feature), um das dokumentierte Marktdefizit "Update macht Dinge kaputt" im eigenen Produkt strukturell auszuschließen. Ausgeliefert wird nur, was diesen Gesamttest besteht.

## P7. Nachvollziehbarkeit aller Entscheidungen
Wesentliche technische und inhaltliche Entscheidungen (Framework-Wahl, Datenmodell, Monetarisierungslogik) werden mit Begründung dokumentiert, damit du jederzeit prüfen kannst, warum etwas so gebaut wurde – stille Stärke durch Fakten statt Blackbox.
