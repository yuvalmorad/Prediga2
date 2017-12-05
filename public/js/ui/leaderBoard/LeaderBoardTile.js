component.LeaderBoardTile = (function(){
    var Tile = component.Tile,
        LeaderBoardMainTile = component.LeaderBoardMainTile;

    return function(props) {
        var user = props.user,
            //trend = user.trend,
            borderColor = "#a7a4a4";

        /*if (trend > 0) {
            borderColor = "#00ff00";
        } else if (trend < 0) {
            borderColor = "red";
        }*/

        return re(Tile, {disableOpen: true, borderLeftColor: borderColor, borderRightColor: borderColor, className: "leader-board-tile"},
            re(LeaderBoardMainTile, props)
        );
    };
})();


