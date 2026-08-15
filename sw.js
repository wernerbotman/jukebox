/* Kleine service worker voor de Jukebox — laadt de app ook offline. */
const CACHE='jukebox-v1';
self.addEventListener('install',e=>{ self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html'])).catch(()=>{})); });
self.addEventListener('activate',e=>{ e.waitUntil((async()=>{
  const keys=await caches.keys(); await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
})()); });
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  if(e.request.mode==='navigate'){ e.respondWith(fetch(e.request).catch(()=>caches.match('./index.html'))); return; }
  e.respondWith(caches.match(e.request).then(r=>r|| fetch(e.request).then(resp=>{
    try{ const cp=resp.clone(); caches.open(CACHE).then(c=>c.put(e.request,cp)); }catch(_){} return resp;
  })).catch(()=>caches.match('./index.html')));
});
