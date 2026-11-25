/* Tisbury PD officer app - version 20261124f. Change VERSION whenever you upload new files. */
const VERSION='20261124f',C='pd-officer-'+VERSION,SHELL=["./", "icon-192.png", "icon-512.png", "icon-maskable-192.png", "icon-maskable-512.png", "index.html", "manifest.webmanifest", "vendor/pdf-lib.min.js", "vendor/pdf.min.mjs", "vendor/pdf.worker.min.mjs"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x.startsWith('pd-officer-')).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const page=r=>r.mode==='navigate'||/\/$|\.html$/.test(new URL(r.url).pathname);
self.addEventListener('fetch',e=>{const r=e.request;if(r.method==='GET'&&/^(cdn\.jsdelivr\.net|tessdata\.projectnaptha\.com|unpkg\.com)$/.test(new URL(r.url).hostname)){e.respondWith(caches.open('pd-ocr').then(async c=>(await c.match(r))||fetch(r).then(n=>{if(n.ok)c.put(r,n.clone());return n})));return}if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
 if(page(r)){e.respondWith((async()=>{const c=await caches.open(C);try{const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),5000);
  const n=await fetch(r,{signal:ctl.signal,cache:'no-cache'});clearTimeout(t);if(n.ok)c.put(r,n.clone());return n}
  catch(x){return(await c.match(r,{ignoreSearch:true}))||(await c.match('index.html'))||Response.error()}})());return}
 e.respondWith(caches.open(C).then(async c=>(await c.match(r,{ignoreSearch:true}))||fetch(r).then(n=>{if(n.ok)c.put(r,n.clone());return n})))});

/* Recent forms are kept 24 hours. Delete expired ones whenever this worker runs,
   including periodic background checks, so they don't wait for the app to be opened. */
const RECENT_MS=24*3600*1000;
function purgeDb(name,store){return new Promise(done=>{try{const q=indexedDB.open(name,1);
 q.onupgradeneeded=()=>q.result.createObjectStore(store,{keyPath:'id'});
 q.onerror=()=>done();q.onsuccess=()=>{const d=q.result;try{const t=d.transaction(store,'readwrite'),s=t.objectStore(store),now=Date.now();
  s.openCursor().onsuccess=ev=>{const c=ev.target.result;if(!c)return;if(!c.value||now-c.value.ts>=RECENT_MS)c.delete();c.continue()};
  t.oncomplete=t.onerror=t.onabort=()=>{d.close();done()}}catch(x){d.close();done()}}}catch(x){done()}})}
const purgeRecent=()=>Promise.all([purgeDb('pd_recent_officer','f'),purgeDb('pd_drafts_officer','d')]);
let lastPurge=0;
self.addEventListener('activate',e=>e.waitUntil(purgeRecent()));
self.addEventListener('periodicsync',e=>{if(e.tag==='purge-recent')e.waitUntil(purgeRecent())});
self.addEventListener('fetch',e=>{if(e.request.mode==='navigate'&&Date.now()-lastPurge>60000){lastPurge=Date.now();e.waitUntil(purgeRecent())}});
