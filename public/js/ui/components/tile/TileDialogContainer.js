window.component = window.component || {};
component.TileDialogContainer = (function(){
    var connect = ReactRedux.connect;

    var TileDialogContainer = React.createClass({

        getInitialState: function() {
            return {
                saveButtonEnabled: true,
                displayRandomButton: false,
                showStrikeIndication: false,
                isStrike: false
            }
        },

        escFunction: function(event){
            if(event.keyCode === 27) {
                this.closeDialog();
            }
        },

        componentDidMount: function(){
            document.addEventListener("keydown", this.escFunction, false);
        },

        componentWillUnmount: function(){
            document.removeEventListener("keydown", this.escFunction, false);
        },

        onCancel: function() { // close/cancel
            this.closeDialog();
        },

        onSave: function() {
            this.closeDialog();
            if (this.onDialogSave) {
                this.onDialogSave();
            }
        },

        onRandom: function() {
            this.closeDialog();
            if (this.onDialogRandom) {
                this.onDialogRandom();
            }
        },

        closeDialog: function() {
            this.props.closeTileDialog();
            this.setState({saveButtonEnabled: true, displayRandomButton: false, showStrikeIndication: false, isStrike: false});
        },

        assignDialogSaveFun: function(onDialogSaveFunc) {
            this.onDialogSave = onDialogSaveFunc;
        },

        assignDialogRandomFun: function(onDialogSaveFunc) {
            this.onDialogRandom = onDialogSaveFunc;
        },

        setSaveButtonEnabled: function(status) {
            this.setState({saveButtonEnabled: status});
        },

        setShowStrikeIndication: function(show, isStrike) {
            this.setState({showStrikeIndication: show, isStrike: isStrike});
        },

        setRandomButtonDisplay: function(status) {
            this.setState({displayRandomButton: status});
        },

        render: function() {
            var props = this.props;
            var className = "tile-dialog-container";
            var componentElement;
            var componentProps = props.componentProps;
            var isDialogFormDisabled = false;
            var saveButtonEnabled = this.state.saveButtonEnabled;
            var displayRandomButton = this.state.displayRandomButton;
            var showStrikeIndication = this.state.showStrikeIndication;
            var isStrike = this.state.isStrike;

            if (props.isShowTileDialog) {
                isDialogFormDisabled = !!componentProps.isDialogFormDisabled;
                componentProps.closeDialog = this.closeDialog;
                componentProps.onDialogSave = this.assignDialogSaveFun;
                componentProps.onDialogRandom = this.assignDialogRandomFun;
                componentProps.setSaveButtonEnabled = this.setSaveButtonEnabled;
                componentProps.setShowStrikeIndication = this.setShowStrikeIndication;
                componentProps.setRandomButtonDisplay = this.setRandomButtonDisplay;
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
                        re("button", {onClick: this.onRandom, className: displayRandomButton && !isDialogFormDisabled ? "" : "hide"}, "Random"),
                        re("button", {onClick: this.onCancel, className: isDialogFormDisabled ? "hide" : ""}, "Cancel"),
                        re("button", {onClick: isSave ?  this.onSave : this.onCancel, className: "main-button", disabled: isSave && !saveButtonEnabled}, isSave ?
                            ["Submit",
                                re("div", {className: (isStrike ? 'strike' : 'no-strike') + (showStrikeIndication ? "" : " hide")}
                                )
                            ] :
                            "Close")
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
            closeTileDialog: function(){action.general.closeTileDialog();}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(TileDialogContainer);
})();


