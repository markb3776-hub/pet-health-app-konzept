#!/bin/bash
# ============================================================================
# simplyPet – Qualitätsprüfung (Pre-Release Check)
# ============================================================================
# Zweck: Führt alle automatisierten Qualitätsprüfungen durch BEVOR eine neue
#         APK gebaut wird. Fängt Fehler ab, bevor sie den Nutzer erreichen.
#
# Nutzung:
#   cd app/
#   chmod +x scripts/quality_check.sh
#   ./scripts/quality_check.sh
#
# Was es prüft:
#   1. TypeScript-Kompilierung (Typ-Fehler)
#   2. Import-Konsistenz (fehlende Dateien)
#   3. Datenbank-Schema-Konsistenz (Migrationen)
#   4. Doktrin-Konformität (verbotene Muster)
#   5. Versionsnummer-Konsistenz
#   6. Zusammenfassung mit PASS/FAIL
#
# Geschätzte Dauer: 30 Sekunden
# ============================================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0

pass() { echo -e "  ${GREEN}✓ PASS${NC} $1"; PASS_COUNT=$((PASS_COUNT + 1)); }
fail() { echo -e "  ${RED}✗ FAIL${NC} $1"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
warn() { echo -e "  ${YELLOW}⚠ WARN${NC} $1"; WARN_COUNT=$((WARN_COUNT + 1)); }

echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  simplyPet – Qualitätsprüfung${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""

# Prüfe ob wir im App-Ordner sind
if [ ! -f "package.json" ]; then
    echo -e "${RED}FEHLER: Bitte aus dem app/ Ordner ausführen.${NC}"
    exit 1
fi

# ─── 1. TypeScript ───────────────────────────────────────────────────────────
echo -e "${YELLOW}[1/6]${NC} TypeScript-Kompilierung..."
if npx tsc --noEmit 2>/dev/null; then
    pass "TypeScript: 0 Fehler"
else
    fail "TypeScript: Kompilierungsfehler gefunden"
fi

# ─── 2. Import-Konsistenz ────────────────────────────────────────────────────
echo -e "${YELLOW}[2/6]${NC} Import-Konsistenz..."
MISSING_IMPORTS=0
# Prüfe ob importierte lokale Dateien existieren
for file in $(find src -name "*.ts" -o -name "*.tsx" 2>/dev/null); do
    imports=$(grep -oP "from ['\"]\..*?['\"]" "$file" 2>/dev/null | sed "s/from ['\"]//;s/['\"]//g" || true)
    dir=$(dirname "$file")
    for imp in $imports; do
        resolved="$dir/$imp"
        if [ ! -f "${resolved}.ts" ] && [ ! -f "${resolved}.tsx" ] && [ ! -f "${resolved}/index.ts" ] && [ ! -f "${resolved}/index.tsx" ]; then
            MISSING_IMPORTS=$((MISSING_IMPORTS + 1))
        fi
    done
done
if [ $MISSING_IMPORTS -eq 0 ]; then
    pass "Imports: Alle lokalen Importe auflösbar"
else
    fail "Imports: $MISSING_IMPORTS nicht auflösbare Importe gefunden"
fi

# ─── 3. Datenbank-Schema ─────────────────────────────────────────────────────
echo -e "${YELLOW}[3/6]${NC} Datenbank-Schema-Konsistenz..."
# Prüfe ob alle CREATE TABLE Statements IF NOT EXISTS verwenden (defensiv)
DB_FILES=$(find src -name "*.ts" | xargs grep -l "CREATE TABLE" 2>/dev/null || true)
UNSAFE_CREATES=0
for dbfile in $DB_FILES; do
    unsafe=$(grep -c "CREATE TABLE[^I]*[^F]" "$dbfile" 2>/dev/null || echo "0")
    # Genauer: suche CREATE TABLE ohne IF NOT EXISTS
    unsafe2=$(grep "CREATE TABLE" "$dbfile" | grep -cv "IF NOT EXISTS" 2>/dev/null || echo "0")
    UNSAFE_CREATES=$((UNSAFE_CREATES + unsafe2))
done
if [ $UNSAFE_CREATES -eq 0 ]; then
    pass "DB-Schema: Alle CREATE TABLE nutzen IF NOT EXISTS"
else
    warn "DB-Schema: $UNSAFE_CREATES CREATE TABLE ohne IF NOT EXISTS"
fi

# ─── 4. Doktrin-Konformität ──────────────────────────────────────────────────
echo -e "${YELLOW}[4/6]${NC} Doktrin-Konformität..."
VIOLATIONS=0

# Keine INTERNET-Permission (Kern-Doktrin)
if grep -r "INTERNET" android/app/src/main/AndroidManifest.xml 2>/dev/null | grep -qv "<!--"; then
    fail "Doktrin: INTERNET-Permission gefunden!"
    VIOLATIONS=$((VIOLATIONS + 1))
fi

# Keine Analytics/Tracking-Bibliotheken
if grep -r "analytics\|firebase\|sentry\|amplitude\|mixpanel\|posthog" package.json 2>/dev/null | grep -qv "//"; then
    fail "Doktrin: Analytics/Tracking-Bibliothek in package.json!"
    VIOLATIONS=$((VIOLATIONS + 1))
fi

# Keine fetch/axios/http-Aufrufe im Produktionscode (nur in __tests__)
NETWORK_CALLS=$(grep -r "fetch(\|axios\|http://" src/ 2>/dev/null | grep -cv "test\|mock\|comment" || echo "0")
if [ "$NETWORK_CALLS" -gt 0 ]; then
    fail "Doktrin: $NETWORK_CALLS Netzwerk-Aufrufe im Produktionscode!"
    VIOLATIONS=$((VIOLATIONS + 1))
fi

if [ $VIOLATIONS -eq 0 ]; then
    pass "Doktrin: Keine Verstöße (offline, kein Tracking, kein Netzwerk)"
fi

# ─── 5. Versionsnummer ───────────────────────────────────────────────────────
echo -e "${YELLOW}[5/6]${NC} Versionsnummer-Konsistenz..."
PKG_VERSION=$(grep '"version"' package.json | head -1 | grep -oP '[\d.]+' || echo "?")
APP_JSON_VERSION=$(grep '"version"' app.json 2>/dev/null | head -1 | grep -oP '[\d.]+' || echo "?")

if [ "$PKG_VERSION" = "$APP_JSON_VERSION" ] && [ "$PKG_VERSION" != "?" ]; then
    pass "Version: $PKG_VERSION (konsistent in package.json und app.json)"
elif [ "$APP_JSON_VERSION" = "?" ]; then
    warn "Version: app.json hat kein version-Feld (nur package.json: $PKG_VERSION)"
else
    fail "Version: Inkonsistenz! package.json=$PKG_VERSION, app.json=$APP_JSON_VERSION"
fi

# ─── 6. Dateigrößen-Check ────────────────────────────────────────────────────
echo -e "${YELLOW}[6/6]${NC} Dateigrößen-Check..."
LARGE_FILES=$(find src -name "*.ts" -o -name "*.tsx" | xargs wc -l 2>/dev/null | sort -rn | head -5)
LARGEST=$(echo "$LARGE_FILES" | head -1 | awk '{print $1}')
if [ "$LARGEST" -gt 500 ] 2>/dev/null; then
    warn "Größte Datei hat $LARGEST Zeilen (>500 → Refactoring empfohlen)"
else
    pass "Dateigrößen: Alle Dateien unter 500 Zeilen"
fi

# ─── Zusammenfassung ─────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
TOTAL=$((PASS_COUNT + FAIL_COUNT + WARN_COUNT))
echo -e "  Ergebnis: ${GREEN}$PASS_COUNT PASS${NC} | ${RED}$FAIL_COUNT FAIL${NC} | ${YELLOW}$WARN_COUNT WARN${NC} (von $TOTAL Prüfungen)"

if [ $FAIL_COUNT -eq 0 ]; then
    echo -e "  ${GREEN}→ BEREIT FÜR BUILD${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
    exit 0
else
    echo -e "  ${RED}→ NICHT BEREIT – bitte Fehler beheben${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
    exit 1
fi
