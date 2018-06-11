window.component = window.component || {};
component.LeaderBoardStats = (function(){
	var connect = ReactRedux.connect,
		leaderBoardService = service.leaderBoard;

	var LeaderBoardStats =  React.createClass({
        getInitialState: function() {
            return {
				isLoading: true
            }
        },

		componentDidMount: function() {
			var that = this;
			leaderBoardService.getUserStats(this.props.userId, this.props.selectedLeagueId, this.props.selectedGroupId).then(function(res){
				var data = res.data;
				var state = Object.assign({}, data, {isLoading: false});
				that.setState(state);
			});
		},

        render: function() {
			var state = this.state,
				isLoading = state.isLoading;

			if (isLoading) {
				return re("div", {}, "");
			}

			var winner = state.winner || {},
				winner1or2 = winner.winner1or2 || {},
				winnerDraw = winner.winnerDraw || {},
				firstToScore = state.firstToScore || {},
				firstToScore1or2 = firstToScore.firstToScore1or2 || {},
				firstToScoreNone = firstToScore.firstToScoreNone || {},
				goalDiff = state.goalDiff || {},
				goalDiff0 = goalDiff[0] || {},
				goalDiff1 = goalDiff[1] || {},
				goalDiff2 = goalDiff[2] || {},
				goalDiff3 = goalDiff[3] || {},
				team1Goals = state.team1Goals || {},
				team1Goals0 = team1Goals[0] || {},
				team1Goals1 = team1Goals[1] || {},
				team1Goals2 = team1Goals[2] || {},
				team1Goals3 = team1Goals[3] || {},
				team2Goals = state.team2Goals || {},
				team2Goals0 = team2Goals[0] || {},
				team2Goals1 = team2Goals[1] || {},
				team2Goals2 = team2Goals[2] || {},
				team2Goals3 = team2Goals[3] || {}
				;

            return re("div", {className: "leader-board-stats"},
				re("div", {className: "sub-title"}, "Winner (1 or 2)"),
				re("div", {className: "stats-item"}, "Average Score: " + (winner1or2.avgScore || 0)),
				re("div", {className: "stats-item"}, "Total Times: " + (winner1or2.totalCount || 0)),
				re("div", {className: "stats-item"}, "Total Score: " + (winner1or2.totalScore || 0)),

				re("div", {className: "sub-title"}, "Draw"),
				re("div", {className: "stats-item"}, "Average Score: " + ((winnerDraw.avgScore || 0))),
				re("div", {className: "stats-item"}, "Total Times: " + (winnerDraw.totalCount || 0)),
				re("div", {className: "stats-item"}, "Total Score: " + (winnerDraw.totalScore || 0)),

				re("div", {className: "sub-title"}, "First To Score (1 or 2)"),
				re("div", {className: "stats-item"}, "Average Score: " + (firstToScore1or2.avgScore || 0)),
				re("div", {className: "stats-item"}, "Total Times: " + (firstToScore1or2.totalCount || 0)),
				re("div", {className: "stats-item"}, "Total Score: " + (firstToScore1or2.totalScore || 0)),

				re("div", {className: "sub-title"}, "First To Score - None"),
				re("div", {className: "stats-item"}, "Average Score: " + (firstToScoreNone.avgScore || 0)),
				re("div", {className: "stats-item"}, "Total Times: " + (firstToScoreNone.totalCount || 0)),
				re("div", {className: "stats-item"}, "Total Score: " + (firstToScoreNone.totalScore || 0)),

				re("div", {className: "sub-title"}, "0 Goal Diff"),
				re("div", {className: "stats-item"}, "Average Score: " + (goalDiff0.avgScore || 0)),
				re("div", {className: "stats-item"}, "Total Times: " + (goalDiff0.totalCount || 0)),
				re("div", {className: "stats-item"}, "Total Score: " + (goalDiff0.totalScore || 0)),

				re("div", {className: "sub-title"}, "1 Goal Diff"),
				re("div", {className: "stats-item"}, "Average Score: " + (goalDiff1.avgScore || 0)),
				re("div", {className: "stats-item"}, "Total Times: " + (goalDiff1.totalCount || 0)),
				re("div", {className: "stats-item"}, "Total Score: " + (goalDiff1.totalScore || 0)),

				re("div", {className: "sub-title"}, "2 Goal Diff"),
				re("div", {className: "stats-item"}, "Average Score: " + (goalDiff2.avgScore || 0)),
				re("div", {className: "stats-item"}, "Total Times: " + (goalDiff2.totalCount || 0)),
				re("div", {className: "stats-item"}, "Total Score: " + (goalDiff2.totalScore || 0)),

				re("div", {className: "sub-title"}, "3 Goal Diff"),
				re("div", {className: "stats-item"}, "Average Score: " + (goalDiff3.avgScore || 0)),
				re("div", {className: "stats-item"}, "Total Times: " + (goalDiff3.totalCount || 0)),
				re("div", {className: "stats-item"}, "Total Score: " + (goalDiff3.totalScore || 0)),

				re("div", {className: "sub-title"}, "Home team 0 goals"),
				re("div", {className: "stats-item"}, "Average Score: " + (team1Goals0.avgScore || 0)),
				re("div", {className: "stats-item"}, "Total Times: " + (team1Goals0.totalCount || 0)),
				re("div", {className: "stats-item"}, "Total Score: " + (team1Goals0.totalScore || 0)),

				re("div", {className: "sub-title"}, "Home team 1 goals"),
				re("div", {className: "stats-item"}, "Average Score: " + (team1Goals1.avgScore || 0)),
				re("div", {className: "stats-item"}, "Total Times: " + (team1Goals1.totalCount || 0)),
				re("div", {className: "stats-item"}, "Total Score: " + (team1Goals1.totalScore || 0)),

				re("div", {className: "sub-title"}, "Home team 2 goals"),
				re("div", {className: "stats-item"}, "Average Score: " + (team1Goals2.avgScore || 0)),
				re("div", {className: "stats-item"}, "Total Times: " + (team1Goals2.totalCount || 0)),
				re("div", {className: "stats-item"}, "Total Score: " + (team1Goals2.totalScore || 0)),

				re("div", {className: "sub-title"}, "Home team 3 goals"),
				re("div", {className: "stats-item"}, "Average Score: " + (team1Goals3.avgScore || 0)),
				re("div", {className: "stats-item"}, "Total Times: " + (team1Goals3.totalCount || 0)),
				re("div", {className: "stats-item"}, "Total Score: " + (team1Goals3.totalScore || 0)),

				re("div", {className: "sub-title"}, "Away team 0 goals"),
				re("div", {className: "stats-item"}, "Average Score: " + (team2Goals0.avgScore || 0)),
				re("div", {className: "stats-item"}, "Total Times: " + (team2Goals0.totalCount || 0)),
				re("div", {className: "stats-item"}, "Total Score: " + (team2Goals0.totalScore || 0)),

				re("div", {className: "sub-title"}, "Away team 1 goals"),
				re("div", {className: "stats-item"}, "Average Score: " + (team2Goals1.avgScore || 0)),
				re("div", {className: "stats-item"}, "Total Times: " + (team2Goals1.totalCount || 0)),
				re("div", {className: "stats-item"}, "Total Score: " + (team2Goals1.totalScore || 0)),

				re("div", {className: "sub-title"}, "Away team 2 goals"),
				re("div", {className: "stats-item"}, "Average Score: " + (team2Goals2.avgScore || 0)),
				re("div", {className: "stats-item"}, "Total Times: " + (team2Goals2.totalCount || 0)),
				re("div", {className: "stats-item"}, "Total Score: " + (team2Goals2.totalScore || 0)),

				re("div", {className: "sub-title"}, "Away team 3 goals"),
				re("div", {className: "stats-item"}, "Average Score: " + (team2Goals3.avgScore || 0)),
				re("div", {className: "stats-item"}, "Total Times: " + (team2Goals3.totalCount || 0)),
				re("div", {className: "stats-item"}, "Total Score: " + (team2Goals3.totalScore || 0))
			);
        }
    });

	function mapStateToProps(state){
		return {
			selectedLeagueId: state.groups.selectedLeagueId,
			selectedGroupId: state.groups.selectedGroupId
		}
	}

	function mapDispatchToProps(dispatch) {
		return {

		}
	}

	return connect(mapStateToProps, mapDispatchToProps)(LeaderBoardStats);
})();


