utils.init = (function(){
    return {
        onApplicationAuthenticated: onApplicationAuthenticated
    };

    function onApplicationAuthenticated() {
        socket.init();
        pushNotifications.init();
        pushNotifications.askPermissionAndPersistPushSubscriptionIfNeeded(); //TODO move to other place (maybe a checkbox should trigger this)
    }
})();