component.LeaderBoardTile = (function(){
    var Tile = component.Tile,
        LeaderBoardMainTile = component.LeaderBoardMainTile;

    return function(props) {
        var borderColor = props.borderColor;

        return re(Tile, {borderLeftColor: borderColor, borderRightColor: borderColor, className: "leader-board-tile", dialogComponent: "LeaderBoardTileDialog", dialogComponentProps: Object.assign({}, props, {isDialogFormDisabled: true})},
            re(LeaderBoardMainTile, props)
        );
    };
})();


