reducer.general = (function() {
    var SET_LOADING = action.general.SET_LOADING,
        REMOVE_LOADING = action.general.REMOVE_LOADING,
        SET_UPDATING = action.general.SET_UPDATING,
        REMOVE_UPDATING = action.general.REMOVE_UPDATING,
        OPEN_TILE_DIALOG = action.general.OPEN_TILE_DIALOG,
        CLOSE_TILE_DIALOG = action.general.CLOSE_TILE_DIALOG;

    var initialState = {
        isLoading: false,
        isUpdating: false,
        isShowTileDialog: false
    };

    return function general(state, action){
        if (state === undefined) {
            state = initialState;
        }

        switch (action.type) {
            case SET_LOADING:
                return Object.assign({}, state, {isLoading: true});
            case REMOVE_LOADING:
                return Object.assign({}, state, {isLoading: false});
            case SET_UPDATING:
                return Object.assign({}, state, {isUpdating: true});
            case REMOVE_UPDATING:
                return Object.assign({}, state, {isUpdating: false});
            case OPEN_TILE_DIALOG:
                return Object.assign({}, state, {isShowTileDialog: true, tileDailogComponentName: action.componentName, tileDialogComponentProps: action.componentProps});
            case CLOSE_TILE_DIALOG:
                return Object.assign({}, state, {isShowTileDialog: false, tileDailogComponentName: null, tileDialogComponentProps: null});
            default:
                return state
        }
    }
})();