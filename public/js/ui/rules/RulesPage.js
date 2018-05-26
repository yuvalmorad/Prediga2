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
						re("div", {className: "rules-item-header"}, "Groups - play with your friends"),
						re("div", {className: "rules-item-items"},
							re("div", {}, "* Create Group - Create a group and choose leagues, users to play with."),
							re("div", {}, "* Edit Group - override any group configuration like scoring."),
							re("div", {}, "* Delete Group"),
							re("div", {}, "* Join Group"),
							re("div", {}, "* Leave Group")
						)
					)
				),

				re("div", {className: "rules-item"},
					re("div", {className: "rules-item-content"},
						re("div", {className: "rules-item-header"}, "Match Predictions"),
						re("div", {className: "rules-item-items"},
							re("div", {}, "* Submit your prediction 5 minutes before game kickoff time, this can be configurable in a private group."),
							re("div", {}, "* Predict the final score after 90 minutes.")
						)
					)
				),

				re("div", {className: "rules-item"},
					re("div", {className: "rules-item-content"},
						re("div", {className: "rules-item-header"}, "Team Predictions"),
						re("div", {className: "rules-item-items"},
							re("div", {}, "* Submit your prediction before the deadline of each prediction.")
						)
					)
				),

				re("div", {className: "rules-item"},
					re("div", {className: "rules-item-content"},
						re("div", {className: "rules-item-header"}, "Match Score"),
						re("div", {className: "rules-item-items"},
							re("div", {}, "* Winner - " + getPointsStr(groupConfiguration, GAME.BET_TYPES.WINNER.key)),
							re("div", {}, "* First to score - " + getPointsStr(groupConfiguration, GAME.BET_TYPES.FIRST_TO_SCORE.key)),
							re("div", {}, "* Goal diff - " + getPointsStr(groupConfiguration, GAME.BET_TYPES.GOAL_DIFF.key)),
							re("div", {}, "* Exact score (home team) - " + getPointsStr(groupConfiguration, GAME.BET_TYPES.TEAM1_GOALS.key)),
							re("div", {}, "* Exact score (away team) - " + getPointsStr(groupConfiguration, GAME.BET_TYPES.TEAM2_GOALS.key))
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
							re("div", {}, "* 4th place - " + getPointsStr(groupConfiguration, GAME.TEAM_TYPES.TEAM_FOURTH.key))
							/*re("div", {}, "* 2nd last place - " + getPointsStr(groupConfiguration, GAME.TEAM_TYPES.TEAM_SECOND_LAST.key)),
							re("div", {}, "* Last place - " + getPointsStr(groupConfiguration, GAME.TEAM_TYPES.TEAM_LAST.key)),
							re("div", {}, "* Group stage - ?")*/
						)
					)
				),

				re("div", {className: "rules-item"},
					re("div", {className: "rules-item-content"},
						re("div", {className: "rules-item-header"}, "Leaderboard"),
						re("div", {className: "rules-item-items"},
							re("div", {}, "* Score are aggregated from all match and team predictions"),
							re("div", {}, "* Strike is when you predict right all options in one match")
						)
					)
				),

				re("div", {className: "rules-item"},
					re("div", {className: "rules-item-content"},
						re("div", {className: "rules-item-header"}, "Simulator"),
						re("div", {className: "rules-item-items"},
							re("div", {}, "* Simulate your standings while the game is in progress.")
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