action.general = (function(){

    var general = {
        SET_LOADING: "SET_LOADING",
        REMOVE_LOADING: "REMOVE_LOADING",

        SET_UPDATING: "SET_UPDATING",
        REMOVE_UPDATING: "REMOVE_UPDATING",

        OPEN_TILE_DIALOG: "OPEN_TILE_DIALOG",
        CLOSE_TILE_DIALOG: "CLOSE_TILE_DIALOG",

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

        setUpdating: function() {
            return {
                type: general.SET_UPDATING
            }
        },

        removeUpdating: function() {
            return {
                type: general.REMOVE_UPDATING
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