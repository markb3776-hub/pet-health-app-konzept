"""
Fix app icon foreground and splash: Remove pink/magenta background,
keep only white paw+cross on transparent background.
Resize to correct dimensions for Android adaptive icons.
"""
from PIL import Image
import numpy as np

def clean_foreground(input_path, output_path, size):
    """Remove pink background, keep white elements on transparent."""
    img = Image.open(input_path).convert('RGBA')
    data = np.array(img)
    
    # Identify white/near-white pixels (the paw + cross)
    # White pixels: R > 220, G > 220, B > 220
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    
    # The paw is white, everything else (pink bg) should be transparent
    is_white = (r > 200) & (g > 200) & (b > 200)
    
    # Create new image: white where paw is, transparent elsewhere
    new_data = np.zeros_like(data)
    new_data[is_white] = [255, 255, 255, 255]  # solid white
    # For edge pixels (anti-aliasing), use partial transparency
    is_light = (r > 150) & (g > 150) & (b > 150) & ~is_white
    new_data[is_light, 0] = 255
    new_data[is_light, 1] = 255
    new_data[is_light, 2] = 255
    new_data[is_light, 3] = ((r[is_light].astype(int) + g[is_light].astype(int) + b[is_light].astype(int)) // 3).astype(np.uint8)
    
    result = Image.fromarray(new_data)
    result = result.resize((size, size), Image.LANCZOS)
    result.save(output_path)
    print(f"Saved: {output_path} ({size}x{size})")

# Fix foreground (512x512 for adaptive icon)
clean_foreground(
    'app/assets/android-icon-foreground.png',
    'app/assets/android-icon-foreground.png',
    512
)

# Fix splash icon (512x512)
clean_foreground(
    'app/assets/splash-icon.png',
    'app/assets/splash-icon.png',
    512
)

# Create monochrome version (same as foreground but for themed icons)
clean_foreground(
    'app/assets/android-icon-foreground.png',
    'app/assets/android-icon-monochrome.png',
    512
)

# Resize main icon to 1024x1024
img = Image.open('app/assets/icon.png')
img = img.resize((1024, 1024), Image.LANCZOS)
img.save('app/assets/icon.png')
print(f"Resized icon.png to 1024x1024")

print("\nAll icons fixed!")
