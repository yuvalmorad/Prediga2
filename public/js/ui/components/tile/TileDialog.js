window.component = window.component || {};
component.TileDialog = (function(){
    var TileWrapper = component.TileWrapper;

    return function(props) {
        var className = "tile";

        if (props.className) {
            className += " " + props.className
        }

        var opts = { className: className};

        return re("div", opts,
            re(TileWrapper, props)
        );
    }
})();


