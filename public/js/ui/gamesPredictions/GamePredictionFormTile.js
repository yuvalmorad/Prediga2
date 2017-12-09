component.GamePredictionFormTile = (function(){
    var RadioGroup = component.RadioGroup;
    var InputNumber = component.InputNumber;

    var IMAGE_SIZE = 2.5;
    var TRANSFORM_BACK = 2;
    var MAX_USERS = 7;
    var DEAFULT_PROFILE_IMAGE = "../images/default_profile.png";

    function mapToMutualFriends(_users, reverse) {
        var users = _users.splice(0, MAX_USERS);
        if (_users.length) {
            //left users
            users.push({additionalFriends: _users.length});
        }

        return users.map(function(user, index){
            var leftRightProperty = reverse ? "right" : "left";
            var style = {
                zIndex: (users.length - index),
                top: (Math.floor(index / 3) * TRANSFORM_BACK) + "rem",
                width: IMAGE_SIZE + "rem",
                height: IMAGE_SIZE + "rem"
            };

            style[leftRightProperty] = ((index % 3) * TRANSFORM_BACK) + "rem";
            if (user.style) {
                Object.assign(style, user.style);
            }

            if (user.additionalFriends) {
                //not a user
                style["lineHeight"] = IMAGE_SIZE + "rem";
                return re("div", {className: "additional-mutual-friends", style: style, key: "mutualFriendImg_" + index}, "+" + user.additionalFriends);
            } else {
                return re("img", {src: user.photo || DEAFULT_PROFILE_IMAGE, style: style, key: "mutualFriendImg_" + index});
            }
        });
    }

    function getMutualFriendsWidth(users) {
        var width = users.length * IMAGE_SIZE - (users.length - 1) * (IMAGE_SIZE - TRANSFORM_BACK);

        return width + "rem";
    }

    return React.createClass({
        onRadioGroupChanged: function(groupName, radioName) {
            var prediction = {};
            prediction[groupName] = radioName;

            this.props.updateGameForm(prediction);
        },

        onInputNumberChanged: function(propertyName, num) {
            var prediction = {};
            prediction[propertyName] = num;

            this.props.updateGameForm(prediction);
        },

        render: function() {
            var props = this.props,
                game = props.game,
                prediction = props.prediction,
                otherMatchPredictions = props.otherMatchPredictions,
                users = props.users,
                userId = props.userId,
                predictionWinner = prediction && prediction[GAME.BET_TYPES.WINNER.key],
                predictionFirstToScore = prediction && prediction[GAME.BET_TYPES.FIRST_TO_SCORE.key],
                predictionTeam1Goals = prediction && prediction[GAME.BET_TYPES.TEAM1_GOALS.key],
                predictionTeam2Goals = prediction && prediction[GAME.BET_TYPES.TEAM2_GOALS.key],
                predictionGoalDiff = prediction && prediction[GAME.BET_TYPES.GOAL_DIFF.key],
                otherPredictionByWinner = utils.general.getOtherPredictionsUserIdsByWinner(otherMatchPredictions),
                otherPredctionsTeam1 = utils.general.mapUsersIdsToUsersObjects(otherPredictionByWinner[game.team1] || [], users),
                otherPredctionsDraw = utils.general.mapUsersIdsToUsersObjects(otherPredictionByWinner["draw"] || [], users),
                otherPredctionsTeam2 = utils.general.mapUsersIdsToUsersObjects(otherPredictionByWinner[game.team2] || [], users),
                result = props.result,
                team1 = models.leagues.getTeamByTeamName(game.team1),
                team2 = models.leagues.getTeamByTeamName(game.team2),
                isFormDisabled = false,
                team1Name = team1.name,
                team2Name = team2.name,
                team1Color = team1.color,
                team2Color = team2.color,
                team1SecondColor = team1.secondColor,
                team2SecondColor = team2.secondColor,
                points = {};

            if (predictionWinner) {
                var myUser = utils.general.findItemInArrBy(users, "_id", userId);
                var myUserObj = {photo: myUser.photo};

                if (predictionWinner === game.team1) {
                    myUserObj.style = {borderColor: team1Color};
                    otherPredctionsTeam1.unshift(myUserObj);
                }
                if (predictionWinner === "draw") {
                    myUserObj.style = {borderColor: COLORS.DRAW_COLOR};
                    otherPredctionsDraw.unshift(myUserObj);
                }
                if (predictionWinner === game.team2) {
                    myUserObj.style = {borderColor: team2Color};
                    otherPredctionsTeam2.unshift(myUserObj);
                }
            }

            var mutualFriendsTeam1 = mapToMutualFriends(otherPredctionsTeam1),
                mutualFriendsDrawWidth = getMutualFriendsWidth(otherPredctionsDraw),
                mutualFriendsDraw = mapToMutualFriends(otherPredctionsDraw, false),
                mutualFriendsTeam2 = mapToMutualFriends(otherPredctionsTeam2, true);

            if (result) {
                //POST_GAME
                points = utils.general.calculatePoints(prediction, result);
                isFormDisabled = true;
            }

            return re("div", {className: "game-form"},
                re("div", {className: "form-row-title"}, "Game Outcome"),
                re(RadioGroup, {className: "game-outcome", points: points[GAME.BET_TYPES.WINNER.key], onChange: this.onRadioGroupChanged, _id: game._id + "0", name: GAME.BET_TYPES.WINNER.key, isDisabled: isFormDisabled, inputs: [
                        {bgColor: team1Color, textColor: team1SecondColor, text: team1Name, name: team1Name, res: predictionWinner},
                        {bgColor: COLORS.DRAW_COLOR, text: "Draw", name: "draw", res: predictionWinner, isDefault: true},
                        {bgColor: team2Color, textColor: team2SecondColor, text: team2Name, name: team2Name, res: predictionWinner}
                    ]}
                ),
                re("div", {className: "goals-predictions"},
                    re("div", {},
                        re("div", {className: "form-row-title"}, "Goals"),
                        re(InputNumber, {isDisabled: isFormDisabled, points: points[GAME.BET_TYPES.TEAM1_GOALS.key], num: predictionTeam1Goals, onChange: this.onInputNumberChanged.bind(this, GAME.BET_TYPES.TEAM1_GOALS.key)})
                    ),
                    re("div", {},
                        re("div", {className: "form-row-title"}, "Diff"),
                        re(InputNumber, {isDisabled: isFormDisabled, points: points[GAME.BET_TYPES.GOAL_DIFF.key], num: predictionGoalDiff, onChange: this.onInputNumberChanged.bind(this, GAME.BET_TYPES.GOAL_DIFF.key)})
                    ),
                    re("div", {},
                        re("div", {className: "form-row-title"}, "Goals"),
                        re(InputNumber, {isDisabled: isFormDisabled, points: points[GAME.BET_TYPES.TEAM2_GOALS.key], num: predictionTeam2Goals, onChange: this.onInputNumberChanged.bind(this, GAME.BET_TYPES.TEAM2_GOALS.key)})
                    )
                ),
                re("div", {className: "form-row-title"}, "First to Score"),
                re(RadioGroup, {className: "first-score", points: points[GAME.BET_TYPES.FIRST_TO_SCORE.key], onChange: this.onRadioGroupChanged, _id: game._id + "1", name: GAME.BET_TYPES.FIRST_TO_SCORE.key, isDisabled: isFormDisabled, inputs: [
                        {bgColor: team1Color, textColor: team1SecondColor, text: team1Name, name: team1Name, res: predictionFirstToScore},
                        {bgColor: COLORS.DRAW_COLOR, text: "None", name: "none", res: predictionFirstToScore, isDefault: true},
                        {bgColor: team2Color, textColor: team2SecondColor, text: team2Name, name: team2Name, res: predictionFirstToScore}
                    ]}
                ),
                re("div", {className: "form-row-title"}, "Friends"),
                re("div", {className: "mutual-friends"},
                    re("div", {},
                        re("div", {},
                            mutualFriendsTeam1
                        )
                    ),
                    re("div", {},
                        re("div", {className: "mutual-friends-center", style: {width: mutualFriendsDrawWidth}},
                            mutualFriendsDraw
                        )
                    ),
                    re("div", {},
                        re("div", {},
                            mutualFriendsTeam2
                        )
                    )
                )
            );
        }
    });
})();


