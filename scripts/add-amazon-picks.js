const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const TAG = 'bouskine-20';
const link = q => 'https://www.amazon.com/s?k=' + encodeURIComponent(q).replace(/%20/g, '+') + '&tag=' + TAG;
const items = [
  ['wire-puppy-crate-with-divider', 'Wire Puppy Crate with Divider', 'Sleep & Crate', 'puppy wire crate with divider', '/assets/night.jpg', 'A folding wire crate with a divider panel that lets the space grow with your puppy.', 'A divider lets you keep the crate just big enough for sleeping, which helps with potty training. Check the size chart for your breed.'],
  ['washable-puppy-crate-bed', 'Washable Puppy Crate Bed', 'Sleep & Crate', 'washable puppy crate bed', '/assets/picks/all-season-washable-dog-bed.jpg', 'A soft crate pad with a removable cover that can go in the washing machine.', 'Accidents happen. A cover you can wash keeps the crate fresh and cozy.'],
  ['puppy-heartbeat-comfort-toy', 'Puppy Heartbeat Comfort Toy', 'Sleep & Crate', 'puppy heartbeat toy for sleep', '/assets/play.jpg', 'A plush toy with a gentle simulated heartbeat, made to comfort puppies at bedtime.', 'Some puppies settle faster at night with a soft comfort toy. Always supervise and check that it is safe for your puppy.'],
  ['enzymatic-pet-stain-cleaner', 'Enzymatic Pet Stain Cleaner', 'Potty Training', 'enzyme cleaner pet urine', '/assets/potty.jpg', 'A cleaner made to break down pet urine and odors on floors and fabric.', 'Cleaning accidents well helps stop puppies returning to the same spot. Test on a small hidden area first.'],
  ['puppy-training-pads', 'Puppy Training Pads', 'Potty Training', 'puppy training pads', '/assets/picks/disposable-puppy-training-pads.jpg', 'Absorbent pads for indoor potty spots, balconies or bad-weather days.', 'Pads can protect floors while your puppy learns. Move toward the outdoor spot as your puppy matures.'],
  ['rubber-puppy-teething-chews', 'Rubber Puppy Teething Chews', 'Biting & Teething', 'puppy teething chew toys rubber', '/assets/bite.jpg', 'Soft rubber chew toys sized for puppies, made to soothe sore gums.', 'Having the right chew handy lets you redirect biting calmly. Replace toys that wear down or break.'],
  ['soft-puppy-training-treats', 'Soft Puppy Training Treats', 'Training', 'puppy training treats small soft', '/assets/hero.jpg', 'Small, soft treats that are quick to eat, made for training sessions.', 'Tiny, soft treats let you reward quickly without filling your puppy up.'],
  ['puppy-harness-and-leash-set', 'Puppy Harness and Leash Set', 'Puppy Essentials', 'puppy harness and leash set', '/assets/collar.jpg', 'An adjustable soft harness with a matching lightweight leash for small to medium puppies.', 'A snug, adjustable harness is gentle on a growing neck. Measure your puppy and check the size guide.'],
  ['puppy-slow-feeder-bowl', 'Puppy Slow Feeder Bowl', 'Puppy Essentials', 'puppy slow feeder bowl', '/assets/picks/silicone-slow-feeder-dog-bowl.jpg', 'A bowl with raised patterns that make puppies eat a bit slower.', 'Slower eating can be a calmer mealtime for fast eaters. Ask your vet about portions.'],
  ['puppy-exercise-pen-playpen', 'Puppy Exercise Pen / Playpen', 'Puppy Essentials', 'puppy exercise pen playpen', '/assets/garden.jpg', 'A foldable pen that creates a safe play area indoors or outdoors.', 'A pen gives your puppy room to play while you cook, work or keep an eye on them. Always supervise.']
];
let order = 30;
for (const [slug, title, category, q, image, short, why] of items) {
  const j = { merchant: 'Amazon', hidden: false, slug, title, category, short, why, url: link(q), cta: 'See options on Amazon', image, imageAlt: title, order: order++ };
  fs.writeFileSync(path.join(root, 'content', 'picks', slug + '.json'), JSON.stringify(j, null, 2) + '\n');
}
const f = path.join(root, 'build', 'build.js');
let b = fs.readFileSync(f, 'utf8');
if (!b.includes("p.merchant === 'Amazon'")) {
  b = b.replace('? `<a class="btn btn-gold" href="/go/${p.slug}/" target="_blank" rel="sponsored nofollow noopener">',
    '? `<a class="btn btn-gold" href="${p.merchant === \'Amazon\' ? esc(p.url) : \'/go/\' + p.slug + \'/\'}" target="_blank" rel="sponsored nofollow noopener">');
  b = b.replace("const SHOP_NOTE = '<b>Heads up.</b>", "const SHOP_NOTE = '<b>Heads up.</b> As an Amazon Associate we earn from qualifying purchases.");
  fs.writeFileSync(f, b);
}
console.log('done', items.length);
