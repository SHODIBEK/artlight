import sys
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGB')
W, H = im.size
px = im.load()
def is_bg(c, bg, tol=12):
    return all(abs(a-b) <= tol for a, b in zip(c, bg))
def segments(y0, y1, x0, x1, bg, gap=6, tol=12):
    cols = [any(not is_bg(px[x, y], bg, tol) for y in range(y0, y1)) for x in range(x0, x1)]
    segs = []; start = None; last = None
    for i, c in enumerate(cols):
        x = x0 + i
        if c:
            if start is None: start = x
            last = x
        elif start is not None and x - last > gap:
            segs.append((start, last)); start = None
    if start is not None: segs.append((start, last))
    out = []
    for a, b in segs:
        rows = [y for y in range(y0, y1) if any(not is_bg(px[x, y], bg, tol) for x in range(a, b+1))]
        out.append((a, rows[0], b-a+1, rows[-1]-rows[0]+1))
    return out
cmd = sys.argv[2]
if cmd == 'seg':
    y0,y1,x0,x1 = map(int, sys.argv[3:7]); bg = tuple(map(int, sys.argv[7].split(','))); gap = int(sys.argv[8]) if len(sys.argv)>8 else 6
    for s in segments(y0,y1,x0,x1,bg,gap): print('x=%d y=%d w=%d h=%d' % s, px[s[0]+s[2]//2, s[1]+s[3]//2])
elif cmd == 'col':
    x = int(sys.argv[3]); y0,y1 = map(int, sys.argv[4:6]); prev=None
    for y in range(y0,y1):
        c = px[x,y]
        if c != prev: print(y, c); prev = c
elif cmd == 'row':
    y = int(sys.argv[3]); x0,x1 = map(int, sys.argv[4:6]); prev=None
    for x in range(x0,x1):
        c = px[x,y]
        if c != prev: print(x, c); prev = c
