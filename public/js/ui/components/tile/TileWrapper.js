component.TileWrapper = (function(){
    return function(props) {
        var leftBackgroundImage = "linear-gradient(" + props.borderLeftColor + " 50%, " + props.borderLeftSecondColor + " 0%)";
        var rightBackgroundImage = "linear-gradient(" + props.borderRightColor + " 50%, " + props.borderRightSecondColor + " 0%)";

        return re("div", {className: "tile-wrapper"},
            re("div", {className: "tile-border-right", style: {backgroundImage: rightBackgroundImage}}),
            re("div", {className: "tile-border-left", style: {backgroundImage: leftBackgroundImage}}),
            props.children
        )
    }
})();