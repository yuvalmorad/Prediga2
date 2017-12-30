component.SiteHeader = (function(){
    var connect = ReactRedux.connect;

    var SiteHeader = React.createClass({
            onBackButtonClicked: function() {
                routerHistory.goBack();
            },

            render: function () {
                var props = this.props,
                    hide = props.hide,
                    title = props.title,
                    siteHeaderConfig = props.siteHeaderConfig,
                    hideMenuButton = siteHeaderConfig.hideMenuButton,
                    hasBackButton = siteHeaderConfig.hasBackButton;
                //siteHeaderActionButtons = props.siteHeaderActionButtons,
                //rightButton;

                /*if (siteHeaderActionButtons) {
                    var button = siteHeaderActionButtons[0];
                    rightButton = re("a", {className: "action-button", onClick: button.onClick}, button.text);
                }*/
                return re("div", { className: "site-header" + (hide ? " hide" : "") },
                    re("div", {className: "left"},
                        re("a", {className: "back-button" + (hasBackButton ? "" : " hide"), onClick: this.onBackButtonClicked}, "<"),
                        re("a", {className: "menu-button" + (hideMenuButton ? " hide" : ""), onClick: props.toggleMenu})
                    ),
                    re("div", {className: "center"}, title),
                        re("div", {className: "right"})
            );
        }
    });

    function mapStateToProps(state){
        return {

        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            toggleMenu: function(){dispatch(action.general.toggleMenu())}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(SiteHeader);
})();


