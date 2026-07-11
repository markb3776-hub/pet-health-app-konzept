"""
Erstellt Play-Store-Screenshots aus echten App-Screenshots.
Fügt einen dunklen Hintergrund, Feature-Text oben und einen Handy-Rahmen hinzu.
Format: 1080x1920 (9:16) – Google Play Standard
"""
from PIL import Image, ImageDraw, ImageFont
import os

# Konfiguration
OUTPUT_DIR = "/home/ubuntu/simplypet_workspace/store_assets"
BG_COLOR = (26, 26, 46)  # #1A1A2E – dunkler Hintergrund
TEXT_COLOR = (255, 255, 255)  # Weiß
CANVAS_W, CANVAS_H = 1080, 1920
PHONE_RADIUS = 40
PHONE_BORDER_COLOR = (60, 60, 60)  # Dunkelgrau für Rahmen
PHONE_BORDER_WIDTH = 8

# Screenshots und ihre Feature-Texte
screenshots = [
    ("/home/ubuntu/upload/1000171478.jpg", "Alle Tiere\nauf einen Blick"),
    ("/home/ubuntu/upload/1000171480.jpg", "Termine und\nErinnerungen"),
    ("/home/ubuntu/upload/1000171484.jpg", "Alles einfach\nfesthalten"),
    ("/home/ubuntu/upload/1000171490.jpg", "Notfallpass –\nimmer griffbereit"),
    ("/home/ubuntu/upload/1000171492.jpg", "Alle Infos für\nden Ernstfall"),
    ("/home/ubuntu/upload/1000171486.jpg", "Datensicherung\nin deiner Hand"),
    ("/home/ubuntu/upload/1000171488.jpg", "100% offline –\n100% privat"),
    ("/home/ubuntu/upload/1000171494.jpg", "Tipp: Halte den\nPass aktuell"),
]

# Font laden (system fallback)
def get_font(size):
    font_paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf",
    ]
    for fp in font_paths:
        if os.path.exists(fp):
            return ImageFont.truetype(fp, size)
    return ImageFont.load_default()

font_title = get_font(64)

os.makedirs(OUTPUT_DIR, exist_ok=True)

for i, (src_path, title_text) in enumerate(screenshots, 1):
    # Canvas erstellen
    canvas = Image.new("RGB", (CANVAS_W, CANVAS_H), BG_COLOR)
    draw = ImageDraw.Draw(canvas)
    
    # Screenshot laden und skalieren
    screenshot = Image.open(src_path)
    
    # Handy-Bereich berechnen (unten zentriert, mit Platz für Text oben)
    text_area_height = 320  # Platz für Überschrift oben
    phone_area_top = text_area_height
    phone_area_height = CANVAS_H - phone_area_top - 60  # 60px Padding unten
    phone_area_width = CANVAS_W - 120  # 60px Padding links+rechts
    
    # Screenshot proportional skalieren
    sc_ratio = screenshot.width / screenshot.height
    phone_inner_w = phone_area_width - (PHONE_BORDER_WIDTH * 2) - 20
    phone_inner_h = phone_area_height - (PHONE_BORDER_WIDTH * 2) - 20
    
    if sc_ratio > phone_inner_w / phone_inner_h:
        new_w = phone_inner_w
        new_h = int(new_w / sc_ratio)
    else:
        new_h = phone_inner_h
        new_w = int(new_h * sc_ratio)
    
    screenshot_resized = screenshot.resize((new_w, new_h), Image.LANCZOS)
    
    # Handy-Rahmen zeichnen (abgerundetes Rechteck)
    phone_w = new_w + PHONE_BORDER_WIDTH * 2 + 20
    phone_h = new_h + PHONE_BORDER_WIDTH * 2 + 20
    phone_x = (CANVAS_W - phone_w) // 2
    phone_y = phone_area_top + (phone_area_height - phone_h) // 2
    
    # Äußerer Rahmen (dunkelgrau)
    draw.rounded_rectangle(
        [phone_x, phone_y, phone_x + phone_w, phone_y + phone_h],
        radius=PHONE_RADIUS,
        fill=PHONE_BORDER_COLOR,
    )
    
    # Innerer Bereich (weiß – Bildschirm)
    inner_x = phone_x + PHONE_BORDER_WIDTH
    inner_y = phone_y + PHONE_BORDER_WIDTH
    inner_w = phone_w - PHONE_BORDER_WIDTH * 2
    inner_h = phone_h - PHONE_BORDER_WIDTH * 2
    draw.rounded_rectangle(
        [inner_x, inner_y, inner_x + inner_w, inner_y + inner_h],
        radius=PHONE_RADIUS - 5,
        fill=(255, 255, 255),
    )
    
    # Screenshot einfügen (zentriert im inneren Bereich)
    sc_x = inner_x + (inner_w - new_w) // 2
    sc_y = inner_y + (inner_h - new_h) // 2
    canvas.paste(screenshot_resized, (sc_x, sc_y))
    
    # Feature-Text oben zentriert
    lines = title_text.split("\n")
    total_text_h = len(lines) * 75
    text_start_y = (text_area_height - total_text_h) // 2
    
    for j, line in enumerate(lines):
        bbox = draw.textbbox((0, 0), line, font=font_title)
        tw = bbox[2] - bbox[0]
        tx = (CANVAS_W - tw) // 2
        ty = text_start_y + j * 75
        draw.text((tx, ty), line, fill=TEXT_COLOR, font=font_title)
    
    # Speichern
    output_path = os.path.join(OUTPUT_DIR, f"screenshot_{i:02d}.png")
    canvas.save(output_path, "PNG", quality=95)
    print(f"✓ Screenshot {i:02d}: {output_path}")

print(f"\nFertig – {len(screenshots)} Screenshots erstellt in {OUTPUT_DIR}")
