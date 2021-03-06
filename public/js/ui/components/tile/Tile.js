window.component = window.component || {};
component.Tile = (function(){
    var connect = ReactRedux.connect,
        TileWrapper = component.TileWrapper;

    var Tile = React.createClass({
        getInitialState: function() {
            return {isInPlaceOpen: false};
        },

        onTileClicked: function(e) {
            var tagName = e.target.tagName;
            if (tagName === "A" || tagName === "INPUT") {
                return;
            }

            if (this.props.onClick) {
				this.props.onClick();
            } else if (this.props.navigateOnClickTo) {
                routerHistory.push(this.props.navigateOnClickTo);
            } else if (this.props.openInPlace) {
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
				animation = props.animation,
                state = this.state,
                className = "tile",
                disableOpen = props.disableOpen,
                style = {};

            if (props.className) {
                className += " " + props.className
            }

            if (!props.hasPrediction) {
                className += " no-prediction";
            }

            if (state.isInPlaceOpen && !disableOpen) {
                className += " open";
            }

            if (animation) {
				style.animationName = animation.name;
            }

            var opts = { className: className, style: style};

            if (!disableOpen) {
                opts.onClick = this.onTileClicked;
            }

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
            openTileDialog: function(componentName, componentProps){dispatch(action.general.openTileDialog(componentName, componentProps))}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(Tile);
})();


