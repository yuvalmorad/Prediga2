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
        copyArrAndAdd: copyArrAndAdd,
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
        formatDateToDateMonthYearString: formatDateToDateMonthYearString,
        getLeagueLogoURL: getLeagueLogoURL,
        leagueNameToIdName: leagueNameToIdName,
        cutUrlPath: cutUrlPath,
		getGroupIdFromUrl: getGroupIdFromUrl,
        getLeadersByLeagueId: getLeadersByLeagueId,
        getTeamsUniqueGraphColor: getTeamsUniqueGraphColor,
        compareStringsLowerCase: compareStringsLowerCase,
        formatDateByMonthAndDate: formatDateByMonthAndDate,
        getGroupConfiguration: getGroupConfiguration,
        isUserActive: isUserActive,
		copyJoinGroupLink: copyJoinGroupLink,
        isPredictionStrike: isPredictionStrike
    };

    function isPredictionStrike(prediction, game) {
        if (!prediction || !game || !game.team1 || !game.team2) {
            return false;
        }

        var team1 = game.team1;
        var team2 = game.team2;
		var winner = prediction[GAME.BET_TYPES.WINNER.key];
		var firstToScore = prediction[GAME.BET_TYPES.FIRST_TO_SCORE.key];
		var team1Goals = prediction[GAME.BET_TYPES.TEAM1_GOALS.key];
		var team2Goals = prediction[GAME.BET_TYPES.TEAM2_GOALS.key];
		var goalDiff = prediction[GAME.BET_TYPES.GOAL_DIFF.key];

		if (isFirstScoreNone(firstToScore)) {
		    // 0 : 0
		    return goalDiff === 0 && isMatchDraw(winner) && team1Goals === 0 && team2Goals === 0;
        }

        if (isMatchDraw(winner)) {
		    // draw
            return team1Goals === team2Goals && goalDiff === 0 && (team1Goals !== 0 || team2Goals !== 0 || isFirstScoreNone(firstToScore));
        }

        //some team wins
        if (winner === team1) {
		    //team1 win
            return team1Goals > team2Goals && goalDiff === (team1Goals - team2Goals) && (team2Goals !== 0 || firstToScore === team1)
        } else if (winner === team2) {
			//team2 win
			return team2Goals > team1Goals && goalDiff === (team2Goals - team1Goals) && (team1Goals !== 0 || firstToScore === team2)
		}

        return false;
    }

    function copyJoinGroupLink(groupId) {
        var linkToCopy = location.origin + "/group/" + groupId + "/matchPredictions?autoJoin=true";

		const el = document.createElement('textarea');
		el.value = linkToCopy;
		el.setAttribute('readonly', '');
		el.style.position = 'absolute';
		el.style.left = '-9999px';
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);

		alert("Link was copied:\n" + linkToCopy);
    }

    function isUserActive(leader, groupId) {
        return groupId === INITIAL_PUPLIC_GROUP || (leader && leader.isActive);
    }

    function getGroupConfiguration(groups, groupId, groupsConfiguration) {
        var group = findItemInArrBy(groups, "_id", groupId);
        return group ? findItemInArrBy(groupsConfiguration, "_id", group.configurationId) : null;
    }

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
	    if (path.indexOf("/group/") === 0) {
			return "/" + path.split("/")[3];
        }
        return "/" + path.split("/")[1];
    }

    function getGroupIdFromUrl(path) {
		if (path.indexOf("/group/") === 0) {
			return path.split("/")[2];
		}
    }

    function formatHourMinutesTime(date) {
        var dateObj = new Date(date);
        var hours = dateObj.getHours();
        var minutes = dateObj.getMinutes();
        hours = addZeroToTimeIfNeeded(hours);
        minutes = addZeroToTimeIfNeeded(minutes);
        return hours + ":" + minutes;
    }

    function formatDateToDateMonthYearString(_date) {
        var d = new Date(_date);
        var date = addZeroToTimeIfNeeded(d.getDate());
        var month = addZeroToTimeIfNeeded(d.getMonth() + 1);
        var year = d.getFullYear();
        return date + "." + month + "." + year;
    }

    function getLeagueLogoURL(leagueIdName) {
        return "url('/images/sprites/" + leagueIdName + "_teams.png')"
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
        if (result.status_name === "??????????") {
            return "Half-Time";
        } else {
            return gameTime + "'";
        }
    }

    function getGameStatus(result) {
        if (result) {
            if (result.active) {
                //not complete yet -> game is running
                return GAME.STATUS.RUNNING_GAME;
            } else {
                return GAME.STATUS.POST_GAME;
            }
        } else {
            //no result yet -> before game kickoff
            return GAME.STATUS.PRE_GAME;
        }
    }

    function isGameClosed(kickofftime, groupConfiguration) {
        if (!groupConfiguration) {
            return false;
        }
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

    function copyArrAndAdd(arr, obj) {
        var res = arr.slice();
        res.push(obj);
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