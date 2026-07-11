#!/bin/bash
# ============================================================================
# simplyPet – Build-Umgebung Setup-Skript
# ============================================================================
# Zweck: Richtet die komplette Entwicklungs- und Build-Umgebung in einer
#         frischen Sandbox ein. Muss nur EINMAL pro Session ausgeführt werden.
#
# Nutzung:
#   cd /home/ubuntu
#   gh repo clone markb3776-hub/pet-health-app-konzept simplypet_workspace
#   cd simplypet_workspace
#   chmod +x scripts/setup_build_env.sh
#   ./scripts/setup_build_env.sh
#
# Was es tut:
#   1. Prüft Voraussetzungen (Node, Java, Android SDK)
#   2. Installiert fehlende Abhängigkeiten
#   3. Richtet Android SDK + Gradle speicherschonend ein
#   4. Führt npm install im App-Ordner aus
#   5. Meldet Bereitschaft
#
# Geschätzte Dauer: 3-5 Minuten
# ============================================================================

set -e  # Bei Fehler sofort abbrechen

# Farben für Ausgabe
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  simplyPet – Build-Umgebung Setup${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""

# ─── Schritt 1: Arbeitsverzeichnis prüfen ────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
APP_DIR="$REPO_ROOT/app"

if [ ! -d "$APP_DIR" ]; then
    echo -e "${RED}FEHLER: App-Ordner nicht gefunden unter $APP_DIR${NC}"
    echo "Bist du im richtigen Verzeichnis? Das Skript erwartet die Repo-Struktur."
    exit 1
fi

echo -e "${GREEN}✓${NC} Repo-Root: $REPO_ROOT"
echo -e "${GREEN}✓${NC} App-Ordner: $APP_DIR"
echo ""

# ─── Schritt 2: Node.js prüfen ──────────────────────────────────────────────
echo -e "${YELLOW}[1/5]${NC} Node.js prüfen..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js $NODE_VERSION vorhanden"
else
    echo -e "${RED}FEHLER: Node.js nicht gefunden. Bitte installieren.${NC}"
    exit 1
fi

# ─── Schritt 3: Java/JDK prüfen und ggf. installieren ───────────────────────
echo -e "${YELLOW}[2/5]${NC} Java JDK 17 prüfen..."
if java -version 2>&1 | grep -q "17"; then
    echo -e "${GREEN}✓${NC} JDK 17 vorhanden"
else
    echo "  → JDK 17 wird installiert..."
    sudo apt-get update -qq && sudo apt-get install -y -qq openjdk-17-jdk > /dev/null 2>&1
    export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
    echo -e "${GREEN}✓${NC} JDK 17 installiert"
fi
export JAVA_HOME=${JAVA_HOME:-/usr/lib/jvm/jdk-17.0.11+9}

# ─── Schritt 4: Android SDK prüfen und einrichten ────────────────────────────
echo -e "${YELLOW}[3/5]${NC} Android SDK einrichten..."
export ANDROID_HOME=${ANDROID_HOME:-/home/ubuntu/android-sdk}
export ANDROID_SDK_ROOT=$ANDROID_HOME
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

if [ ! -d "$ANDROID_HOME/platforms/android-36" ]; then
    echo "  → Android SDK wird heruntergeladen (dies dauert 1-2 Minuten)..."
    mkdir -p $ANDROID_HOME/cmdline-tools
    
    # Command-line tools herunterladen falls nicht vorhanden
    if [ ! -f "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" ]; then
        cd /tmp
        wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O cmdtools.zip
        unzip -q -o cmdtools.zip -d $ANDROID_HOME/cmdline-tools/
        mv $ANDROID_HOME/cmdline-tools/cmdline-tools $ANDROID_HOME/cmdline-tools/latest 2>/dev/null || true
        cd $REPO_ROOT
    fi
    
    # Lizenzen akzeptieren und Pakete installieren
    yes | $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses > /dev/null 2>&1 || true
    $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --install \
        "platforms;android-36" \
        "build-tools;36.0.0" \
        "platform-tools" > /dev/null 2>&1
    echo -e "${GREEN}✓${NC} Android SDK installiert (API 36)"
else
    echo -e "${GREEN}✓${NC} Android SDK bereits vorhanden"
fi

# ─── Schritt 5: npm install ──────────────────────────────────────────────────
echo -e "${YELLOW}[4/5]${NC} npm-Abhängigkeiten installieren..."
cd "$APP_DIR"
if [ -d "node_modules" ] && [ -f "node_modules/.package-lock.json" ]; then
    echo -e "${GREEN}✓${NC} node_modules bereits vorhanden (übersprungen)"
else
    npm install --prefer-offline --no-audit --no-fund 2>&1 | tail -3
    echo -e "${GREEN}✓${NC} npm install abgeschlossen"
fi

# ─── Schritt 6: Gradle speicherschonend konfigurieren ────────────────────────
echo -e "${YELLOW}[5/5]${NC} Gradle speicherschonend konfigurieren..."
GRADLE_PROPS="$APP_DIR/android/gradle.properties"
if [ -f "$GRADLE_PROPS" ]; then
    # Speicherschonende Einstellungen sicherstellen
    grep -q "org.gradle.jvmargs" "$GRADLE_PROPS" || echo "org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m" >> "$GRADLE_PROPS"
    grep -q "org.gradle.workers.max" "$GRADLE_PROPS" || echo "org.gradle.workers.max=1" >> "$GRADLE_PROPS"
    grep -q "org.gradle.daemon" "$GRADLE_PROPS" || echo "org.gradle.daemon=false" >> "$GRADLE_PROPS"
    grep -q "org.gradle.parallel" "$GRADLE_PROPS" || echo "org.gradle.parallel=false" >> "$GRADLE_PROPS"
    echo -e "${GREEN}✓${NC} Gradle konfiguriert (1 Worker, kein Daemon, max 2GB RAM)"
else
    echo -e "${YELLOW}⚠${NC} gradle.properties nicht gefunden – übersprungen"
fi

# ─── Zusammenfassung ─────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✓ Build-Umgebung bereit!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""
echo "  Nächste Schritte:"
echo "    • Code bearbeiten:  cd $APP_DIR/src/"
echo "    • TypeScript prüfen: cd $APP_DIR && npx tsc --noEmit"
echo "    • APK bauen:        cd $APP_DIR && ./scripts/build_apk.sh"
echo ""
echo "  Umgebungsvariablen (für diese Session):"
echo "    export JAVA_HOME=$JAVA_HOME"
echo "    export ANDROID_HOME=$ANDROID_HOME"
echo "    export PATH=\$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools"
echo ""
