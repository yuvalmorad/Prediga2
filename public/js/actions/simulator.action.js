action.simulator = (function(){

    var simulator = {
        LOAD_SIMULATOR_SUCCESS: "LOAD_SIMULATOR_SUCCESS",
        loadSimulator: loadSimulator
    };

    function loadSimulator() {
        return function(dispatch){
            service.simulator.getAll().then(function(res){
                var data = res.data;
                dispatch(action.authentication.setUserId(res.headers.userid));
                dispatch(success(data.leaderboard, data.users, data.matches, data.predictions));
            }, function(error){

            })
        };

        function success(leaders, users, matches, predictions) { return { type: simulator.LOAD_SIMULATOR_SUCCESS, leaders: leaders, users: users, matches: matches, predictions: predictions } }
    }

    return simulator;
})();