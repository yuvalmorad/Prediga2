window.utils = window.utils || {};
utils.userSettings = (function(){
    var KEYS = {
        PUSH_NOTIFICATION: "PUSH_NOTIFICATION"
    };

    return {
        isPushNotificationsEnabled: isPushNotificationsEnabled,
        isPushNotificationsHasValue: isPushNotificationsHasValue
    };

    function isEnabled(userSettings, key) {
        var setting = utils.general.findItemInArrBy(userSettings, "key", key);
        if (setting) {
            return setting.value === "true";
        } else {
            return false;
        }
    }

    function hasValue(userSettings, key) {
        var setting = utils.general.findItemInArrBy(userSettings, "key", key);
        return !!setting;
    }

    function isPushNotificationsEnabled(userSettings) {
        return isEnabled(userSettings, KEYS.PUSH_NOTIFICATION)
    }

    function isPushNotificationsHasValue(userSettings) {
        return hasValue(userSettings, KEYS.PUSH_NOTIFICATION)
    }
})();