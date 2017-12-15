reducer.general = (function() {
    var SET_LOADING = action.general.SET_LOADING,
        REMOVE_LOADING = action.general.REMOVE_LOADING,
        OPEN_TILE_DIALOG = action.general.OPEN_TILE_DIALOG,
        CLOSE_TILE_DIALOG = action.general.CLOSE_TILE_DIALOG,
        TOGGLE_MENU = action.general.TOGGLE_MENU;

    var initialState = {
        isLoading: false,
        isShowTileDialog: false,
        isMenuOpen: false
    };

    return function general(state, action){
        if (state === undefined) {
            state = initialState;
        }

        switch (action.type) {
            case TOGGLE_MENU:
                return Object.assign({}, state, {isMenuOpen: !state.isMenuOpen});
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
})();