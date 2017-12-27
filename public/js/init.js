window.re = React.createElement;
window.routerHistory = History.createBrowserHistory();

var store;
var component = {};
var reducer = {};
var action = {};
var service = {};
var utils = {};
var models = {};

var httpInstnace = axios.create({
    baseURL: '/',
    timeout: 5000
});

/*
var publicKey = "BI75psBX1HkM6jpcXdEYKNV41ZZdzQU_pJf7sS_1V6r3mE-83ptsqjZ7pIVT9sfHc4ThRgc_YAnaS3XSE-igB98";

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/')
    ;
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

//#1 register service worker

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

//#2 ask permission from user

function askPermission() {
    return new Promise(function(resolve, reject) {
            const permissionResult = Notification.requestPermission(function(result) {
                resolve(result);
            });

            if (permissionResult) {
                permissionResult.then(resolve, reject);
            }
        })
        .then(function(permissionResult) {
            console.log(permissionResult);
            if (permissionResult !== 'granted') {
                throw new Error('We weren\'t granted permission.');
            }
        });
}

//#3 subscribe user to get pushSubscription object and send to server

function subscribeUserToPush() {
    return navigator.serviceWorker.register('sw.js')
        .then(function(registration) {
            const subscribeOptions = {
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
}*/

