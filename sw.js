/* Service worker voor de Jukebox — NETWERK EERST (altijd de nieuwste versie online),
   met de cache alleen als terugval wanneer je offline bent. */
const CACHE='jukebox-v3';
self.addEventListener('install', e=>{ self.skipWaiting(); });
self.addEventListener('activate', e=>{ e.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
})()); });
self.addEventListener('fetch', e=>{
  if(e.request.method!=='GET') return;
  e.respondWith((async()=>{
    try{
      const fresh = await fetch(e.request, {cache:'no-store'});
      try{ const c=await caches.open(CACHE); c.put(e.request, fresh.clone()); }catch(_){}
      return fresh;
    }catch(err){
      const cached = await caches.match(e.request);
      return cached || caches.match('./index.html');
    }
  })());
});
