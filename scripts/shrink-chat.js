const fs=require('fs'),p=require('path').join(__dirname,'..','site','chat.js');
let s=fs.readFileSync(p,'utf8');
s=s.replace("right:16px;bottom:16px;z-index:9998;display:flex;align-items:center;gap:8px;background:#F6C431;color:#0B1F44;border:0;border-radius:999px;padding:11px 16px;font:800 14px/1 \"Segoe UI\",Arial,sans-serif;cursor:pointer;box-shadow:0 8px 22px rgba(11,31,68,.3)}",
 "right:14px;bottom:14px;z-index:9998;display:flex;align-items:center;justify-content:center;width:46px;height:46px;background:#F6C431;color:#0B1F44;border:0;border-radius:50%;padding:0;cursor:pointer;box-shadow:0 4px 14px rgba(11,31,68,.28)}");
s=s.replace("#pgc-btn svg{width:20px;height:20px}","#pgc-btn svg{width:22px;height:22px}#pgc-btn span{display:none}");
s=s.replace("right:16px;bottom:72px;z-index:9999;width:340px","right:14px;bottom:68px;z-index:9999;width:320px");
s=s.replace("height:460px;max-height:calc(100vh - 100px)","height:420px;max-height:calc(100vh - 90px)");
s=s.replace("btn.setAttribute('aria-label', 'Ask PuppyGuido a puppy question');","btn.setAttribute('aria-label', 'Ask PuppyGuido a puppy question'); btn.title = 'Ask a puppy question';");
fs.writeFileSync(p,s);
