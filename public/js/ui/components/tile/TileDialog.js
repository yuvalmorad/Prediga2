component.TileDialog = (function(){
    var connect = ReactRedux.connect;

    var TileDialog = React.createClass({
        render: function() {
            var props = this.props,
                className = "tile";

            if (props.className) {
                className += " " + props.className
            }

            var opts = { className: className , style: {borderLeftColor: props.borderLeftColor, borderRightColor: props.borderRightColor}};

            return re("div", opts,
                props.children
            );
        }
    });

    function mapStateToProps(state){
        return {
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            //openTileDialog: function(componentName, tileDialogId){dispatch(action.general.openTileDialog(componentName, tileDialogId))}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(TileDialog);
})();


