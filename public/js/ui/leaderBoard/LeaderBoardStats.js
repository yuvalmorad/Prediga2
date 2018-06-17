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

			var s12 = state["12"] || 0,
                s10 = state["10"] || 0,
                s8 = state["8"] || 0,
                s6 = state["6"] || 0,
                s4 = state["4"] || 0,
                s2 = state["2"] || 0,
                s0 = state["0"] || 0;

            return re("div", {className: "leader-board-stats"},
                re("div", {className: "sub-title"}, "Score Distribution"),
                // TODO - should be generic distribution according to the object.keys.
                re("div", {className: "stats-item"}, "12: " + "("+s12+" times) " + (s12 / state["total"] * 100) + "%"),
                re("div", {className: "stats-item"}, "10: " + "("+s10+" times) " + (s10 / state["total"] * 100) + "%"),
                re("div", {className: "stats-item"}, "8: " + "("+s8+" times) " + (s8 / state["total"] * 100) + "%"),
                re("div", {className: "stats-item"}, "6: " + "("+s6+" times) " + (s6 / state["total"] * 100) + "%"),
                re("div", {className: "stats-item"}, "4: " + "("+s4+" times) " + (s4 / state["total"] * 100) + "%"),
                re("div", {className: "stats-item"}, "2: " + "("+s2+" times) " + (s2 / state["total"] * 100) + "%"),
                re("div", {className: "stats-item"}, "0: " + "("+s0+" times) " + (s0 / state["total"] * 100) + "%"),
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


