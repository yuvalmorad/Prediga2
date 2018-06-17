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

        render: function () {
            var state = this.state,
                isLoading = state.isLoading;

            if (isLoading) {
                return re("div", {}, "");
            }

            var total = state["total"] || 0,
                s12 = state["12"] || 0,
                s10 = state["10"] || 0,
                s8 = state["8"] || 0,
                s6 = state["6"] || 0,
                s4 = state["4"] || 0,
                s2 = state["2"] || 0,
                s0 = state["0"] || 0;

            return re("div", {className: "leader-board-stats"},
                re("div", {className: "sub-title"}, "Points Distribution"),
                // TODO - should be generic distribution according to the object.keys.
                re("div", {className: "stats-item"}, "12: " + getTimesString(s12) + " | " + getPercentageString(s12, total)),
                re("div", {className: "stats-item"}, "10: " + getTimesString(s10) + " | " + getPercentageString(s10, total)),
                re("div", {className: "stats-item"}, "8: " + getTimesString(s8) + " | " + getPercentageString(s8, total)),
                re("div", {className: "stats-item"}, "6: " + getTimesString(s6) + " | " + getPercentageString(s6, total)),
                re("div", {className: "stats-item"}, "4: " + getTimesString(s4) + " | " + getPercentageString(s4, total)),
                re("div", {className: "stats-item"}, "2: " + getTimesString(s2) + " | " + getPercentageString(s2, total)),
                re("div", {className: "stats-item"}, "0: " + getTimesString(s0) + " | " + getPercentageString(s0, total)),
            );
        }
    });

    function getTimesString(value) {
        return value === 1 ? "1 time" : value + " times";
    }

    function getPercentageString(value, total) {
        return (value / total * 100) + "%";
    }

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


