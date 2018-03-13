window.utils = window.utils || {};
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
    function loadWithPredictions(serviceObj, mainObjectProperty, successType, groupId, additionalProperty) {
        return function(dispatch){
            serviceObj.getAll(groupId).then(function(res){
                var data = res.data;
                dispatch(success(data[mainObjectProperty], data.predictions, data.results, data.predictionsCounters, groupId, data[additionalProperty]));
            }, function(error){

            })
        };

        function success(mainObject, userPredictions, results, predictionsCounters, groupId, additionalValue) {
            var res = {
                type: successType,
                userPredictions: userPredictions,
                results: results,
                predictionsCounters: predictionsCounters,
                groupId: groupId
            };
            res[mainObjectProperty] = mainObject;

            if (additionalProperty) {
                res[additionalProperty] = additionalValue;
            }

            return res;
        }
    }

    function updatePrediction(prediction, serviceObj, updateType, groupId) {
        return function(dispatch){
            serviceObj.updatePrediction(prediction, groupId).then(function(predictionRes){
                dispatch(updatePredictionState(predictionRes));
                console.log("success");
            }, function(error){
                console.log("error");
            });
        };

        function updatePredictionState(predictionRes) { return { type: updateType, prediction: predictionRes} }
    }
})();