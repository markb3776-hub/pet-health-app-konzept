#!/usr/bin/env python3
"""
Generiert das simplyPet App-Hintergrundbild programmatisch:
- Vertikaler Gradient: oben dunkel (#1F7A64) → unten hell (#5ECFB0)
- Semi-transparente Blasen/Kreise überlagert
- Ausgabe: 1080x2340 PNG (Standard-Smartphone-Auflösung)
"""

from PIL import Image, ImageDraw, ImageFilter
import random
import os

# Bildgröße
WIDTH = 1080
HEIGHT = 2340

# Gradient-Farben (oben dunkel → unten hell)
COLOR_TOP = (31, 122, 100)      # #1F7A64 (primaryDark)
COLOR_BOTTOM = (94, 207, 176)   # #5ECFB0 (helles Mint)

def lerp_color(c1, c2, t):
    """Lineare Interpolation zwischen zwei Farben"""
    return tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))

def create_gradient(width, height, color_top, color_bottom):
    """Erstellt ein Bild mit vertikalem Gradient"""
    img = Image.new('RGBA', (width, height))
    draw = ImageDraw.Draw(img)
    
    for y in range(height):
        t = y / (height - 1)
        color = lerp_color(color_top, color_bottom, t)
        draw.line([(0, y), (width, y)], fill=(*color, 255))
    
    return img

def draw_bubbles(img, num_bubbles=50):
    """Zeichnet semi-transparente Blasen auf das Bild"""
    overlay = Image.new('RGBA', img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    random.seed(42)  # Reproduzierbar
    
    for _ in range(num_bubbles):
        # Zufällige Position
        x = random.randint(-100, WIDTH + 100)
        y = random.randint(-100, HEIGHT + 100)
        
        # Verschiedene Größen (kleine und große Blasen)
        size_category = random.random()
        if size_category < 0.3:
            radius = random.randint(20, 60)       # Kleine Blasen
        elif size_category < 0.7:
            radius = random.randint(60, 150)      # Mittlere Blasen
        else:
            radius = random.randint(150, 350)     # Große Blasen
        
        # Semi-transparente Farbe (weiß oder leicht grünlich)
        color_choice = random.random()
        if color_choice < 0.6:
            # Weiße Blasen (sehr dezent)
            alpha = random.randint(8, 30)
            bubble_color = (255, 255, 255, alpha)
        elif color_choice < 0.85:
            # Leicht hellere grüne Blasen
            alpha = random.randint(10, 35)
            bubble_color = (130, 220, 190, alpha)
        else:
            # Dunklere grüne Blasen (Tiefe)
            alpha = random.randint(10, 25)
            bubble_color = (20, 90, 75, alpha)
        
        # Kreis zeichnen
        draw.ellipse(
            [x - radius, y - radius, x + radius, y + radius],
            fill=bubble_color
        )
    
    # Overlay auf das Hauptbild compositen
    return Image.alpha_composite(img, overlay)

def add_subtle_glow(img):
    """Fügt einen dezenten hellen Glow oben-links hinzu (wie Lichteinfall)"""
    overlay = Image.new('RGBA', img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    # Großer, sehr dezenter Lichtfleck oben-links
    center_x = int(WIDTH * 0.25)
    center_y = int(HEIGHT * 0.15)
    max_radius = 500
    
    for r in range(max_radius, 0, -5):
        t = r / max_radius
        alpha = int(12 * (1 - t))  # Sehr dezent
        draw.ellipse(
            [center_x - r, center_y - r, center_x + r, center_y + r],
            fill=(255, 255, 255, alpha)
        )
    
    return Image.alpha_composite(img, overlay)

def main():
    print(f"Generiere simplyPet Hintergrund ({WIDTH}x{HEIGHT})...")
    
    # 1. Gradient erstellen
    img = create_gradient(WIDTH, HEIGHT, COLOR_TOP, COLOR_BOTTOM)
    print("  Gradient erstellt")
    
    # 2. Dezenten Glow hinzufügen
    img = add_subtle_glow(img)
    print("  Glow hinzugefuegt")
    
    # 3. Blasen zeichnen
    img = draw_bubbles(img, num_bubbles=50)
    print("  Blasen gezeichnet")
    
    # 4. Als PNG speichern (volle Qualität)
    output_path = "/home/ubuntu/simplypet_workspace/app/assets/app-background.png"
    img_rgb = img.convert('RGB')
    img_rgb.save(output_path, 'PNG', optimize=True)
    print(f"  Gespeichert: {output_path}")
    
    # 5. Dateigröße prüfen
    size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"  Dateigroesse: {size_mb:.1f} MB")
    
    # 6. Wenn zu groß, auch als JPEG speichern (für Performance)
    if size_mb > 1.5:
        jpg_path = output_path.replace('.png', '.jpg')
        img_rgb.save(jpg_path, 'JPEG', quality=85, optimize=True)
        jpg_size = os.path.getsize(jpg_path) / (1024 * 1024)
        print(f"  JPEG-Alternative: {jpg_path} ({jpg_size:.1f} MB)")
    
    print("\nFertig!")

if __name__ == "__main__":
    main()
