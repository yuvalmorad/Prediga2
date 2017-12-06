utils.action = (function(){
    return {
        loadWithPredictions: loadWithPredictions,
        updatePrediction: updatePrediction
    };

    //mainObjectProperty = "teams"/"matches"
    function loadWithPredictions(serviceObj, mainObjectProperty, successType) {
        return function(dispatch){
            serviceObj.getAll().then(function(res){
                var userId = res.headers.userid;
                var data = res.data;
                dispatch(action.authentication.setUserId(userId));

                var userPredictions = data.predictions.filter(function(prediction){
                    return prediction.userId === userId;
                });

                var otherPredictions = data.predictions.filter(function(prediction){
                    return prediction.userId !== userId;
                });

                dispatch(success(data[mainObjectProperty], userPredictions, otherPredictions, data.users, data.results));
            }, function(error){

            })
        };

        function success(mainObject, userPredictions, otherPredictions, users, results) {
            var res = {
                type: successType, userPredictions: userPredictions, otherPredictions: otherPredictions, users: users, results: results
            };
            res[mainObjectProperty] = mainObject;

            return res;
        }
    }

    function updatePrediction(prediction, serviceObj, updateType) {
        return function(dispatch){
            dispatch(action.general.setUpdating());
            serviceObj.updatePrediction(prediction).then(function(predictionRes){
                dispatch(updatePredictionState(predictionRes));
                dispatch(action.general.removeUpdating());
                console.log("success");
            }, function(error){
                dispatch(action.general.removeUpdating());
                console.log("error");
            });
        };

        function updatePredictionState(predictionRes) { return { type: updateType, prediction: predictionRes} }
    }
})();