from PIL import Image
import os

src_path = "/Users/kotsuka/Documents/systemDev/Kokoromou/Gemini_Generated_Image_39rs7539rs7539rs.jpeg"
img = Image.open(src_path).convert("RGBA")

# 1. public/logo.png (512x512)
logo_png_path = "/Users/kotsuka/Documents/systemDev/Kokoromou/public/logo.png"
img_512 = img.resize((512, 512), Image.Resampling.LANCZOS)
img_512.save(logo_png_path, "PNG")
print(f"Saved {logo_png_path}")

# 2. public/logo.jpeg
logo_jpeg_path = "/Users/kotsuka/Documents/systemDev/Kokoromou/public/logo.jpeg"
img.convert("RGB").save(logo_jpeg_path, "JPEG", quality=95)
print(f"Saved {logo_jpeg_path}")

# 3. src/app/icon.png (Next.js App Router 自動ファビコン, 192x192)
icon_png_path = "/Users/kotsuka/Documents/systemDev/Kokoromou/src/app/icon.png"
img_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
img_192.save(icon_png_path, "PNG")
img_192.save("/Users/kotsuka/Documents/systemDev/Kokoromou/public/icon.png", "PNG")
print(f"Saved {icon_png_path}")

# 4. src/app/apple-icon.png (180x180)
apple_icon_path = "/Users/kotsuka/Documents/systemDev/Kokoromou/src/app/apple-icon.png"
img_180 = img.resize((180, 180), Image.Resampling.LANCZOS)
img_180.save(apple_icon_path, "PNG")
img_180.save("/Users/kotsuka/Documents/systemDev/Kokoromou/public/apple-touch-icon.png", "PNG")
print(f"Saved {apple_icon_path}")

# 5. src/app/favicon.ico & public/favicon.ico (16, 32, 48)
favicon_path = "/Users/kotsuka/Documents/systemDev/Kokoromou/src/app/favicon.ico"
public_favicon_path = "/Users/kotsuka/Documents/systemDev/Kokoromou/public/favicon.ico"
img.save(favicon_path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
img.save(public_favicon_path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
print(f"Saved {favicon_path} and {public_favicon_path}")
