// Unique illustrated cards (not product photos) for shop picks that used generic or duplicated images.
const fs = require('fs'), cp = require('child_process'), path = require('path');
const CHROME = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe';
const root = path.join(__dirname, '..');
const tmp = path.join(process.env.TEMP || 'C:/Windows/Temp', 'pg-pick-cards');
fs.mkdirSync(tmp, { recursive: true });
const icon = {
  'bissell-little-green-pet-carpet-cleaner': ['🧽', 'Clean-up'],
  'dog-car-seat-belt': ['🚗', 'Car safety'],
  'enzymatic-pet-stain-cleaner': ['🧴', 'Clean-up'],
  'furbo-360-dog-camera': ['📹', 'Check in'],
  'midwest-icrate-folding-dog-crate': ['🏠', 'Crate'],
  'orthopedic-memory-foam-dog-bed-washable': ['🛏️', 'Bed'],
  'petmate-sky-kennel-travel-crate': ['🧳', 'Travel'],
  'puppy-exercise-pen-playpen': ['🐾', 'Play area'],
  'puppy-harness-and-leash-set': ['🦮', 'Walks'],
  'puppy-heartbeat-comfort-toy': ['🧸', 'Comfort'],
  'soft-puppy-training-treats': ['🍖', 'Training'],
  'tractive-gps-dog-tracker': ['📍', 'Safety'],
  'wire-puppy-crate-with-divider': ['🏠', 'Crate'],
  'rubber-puppy-teething-chews': ['🦴', 'Teething'],
  'puppy-training-pads': ['📄', 'Potty'],
  'washable-puppy-crate-bed': ['🛏️', 'Crate bed'],
  'puppy-slow-feeder-bowl': ['🥣', 'Mealtime']
};
const outDir = path.join(root, 'site', 'assets', 'picks');
for (const [slug, [emoji, tag]] of Object.entries(icon)) {
  const j = JSON.parse(fs.readFileSync(path.join(root, 'content', 'picks', slug + '.json'), 'utf8'));
  const html = `<!doctype html><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;width:600px;height:600px;background:linear-gradient(160deg,#13306a,#0B1F44);font-family:"Segoe UI",Arial,sans-serif;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px;position:relative}
.c{width:230px;height:230px;border-radius:50%;background:#F6C431;display:flex;align-items:center;justify-content:center;font-size:120px;box-shadow:0 14px 40px rgba(0,0,0,.35)}
.k{margin-top:26px;background:#F6C431;color:#0B1F44;font-weight:800;letter-spacing:.08em;text-transform:uppercase;border-radius:10px;padding:6px 14px;font-size:18px}
h1{font-size:32px;line-height:1.2;margin:16px 0 0;font-weight:800}
.f{position:absolute;bottom:20px;left:0;right:0;font-size:15px;color:#9fb3d6}</style>
<div class="c">${emoji}</div><div class="k">${tag}</div><h1>${j.title.replace(/&/g, '&amp;')}</h1><div class="f">PuppyGuido pick</div>`;
  const hf = path.join(tmp, slug + '.html'), png = path.join(tmp, slug + '.png');
  fs.writeFileSync(hf, html);
  cp.spawnSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=600,600', '--virtual-time-budget=2000', '--screenshot=' + png, 'file:///' + hf.replace(/\\/g, '/')], { stdio: 'ignore' });
  const jpg = path.join(outDir, slug + '.jpg');
  const r = cp.spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', png, '-q:v', '3', jpg], { encoding: 'utf8' });
  if (r.status) { console.log('ffmpeg fail', slug, r.stderr.slice(0, 200)); continue; }
  j.image = '/assets/picks/' + slug + '.jpg';
  j.imageAlt = 'PuppyGuido pick card: ' + j.title + ' (illustration, not a product photo)';
  fs.writeFileSync(path.join(root, 'content', 'picks', slug + '.json'), JSON.stringify(j, null, 2) + '\n');
  console.log('ok', slug);
}
