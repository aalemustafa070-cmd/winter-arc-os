const CACHE='winter-arc-v39';
const ASSETS=['./','./index.html','./manifest.json','./icon.svg'];

self.addEventListener('install',e=>e.waitUntil(
  caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())
));

self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(keys=>Promise.all(
    keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))
  )).then(()=>self.clients.claim())
));

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const url=new URL(e.request.url);

  // Always prefer the newest HTML so an old cached app cannot hide a new deployment.
  if(e.request.mode==='navigate' || url.pathname.endsWith('/index.html')){
    e.respondWith(
      fetch(e.request).then(r=>{
        const copy=r.clone();
        caches.open(CACHE).then(c=>c.put('./index.html',copy));
        return r;
      }).catch(()=>caches.match('./index.html'))
    );
    return;
  }

  e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{
    const copy=r.clone();
    caches.open(CACHE).then(x=>x.put(e.request,copy));
    return r;
  }).catch(()=>caches.match('./index.html'))));
});
