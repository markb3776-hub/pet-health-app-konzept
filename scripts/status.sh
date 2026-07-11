#!/bin/bash
# ============================================================================
# simplyPet – Projekt-Status (Session-Briefing)
# ============================================================================
# Zweck: Zeigt den aktuellen Stand des Projekts auf einen Blick.
#         Nützlich am Anfang jeder Session oder wenn man den Überblick braucht.
#
# Nutzung:
#   ./scripts/status.sh
# ============================================================================

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$REPO_ROOT"

echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  simplyPet – Projekt-Status${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""

# ─── Git-Status ──────────────────────────────────────────────────────────────
echo -e "${CYAN}Git:${NC}"
echo "  Branch: $(git branch --show-current)"
echo "  Letzter Commit: $(git log --oneline -1)"
echo "  Ungespeicherte Änderungen: $(git status --short | wc -l) Dateien"
echo ""

# ─── Versions-Info ───────────────────────────────────────────────────────────
echo -e "${CYAN}Version:${NC}"
if [ -f "app/package.json" ]; then
    PKG_VERSION=$(grep '"version"' app/package.json | head -1 | grep -oP '[\d.]+')
    echo "  App-Version: $PKG_VERSION"
fi
echo ""

# ─── Dokument-Zählung ────────────────────────────────────────────────────────
echo -e "${CYAN}Dokumentation:${NC}"
DOC_COUNT=$(find . -maxdepth 1 -name "*.md" | wc -l)
echo "  Konzept-Dokumente: $DOC_COUNT"
echo "  Skripte: $(ls scripts/*.sh 2>/dev/null | wc -l)"
echo ""

# ─── Aktuelle Roadmap-Position ───────────────────────────────────────────────
echo -e "${CYAN}Roadmap-Position:${NC}"
if [ -f "roadmap_prototyp.md" ]; then
    # Finde den aktuell laufenden Schritt
    CURRENT=$(grep -n "LAUFEND" roadmap_prototyp.md | head -1)
    NEXT=$(grep -n "GEPLANT" roadmap_prototyp.md | head -1)
    if [ -n "$CURRENT" ]; then
        echo -e "  ${GREEN}▶${NC} $(echo $CURRENT | cut -d: -f2-)"
    fi
    if [ -n "$NEXT" ]; then
        echo -e "  ${YELLOW}⏭${NC} $(echo $NEXT | cut -d: -f2-)"
    fi
fi
echo ""

# ─── Offene Punkte ───────────────────────────────────────────────────────────
echo -e "${CYAN}Offene Punkte (aus Nutzertest-Feedback):${NC}"
if [ -f "nutzertest_feedback_v0.1.1.md" ]; then
    # Zähle die geplanten Features
    FEATURES=$(grep -c "^| [0-9]" nutzertest_feedback_v0.1.1.md 2>/dev/null || echo "0")
    echo "  Geplante Änderungen für nächsten Durchlauf: $FEATURES"
    
    # Zeige ausstehende Punkte
    PENDING=$(grep -c "⏳" nutzertest_feedback_v0.1.1.md 2>/dev/null || echo "0")
    DONE=$(grep -c "✅" nutzertest_feedback_v0.1.1.md 2>/dev/null || echo "0")
    echo "  Status: $DONE erledigt, $PENDING ausstehend"
fi
echo ""

# ─── Letzte Aktivitäten ──────────────────────────────────────────────────────
echo -e "${CYAN}Letzte 5 Commits:${NC}"
git log --oneline -5 | while read line; do
    echo "  $line"
done
echo ""

echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "  Handbuch: ${CYAN}ENTWICKLER_HANDBUCH.md${NC}"
echo -e "  Feedback: ${CYAN}nutzertest_feedback_v0.1.1.md${NC}"
echo -e "  Roadmap:  ${CYAN}roadmap_prototyp.md${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
