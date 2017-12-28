self.addEventListener('install', function(event) {
    console.log("install");
});

self.addEventListener('activate', function(event) {
    console.log("activate");
});

//push from server
self.addEventListener('push', function(event) {
    console.log("push!!!", event);
    displayNotification(event);
    //event.data.text()
    //event.data.json() get as json
});

//our notification clicked
self.addEventListener('notificationclick', function(event) {
    console.log("on notificationclick!!!");
    var clickedNotification = event.notification;
    clickedNotification.close();
    openWindowOrFocus(event);
});

function displayNotification(event) {
    if (Notification.permission == 'granted') {
        var options = {
            body: event.data.text()
        };

        var title = 'Prediga';
        event.waitUntil(
            self.registration.showNotification(title, options)
        );
    }
}

function openWindowOrFocus(event) {
    var urlToOpen = self.location.origin;

    var promiseChain = clients.matchAll({
       type: 'window',
       includeUncontrolled: true
    }).then(function(windowClients){
        var matchingClient = null;

        for (var i = 0; i < windowClients.length; i++) {
            var windowClient = windowClients[i];
            if (windowClient.url.indexOf(urlToOpen >= 0)) {
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

   event.waitUntil(promiseChain);
}