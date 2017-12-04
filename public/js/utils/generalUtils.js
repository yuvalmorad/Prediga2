utils.general = (function(){
    return {
        findItemInArrBy: findItemInArrBy,
        calculatePoints: calculatePoints,
        getMaxPoints: getMaxPoints,
        sumObject: sumObject,
        updateOrCreateObject: updateOrCreateObject
    };

    function updateOrCreateObject(arr, objectToUpdate) {
        var newArr = arr.slice();
        var index, i;
        for (i = 0; i < newArr.length; i++) {
            if (newArr[i]._id === objectToUpdate._id) {
                index = i;
                break;
            }
        }

        if (index === undefined) {
            //new prediction
            newArr.push(objectToUpdate);
        } else {
            newArr[index] = objectToUpdate;
        }

        return newArr;
    }

    function findItemInArrBy(arr, property, val) {
        var i;
        for (i = 0; i < arr.length; i++) {
            if (arr[i][property] === val) {
                return arr[i]
            }
        }
    }

    function calculatePoints(game) {
        var res = {};
        Object.keys(POINTS).forEach(function(key){
            var resultsKey = "results_" + key;
            var userPredictionKey = "userPrediction_" + key;

            res[key] = (game[resultsKey] === game[userPredictionKey] ? POINTS[key] : 0);
        });

        return res;
    }

    function sumObject(obj){
        return Object.keys(obj).reduce(function(res, key){
            return res + obj[key];
        }, 0);
    }

    function getMaxPoints() {
        return sumObject(POINTS);
    }
})();