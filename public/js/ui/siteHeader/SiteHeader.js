component.SiteHeader = (function(){
    var connect = ReactRedux.connect;

    var SiteHeader = function (props) {
       var hide = props.hide,
           title = props.title,
           siteHeaderConfig = props.siteHeaderConfig;
           //siteHeaderActionButtons = props.siteHeaderActionButtons,
           //rightButton;

       /*if (siteHeaderActionButtons) {
           var button = siteHeaderActionButtons[0];
           rightButton = re("a", {className: "action-button", onClick: button.onClick}, button.text);
       }*/
       return re("div", { className: "site-header" + (hide ? " hide" : "") },
           re("div", {className: "left"},
               re("a", {className: "menu-button" + (siteHeaderConfig.hideMenuButton ? " hide" : ""), onClick: props.toggleMenu})
           ),
           re("div", {className: "center"}, title),
           re("div", {className: "right"})
       );
    };

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


