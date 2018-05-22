var cacheList = [
    "images/sprites/champions_teams.png",
    "images/sprites/england_teams.png",
    "images/sprites/israel_teams.png",
    "images/sprites/spain_teams.png",
    "images/sprites/world_cup_teams.png",
    "images/football-stadium-small.png",
    "images/prediga_logo_transparent.png",
    "images/badge1.png",
    "images/badge2.png",
    "images/teamCategories/questions.png",
    "images/iconsMessage/emoji.png",
    "images/iconsMessage/flags.png",
    "images/iconsMessage/misc.png",
    "images/iconsMessage/sport.png",
    "fonts/prediga-groups.woff2",
    "fonts/prediga-groups.woff",
    "fonts/prediga.woff2",
    "fonts/prediga.woff"
];

var cacheName = "prediga_v2";

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(cacheList);
        }).then(function() {
            return self.skipWaiting();
        })
    );
});

self.addEventListener('activate', function(event) {
    //delete old cache version
    event.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(
                keys.map(function(key){
                    if (cacheName !== key) {
                        console.log("deleting cache: " + key );
                        return caches.delete(key);
                    }
                })
            )
        })
    );

    return self.clients.claim();
});

self.addEventListener('fetch', function(event){
    var request = event.request;
    var url = request.url;

    if (url.indexOf("/images/") >= 0 || url.indexOf("/fonts/") >= 0) {
        //image or font
        event.respondWith(
            caches.match(event.request).then(function(response) {
                // return from cache, otherwise fetch from network
                return response || fetch(request);
            })
        );
    }
});

//push from server
self.addEventListener('push', function(event) {
    console.log("push!!!", event);
    displayNotification(event);
});

function displayNotification(event) {
    if (Notification.permission == 'granted') {

        var text = event.data.text();
        var url = "/";

        try {
            var pushObj = JSON.parse(text);
            url = pushObj.url || "/";
            text = pushObj.text;
        } catch (e) {
            //old implementation in server - plain text
        }

        var options = {
            body: text,
            icon: './images/prediga192.png',
            badge: './images/prediga128.png',
            data: {
                url: url
            }
        };

        var title = 'Prediga';
        event.waitUntil(
            self.registration.showNotification(title, options)
        );
    }
}

//our notification clicked
self.addEventListener('notificationclick', function(event) {
    console.log("on notificationclick!!!");
    var clickedNotification = event.notification;
    clickedNotification.close();
    openWindowOrFocus(event);
});

function openWindowOrFocus(event) {
    var baseUrl = self.location.origin;
    var data = event.notification.data;
    var urlToOpen = data.url;

    var promiseChain = clients.matchAll({
       type: 'window'
    }).then(function(windowClients){
        var matchingClient = null;

        for (var i = 0; i < windowClients.length; i++) {
            var windowClient = windowClients[i];
            if (windowClient.url.indexOf(baseUrl >= 0)) {
                matchingClient = windowClient;
                break;
            }
        }

        if (matchingClient) {
            return matchingClient.focus().then(function(windowMatch){
                return windowMatch.navigate(urlToOpen);
            });
        } else {
            return clients.openWindow(baseUrl + urlToOpen);
        }
    });

   event.waitUntil(promiseChain);
}