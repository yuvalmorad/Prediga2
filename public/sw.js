var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
    '/'
];

self.addEventListener('install', function(event) {
    console.log("install");
    // Perform install steps
    /*event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );*/

    /* self.addEventListener('fetch', function(event) {
       console.log("fetch");
        event.respondWith(
            caches.match(event.request)
                .then(function(response) {
                        // Cache hit - return response
                        if (response) {
                            return response;
                        }
                        return fetch(event.request);
                    }
                )
        );
    });*/

    self.addEventListener('activate', function(event) {
        console.log("activate");
    });

    self.addEventListener('push', function(event) {
        console.log("push!!!", event)
    });
});