component.TileDialog = (function(){
    var connect = ReactRedux.connect,
        TileWrapper = component.TileWrapper;

    var TileDialog = React.createClass({
        render: function() {
            var props = this.props,
                className = "tile";

            if (props.className) {
                className += " " + props.className
            }

            var opts = { className: className};

            return re("div", opts,
                re(TileWrapper, props)
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


