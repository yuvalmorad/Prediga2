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