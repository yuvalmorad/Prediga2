component.TileDialogContainer = (function(){
    var connect = ReactRedux.connect;

    var TileDialogContainer = React.createClass({

        onCancel: function() {//close/cancel
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
            var componentProps = props.componentProps;
            var isDialogFormDisabled = false;

            if (props.isShowTileDialog) {
                isDialogFormDisabled = !!componentProps.isDialogFormDisabled;
                componentProps.onDialogSave = this.assignDialogSaveFun;
                componentElement = re(component[props.componentName], componentProps);
                className +=  (" " + props.componentName);
            } else {
                className += " hide";
            }

            return re("div", { className: className},
                re("div", {className: "dialog-button"},
                    re("button", {onClick: this.onCancel, className: isDialogFormDisabled ? "hide" : ""}, "Cancel")
                ),
                componentElement,
                re("div", {className: "dialog-button"},
                    re("button", {onClick: isDialogFormDisabled ? this.onCancel : this.onSave}, isDialogFormDisabled ? "Close" : "Save")
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


