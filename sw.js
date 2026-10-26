/* Tisbury PD officer app - version adf26a3092. Change VERSION whenever you upload new files. */
const VERSION='adf26a3092',C='pd-officer-'+VERSION,SHELL=["./", "icon-192.png", "icon-512.png", "index.html", "manifest.webmanifest", "vendor/pdf-lib.min.js", "vendor/pdf.min.mjs", "vendor/pdf.worker.min.mjs"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x.startsWith('pd-officer-')).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const page=r=>r.mode==='navigate'||/\/$|\.html$/.test(new URL(r.url).pathname);
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
 if(page(r)){e.respondWith((async()=>{const c=await caches.open(C);try{const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),5000);
  const n=await fetch(r,{signal:ctl.signal,cache:'no-cache'});clearTimeout(t);if(n.ok)c.put(r,n.clone());return n}
  catch(x){return(await c.match(r,{ignoreSearch:true}))||(await c.match('index.html'))||Response.error()}})());return}
 e.respondWith(caches.open(C).then(async c=>(await c.match(r,{ignoreSearch:true}))||fetch(r).then(n=>{if(n.ok)c.put(r,n.clone());return n})))});
