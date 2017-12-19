var store = (function(){
    var combineReducers = Redux.combineReducers,
        applyMiddleware = Redux.applyMiddleware,
        compose = Redux.compose,
        thunkMiddleware = ReduxThunk.default;

    var rootReducer = combineReducers({
        authentication: reducer.authentication,
        general: reducer.general,
        gamesPredictions: reducer.gamesPredictions,
        teamsPredictions: reducer.teamsPredictions,
        leaderBoard: reducer.leaderBoard,
        simulator: reducer.simulator
    });

    return store = Redux.createStore(rootReducer, {}, compose(applyMiddleware(thunkMiddleware)));
})();