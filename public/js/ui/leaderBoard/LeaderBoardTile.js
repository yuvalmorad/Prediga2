component.LeaderBoardTile = (function(){
    var Tile = component.Tile,
        LeaderBoardMainTile = component.LeaderBoardMainTile;

    return function(props) {
        var user = props.user,
            borderColor = "#a7a4a4";

        if (user.rank === 1) {
            borderColor = "#00ff00";
        } else if (user.rank === 2) {
            borderColor = "red";
        }

        return re(Tile, {disableOpen: true, borderLeftColor: borderColor, borderRightColor: borderColor, className: "leader-board-tile"},
            re(LeaderBoardMainTile, {user: props.user})
        );
    };
})();


