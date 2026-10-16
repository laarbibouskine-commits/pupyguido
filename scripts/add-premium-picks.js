const fs=require('fs'),path=require('path');
const dir=path.join(__dirname,'..','content','picks');
const tag='&tag=bouskine-20';
const q=s=>'https://www.amazon.com/s?k='+s.replace(/ /g,'+')+tag;
const items=[
 {slug:'furbo-360-dog-camera',title:'Furbo 360 Dog Camera',category:'Puppy Essentials',short:'A pet camera with two-way audio and treat toss so you can check in on your puppy from your phone.',why:'Handy when you are practicing short alone times. A paid plan is needed to activate it, so check the current plan details before you buy.',q:'Furbo 360 dog camera',image:'/assets/picks/../night.jpg',order:5},
 {slug:'midwest-icrate-folding-dog-crate',title:'MidWest iCrate Folding Dog Crate with Divider',category:'Sleep & Crate',short:'A popular folding wire crate with a divider panel, so it grows with your puppy.',why:'A divider means one crate can last from puppy to adult. Pick the size from your puppy\'s expected adult weight.',q:'MidWest iCrate double door folding dog crate divider',image:'/assets/checklist.jpg',order:6},
 {slug:'bissell-little-green-pet-carpet-cleaner',title:'BISSELL Little Green Pet Portable Carpet Cleaner',category:'Potty Training',short:'A compact carpet and upholstery cleaner for pet stains.',why:'Accidents happen while puppies learn. A machine plus an enzyme cleaner helps remove stains and smells.',q:'BISSELL Little Green Pet portable carpet cleaner',image:'/assets/potty.jpg',order:7},
 {slug:'tractive-gps-dog-tracker',title:'Tractive GPS Dog Tracker',category:'Puppy Essentials',short:'A small GPS tracker that clips to a collar or harness so you can see where your dog is.',why:'Peace of mind for walks and travel as your puppy grows. A subscription is required for tracking, so check the plan first.',q:'Tractive GPS dog tracker',image:'/assets/collar.jpg',order:8},
 {slug:'orthopedic-memory-foam-dog-bed-washable',title:'Orthopedic Memory Foam Dog Bed with Washable Cover',category:'Sleep & Crate',short:'A supportive foam bed with a removable, washable cover.',why:'A comfy, easy-to-clean bed makes the crate or pen more inviting. Choose a size that fits your puppy\'s expected adult size.',q:'orthopedic memory foam dog bed washable cover',image:'/assets/night.jpg',order:9},
 {slug:'petmate-sky-kennel-travel-crate',title:'Petmate Sky Kennel Travel Crate',category:'Puppy Essentials',short:'A hard-sided plastic kennel for car trips, vet visits and travel.',why:'A secure, enclosed crate helps for the car and vet. Check airline and size rules before you fly.',q:'Petmate Sky Kennel',image:'/assets/hero.jpg',order:10},
 {slug:'dog-car-seat-belt',title:'Dog Car Seat Belt (2 Pack)',category:'Puppy Essentials',short:'An adjustable seat belt tether that clips to a harness.',why:'A low-cost way to keep your puppy secured in the car. Use it with a harness, not a collar.',q:'dog car seat belt harness tether',image:'/assets/play.jpg',order:11}
];
for(const i of items){
  const o={merchant:'Amazon',hidden:false,slug:i.slug,title:i.title,category:i.category,short:i.short,why:i.why,url:q(i.q),cta:'See options on Amazon',image:i.image.replace('/picks/..',''),imageAlt:i.title,order:i.order};
  fs.writeFileSync(path.join(dir,i.slug+'.json'),JSON.stringify(o,null,2)+'\n');
}
console.log('ok',items.length);
