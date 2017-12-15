component.LeaderBoardTile = (function(){
    var Tile = component.Tile,
        LeaderBoardMainTile = component.LeaderBoardMainTile,
        LeaderBoardMatchesHistory = component.LeaderBoardMatchesHistory;

    return React.createClass({
        getInitialState: function () {
            return {wasOpenInPlace: false};
        },

        onOpenInPlace: function() {
            this.setState({wasOpenInPlace: true});
        },

        render: function() {
            var props = this.props,
                state = this.state,
                borderColor = props.borderColor,
                leaderBoardMatchesHistoryElem;

            if (state.wasOpenInPlace) {
                leaderBoardMatchesHistoryElem = re(LeaderBoardMatchesHistory, {userId: props.user._id});
            }

            return re(Tile, {borderLeftColor: borderColor, borderRightColor: borderColor, className: "leader-board-tile", openInPlace: true, onOpenInPlace: this.onOpenInPlace},
                re(LeaderBoardMainTile, props),
                leaderBoardMatchesHistoryElem
            );
        }
    });

})();


