window.utils = window.utils || {};
utils.userSettings = (function(){
    var KEYS = {
        PUSH_NOTIFICATION: "PUSH_NOTIFICATION",
        RANDOM_ALL: "RANDOM_ALL",
        COPY_ALL_GROUPS: "COPY_ALL_GROUPS"
    };

	var VALUES = {
		TRUE: "true",
		FALSE: "false"
	};

    return {
		KEYS: KEYS,
		VALUES: VALUES,
		isUserSettingsEnabled: isUserSettingsEnabled,
		isUserSettingsHasValue: isUserSettingsHasValue
    };

    function isEnabled(userSettings, key) {
        var setting = utils.general.findItemInArrBy(userSettings, "key", key);
        if (setting) {
            return setting.value === VALUES.TRUE;
        } else {
            return false;
        }
    }

    function hasValue(userSettings, key) {
        var setting = utils.general.findItemInArrBy(userSettings, "key", key);
        return !!setting;
    }

    function isUserSettingsEnabled(userSettings, key) {
        return isEnabled(userSettings, key);
    }

    function isUserSettingsHasValue(userSettings, key) {
        return hasValue(userSettings, key);
    }
})();