utils.general = (function(){
    return {
        findItemInArrBy: findItemInArrBy,
        findItemsInArrBy: findItemsInArrBy,
        calculatePoints: calculatePoints,
        calculateTotalPoints: calculateTotalPoints,
        sumObject: sumObject,
        getMaxPoints: getMaxPoints,
        isPointsStrike: isPointsStrike,
        updateOrCreateObject: updateOrCreateObject,
        getOtherPredictionsUserIdsByWinner: getOtherPredictionsUserIdsByWinner,
        mapUsersIdsToUsersObjects: mapUsersIdsToUsersObjects,
        isMatchDraw: isMatchDraw,
        isFirstScoreNone: isFirstScoreNone,
        getDrawFromObject: getDrawFromObject,
        isGameClosed: isGameClosed,
        formatMinutesSecondsTime: formatMinutesSecondsTime,
        formatHourMinutesTime: formatHourMinutesTime,
        getLeagueLogoURL: getLeagueLogoURL
    };

    function formatHourMinutesTime(date) {
        var dateObj = new Date(date);
        var hours = dateObj.getHours();
        var minutes = dateObj.getMinutes();
        hours = addZeroToTimeIfNeeded(hours);
        minutes = addZeroToTimeIfNeeded(minutes);
        return hours + ":" + minutes;
    }

    function getLeagueLogoURL(league) {
        return "url('../images/sprites/" + league + "_teams.png')"
    }

    function addZeroToTimeIfNeeded(time) {
        if (time.toString().length === 1) {
            time = "0" + time;
        }

        return time;
    }

    function formatMinutesSecondsTime(dateMs) {
        var totalSeconds = Math.floor(dateMs/1000);
        var seconds = addZeroToTimeIfNeeded(totalSeconds % 60);
        var minutes = addZeroToTimeIfNeeded(Math.floor(totalSeconds / 60));
        return minutes + ":" + seconds;
    }

    function isGameClosed(kickofftime) {
        var currentDate = new Date();
        var gameClosedDate = new Date(kickofftime);
        gameClosedDate.setMinutes(gameClosedDate.getMinutes() - 5);
        return currentDate >= gameClosedDate;
    }

    function isMatchDraw(winner) {
        return (winner || "").toLowerCase() === "draw";
    }

    function isFirstScoreNone(firstToScore) {
        return (firstToScore || "").toLowerCase() === "none";
    }

    function getDrawFromObject(obj) {
        return obj["draw"] || obj["Draw"];
    }

    function mapUsersIdsToUsersObjects(usersIds, users) {
        return usersIds.map(function(userId){
            return users.filter(function(user){
                return userId === user._id;
            })[0];
        });
    }

    function getOtherPredictionsUserIdsByWinner(predictions) {
        var res = {};
        (predictions || []).forEach(function(prediction){
            if (!res[prediction.winner]) {
                res[prediction.winner] = [];
            }

            res[prediction.winner].push(prediction.userId);
        });

        return res;
    }

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

    function findItemInArrBy(arr, property, val, returnIndex) {
        var i;
        for (i = 0; i < arr.length; i++) {
            if (property.indexOf(".") > 0) {
                var properties = property.split(".");
                if (arr[i][properties[0]] && arr[i][properties[0]][properties[1]] && arr[i][properties[0]][properties[1]][properties[2]] === val) {
                    return returnIndex ? i : arr[i];
                }
            } else if (arr[i][property] === val) {
                return returnIndex ? i : arr[i];
            }
        }
    }

    function findItemsInArrBy(arr, property, val) {
        return arr.filter(function(item){
            return item[property] === val;
        });
    }

    function calculatePoints(prediction, result) {
        prediction = prediction || {};
        var res = {};
        Object.keys(GAME.BET_TYPES).forEach(function(typeKey){
            var betType = GAME.BET_TYPES[typeKey];
            var key = betType.key;
            var points = betType.points;
            var predictionVal = prediction[key];
            var resultVal = result[key];

            if (predictionVal !== undefined && resultVal !== undefined) {
                predictionVal = typeof predictionVal === "string" ? predictionVal.toLowerCase() : predictionVal;
                resultVal = typeof resultVal === "string" ? resultVal.toLowerCase() : resultVal;
                res[key] = predictionVal === resultVal ? points : 0;
            } else {
                res[key] = 0;
            }
        });

        return res;
    }

    function calculateTotalPoints(prediction, result) {
        return sumObject(calculatePoints(prediction, result));
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

    function isPointsStrike(points) {
        return points === getMaxPoints();
    }
})();