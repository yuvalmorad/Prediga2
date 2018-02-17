window.action = window.action || {};
action.userSettings = (function () {
    var userSettingsAction = {
        LOAD_USER_SETTINGS: "LOAD_USER_SETTINGS",
        load: load,

        enablePush: enablePush,
        disablePush: disablePush
    };

    function enablePush(pushSubscription) {
        return function(dispatch){
            service.userSettings.enablePush(pushSubscription).then(function(userSettings){
                dispatch({type: userSettingsAction.LOAD_USER_SETTINGS, userSettings: userSettings});
            });
        };
    }

    function disablePush() {
        return function(dispatch){
            service.userSettings.disablePush().then(function(userSettings){
                dispatch({type: userSettingsAction.LOAD_USER_SETTINGS, userSettings: userSettings});
            });
        };
    }

    function load() {
        return function(dispatch){
            service.userSettings.getUserSettings().then(function(userSettings){
                dispatch({type: userSettingsAction.LOAD_USER_SETTINGS, userSettings: userSettings});
                utils.init.onApplicationAuthenticated(userSettings);
            }, function(error){

            })
        };
    }

    return userSettingsAction;
})();