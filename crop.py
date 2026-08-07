from PIL import Image, ImageDraw

def crop_to_circle(image_path, output_path, size=(256, 256)):
    # Open the image and convert to RGBA
    img = Image.open(image_path).convert("RGBA")
    
    # Resize image to a square if it's not
    img = img.resize(size, Image.Resampling.LANCZOS)
    
    # Create a circular mask
    mask = Image.new('L', size, 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0) + size, fill=255)
    
    # Apply mask to the image
    result = Image.new('RGBA', size, (0, 0, 0, 0))
    result.paste(img, (0, 0), mask=mask)
    
    # Save the output
    result.save(output_path, format="PNG")
    print(f"Successfully saved cropped image to {output_path}")

input_img = r"C:\Users\Yaad\Downloads\ChatGPT Image Aug 7, 2026, 06_56_44 PM.png"
output_img = r"C:\Users\Yaad\Documents\Freshup Oceansense\Oceansense project\Occeansense\oceansense\frontend\public\favicon.png"

crop_to_circle(input_img, output_img)
