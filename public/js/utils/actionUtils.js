utils.action = (function(){
    return {
        loadWithPredictions: loadWithPredictions,
        updatePrediction: updatePrediction,
        REQUEST_STATUS: {
            NOT_LOADED: "NOT_LOADED",
            LOADING: "LOADING",
            SUCCESS_LOADED: "SUCCESS_LOADED",
            ERROR_LOADING: "ERROR_LOADING"
        }
    };

    //mainObjectProperty = "teams"/"matches"
    function loadWithPredictions(serviceObj, mainObjectProperty, successType) {
        return function(dispatch){
            serviceObj.getAll().then(function(res){
                var data = res.data;
                dispatch(success(data[mainObjectProperty], data.predictions, data.results, data.predictionsCounters));
            }, function(error){

            })
        };

        function success(mainObject, userPredictions, results, predictionsCounters) {
            var res = {
                type: successType, userPredictions: userPredictions, results: results, predictionsCounters: predictionsCounters
            };
            res[mainObjectProperty] = mainObject;

            return res;
        }
    }

    function updatePrediction(prediction, serviceObj, updateType) {
        return function(dispatch){
            serviceObj.updatePrediction(prediction).then(function(predictionRes){
                dispatch(updatePredictionState(predictionRes));
                console.log("success");
            }, function(error){
                console.log("error");
            });
        };

        function updatePredictionState(predictionRes) { return { type: updateType, prediction: predictionRes} }
    }
})();