"""
Erstellt einen zusätzlichen Store-Screenshot (Nr. 09) aus dem Homescreen-Bild.
Zeigt das App-Icon auf dem echten Android-Homescreen.
Format: 1080x1920 (9:16) – Google Play Standard
"""
from PIL import Image, ImageDraw, ImageFont
import os

OUTPUT_DIR = "/home/ubuntu/simplypet_workspace/store_assets"
BG_COLOR = (26, 26, 46)  # #1A1A2E
TEXT_COLOR = (255, 255, 255)
CANVAS_W, CANVAS_H = 1080, 1920

# Font laden
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

# Homescreen-Bild (das mit dem Icon auf dem Startbildschirm)
src_path = "/home/ubuntu/upload/1000171496.jpg"
title_text = "Dein Begleiter –\nimmer griffbereit"

# Canvas erstellen
canvas = Image.new("RGB", (CANVAS_W, CANVAS_H), BG_COLOR)
draw = ImageDraw.Draw(canvas)

# Screenshot laden (1080x2340) – auf Handy-Größe skalieren
screenshot = Image.open(src_path)

# Handy-Bereich berechnen
PHONE_RADIUS = 40
PHONE_BORDER_COLOR = (60, 60, 60)
PHONE_BORDER_WIDTH = 8

text_area_height = 320
phone_area_top = text_area_height
phone_area_height = CANVAS_H - phone_area_top - 60
phone_area_width = CANVAS_W - 120

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

# Handy-Rahmen
phone_w = new_w + PHONE_BORDER_WIDTH * 2 + 20
phone_h = new_h + PHONE_BORDER_WIDTH * 2 + 20
phone_x = (CANVAS_W - phone_w) // 2
phone_y = phone_area_top + (phone_area_height - phone_h) // 2

# Äußerer Rahmen
draw.rounded_rectangle(
    [phone_x, phone_y, phone_x + phone_w, phone_y + phone_h],
    radius=PHONE_RADIUS,
    fill=PHONE_BORDER_COLOR,
)

# Innerer Bereich (schwarz für Homescreen)
inner_x = phone_x + PHONE_BORDER_WIDTH
inner_y = phone_y + PHONE_BORDER_WIDTH
inner_w = phone_w - PHONE_BORDER_WIDTH * 2
inner_h = phone_h - PHONE_BORDER_WIDTH * 2
draw.rounded_rectangle(
    [inner_x, inner_y, inner_x + inner_w, inner_y + inner_h],
    radius=PHONE_RADIUS - 5,
    fill=(0, 0, 0),
)

# Screenshot einfügen
sc_x = inner_x + (inner_w - new_w) // 2
sc_y = inner_y + (inner_h - new_h) // 2
canvas.paste(screenshot_resized, (sc_x, sc_y))

# Feature-Text oben
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
output_path = os.path.join(OUTPUT_DIR, "screenshot_09.png")
canvas.save(output_path, "PNG", quality=95)
print(f"✓ Screenshot 09: {output_path}")
print(f"  Größe: {canvas.size}")
