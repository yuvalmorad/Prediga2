utils.general = (function(){
    return {
        calculatePoints: calculatePoints,
        getMaxPoints: getMaxPoints,
        sumObject: sumObject
    };

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