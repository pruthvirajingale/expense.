const CACHE="expense-pro-v6";
const BASE=self.registration.scope;
const ASSETS=[BASE,new URL("index.html",BASE).href,new URL("manifest.webmanifest",BASE).href,new URL("icons/icon-192.png",BASE).href,new URL("icons/icon-512.png",BASE).href];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET")return;
 e.respondWith(caches.match(e.request).then(x=>x||fetch(e.request).then(r=>{let c=r.clone();caches.open(CACHE).then(k=>k.put(e.request,c));return r}).catch(()=>caches.match(new URL("index.html",BASE).href))));
});
