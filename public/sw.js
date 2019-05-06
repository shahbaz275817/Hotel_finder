var CACHE_STATIC_NAME = 'static-v23';
var CACHE_DYNAMIC_NAME = 'dynamic-v23';
var STATIC_FILES = [
    '/',
    '/javascripts/main.js',
    '/javascripts/recoms.js',
    '/stylesheets/style.css',
    '/offline',
    '/offlineinfo',
    'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js'
];



self.addEventListener('install', function (event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function (cache) {
        console.log('[Service Worker] Precaching App Shell');
        cache.addAll(STATIC_FILES);
      })
  )
});

self.addEventListener('activate', function (event) {
    console.log('[Service Worker] Activating Service Worker ....', event);
    event.waitUntil(
        caches.keys()
            .then(function (keyList) {
                return Promise.all(keyList.map(function (key) {
                    if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
                        console.log('[Service Worker] Removing old cache.', key);
                        return caches.delete(key);
                    }
                }));
            })
    );
    return self.clients.claim();
});
  
self.addEventListener('fetch',(event)=>{
   // this approach causing no internet connection for a sec
    /* event.respondWith(
        fetch(event.request)
            .then(function(res) {
                return caches.open(CACHE_DYNAMIC_NAME)
                    .then(function(cache) {
                        cache.put(event.request.url, res.clone());
                        return res;
                    })
            })
            .catch(function(err) {
                return caches.match(event.request)
                    .catch(err=>{
                        return cache.match('/offline')
                    });
            })
    );*/
    event.respondWith(
        // Try the cache
        caches.match(event.request).then(function(res) {
            if (res) {
                return caches.open(CACHE_DYNAMIC_NAME)
                    .then(function(cache) {
                        cache.put(event.request.url, res.clone());
                        return res;
                    });

            }
            return fetch(event.request).then(function(response) {
                return response
            });
        }).catch(function() {
            // If both fail, show a generic fallback:
            return caches.match('/offline');
        })
    );
   /* event.respondWith(event.respondWith(
        caches.match(event.request)
            .then((response)=>{
                if(response)
                    return response;
                else
                    return fetch(event.request)
                        .then(res=>{
                            caches.open(CACHE_DYNAMIC_NAME)
                                .then((cache)=>{
                                    cache.put(event.request.url,res.clone());
                                    return res;
                                })
                        })
                        .catch(err=>{
                            return caches.open(CACHE_STATIC_NAME)
                                .then(cache=>{
                                    return cache.match('/offline')
                                })
                        });
            })
    ));*/
});

