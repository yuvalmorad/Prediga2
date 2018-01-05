window.action = window.action || {};
action.general = (function(){
    var general = {
        SET_LOADING: "SET_LOADING",
        REMOVE_LOADING: "REMOVE_LOADING",

        OPEN_TILE_DIALOG: "OPEN_TILE_DIALOG",
        CLOSE_TILE_DIALOG: "CLOSE_TILE_DIALOG",

        TOGGLE_MAIN_MENU: "TOGGLE_MAIN_MENU",
        CLOSE_ALL_MENUS: "CLOSE_ALL_MENUS",

        SET_SITE_HEADER_TITLE: "SET_SITE_HEADER_TITLE",

        FIRE_SITE_HEADER_EVENT: "FIRE_SITE_HEADER_EVENT",
        RESET_SITE_HEADER_EVENT: "RESET_SITE_HEADER_EVENT",

        resetSiteHeaderEvent: function () {
            return {
                type: general.RESET_SITE_HEADER_EVENT
            }
        },

        fireSiteHeaderEvent: function(eventName) {
            return {
                type: general.FIRE_SITE_HEADER_EVENT,
                eventName: eventName
            }
        },

        setSiteHeaderTitle: function(title) {
            return {
                type: general.SET_SITE_HEADER_TITLE,
                title: title
            }
        },

        closeAllMenus: function() {
            return {
                type: general.CLOSE_ALL_MENUS
            }
        },

        toggleMainMenu: function() {
            return {
                type: general.TOGGLE_MAIN_MENU
            }
        },

        setLoading: function() {
            return {
                type: general.SET_LOADING
            }
        },

        removeLoading: function() {
            return {
                type: general.REMOVE_LOADING
            }
        },

        openTileDialog: function(componentName, componentProps) {
            return {
                type: general.OPEN_TILE_DIALOG,
                componentName: componentName,
                componentProps: componentProps
            }
        },

        closeTileDialog: function() {
            return {
                type: general.CLOSE_TILE_DIALOG
            }
        }
    };

    return general;
})();