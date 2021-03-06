var store = initStore();

function initStore() {
    var combineReducers = Redux.combineReducers,
        applyMiddleware = Redux.applyMiddleware,
        compose = Redux.compose,
        thunkMiddleware = ReduxThunk.default;

    var rootReducer = combineReducers({
        authentication: reducer.authentication(),
        leagues: reducer.leagues(),
        general: reducer.general(),
        gamesPredictions: reducer.gamesPredictions(),
        teamsPredictions: reducer.teamsPredictions(),
        leaderBoard: reducer.leaderBoard(),
        simulator: reducer.simulator(),
        users: reducer.users(),
        groupsConfiguration: reducer.groupsConfiguration(),
        groups: reducer.groups(),
        userSettings: reducer.userSettings(),
        groupMessages: reducer.groupMessages()
    });

    return store = Redux.createStore(rootReducer, {}, compose(applyMiddleware(thunkMiddleware)));
}