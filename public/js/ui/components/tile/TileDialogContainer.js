component.TileDialogContainer = (function(){
    var connect = ReactRedux.connect;

    var TileDialogContainer = React.createClass({

        getInitialState: function() {
            return {
                saveButtonEnabled: true
            }
        },

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

        setSaveButtonEnabled: function(status) {
            this.setState({saveButtonEnabled: status});
        },

        render: function() {
            var props = this.props;
            var className = "tile-dialog-container";
            var componentElement;
            var componentProps = props.componentProps;
            var isDialogFormDisabled = false;
            var saveButtonEnabled = this.state.saveButtonEnabled;

            if (props.isShowTileDialog) {
                isDialogFormDisabled = !!componentProps.isDialogFormDisabled;
                componentProps.onDialogSave = this.assignDialogSaveFun;
                componentProps.setSaveButtonEnabled = this.setSaveButtonEnabled;
                componentElement = re(component[props.componentName], componentProps);
                className +=  (" " + props.componentName);
                if (componentProps.dialogContainerClassName) {
                    className += (" " + componentProps.dialogContainerClassName);
                }
            } else {
                className += " hide";
            }

            var dialogButtonStyle = {};
            if (isDialogFormDisabled) {
                dialogButtonStyle.justifyContent = "flex-end";
            }

            var isSave = !isDialogFormDisabled;
            return re("div", { className: className},
                re("div", { className: "tile-dialog-container-wrapper"},
                    componentElement,
                    re("div", {className: "dialog-button", style: dialogButtonStyle},
                        re("button", {onClick: this.onCancel, className: isDialogFormDisabled ? "hide" : ""}, "Cancel"),
                        re("button", {onClick: isSave ?  this.onSave : this.onCancel, className: "main-button", disabled: isSave && !saveButtonEnabled}, isSave ? "Save" : "Close")
                    )
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


