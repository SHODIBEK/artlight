import sys
from PIL import Image, ImageChops
# diff.py design.png shot.png x0 y0 x1 y1 out.png
a = Image.open(sys.argv[1]).convert('RGB'); b = Image.open(sys.argv[2]).convert('RGB')
x0,y0,x1,y1 = map(int, sys.argv[3:7]); box=(x0,y0,x1,y1)
ca, cb = a.crop(box), b.crop(box)
d = ImageChops.difference(ca, cb).convert('L')
px = d.load(); w,h = d.size
bad = sum(1 for x in range(w) for y in range(h) if px[x,y] > 40)
print('pixels>40: %d of %d (%.2f%%)' % (bad, w*h, 100*bad/(w*h)))
# side-by-side + diff
out = Image.new('RGB', (w, h*3), 'white'); out.paste(ca,(0,0)); out.paste(cb,(0,h)); out.paste(d.point(lambda v: 255 if v>40 else 0).convert('RGB'),(0,2*h)); out.save(sys.argv[7])
