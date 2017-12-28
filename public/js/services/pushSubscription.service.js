service.pushSubscription = (function() {
    return {
        addPushSubscription: addPushSubscription
    };

    function addPushSubscription(pushSubscription) {
        return httpInstnace.post("/api/pushSubscription", {pushSubscription: pushSubscription});
    }
})();