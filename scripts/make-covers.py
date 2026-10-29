import json, glob, os, subprocess
from PIL import Image, ImageDraw, ImageFont

ROOT = r"C:\Users\user\Downloads\PupyGuido_Website_V2"
A = ROOT + r"\site\assets"
POSTS = ROOT + r"\content\posts"
TMP = r"C:\Users\user\AppData\Local\Temp\claude\C--Users-user\8c869e3b-7d6a-4874-9f21-a2aecd819d25\scratchpad\icons"
os.makedirs(TMP, exist_ok=True)
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
if not os.path.exists(CHROME): CHROME = r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
NAVY = (11, 31, 68); GOLD = (246, 196, 49)
SB = r"C:\Windows\Fonts\segoeuib.ttf"
SHIFT = 0.14

PHOTOS = {
 "puppy-first-night-home": ("night", .55, .50),
 "puppy-nap-and-sleep-schedule": ("bite", .50, .52),
 "puppy-potty-training-schedule": ("potty", .50, .33),
 "puppy-wont-pee-outside": ("garden", .42, .50),
 "first-commands-to-teach-a-puppy": ("collar", .55, .35),
 "new-puppy-checklist": ("checklist", .50, .30),
 "first-week-with-puppy-what-to-do": ("hero", .50, .38),
 "puppy-essentials-list": ("play", .50, .30),
 "puppy-crying-at-night": ("photos\\px-21782909", 0.58, 0.60),
 "crate-training-a-puppy": ("photos\\px-5047575", 0.50, 0.45),
 "how-to-prepare-for-a-puppy-checklist": ("photos\\px-28990269", 0.50, 0.43),
 "puppy-schedule-when-working-full-time": ("photos\\px-1750378", 0.50, 0.50),
 "can-you-leave-a-puppy-alone-for-8-hours": ("photos\\px-8339246", 0.45, 0.36),
 "puppy-blues-regret-getting-a-puppy": ("photos\\px-20144428", 0.50, 0.32),
 "how-to-stop-puppy-biting": ("photos\\px-28667156", 0.60, 0.50),
 "when-does-puppy-biting-stop": ("photos\\px-1750380", 0.70, 0.50),
 "puppy-potty-training-regression": ("photos\\px-16420806", 0.72, 0.45),
 "puppy-potty-training-timeline": ("photos\\px-1346086", 0.52, 0.38),
 "puppy-socialization-checklist": ("photos\\px-12951463", 0.62, 0.45),
 "puppy-feeding-schedule": ("photos\\px-8434725", 0.50, 0.38),
 "puppy-zoomies": ("photos\\px-9863520", 0.50, 0.38),
}
ART = json.load(open(ROOT + r"\build\cover-art.json", encoding="utf-8"))

def icon_png(key):
    out = TMP + "\\" + key + ".png"
    html = TMP + "\\" + key + ".html"
    open(html, "w", encoding="utf-8").write(
        '<html><body style="margin:0;background:transparent"><svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 160 160">' + ART[key] + '</svg></body></html>')
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--default-background-color=00000000",
                    "--window-size=480,480", "--screenshot=" + out, "file:///" + html.replace("\\", "/")], capture_output=True)
    return Image.open(out).convert("RGBA")

def crop(name, fx, fy, w, h):
    im = Image.open(A + "\\" + name + ".jpg").convert("RGB")
    iw, ih = im.size; t = w / h
    if iw / ih > t: ch = ih; cw = ch * t
    else: cw = iw; ch = cw / t
    cx = min(max(fx * iw, cw / 2), iw - cw / 2); cy = min(max(fy * ih + 0.12 * ch, ch / 2), ih - ch / 2)  # fy = face height; face sits in the upper part, gradient below
    return im.crop((int(cx - cw / 2), int(cy - ch / 2), int(cx + cw / 2), int(cy + ch / 2))).resize((w, h), Image.LANCZOS)

def paw(d, cx, cy, s, fill):
    d.ellipse([cx - .45 * s, cy - .05 * s, cx + .45 * s, cy + .55 * s], fill=fill)
    for dx, dy, r in [(-.62, -.28, .2), (-.22, -.58, .22), (.22, -.58, .22), (.62, -.28, .2)]:
        d.ellipse([cx + dx * s - r * s, cy + dy * s - r * s, cx + dx * s + r * s, cy + dy * s + r * s], fill=fill)

def placeholder(w, h, seed, key):
    img = Image.new("RGB", (w, h), NAVY); d = ImageDraw.Draw(img)
    for y in range(h):
        k = y / h; d.line([(0, y), (w, y)], fill=(int(22 - 11 * k), int(51 - 20 * k), int(107 - 39 * k)))
    step = 130; ox = (seed * 7) % 60; oy = (seed * 3) % 40
    for gy in range(-1, h // step + 2):
        for gx in range(-1, w // step + 2):
            paw(d, gx * step + (step // 2 if gy % 2 else 0) + ox, gy * step + oy, 24, (30, 62, 124))
    if key in ART:
        ic = icon_png(key).resize((int(w * .27), int(w * .27)), Image.LANCZOS)
        img.paste(ic, ((w - ic.width) // 2, int(h * .09)), ic)
    return img

def title_box(img, title):
    W, H = img.size
    d0 = ImageDraw.Draw(img)
    maxw = W - 2 * 56
    for fs in (50, 46, 42, 38, 34):
        f = ImageFont.truetype(SB, fs); words = title.split(); lines = []; cur = ""
        for w_ in words:
            t = (cur + " " + w_).strip()
            if d0.textlength(t, font=f) <= maxw: cur = t
            else: lines.append(cur); cur = w_
        lines.append(cur)
        if len(lines) <= 3: break
    lh = int(fs * 1.2)
    th = lh * len(lines)
    gh = th + 190                      # gradient height
    ov = Image.new("RGBA", img.size, (0, 0, 0, 0))
    px = ov.load()
    for y in range(H - gh, H):
        k = (y - (H - gh)) / gh        # 0 at top of gradient, 1 at bottom
        a = int(250 * (k ** 0.65)) if k < 1 else 250
        for x in range(W): px[x, y] = (11, 31, 68, a)
    img.paste(Image.alpha_composite(img.convert("RGBA"), ov).convert("RGB"))
    d = ImageDraw.Draw(img)
    y = H - 44 - th
    for l in lines:
        d.text((56 + 2, y + 2), l, font=f, fill=(5, 14, 34)); d.text((56, y), l, font=f, fill=GOLD); y += lh

for fp in sorted(glob.glob(POSTS + "\\*.json")):
    d = json.load(open(fp, encoding="utf-8")); slug = d["slug"]
    ph = PHOTOS.get(slug)
    if ph:
        crop(ph[0], ph[1], ph[2], 1600, 900).save(A + r"\blog\cover-" + slug + ".jpg", quality=82, optimize=True)
        base = crop(ph[0], ph[1], ph[2], 1200, 630)
    else:
        base = placeholder(1200, 630, len(slug), d.get("coverArt", ""))
    title_box(base, d["title"])
    base.save(A + r"\blog\og-" + slug + ".jpg", quality=84, optimize=True)
print("done")
