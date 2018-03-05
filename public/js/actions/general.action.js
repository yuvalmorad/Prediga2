window.action = window.action || {};
action.general = (function(){
    var general = {
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

        openTileDialog: function(componentName, componentProps) {
            routerHistory.push("#dialogOpen");
            return {
                type: general.OPEN_TILE_DIALOG,
                componentName: componentName,
                componentProps: componentProps
            }
        },

        closeTileDialog: function() {
            routerHistory.goBack();
        },

        closeTileDialogAction: function() {
            return {
                type: general.CLOSE_TILE_DIALOG
            }
        }
    };

    return general;
})();