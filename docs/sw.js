/* Offline-Hülle für die Asienreise-App. Fremde Kacheln und Fotos werden nicht gespeichert. */
const V='asien27-2726fac0bc';
const SHELL=['./','index.html','leaflet.js','fonts.css','manifest.webmanifest','icon-192.png','icon-512.png','icon-180.png','3y9K6as8bTXq_nANBjzKo3IeZx8z6up5BeSl9D4dj_x9PpZBMlGGInHWVyNJtvI.woff2','3y9K6as8bTXq_nANBjzKo3IeZx8z6up5BeSl9D4dj_x9PpZBMlGHInHWVyNJtvI.woff2','3y9K6as8bTXq_nANBjzKo3IeZx8z6up5BeSl9D4dj_x9PpZBMlGIInHWVyNJ.woff2','_Xms-HUzqDCFdgfMm4S9DaRvzig.woff2','_Xms-HUzqDCFdgfMm4q9DaRvziissg.woff2','aFTR7PB1QTsUX8KYvumzEY2tbYf-Vlh3uA.woff2','aFTR7PB1QTsUX8KYvumzEYOtbYf-Vlg.woff2','aFTU7PB1QTsUX8KYthSQBK6PYK3EXw.woff2','aFTU7PB1QTsUX8KYthqQBK6PYK0.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('asien27-')&&k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin)return;
  const isPage=r.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('index.html');
  if(isPage){
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put('index.html',c));return res}).catch(()=>caches.match('index.html').then(m=>m||caches.match('./'))));
    return;
  }
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(V).then(x=>x.put(r,c))}return res})));
});
