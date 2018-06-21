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
				that.createUserPointsPie(state);
			});

			leaders = utils.general.getLeadersByLeagueId(leaders, selectedLeagueId);
			var user = utils.general.findItemInArrBy(leaders, "userId", userId);
			this.createUserProgressLineChart(user);
		},

		createUserProgressLineChart: function(user) {
			var placesOverMatches = user.placesOverMatches || [];

			var bestValuesTemp = {};
			var bestValueGap = 10;
			var labels = placesOverMatches.map(function(value, index){
				var bestValueIndex = (Math.floor(index/bestValueGap) + 1) * bestValueGap;

				if (!bestValuesTemp[bestValueIndex]) {
					bestValuesTemp[bestValueIndex] = {
						value: value,
						index: index
					};
				} else {
					if (value < bestValuesTemp[bestValueIndex].value) {
						bestValuesTemp[bestValueIndex] = {
							value: value,
							index: index
						}
					}
				}

				return "";
			});

			var bestValues = {};

			Object.keys(bestValuesTemp).map(function(key){
				bestValues[bestValuesTemp[key].index] = bestValuesTemp[key].value;
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
					if(data.type === 'point' && bestValues[data.index] !== undefined) {

						data.group.elem('text', {
							x: data.x - 10,
							y: data.y,
							fontSize: '1rem'
						}, 'ct-label ct-label-bestPos').text(bestValues[data.index]);
					}
				});
			}
		},

		createUserPointsPie: function(state) {
        	var s12 = state["12"] || 0,
				s10 = state["10"] || 0,
				s8 = state["8"] || 0,
				s6 = state["6"] || 0,
				s4 = state["4"] || 0,
				s2 = state["2"] || 0,
				s0 = state["0"] || 0;

			var data = {
				labels: ['0 pts', '2 pts', '4 pts', '6 pts', '8 pts', '10 pts', '12 pts'],
				series: [s0, s2, s4, s6, s8, s10, s12]
			};

			new Chartist.Bar(this.userPointsRef, data, {distributeSeries: true, axisY: {onlyInteger: true}});
		},

		assignUserProgressRef: function(userProgressRef) {
        	this.userProgressRef = userProgressRef;
		},

		assignUserPointsRef: function(userPointsRef) {
        	this.userPointsRef = userPointsRef;
		},

        render: function () {
            return re("div", {className: "leader-board-stats"},
				re("div", {className: "sub-title"}, "Position History:"),
				re("div", {ref: this.assignUserProgressRef}),
				re("div", {className: "sub-title"}, "Points Distribution:"),
				re("div", {ref: this.assignUserPointsRef})
            );
        }
    });

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


