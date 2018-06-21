window.utils = window.utils || {};
utils.localStorage = (function(){
    var KEYS = {
        FAVOURITE_USERS_IDS: "FAVOURITE_USERS_IDS"
    };

    function persist(item, key) {
        localStorage.setItem(key, JSON.stringify(item));
    }

    function get(key) {
		var itemStr = localStorage.getItem(key);

		if (itemStr) {
		    return JSON.parse(itemStr);
        }
    }

    return {
        getFavouriteUsersIds: function() {
            return get(KEYS.FAVOURITE_USERS_IDS) || [];
        },
		setFavouriteUsersIds: function(favouriteUsersIds) {
			persist(favouriteUsersIds, KEYS.FAVOURITE_USERS_IDS);
        }
    };
})();