window.reducer = window.reducer || {};
reducer.general = function() {
    var OPEN_TILE_DIALOG = action.general.OPEN_TILE_DIALOG,
        CLOSE_TILE_DIALOG = action.general.CLOSE_TILE_DIALOG,
        TOGGLE_MAIN_MENU = action.general.TOGGLE_MAIN_MENU,
        CLOSE_ALL_MENUS = action.general.CLOSE_ALL_MENUS,
        SET_SITE_HEADER_TITLE = action.general.SET_SITE_HEADER_TITLE,
        FIRE_SITE_HEADER_EVENT = action.general.FIRE_SITE_HEADER_EVENT,
        RESET_SITE_HEADER_EVENT = action.general.RESET_SITE_HEADER_EVENT;


    var initialState = {
        isShowTileDialog: false,
        isMainMenuOpen: false,
        siteHeaderTitle: "",
        siteHeaderFiredEvent: ""
    };

    return function general(state, action){
        if (state === undefined) {
            state = initialState;
        }

        switch (action.type) {
            case CLOSE_ALL_MENUS:
                return Object.assign({}, state, {isMainMenuOpen: false});
            case TOGGLE_MAIN_MENU:
                return Object.assign({}, state, {isMainMenuOpen: !state.isMainMenuOpen});
            case OPEN_TILE_DIALOG:
                return Object.assign({}, state, {isShowTileDialog: true, tileDailogComponentName: action.componentName, tileDialogComponentProps: action.componentProps});
            case CLOSE_TILE_DIALOG:
                return Object.assign({}, state, {isShowTileDialog: false, tileDailogComponentName: null, tileDialogComponentProps: null});
            case SET_SITE_HEADER_TITLE:
                return Object.assign({}, state, {siteHeaderTitle: action.title});
            case FIRE_SITE_HEADER_EVENT:
                return Object.assign({}, state, {siteHeaderFiredEvent: action.eventName});
            case RESET_SITE_HEADER_EVENT:
                return Object.assign({}, state, {siteHeaderFiredEvent: ""});
            default:
                return state
        }
    };
}