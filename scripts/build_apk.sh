#!/bin/bash
# ============================================================================
# simplyPet – APK Build-Skript
# ============================================================================
# Zweck: Baut die Release-APK mit allen Prüfungen und Sicherheitsmaßnahmen.
#
# Nutzung:
#   cd app/
#   chmod +x scripts/build_apk.sh
#   ./scripts/build_apk.sh
#
# Was es tut:
#   1. TypeScript-Prüfung (keine Fehler erlaubt)
#   2. Expo-Doctor (Konfigurationsprüfung)
#   3. Prebuild (Android-Ordner generieren)
#   4. Gradle-Build (Release-APK)
#   5. APK-Verifizierung (apksigner)
#   6. Ausgabe: Pfad zur fertigen APK
#
# Geschätzte Dauer: 15-25 Minuten
# ============================================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Zeitstempel für Build
BUILD_TIME=$(date +"%Y-%m-%d_%H-%M")
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  simplyPet – APK Build ($BUILD_TIME)${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""

# Prüfe ob wir im App-Ordner sind
if [ ! -f "package.json" ]; then
    echo -e "${RED}FEHLER: Bitte aus dem app/ Ordner ausführen.${NC}"
    exit 1
fi

# Umgebungsvariablen setzen
export JAVA_HOME=${JAVA_HOME:-/usr/lib/jvm/jdk-17.0.11+9}
export ANDROID_HOME=${ANDROID_HOME:-/home/ubuntu/android-sdk}
export ANDROID_SDK_ROOT=$ANDROID_HOME
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/build-tools/36.0.0

# ─── Schritt 1: TypeScript-Prüfung ──────────────────────────────────────────
echo -e "${YELLOW}[1/5]${NC} TypeScript-Prüfung..."
TSC_OUTPUT=$(npx tsc --noEmit 2>&1) || {
    echo -e "${RED}✗ TypeScript-Fehler gefunden:${NC}"
    echo "$TSC_OUTPUT"
    echo ""
    echo -e "${RED}Build abgebrochen. Bitte Fehler zuerst beheben.${NC}"
    exit 1
}
echo -e "${GREEN}✓${NC} TypeScript: 0 Fehler"

# ─── Schritt 2: Expo Doctor ─────────────────────────────────────────────────
echo -e "${YELLOW}[2/5]${NC} Expo-Konfigurationsprüfung..."
EXPO_OUTPUT=$(npx expo-doctor 2>&1) || true
if echo "$EXPO_OUTPUT" | grep -q "error"; then
    echo -e "${YELLOW}⚠${NC} Expo-Doctor meldet Warnungen (Build wird fortgesetzt):"
    echo "$EXPO_OUTPUT" | grep -i "error" | head -5
else
    echo -e "${GREEN}✓${NC} Expo-Doctor: keine kritischen Probleme"
fi

# ─── Schritt 3: Prebuild ────────────────────────────────────────────────────
echo -e "${YELLOW}[3/5]${NC} Expo Prebuild (Android-Ordner generieren)..."
if [ -d "android" ]; then
    echo "  → android/ existiert bereits (übersprungen, nutze --clean falls nötig)"
else
    npx expo prebuild --platform android --no-install 2>&1 | tail -5
    echo -e "${GREEN}✓${NC} Prebuild abgeschlossen"
fi

# ─── Schritt 4: Gradle Build ────────────────────────────────────────────────
echo -e "${YELLOW}[4/5]${NC} Gradle Release-Build (dies dauert 10-15 Minuten)..."
cd android

# Speicher freigeben vor dem Build
sync && echo 3 | sudo tee /proc/sys/vm/drop_caches > /dev/null 2>&1 || true

./gradlew assembleRelease \
    --no-daemon \
    --max-workers=1 \
    -Dorg.gradle.jvmargs="-Xmx2048m" \
    2>&1 | grep -E "(BUILD|ERROR|FAILURE|Task)" | tail -10

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Gradle-Build erfolgreich"
else
    echo -e "${RED}✗ Gradle-Build fehlgeschlagen${NC}"
    exit 1
fi
cd ..

# ─── Schritt 5: APK finden und verifizieren ──────────────────────────────────
echo -e "${YELLOW}[5/5]${NC} APK verifizieren..."
APK_PATH=$(find android/app/build/outputs/apk/release -name "*.apk" 2>/dev/null | head -1)

if [ -z "$APK_PATH" ]; then
    echo -e "${RED}✗ Keine APK gefunden!${NC}"
    exit 1
fi

APK_SIZE=$(du -h "$APK_PATH" | cut -f1)
echo -e "${GREEN}✓${NC} APK gefunden: $APK_PATH ($APK_SIZE)"

# apksigner Verifizierung
if command -v apksigner &> /dev/null; then
    if apksigner verify "$APK_PATH" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} APK-Signatur gültig"
    else
        echo -e "${YELLOW}⚠${NC} APK nicht signiert (Debug-Build oder Signierung fehlt)"
    fi
fi

# ─── Zusammenfassung ─────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✓ Build abgeschlossen!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""
echo "  APK-Datei: $APK_PATH"
echo "  Größe:     $APK_SIZE"
echo "  Build-Zeit: $BUILD_TIME"
echo ""
echo "  Nächster Schritt:"
echo "    → APK auf Testgerät übertragen"
echo ""
