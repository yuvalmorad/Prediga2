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
			var that = this,
				props = this.props,
				selectedLeagueId = props.selectedLeagueId,
				selectedGroupId = props.selectedGroupId,
				userId = props.userId,
				leaders = props.leaders;

			leaderBoardService.getUserStats(userId, selectedLeagueId, selectedGroupId).then(function(res){
				var data = res.data;
				var state = Object.assign({}, data, {isLoading: false});
				that.setState(state);
			});

			leaders = utils.general.getLeadersByLeagueId(leaders, selectedLeagueId);
			var user = utils.general.findItemInArrBy(leaders, "userId", userId);
			var placesOverMatches = user.placesOverMatches || [];

			var bestValue;
			var labels = placesOverMatches.map(function(value, index){
				if (!bestValue) {
					bestValue = {
						value: value,
						index: index
					}
				} else {
					if (value < bestValue.value) {
						bestValue = {
							value: value,
							index: index
						}
					}
				}
				return ""//index + 1;
			});

			if (placesOverMatches.length) {
				new Chartist.Line(this.userProgressRef, {
					labels: labels,
					series: [
						placesOverMatches
					]
				}, {
					fullWidth: true,
					axisY: {
						onlyInteger: true,
						labelInterpolationFnc: function(value) {
							return -value;
						}
					}
				}).on('data', function(context) {
					context.data.series = context.data.series.map(function(series) {
						return series.map(function(value) {
							return -value;
						});
					});
				}).on('draw', function(data) {
					if(data.type === 'point' && bestValue && data.index === bestValue.index) {

						data.group.elem('text', {
							x: data.x - 10,
							y: data.y,
							fontSize: '1rem'
						}, 'ct-label ct-label-bestPos').text(bestValue.value);
					}
				});
			}
		},

		assignUserProgressRef: function(userProgressRef) {
        	this.userProgressRef = userProgressRef;
		},

        render: function () {
            var state = this.state,
                isLoading = state.isLoading,
				stats;

            if (!isLoading) {
				var total = state["total"] || 0,
					s12 = state["12"] || 0,
					s10 = state["10"] || 0,
					s8 = state["8"] || 0,
					s6 = state["6"] || 0,
					s4 = state["4"] || 0,
					s2 = state["2"] || 0,
					s0 = state["0"] || 0;

				stats = re("div", {},
					re("div", {className: "sub-title"}, "Points Distribution"),
					// TODO - should be generic distribution according to the object.keys.
					re("div", {className: "stats-item"}, "12: " + getTimesString(s12) + getPercentageString(s12, total)),
					re("div", {className: "stats-item"}, "10: " + getTimesString(s10) + getPercentageString(s10, total)),
					re("div", {className: "stats-item"}, "8: " + getTimesString(s8) + getPercentageString(s8, total)),
					re("div", {className: "stats-item"}, "6: " + getTimesString(s6) + getPercentageString(s6, total)),
					re("div", {className: "stats-item"}, "4: " + getTimesString(s4) + getPercentageString(s4, total)),
					re("div", {className: "stats-item"}, "2: " + getTimesString(s2) + getPercentageString(s2, total)),
					re("div", {className: "stats-item"}, "0: " + getTimesString(s0) + getPercentageString(s0, total))
				);
            }

            return re("div", {className: "leader-board-stats"},
				re("div", {className: "sub-title"}, "Position History:"),
				re("div", {ref: this.assignUserProgressRef}),
				stats
            );
        }
    });

    function getTimesString(value) {
        return value === 1 ? "1 time" : value + " times";
    }

    function getPercentageString(value, total) {
        return " ("+ (value / total * 100).toFixed(2) + "%)";
    }

	function mapStateToProps(state){
		return {
			selectedLeagueId: state.groups.selectedLeagueId,
			selectedGroupId: state.groups.selectedGroupId,
			leaders: state.leaderBoard.leaders
		}
	}

	function mapDispatchToProps(dispatch) {
		return {

		}
	}

	return connect(mapStateToProps, mapDispatchToProps)(LeaderBoardStats);
})();


