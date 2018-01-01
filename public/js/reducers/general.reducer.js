window.reducer = window.reducer || {};
reducer.general = function() {
    var SET_LOADING = action.general.SET_LOADING,
        REMOVE_LOADING = action.general.REMOVE_LOADING,
        OPEN_TILE_DIALOG = action.general.OPEN_TILE_DIALOG,
        CLOSE_TILE_DIALOG = action.general.CLOSE_TILE_DIALOG,
        TOGGLE_MAIN_MENU = action.general.TOGGLE_MAIN_MENU,
        TOGGLE_MENU_GROUPS = action.general.TOGGLE_MENU_GROUPS,
        CLOSE_ALL_MENUS = action.general.CLOSE_ALL_MENUS;

    var initialState = {
        isLoading: false,
        isShowTileDialog: false,
        isMainMenuOpen: false,
        isMenuGroupsOpen: false
    };

    return function general(state, action){
        if (state === undefined) {
            state = initialState;
        }

        switch (action.type) {
            case CLOSE_ALL_MENUS:
                return Object.assign({}, state, {isMainMenuOpen: false, isMenuGroupsOpen: false});
            case TOGGLE_MAIN_MENU:
                return Object.assign({}, state, {isMainMenuOpen: !state.isMainMenuOpen, isMenuGroupsOpen: false});
            case TOGGLE_MENU_GROUPS:
                return Object.assign({}, state, {isMenuGroupsOpen: !state.isMenuGroupsOpen, isMainMenuOpen: false});
            case SET_LOADING:
                return Object.assign({}, state, {isLoading: true});
            case REMOVE_LOADING:
                return Object.assign({}, state, {isLoading: false});
            case OPEN_TILE_DIALOG:
                return Object.assign({}, state, {isShowTileDialog: true, tileDailogComponentName: action.componentName, tileDialogComponentProps: action.componentProps});
            case CLOSE_TILE_DIALOG:
                return Object.assign({}, state, {isShowTileDialog: false, tileDailogComponentName: null, tileDialogComponentProps: null});
            default:
                return state
        }
    }
}