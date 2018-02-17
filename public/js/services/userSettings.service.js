window.service = window.service || {};
service.userSettings = (function() {
    return {
        enablePush: enablePush,
        disablePush: disablePush,
        getUserSettings: getUserSettings
    };

    function enablePush(pushSubscription) {
        return httpInstnace.post("/api/userSettings/enablePush", {pushSubscription: pushSubscription}).then(function(res){
            return res.data;
        });
    }

    function disablePush() {
        return httpInstnace.post("/api/userSettings/disablePush").then(function(res){
            return res.data;
        });
    }

    function getUserSettings() {
        return httpInstnace.get("/api/userSettings").then(function(res){
            return res.data;
        });
    }
})();