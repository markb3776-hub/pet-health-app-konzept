#!/usr/bin/env python3
"""
Wraps the outermost JSX element in each screen's MAIN return with <ScreenBackground>.
Handles: <View, <ScrollView, <KeyboardAvoidingView, <SafeAreaView as outer elements.
"""
import os
import re

BASE = "/home/ubuntu/simplypet_workspace/app"

# Screens that still need wrapping (those that failed in first pass)
SCREENS = [
    "src/screens/SitterScreen.tsx",
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

# JSX elements that can be the outermost wrapper
OUTER_ELEMENTS = ['<View', '<ScrollView', '<KeyboardAvoidingView', '<SafeAreaView']

def find_main_return(lines):
    """Find the main component return statement (the last top-level return)"""
    # Find all "  return (" patterns (2-space indent = top-level in function)
    candidates = []
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped == 'return (' and line.startswith('  return'):
            candidates.append(i)
    
    if not candidates:
        # Try any return (
        for i, line in enumerate(lines):
            if line.strip() == 'return (':
                candidates.append(i)
    
    # The main return is the LAST one
    return candidates[-1] if candidates else None

def find_closing_paren(lines, start_idx):
    """Find the closing );  that matches the return ("""
    # After return (, find the matching );
    depth = 0
    for i in range(start_idx, len(lines)):
        line = lines[i]
        if 'return (' in line or line.strip() == '(':
            depth += 1
        # Count parens
        for ch in line:
            if ch == '(':
                pass  # already counted above for the return line
            elif ch == ')':
                pass
        # Simpler: look for "  );" at the expected indentation
        if i > start_idx and lines[i].strip() == ');':
            return i
    return None

def wrap_screen(filepath):
    """Wrap the main return JSX with ScreenBackground"""
    full_path = os.path.join(BASE, filepath)
    
    with open(full_path, 'r') as f:
        content = f.read()
    
    if '<ScreenBackground>' in content:
        print(f"  SKIP (already wrapped): {filepath}")
        return
    
    lines = content.split('\n')
    
    # Find the main return
    return_idx = find_main_return(lines)
    if return_idx is None:
        print(f"  ERROR: No main return found in {filepath}")
        return
    
    # The line after "return (" should be the outer JSX element
    outer_line_idx = return_idx + 1
    outer_line = lines[outer_line_idx].strip()
    
    # Check if it's a recognized outer element
    is_outer = any(outer_line.startswith(el) for el in OUTER_ELEMENTS)
    if not is_outer:
        print(f"  ERROR: Unexpected outer element '{outer_line[:40]}' in {filepath}")
        return
    
    # Find the closing ); of the return
    closing_idx = None
    for i in range(return_idx + 1, len(lines)):
        if lines[i].strip() == ');':
            closing_idx = i
            break
    
    if closing_idx is None:
        print(f"  ERROR: No closing ); found in {filepath}")
        return
    
    # The line before ); should be the closing tag
    # Insert </ScreenBackground> before the closing tag line
    # and <ScreenBackground> after "return ("
    indent = '    '  # standard 4-space indent for JSX inside return
    
    # Insert </ScreenBackground> before the line that has the closing tag (line before );)
    close_tag_line = closing_idx - 1
    # Actually, insert right before );
    lines.insert(closing_idx, f"{indent}</ScreenBackground>")
    # Insert <ScreenBackground> right after "return ("
    lines.insert(return_idx + 1, f"{indent}<ScreenBackground>")
    
    with open(full_path, 'w') as f:
        f.write('\n'.join(lines))
    
    print(f"  OK: {filepath}")

print("Wrapping remaining screens with <ScreenBackground>...")
for screen in SCREENS:
    wrap_screen(screen)

print("\nDone!")
