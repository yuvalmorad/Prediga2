window.component = window.component || {};
component.RulesPage = (function () {
	var connect = ReactRedux.connect;

	function getPointsStr(groupConfiguration, betType) {
		return groupConfiguration ? groupConfiguration[betType] + "pts" : "";
	}

	function RulesPage(props) {
		var groupsConfiguration = props.groupsConfiguration,
			selectedGroupId = props.selectedGroupId,
			groups = props.groups,
			groupConfiguration = utils.general.getGroupConfiguration(groups, selectedGroupId, groupsConfiguration);

		return re("div", {className: "content"},
			re("div", {className: "scroll-container"},

				re("div", {className: "rules-item"},
					re("div", {className: "rules-item-content"},
						re("div", {className: "rules-item-header"}, "Prediga - How to play"),
						re("div", {className: "rules-item-items"},
							re("div", {}, "Outsmart your friends, family, and work buddies by predicting the outcome of football competitions (...or soccer depending on where you come from, but we mean the sport where a round ball is kicked around).\n" +
								"Show everyone who's king and take all the glory!!")
						)
					)
				),

				re("div", {className: "rules-item"},
					re("div", {className: "rules-item-content"},
						re("div", {className: "rules-item-header"}, "Match Score"),
						re("div", {className: "rules-item-items"},
							re("div", {}, "* Winner - " + getPointsStr(groupConfiguration, GAME.BET_TYPES.WINNER.key)),
							re("div", {}, "* First to score - " + getPointsStr(groupConfiguration, GAME.BET_TYPES.FIRST_TO_SCORE.key)),
							re("div", {}, "* Goal diff. - " + getPointsStr(groupConfiguration, GAME.BET_TYPES.GOAL_DIFF.key)),
							re("div", {}, "* Team home/away exact goal scored - " + getPointsStr(groupConfiguration, GAME.BET_TYPES.TEAM1_GOALS.key)),
							re("div", {}, "* (Bonus) Exact score including goal diff. - 1 strike")
						)
					)
				),

				re("div", {className: "rules-item"},
					re("div", {className: "rules-item-content"},
						re("div", {className: "rules-item-header"}, "Team Score"),
						re("div", {className: "rules-item-items"},
							re("div", {}, "* Winning - " + getPointsStr(groupConfiguration, GAME.TEAM_TYPES.TEAM_WINNER.key)),
							re("div", {}, "* Runner-up - " + getPointsStr(groupConfiguration, GAME.TEAM_TYPES.TEAM_RUNNER_UP.key)),
							re("div", {}, "* 3rd place - " + getPointsStr(groupConfiguration, GAME.TEAM_TYPES.TEAM_THIRD.key)),
							re("div", {}, "* 4th place - " + getPointsStr(groupConfiguration, GAME.TEAM_TYPES.TEAM_FOURTH.key)),
							re("div", {}, "* Group stage (1st or 2nd place) - "+ getPointsStr(groupConfiguration, GAME.TEAM_TYPES.TEAM_GROUP_STAGE.key))
						)
					)
				),

				re("div", {className: "rules-item"},
					re("div", {className: "rules-item-content"},
						re("div", {className: "rules-item-header"}, "Get Started"),
						re("div", {className: "rules-item-items"},
							re("div", {}, "* Open the Prediga side panel, and join an existing group, make your own private group, or play against all registered Prediga users in the Everyone group."),
							re("div", {}, "* In the main screen, choose a tournament or league."),
							re("div", {}, "* Make your predictions for upcoming matches and the overall team standings."),
							re("div", {}, "* Just make sure you complete your predictions before the cutoff times of each match and competition."),
							re("div", {}, "* The more accurate predictions you make, the more points you score. It's really as easy as that!!"),
							re("div", {}, "* Check out the Leaderboard to track your overall standing in each group and competition. "),
						)
					)
				),

				re("div", {className: "rules-item"},
					re("div", {className: "rules-item-content"},
						re("div", {className: "rules-item-header"}, "Match Predictions"),
						re("div", {className: "rules-item-items"},
							re("div", {}, "In the Match Prediction screen, open a match tile to enter your prediction. Choose the match winner or mark it as a draw, set the number of goals scored by each team, the goal difference, and the first team to score."),
							re("div", {}, "* You can enter and change a match prediction up to 5 minutes before kickoff time. In private groups, the cutoff time may differ depending on the time configured by the group admin."),
							re("div", {}, "* You score a strike if all your predictions in a match are correct (maximum points). But if you aren't sure about the outcome and don't want to risk it too much, you can enter a non-sensical prediction. "),
							re("div", {}, "For example, you might predict a draw but enter a 2-goal difference, or you could mark a match winner but enter the same number of goals scored by each team. Remember that playing it safe means you forfeit the chance to score maximum points. Choose your strategy carefully for each match"),
							re("div", {}, "* Before a match has started, you won't be able to see the exact predictions made by other players in your group. However, the colored bar below the score in a match tile represents the overall percentage that each team is predicted as the match winner by the players in your group."),
							re("div", {}, "* In case you forget to make a prediction before the cutoff time, you risk losing potential points. In the Settings screen, you can instruct Prediga to make a randomized prediction for you one hour before the cutoff time. By default, Prediga sends you reminders via your browser (you can opt out from the Prediga settings or blacklist all notifications from Prediga)."),
							re("div", {}, "* If you're member of more than one group, remember that your match predictions are only applied to the group you've currently selected in the Prediga side panel.")
						)
					)
				),

				re("div", {className: "rules-item"},
					re("div", {className: "rules-item-content"},
						re("div", {className: "rules-item-header"}, "Team Predictions"),
						re("div", {className: "rules-item-items"},
							re("div", {}, "In the Team Predictions screen, enter your predictions for the overall team standings in the competition. Score big bonus points at the end of the competition for accurate predictions."),
							re("div", {}, "* Choose the teams for the top four and bottom two places. And in some competitions where there is a qualification group stage, you'll need to predict the winners of each group."),
							re("div", {}, "* Make your predictions wisely—after the team prediction cutoff you can't make any more changes. The cutoff time is noted at the top of the Team Prediction screen."),
							re("div", {}, "* The cutoff time for team predictions is the same for the Everyone group and all private groups."),
							re("div", {}, "* Remember that your team predictions are only applied to the group you've currently selected in the Prediga side panel.")
						)
					)
				),

				re("div", {className: "rules-item"},
					re("div", {className: "rules-item-content"},
						re("div", {className: "rules-item-header"}, "Leaderboard"),
						re("div", {className: "rules-item-items"},
							re("div", {}, "It all comes down to this!! Here is where you see your overall standing in each group and competition. The leaderboard aggregates your scores from all your match and team predictions."),
							re("div", {}, "* Your scores are not joined across groups and competitions."),
							re("div", {}, "* The leaderboard also shows how many strikes each player has earned. Merit badges are awarded to the strike leaders."),
							re("div", {}, "* You can also see how many places you have gone up or down the leaderboard ranking since the last match in the competition. "),
							re("div", {}, "* Press a player's tile to see their most recent match predictions and points awarded for each."),
							re("div", {}, "* Points for accurate team predictions are only given after a group qualification stage or competition has ended."),
							re("div", {}, "* Avoid the shame of being beaten by the Monkey!! The monkey is a virtual player whose predictions are completely random.")
						)
					)
				),

				re("div", {className: "rules-item"},
					re("div", {className: "rules-item-content"},
						re("div", {className: "rules-item-header"}, "Match Simulator"),
						re("div", {className: "rules-item-items"},
							re("div", {}, "Everyone has submitted their match prediction and you're itching to know where you'll be ranked on the leaderboard before the final whistle is blown!"),
							re("div", {}, "* While a match is ongoing, go into the Match Predictions screen and press the Simulate button in the match tile—see how the current score affects your current standing in the leaderboard, based on the prediction you entered before the cutoff time."),
							re("div", {}, "* To make things more exciting, you can also change the match outcome and see how it would improve (or worsen!!) your overall standing in the leaderboard."),
							re("div", {}, "* In the simulated leaderboard, you can also see the predictions made for the match by other players in your group.")
						)
					)
				)
			)
		);
	};

	function mapStateToProps(state){
		return {
			groupsConfiguration: state.groupsConfiguration.groupsConfiguration,
			selectedGroupId: state.groups.selectedGroupId,
			groups: state.groups.groups
		}
	}

	function mapDispatchToProps(dispatch) {
		return {

		}
	}

	return connect(mapStateToProps, mapDispatchToProps)(RulesPage);
})();