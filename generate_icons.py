import cairosvg
from PIL import Image


# Fonction pour convertir un fichier SVG en image PNG
def convert_svg_to_png(svg_file, output_file, size):
    cairosvg.svg2png(url=svg_file, write_to="temp.png")
    img = Image.open("temp.png")
    img = img.resize(size, Image.Resampling.LANCZOS)
    img.save(output_file)
    print(f"Image générée : {output_file}")


def generate_icons(svg_file):
    # Dimensions des icônes pour l'extension Chrome
    sizes = {"16": (16, 16), "48": (48, 48), "128": (128, 128)}

    for size_key, size in sizes.items():
        output_file = f"icon{size_key}.png"
        convert_svg_to_png(svg_file, output_file, size)


if __name__ == "__main__":
    # Le fichier SVG à partir duquel générer les icônes
    svg_file = "icon.svg"
    generate_icons(svg_file)
