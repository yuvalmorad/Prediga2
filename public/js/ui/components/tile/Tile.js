component.Tile = (function(){
    var connect = ReactRedux.connect;

    var Tile = React.createClass({
        getInitialState: function() {
            return {isInPlaceOpen: false};
        },

        onTileClicked: function(e) {
            if (this.props.openInPlace) {
                this.setState({isInPlaceOpen: !this.state.isInPlaceOpen});
                if (this.props.onOpenInPlace) {
                    this.props.onOpenInPlace();
                }
            } else {
                this.props.openTileDialog(this.props.dialogComponent, this.props.dialogComponentProps);
            }
        },

        render: function() {
            var props = this.props,
                state = this.state,
                className = "tile";

            if (props.className) {
                className += " " + props.className
            }

            if (!props.hasPrediction) {
                className += " no-prediction";
            }

            if (state.isInPlaceOpen) {
                className += " open"
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


