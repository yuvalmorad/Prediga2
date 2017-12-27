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

    //push from server
    self.addEventListener('push', function(event) {
        console.log("push!!!", event)
        //event.data.text()
        //event.data.json() get as json

        // const promiseChain = self.registration.showNotification('Hello, World.');
        //or
        /*showNotification(title, {
            body: message
        });*/

        // event.waitUntil(promiseChain);
    });

    //our notification clicked
    self.addEventListener('notificationclick', function(event) {
        /*const clickedNotification = event.notification;
        clickedNotification.close();

        // Do something as the result of the notification click
        const promiseChain = doSomething();
        event.waitUntil(promiseChain);*/

        //event.action is if the user clicked on an action inside the notification


        //open the application / window

        /*const examplePage = '/demos/notification-examples/example-page.html';
        const promiseChain = clients.openWindow(examplePage);
        event.waitUntil(promiseChain);*/
    });

    //logic for open window only if it is not already open:

   /* const urlToOpen = new URL(examplePage, self.location.origin).href;

    const promiseChain = clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    })
        .then((windowClients) => {
            let matchingClient = null;

            for (let i = 0; i < windowClients.length; i++) {
                const windowClient = windowClients[i];
                if (windowClient.url === urlToOpen) {
                    matchingClient = windowClient;
                    break;
                }
            }

            if (matchingClient) {
                return matchingClient.focus();
            } else {
                return clients.openWindow(urlToOpen);
            }
        });

    event.waitUntil(promiseChain);*/
});