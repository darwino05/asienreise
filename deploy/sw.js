/* Offline-Hülle für die Asienreise-App.
   Eigene Dateien: kommen aus dem Cache, wenn kein Netz da ist.
   Fotos (Wikimedia) und Kartenkacheln (Esri): werden beim Ansehen gemerkt und bleiben beim App-Update erhalten. */
const V='asien27-1b0282ad29';
const IMG='asienmedia-img',TILES='asienmedia-tiles',MAX={[IMG]:500,[TILES]:700};
const SHELL=['./','index.html','leaflet.js','fonts.css','manifest.webmanifest','icon-192.png','icon-512.png','icon-180.png','3y9K6as8bTXq_nANBjzKo3IeZx8z6up5BeSl9D4dj_x9PpZBMlGGInHWVyNJtvI.woff2','3y9K6as8bTXq_nANBjzKo3IeZx8z6up5BeSl9D4dj_x9PpZBMlGHInHWVyNJtvI.woff2','3y9K6as8bTXq_nANBjzKo3IeZx8z6up5BeSl9D4dj_x9PpZBMlGIInHWVyNJ.woff2','_Xms-HUzqDCFdgfMm4S9DaRvzig.woff2','_Xms-HUzqDCFdgfMm4q9DaRvziissg.woff2','aFTR7PB1QTsUX8KYvumzEY2tbYf-Vlh3uA.woff2','aFTR7PB1QTsUX8KYvumzEYOtbYf-Vlg.woff2','aFTU7PB1QTsUX8KYthSQBK6PYK3EXw.woff2','aFTU7PB1QTsUX8KYthqQBK6PYK0.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('asien27-')&&k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
const kindOf=h=>/(^|\.)wikimedia\.org$/.test(h)?IMG:/(^|\.)arcgisonline\.com$/.test(h)?TILES:null;
async function trim(c,name){const ks=await c.keys(),m=MAX[name];if(ks.length>m)await Promise.all(ks.slice(0,ks.length-m).map(k=>c.delete(k)))}
async function media(r,name){
  const c=await caches.open(name),hit=await c.match(r.url);
  if(hit)return hit;
  try{
    /* mit CORS laden, damit die Antwort ihre echte Größe hat (sonst zählt jede Datei ca. 7 MB im Speicher) */
    const res=await fetch(r.url,{mode:'cors',credentials:'omit'});
    if(res.ok){await c.put(r.url,res.clone());trim(c,name)}
    return res;
  }catch(err){return Response.error()}
}
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET')return;
  if(u.origin!==location.origin){const k=kindOf(u.hostname);if(k)e.respondWith(media(r,k));return}
  const isPage=r.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('index.html');
  if(isPage){
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put('index.html',c));return res}).catch(()=>caches.match('index.html').then(m=>m||caches.match('./'))));
    return;
  }
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(V).then(x=>x.put(r,c))}return res})));
});
