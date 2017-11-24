component.Tile = (function(){
    var connect = ReactRedux.connect;

    var Tile = React.createClass({
        onTileClicked: function(e) {
            this.props.openTileDialog(this.props.componentToOpen, this.props.id);
        },

        render: function() {
            var props = this.props,
                className = "tile";

            if (props.className) {
                className += " " + props.className
            }

            var opts = { className: className , style: {borderLeftColor: props.borderLeftColor, borderRightColor: props.borderRightColor}};
            if (!this.props.disableOpen) {
                opts.onClick = this.onTileClicked;
            }

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
            openTileDialog: function(componentName, tileDialogId){dispatch(action.general.openTileDialog(componentName, tileDialogId))}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(Tile);
})();


