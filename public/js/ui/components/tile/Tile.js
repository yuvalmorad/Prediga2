component.Tile = (function(){
    var connect = ReactRedux.connect;

    var Tile = React.createClass({
        onTileClicked: function(e) {
            this.props.openTileDialog(this.props.dialogComponent, this.props.dialogComponentProps);
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
            openTileDialog: function(componentName, componentProps){dispatch(action.general.openTileDialog(componentName, componentProps))}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(Tile);
})();


