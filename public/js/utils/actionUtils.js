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
                var userId = res.headers.userid;
                var data = res.data;

                var userPredictions = data.predictions.filter(function(prediction){
                    return prediction.userId === userId;
                });

                var otherPredictions = data.predictions.filter(function(prediction){
                    return prediction.userId !== userId;
                });

                dispatch(success(data[mainObjectProperty], userPredictions, otherPredictions, data.results));
            }, function(error){

            })
        };

        function success(mainObject, userPredictions, otherPredictions, results) {
            var res = {
                type: successType, userPredictions: userPredictions, otherPredictions: otherPredictions, results: results
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