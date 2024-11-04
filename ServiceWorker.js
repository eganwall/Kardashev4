const cacheName = "DefaultCompany-kardashev_proto-1.0";
const contentToCache = [
<<<<<<< HEAD
    "Build/20241104_web.loader.js",
    "Build/20241104_web.framework.js.unityweb",
    "Build/20241104_web.data.unityweb",
    "Build/20241104_web.wasm.unityweb",
=======
    "Build/20240830_web.loader.js",
    "Build/20240830_web.framework.js.unityweb",
    "Build/20240830_web.data.unityweb",
    "Build/20240830_web.wasm.unityweb",
>>>>>>> 267474499685c61c758f15f97404112ad587d982
    "TemplateData/style.css"

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
      let response = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) { return response; }

      response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
});
