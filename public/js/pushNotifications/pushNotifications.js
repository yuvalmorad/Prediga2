var pushNotifications = (function(){
    var publicKey = "BI75psBX1HkM6jpcXdEYKNV41ZZdzQU_pJf7sS_1V6r3mE-83ptsqjZ7pIVT9sfHc4ThRgc_YAnaS3XSE-igB98";
    var STATUS_GRANTED = "granted";

    function init() {
        //#1 register service worker
        registerServiceWorker();
    }

    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                }, function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                });
            });
        }
    }

    //should be called once per user (also per device ?)
    function askPermissionAndPersistPushSubscriptionIfNeeded() {
        //don't ask for permission if there is already granted permission
        if (Notification.permission === STATUS_GRANTED) {
            return Promise.resolve();
        }

        //#2 ask permission from user
        return askPermission().then(function(){
            //permission accepted
            //#3 subscribe user to get pushSubscription object
            return subscribeUserToPush().then(function(pushSubscription){
                //#4 send pushSubscription to server in order to persist it
                return service.pushSubscription.addPushSubscription(pushSubscription);
            })
        });

    }

    function askPermission() {
        return new Promise(function(resolve, reject) {
                var permissionResult = Notification.requestPermission(function(result) {
                    resolve(result);
                });

                if (permissionResult) {
                    permissionResult.then(resolve, reject);
                }
            })
            .then(function(permissionResult) {
                console.log(permissionResult);
                if (permissionResult !== STATUS_GRANTED) {
                    throw new Error('We weren\'t granted permission.');
                }
            });
    }

    function subscribeUserToPush() {
        return navigator.serviceWorker.register('sw.js')
            .then(function(registration) {
                var subscribeOptions = {
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(
                        publicKey
                    )
                };

                return registration.pushManager.subscribe(subscribeOptions);
            })
            .then(function(pushSubscription) {
                //pushSubscription.endpoint (to send by server)
                //pushSubscription.keys     (to values used to encrypt message)
                console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
                return pushSubscription;
            });
    }

    function urlBase64ToUint8Array(base64String) {
        var padding = '='.repeat((4 - base64String.length % 4) % 4);
        var base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        var rawData = window.atob(base64);
        var outputArray = new Uint8Array(rawData.length);

        for (var i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    return {
        init: init,
        askPermissionAndPersistPushSubscriptionIfNeeded: askPermissionAndPersistPushSubscriptionIfNeeded
    };

})();