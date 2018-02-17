window.utils = window.utils || {};
utils.init = (function(){
    return {
        onApplicationAuthenticated: onApplicationAuthenticated
    };

    function onApplicationAuthenticated(userSettings) {
        socket.init();
        pushNotifications.init(userSettings);
        pushNotifications.askPermissionAndPersistPushSubscriptionIfNeeded(true);
    }
})();