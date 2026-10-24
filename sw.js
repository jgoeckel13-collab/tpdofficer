const C='pd-officer-v3',SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','vendor/pdf-lib.min.js','vendor/pdf.min.mjs','vendor/pdf.worker.min.mjs'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x.startsWith('pd-officer-')).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
 e.respondWith(caches.open(C).then(async c=>{const hit=await c.match(r,{ignoreSearch:true});
  const net=fetch(r).then(n=>{if(n&&n.ok&&!n.redirected)c.put(r,n.clone());return n}).catch(()=>null);
  return hit||await net||(r.mode==='navigate'?await c.match('index.html'):Response.error())}))});
