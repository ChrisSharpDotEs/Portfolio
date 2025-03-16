import tkinter as tk
from PIL import Image
import os

class ImageConverter:
    def __init__(self, imageURL):
        self.image = Image.open(imageURL)
        pass
    def convertToWebp(self, image, output):
        image.save(output, "WEBP")
        return 0
    
    def resizeImg(self, scale):
        ancho, alto = self.image.size
        new_size = (int(ancho * scale), int(alto * scale))
        return self.image.resize(new_size)


directorio = "./public/img"

if any(os.walk(directorio)):
    print("El directorio no está vacío.")
    print(os.listdir())
else:
    print("El directorio está vacío.")
    print(os.listdir())


for root, dirs, files in os.walk(directorio):
    for file in files:
        ruta_relativa = os.path.relpath(os.path.join(root, file), directorio)
        if("svg" in ruta_relativa or "avif" in ruta_relativa): continue
        print("Convirtiendo " + ruta_relativa)
        converter = ImageConverter(directorio + "/" + ruta_relativa)
        imagen = converter.resizeImg(0.5)
        converter.convertToWebp(imagen, "./public/webp/" + ruta_relativa.split(".")[0] + ".webp")
