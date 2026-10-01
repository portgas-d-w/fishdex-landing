from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
names = [('roach','Gardon'),('perch','Perche'),('carp','Carpe commune'),('pike','Brochet'),('zander','Sandre'),('bream','Brème commune'),('tench','Tanche'),('rudd','Rotengle'),('bleak','Ablette'),('crucian','Carassin commun'),('whitebream','Brème bordelière'),('gudgeon','Goujon'),('chub','Chevesne'),('ide','Ide mélanote'),('catfish','Silure glane')]
atlas = Image.new('RGB', (1200, 1130), '#183d36')
font = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 20)
for i, (id, name) in enumerate(names):
    img = Image.open(f'test-results/model-{id}.png').convert('RGBA')
    img.thumbnail((390, 180))
    x = i % 3 * 400 + (400 - img.width)//2
    y = i // 3 * 220 + 25
    atlas.paste(img, (x, y), img)
    ImageDraw.Draw(atlas).text((i%3*400+20, y+180), name, fill='#ecdfb9', font=font)
Path('docs/apercus').mkdir(exist_ok=True)
atlas.save('docs/apercus/poissons-atlas.jpg', quality=90)
