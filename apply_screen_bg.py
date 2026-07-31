#!/usr/bin/env python3
"""
Wraps the outermost View in each screen's return statement with <ScreenBackground>.
Strategy:
- Find the main return ( pattern in each screen
- The outermost <View ...> becomes wrapped: <ScreenBackground><View ...>...</View></ScreenBackground>
- For screens that use styles.flex as outer wrapper: wrap that
- For screens that use styles.container as outer wrapper: wrap that
"""
import re
import os

BASE = "/home/ubuntu/simplypet_workspace/app"

# All screens to process
SCREENS = [
    "src/screens/HomeScreen.tsx",
    "src/screens/AppointmentsScreen.tsx",
    "src/screens/EmergencyPassScreen.tsx",
    "src/screens/SitterScreen.tsx",
    "src/screens/MoreScreen.tsx",
    "src/screens/PetFileScreen.tsx",
    "src/screens/ManagePetsScreen.tsx",
    "src/screens/OnboardingScreen.tsx",
    "src/screens/AddPetScreen.tsx",
    "src/screens/EditPetScreen.tsx",
    "src/screens/entries/DocumentCaptureScreen.tsx",
    "src/screens/entries/ExaminationEntryScreen.tsx",
    "src/screens/entries/FecalSampleEntryScreen.tsx",
    "src/screens/entries/IncidentEntryScreen.tsx",
    "src/screens/entries/MedicationEntryScreen.tsx",
    "src/screens/entries/ObservationEntryScreen.tsx",
    "src/screens/entries/VaccinationEntryScreen.tsx",
    "src/screens/entries/WeightEntryScreen.tsx",
]

def wrap_screen(filepath):
    """Wrap the outermost return JSX with ScreenBackground"""
    full_path = os.path.join(BASE, filepath)
    
    with open(full_path, 'r') as f:
        content = f.read()
    
    # Skip if already wrapped
    if '<ScreenBackground>' in content:
        print(f"  SKIP (already wrapped): {filepath}")
        return
    
    lines = content.split('\n')
    
    # Find the LAST "return (" in the file (the main component return)
    # We look for the pattern: "  return (\n"
    return_indices = []
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped == 'return (' or stripped.startswith('return ('):
            return_indices.append(i)
    
    if not return_indices:
        print(f"  ERROR: No return found in {filepath}")
        return
    
    # Use the last return (which is typically the main component return)
    # But we need to be smart - the main return is usually the one with the most content after it
    # Let's find the one that has <View or <ScrollView right after
    main_return_idx = None
    for idx in reversed(return_indices):
        # Check next non-empty line
        for j in range(idx + 1, min(idx + 5, len(lines))):
            if lines[j].strip().startswith('<View') or lines[j].strip().startswith('<ScrollView'):
                main_return_idx = idx
                break
        if main_return_idx is not None:
            break
    
    if main_return_idx is None:
        # Fallback: use the last return
        main_return_idx = return_indices[-1]
    
    # Find the line with the opening <View
    view_line_idx = None
    for j in range(main_return_idx + 1, min(main_return_idx + 5, len(lines))):
        if lines[j].strip().startswith('<View'):
            view_line_idx = j
            break
    
    if view_line_idx is None:
        print(f"  ERROR: No <View found after return in {filepath}")
        return
    
    # Find the matching closing </View> for this opening tag
    # Count the indentation of the opening View
    indent = len(lines[view_line_idx]) - len(lines[view_line_idx].lstrip())
    
    # Find the closing </View> at the same indentation level
    closing_view_idx = None
    depth = 0
    for j in range(view_line_idx, len(lines)):
        line = lines[j]
        # Count opening and closing View tags
        opens = line.count('<View') + line.count('<View>')
        closes = line.count('</View>')
        depth += opens - closes
        if depth == 0 and closes > 0:
            closing_view_idx = j
            break
    
    if closing_view_idx is None:
        print(f"  ERROR: No matching </View> found in {filepath}")
        return
    
    # Insert <ScreenBackground> before the <View and </ScreenBackground> after </View>
    view_indent = ' ' * indent
    lines.insert(closing_view_idx + 1, f"{view_indent}</ScreenBackground>")
    lines.insert(view_line_idx, f"{view_indent}<ScreenBackground>")
    
    with open(full_path, 'w') as f:
        f.write('\n'.join(lines))
    
    print(f"  OK: {filepath} (wrapped at lines {view_line_idx+1}-{closing_view_idx+2})")

print("Wrapping screens with <ScreenBackground>...")
for screen in SCREENS:
    wrap_screen(screen)

print("\nDone!")
