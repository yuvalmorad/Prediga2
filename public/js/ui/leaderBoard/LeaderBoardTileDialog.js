component.LeaderBoardTileDialog = (function(){
    var TileDialog = component.TileDialog,
        LeaderBoardMainTile = component.LeaderBoardMainTile,
        LeaderBoardMatchesHistory = component.LeaderBoardMatchesHistory;

    return React.createClass({

        render: function() {
            var props = this.props,
                userId = props.user._id,
                borderColor = props.borderColor;

            return re(TileDialog, {borderLeftColor: borderColor, borderRightColor: borderColor, className: "leader-board-tile"},
                re(LeaderBoardMainTile, props),
                re(LeaderBoardMatchesHistory, {userId: userId})
            );
        }
    });
})();


