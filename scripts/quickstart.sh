#!/bin/bash
# ============================================================================
# simplyPet – Quickstart (Ein-Kommando-Setup für neue Sessions)
# ============================================================================
# Zweck: Klont das Repo UND richtet die Build-Umgebung ein – alles in einem.
#         Das ist das ERSTE was in jeder neuen Session ausgeführt wird.
#
# Nutzung (aus dem Home-Verzeichnis):
#   curl -s https://raw.githubusercontent.com/markb3776-hub/pet-health-app-konzept/main/scripts/quickstart.sh | bash
#
# ODER (wenn Repo bereits geklont):
#   cd /home/ubuntu
#   bash simplypet_workspace/scripts/quickstart.sh
#
# Was es tut:
#   1. Klont das Repo (falls nicht vorhanden)
#   2. Führt setup_build_env.sh aus
#   3. Führt quality_check.sh aus (Statusbericht)
#   4. Zeigt aktuelle Roadmap-Position
#
# Geschätzte Dauer: 5-7 Minuten
# ============================================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

WORKSPACE="/home/ubuntu/simplypet_workspace"

echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  simplyPet – Quickstart${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""

# ─── Schritt 1: Repo klonen ─────────────────────────────────────────────────
if [ -d "$WORKSPACE/.git" ]; then
    echo -e "${GREEN}✓${NC} Workspace existiert bereits – aktualisiere..."
    cd "$WORKSPACE"
    git pull --ff-only 2>/dev/null || echo "  (Pull übersprungen – lokale Änderungen vorhanden)"
else
    echo "  → Repo wird geklont..."
    gh repo clone markb3776-hub/pet-health-app-konzept "$WORKSPACE"
    cd "$WORKSPACE"
    echo -e "${GREEN}✓${NC} Repo geklont"
fi

# ─── Schritt 2: Build-Umgebung einrichten ────────────────────────────────────
echo ""
chmod +x scripts/*.sh
./scripts/setup_build_env.sh

# ─── Schritt 3: Qualitätsprüfung ────────────────────────────────────────────
echo ""
echo -e "${YELLOW}Qualitätsprüfung...${NC}"
cd app/
chmod +x scripts/quality_check.sh 2>/dev/null || true
../scripts/quality_check.sh || true
cd ..

# ─── Schritt 4: Aktuelle Position zeigen ────────────────────────────────────
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Aktuelle Position im Projekt:${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""

# Zeige die letzten relevanten Entscheidungen
if [ -f "nutzertest_feedback_v0.1.1.md" ]; then
    echo "  Letztes Feedback-Dokument: nutzertest_feedback_v0.1.1.md"
fi
if [ -f "roadmap_prototyp.md" ]; then
    echo "  Roadmap: roadmap_prototyp.md"
    echo ""
    echo "  Aktueller Schritt:"
    grep -A2 "LAUFEND\|GEPLANT.*wartet" roadmap_prototyp.md | head -5
fi

echo ""
echo -e "${GREEN}  Bereit zum Arbeiten!${NC}"
echo "  Workspace: $WORKSPACE"
echo "  App-Code:  $WORKSPACE/app/src/"
echo ""
