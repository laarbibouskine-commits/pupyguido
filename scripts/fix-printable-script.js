const fs = require('fs');
const f = require('path').join(__dirname, '..', 'build', 'build.js');
let b = fs.readFileSync(f, 'utf8');
const bad = "ctaBox.match(/<script>[sS]*?</script>/)[0]";
const good = "ctaBox.slice(ctaBox.indexOf('<script>'), ctaBox.indexOf('</script>') + 9)";
const n = b.split(bad).length - 1;
b = b.split(bad).join(good);
fs.writeFileSync(f, b);
console.log('replaced', n);
