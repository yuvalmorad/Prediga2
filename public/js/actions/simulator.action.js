action.simulator = (function(){

    var simulator = {
        LOAD_SIMULATOR_SUCCESS: "LOAD_SIMULATOR_SUCCESS",
        loadSimulator: loadSimulator
    };

    function loadSimulator() {
        return function(dispatch){
            service.simulator.getAll().then(function(res){
                var data = res.data;
                dispatch(success(data.leaderboard, data.matches, data.predictions));
            }, function(error){

            })
        };

        function success(leaders, matches, predictions) { return { type: simulator.LOAD_SIMULATOR_SUCCESS, leaders: leaders, matches: matches, predictions: predictions } }
    }

    return simulator;
})();