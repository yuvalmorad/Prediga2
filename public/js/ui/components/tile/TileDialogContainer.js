component.TileDialogContainer = (function(){
    var connect = ReactRedux.connect;

    var TileDialogContainer = React.createClass({

        onCancel: function() {
            this.props.closeTileDialog();
        },

        onSave: function() {
            this.props.closeTileDialog();
            if (this.onDialogSave) {
                this.onDialogSave();
            }
        },

        assignDialogSaveFun: function(onDialogSaveFunc) {
            this.onDialogSave = onDialogSaveFunc;
        },

        render: function() {
            var props = this.props;
            var className = "tile-dialog-container";
            var componentElement;

            if (props.isShowTileDialog) {
                var componentProps = props.componentProps;
                componentProps.onDialogSave = this.assignDialogSaveFun;
                componentElement = re(component[props.componentName], componentProps);
                className +=  (" " + props.componentName);
            } else {
                className += " hide";
            }

            return re("div", { className: className},
                re("div", {className: "dialog-button"},
                    re("button", {onClick: this.onCancel}, "Cancel")
                ),
                componentElement,
                re("div", {className: "dialog-button"},
                    re("button", {onClick: this.onSave}, "Save")
                )
            )
        }
    });

    function mapStateToProps(state){
        return {
            isShowTileDialog: state.general.isShowTileDialog,
            componentName: state.general.tileDailogComponentName,
            componentProps: state.general.tileDialogComponentProps
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            closeTileDialog: function(){dispatch(action.general.closeTileDialog())}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(TileDialogContainer);
})();


