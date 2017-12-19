reducer.simulator = (function() {

    var simulatorAction = action.simulator,
        LOAD_SIMULATR_SUCCESS = simulatorAction.LOAD_SIMULATOR_SUCCESS;

    var initialState = {
        leaders: [],
        matches: [],
        predictions: []
    };

    return function simulator(state, action){
        if (state === undefined) {
            state = initialState;
        }

        switch (action.type) {
            case LOAD_SIMULATR_SUCCESS:
                return Object.assign({}, state, {leaders: action.leaders, matches: action.matches, predictions: action.predictions});
            default:
                return state
        }
    }
})();