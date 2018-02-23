window.service = window.service || {};
service.userSettings = (function() {
    return {
        getUserSettings: getUserSettings,
		toggleUserSettings: toggleUserSettings
    };

	function toggleUserSettings(key, value, body) {
		return httpInstnace.put("/api/userSettings?key=" + key + "&value=" + value, body).then(function (res) {
			return res.data;
		});
	}

    function getUserSettings() {
        return httpInstnace.get("/api/userSettings").then(function(res){
            return res.data;
        });
    }
})();