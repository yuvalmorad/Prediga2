component.TileWrapper = (function(){

    function createBorderStyle(borderColor, borderSecondColor) {
        return borderSecondColor ?
            {backgroundImage: "linear-gradient(" + borderColor + " 50%, " + borderSecondColor + " 0%)"} :
            {backgroundColor: borderColor}
    }

    return function(props) {
        var rightBorderStyle = createBorderStyle(props.borderRightColor, props.borderRightSecondColor),
            leftBorderStyle = createBorderStyle(props.borderLeftColor, props.borderLeftSecondColor);

        return re("div", {className: "tile-wrapper"},
            re("div", {className: "tile-border-right", style: rightBorderStyle}),
            re("div", {className: "tile-border-left", style: leftBorderStyle}),
            props.children
        )
    }
})();