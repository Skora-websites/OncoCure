"""Extract clean transparent logo assets from the supplied Onco Cure signboard.

The signboard photograph shows the brand mark and the "Onco Cure CLINIC"
wordmark mounted on a plain white illuminated panel. That flat near-white
background keys cleanly, unlike the beige wall photo.

Produces:
  public/images/brand/logo-mark.png      -> ribbon + hand + leaf mark
  public/images/brand/logo-full.png      -> mark + full wordmark lockup
"""
from PIL import Image

SRC = "public/images/brand/signboard.jpg"


def key_white(img, thresh=232, soft=30):
    """Make near-white pixels transparent, with a soft ramp + de-fringing."""
    img = img.convert("RGB")
    w, h = img.size
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    sp, op = img.load(), out.load()
    for y in range(h):
        for x in range(w):
            r, g, b = sp[x, y]
            mn = min(r, g, b)
            if mn >= thresh:
                continue  # background
            # partial coverage for anti-aliased edge pixels
            a = 255 if mn <= thresh - soft else int(
                255 * (thresh - mn) / soft)
            if a <= 0:
                continue
            # un-mix against the white backdrop so edges don't carry a white halo
            fa = a / 255.0
            def unmat(c):
                v = (c - 255 * (1 - fa)) / fa
                return max(0, min(255, int(round(v))))
            op[x, y] = (unmat(r), unmat(g), unmat(b), a)
    return out


def drop_small_islands(img, min_ratio=0.02):
    """Remove stray disconnected fragments from the neighbouring artwork.

    The crop windows pick up a sliver of the next element on the signboard;
    those are small isolated islands, so we keep only the largest component
    plus anything comparably sized (the mark and wordmark are separate).
    """
    px = img.load()
    w, h = img.size
    seen = [[False] * w for _ in range(h)]
    islands = []
    for y in range(h):
        for x in range(w):
            if px[x, y][3] == 0 or seen[y][x]:
                continue
            stack = [(x, y)]
            seen[y][x] = True
            cells = []
            while stack:
                cx, cy = stack.pop()
                cells.append((cx, cy))
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = cx + dx, cy + dy
                    if 0 <= nx < w and 0 <= ny < h and not seen[ny][nx] \
                            and px[nx, ny][3] > 0:
                        seen[ny][nx] = True
                        stack.append((nx, ny))
            islands.append(cells)

    if len(islands) <= 2:
        return img
    islands.sort(key=len, reverse=True)
    biggest = len(islands[0])
    keep = set()
    for isl in islands:
        if len(isl) >= biggest * min_ratio:
            keep.update(isl)
    dropped = biggest * (1 - len(keep) / max(1, biggest))
    for cx, cy in keep:
        px[cx, cy] = px[cx, cy]
    # re-alpha everything not kept
    kept_mask = bytearray(w * h)
    for cx, cy in keep:
        kept_mask[cy * w + cx] = 1
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    opx = out.load()
    for cy in range(h):
        for cx in range(w):
            if kept_mask[cy * w + cx]:
                opx[cx, cy] = px[cx, cy]
    print(f"  dropped {len(islands) - sum(1 for i in islands if len(i) >= biggest * min_ratio)}"
          f" island(s), {dropped} px")
    return out


def trim(img, pad=6):
    bbox = img.getbbox()
    if not bbox:
        return img
    w, h = img.size
    bbox = (max(0, bbox[0] - pad), max(0, bbox[1] - pad),
            min(w, bbox[2] + pad), min(h, bbox[3] + pad))
    return img.crop(bbox)


def main():
    board = Image.open(SRC)

    # Crop regions of the signboard (1536x1024) containing the brand artwork.
    print("mark:")
    mark = trim(drop_small_islands(key_white(board.crop((180, 130, 480, 430)))))
    mark.save("public/images/brand/logo-mark.png")
    print("logo-mark.png", mark.size)

    print("full lockup:")
    full = trim(drop_small_islands(key_white(board.crop((170, 120, 1400, 440)))))
    full.save("public/images/brand/logo-full.png")
    print("logo-full.png", full.size)


if __name__ == "__main__":
    main()
