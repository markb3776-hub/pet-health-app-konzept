#!/bin/bash
# Script um alle Screens mit ScreenBackground zu wrappen
# Strategie:
# 1. Import von ScreenBackground hinzufügen
# 2. Container backgroundColor auf 'transparent' setzen
# 3. Die äußerste View mit ScreenBackground wrappen

cd /home/ubuntu/simplypet_workspace/app

echo "=== Wrapping all screens with ScreenBackground ==="

# Liste aller Screen-Dateien
SCREENS=(
  "src/screens/HomeScreen.tsx"
  "src/screens/AppointmentsScreen.tsx"
  "src/screens/EmergencyPassScreen.tsx"
  "src/screens/SitterScreen.tsx"
  "src/screens/MoreScreen.tsx"
  "src/screens/PetFileScreen.tsx"
  "src/screens/ManagePetsScreen.tsx"
  "src/screens/OnboardingScreen.tsx"
  "src/screens/AddPetScreen.tsx"
  "src/screens/EditPetScreen.tsx"
  "src/screens/entries/DocumentCaptureScreen.tsx"
  "src/screens/entries/ExaminationEntryScreen.tsx"
  "src/screens/entries/FecalSampleEntryScreen.tsx"
  "src/screens/entries/IncidentEntryScreen.tsx"
  "src/screens/entries/MedicationEntryScreen.tsx"
  "src/screens/entries/ObservationEntryScreen.tsx"
  "src/screens/entries/VaccinationEntryScreen.tsx"
  "src/screens/entries/WeightEntryScreen.tsx"
)

for f in "${SCREENS[@]}"; do
  echo "Processing: $f"
  
  # Prüfen ob ScreenBackground schon importiert ist
  if grep -q "ScreenBackground" "$f"; then
    echo "  -> Already has ScreenBackground, skipping import"
  else
    # Import hinzufügen (nach dem letzten import-Statement)
    # Relativen Pfad berechnen
    if [[ "$f" == *"/entries/"* ]]; then
      IMPORT_PATH="../../components/ScreenBackground"
    else
      IMPORT_PATH="../components/ScreenBackground"
    fi
    
    # Import nach der letzten import-Zeile einfügen
    LAST_IMPORT_LINE=$(grep -n "^import " "$f" | tail -1 | cut -d: -f1)
    if [ -n "$LAST_IMPORT_LINE" ]; then
      sed -i "${LAST_IMPORT_LINE}a import ScreenBackground from '${IMPORT_PATH}';" "$f"
      echo "  -> Import added at line $((LAST_IMPORT_LINE + 1))"
    fi
  fi
done

echo ""
echo "=== Import phase complete ==="
echo "Now applying backgroundColor changes..."

# backgroundColor in container-Styles auf transparent setzen
for f in "${SCREENS[@]}"; do
  # container: { flex: 1, backgroundColor: colors.background } -> transparent
  sed -i "s/container: { flex: 1, backgroundColor: colors.background }/container: { flex: 1, backgroundColor: 'transparent' }/g" "$f"
  # flex: { flex: 1, backgroundColor: colors.background } -> transparent
  sed -i "s/flex: { flex: 1, backgroundColor: colors.background }/flex: { flex: 1, backgroundColor: 'transparent' }/g" "$f"
  echo "  $f: backgroundColor updated"
done

echo ""
echo "=== Done ==="
