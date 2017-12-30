action.general = (function(){

    var general = {
        SET_LOADING: "SET_LOADING",
        REMOVE_LOADING: "REMOVE_LOADING",

        OPEN_TILE_DIALOG: "OPEN_TILE_DIALOG",
        CLOSE_TILE_DIALOG: "CLOSE_TILE_DIALOG",

        TOGGLE_MENU: "TOGGLE_MENU",
        TOGGLE_MENU_GROUPS: "TOGGLE_MENU_GROUPS",

        toggleMenu: function() {
            return {
                type: general.TOGGLE_MENU
            }
        },

        toggleMenuGroups: function() {
            return {
                type: general.TOGGLE_MENU_GROUPS
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