window.utils = window.utils || {};
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
        isAllBetTypesExists: isAllBetTypesExists,
        getDrawFromObject: getDrawFromObject,
        isGameClosed: isGameClosed,
        getGameStatus: getGameStatus,
        getRunningGameFormat: getRunningGameFormat,
        formatMinutesSecondsTime: formatMinutesSecondsTime,
        formatHourMinutesTime: formatHourMinutesTime,
        getLeagueLogoURL: getLeagueLogoURL,
        leagueNameToIdName: leagueNameToIdName,
        cutUrlPath: cutUrlPath,
        getLeadersByLeagueId: getLeadersByLeagueId,
        getTeamsUniqueGraphColor: getTeamsUniqueGraphColor,
        compareStringsLowerCase: compareStringsLowerCase,
        formatDateByMonthAndDate: formatDateByMonthAndDate
    };

    function formatDateByMonthAndDate(dateObj) {
        var date = addZeroToTimeIfNeeded(dateObj.getDate());
        var month = addZeroToTimeIfNeeded(dateObj.getMonth() + 1);


        return date + "." + month;
    }

    function compareStringsLowerCase(str1, str2) {
        if (!str1 || !str2 || !str1.toLowerCase || !str2.toLowerCase){
             return false;
        }

        return str1.toLowerCase() === str2.toLowerCase();
    }

    function getTeamsUniqueGraphColor(team1, team2) {
        var team1Color = team1.graphColors[0];
        var team2Color = team2.graphColors[0];

        if (team1Color === team2Color) {
            //same color -> try to get the second graph color
            if (team2.graphColors.length > 1) {
                team2Color = team2.graphColors[1];
            } else if (team1.graphColors.length > 1) {
                team1Color = team1.graphColors[1];
            }
        }

        return [team1Color, team2Color];
    }

    function getLeadersByLeagueId(leadersByLeagues, leagueId) {
        return leadersByLeagues.filter(function(leadersByLeague){
            return leadersByLeague.length && leadersByLeague[0].leagueId === leagueId;
        })[0] || [];
    }

    function cutUrlPath(path) {
        return "/" + path.split("/")[1];
    }

    function formatHourMinutesTime(date) {
        var dateObj = new Date(date);
        var hours = dateObj.getHours();
        var minutes = dateObj.getMinutes();
        hours = addZeroToTimeIfNeeded(hours);
        minutes = addZeroToTimeIfNeeded(minutes);
        return hours + ":" + minutes;
    }

    function getLeagueLogoURL(leagueIdName) {
        return "url('../images/sprites/" + leagueIdName + "_teams.png')"
    }

    function leagueNameToIdName(leagueName) {
        return leagueName.toLowerCase().replace(/ /g, "_");
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

    function getRunningGameFormat(result) {
        var gameTime = result.gameTime;
        if (!result.AutoProgressGT && gameTime === 45) {
            return "Half Time";
        } else {
            return "Running " + gameTime + "'";
        }
    }

    function getGameStatus(result) {
        if (result) {
            if (result.completion === undefined) {
                //old games ended without completion
                return GAME.STATUS.POST_GAME;
            } else {
                if (result.completion >= 100) {
                    return GAME.STATUS.POST_GAME;
                } else {
                    //not complete yet -> game is running
                    return GAME.STATUS.RUNNING_GAME;
                }
            }
        } else {
            //no result yet -> before game kickoff
            return GAME.STATUS.PRE_GAME;
        }
    }

    function isGameClosed(kickofftime, groupConfiguration) {
        var currentDate = new Date();
        var gameClosedDate = new Date(kickofftime);
        gameClosedDate.setMinutes(gameClosedDate.getMinutes() - groupConfiguration[GAME.MINUTES_BEFORE_CLOSE_MATCH]);
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
        var winnerKey = GAME.BET_TYPES.WINNER.key;
        (predictions || []).forEach(function(prediction){
            if (!res[prediction[winnerKey]]) {
                res[prediction[winnerKey]] = [];
            }

            res[prediction[winnerKey]].push(prediction.userId);
        });

        return res;
    }

    function updateOrCreateObject(arr, objectToUpdate, byProperty) {
        byProperty = byProperty || "_id";
        var newArr = arr.slice();
        var index, i;
        for (i = 0; i < newArr.length; i++) {
            if (newArr[i][byProperty] === objectToUpdate[byProperty]) {
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

    function isAllBetTypesExists(obj) {
        return Object.keys(GAME.BET_TYPES).every(function(typeKey){
            var betType = GAME.BET_TYPES[typeKey];
            var key = betType.key;
            return obj[key] !== undefined;
        });
    }

    function calculatePoints(prediction, result, configuration) {
        prediction = prediction || {};
        var res = {};
        Object.keys(GAME.BET_TYPES).forEach(function(typeKey){
            var betType = GAME.BET_TYPES[typeKey];
            var key = betType.key;
            var points = configuration[key];
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

    function getMaxPoints(configuration) {
        return Object.keys(GAME.BET_TYPES).reduce(function(res, typeKey){
            var points = configuration[GAME.BET_TYPES[typeKey].key];
            return res + points;
        }, 0);
    }

    function isPointsStrike(points, configuration) {
        return points === getMaxPoints(configuration);
    }

    function calculateTotalPoints(prediction, result, configuration) {
        return sumObject(calculatePoints(prediction, result, configuration));
    }

    function sumObject(obj){
        return Object.keys(obj).reduce(function(res, key){
            return res + obj[key];
        }, 0);
    }
})();