window.action = window.action || {};
action.userSettings = (function () {
    var userSettingsAction = {
        LOAD_USER_SETTINGS: "LOAD_USER_SETTINGS",
        load: load,
		toggleUserSettings: toggleUserSettings
    };

	function toggleUserSettings(key, value, body) {
		return function(dispatch){
			service.userSettings.toggleUserSettings(key, value, body).then(function(userSettings){
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