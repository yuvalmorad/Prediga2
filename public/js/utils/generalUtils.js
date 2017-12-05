utils.general = (function(){
    return {
        findItemInArrBy: findItemInArrBy,
        calculatePoints: calculatePoints,
        sumObject: sumObject,
        getMaxPoints: getMaxPoints,
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

    function calculatePoints(prediction, result) {
        prediction = prediction || {};
        var res = {};
        Object.keys(GAME.BET_TYPES).forEach(function(typeKey){
            var betType = GAME.BET_TYPES[typeKey];
            var key = betType.key;
            var points = betType.points;
            res[key] = (prediction[key] === result[key] ? points : 0);
        });

        return res;
    }

    function sumObject(obj){
        return Object.keys(obj).reduce(function(res, key){
            return res + obj[key];
        }, 0);
    }

    function getMaxPoints() {
        return Object.keys(GAME.BET_TYPES).reduce(function(res, typeKey){
            var points = GAME.BET_TYPES[typeKey].points;
            return res + points;
        }, 0);
    }
})();