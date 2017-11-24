component.NavigationTab = (function(){
    return function (props) {
        var className = "navigation-tab";

        if (routerHistory.location.pathname === (props.to)) {
            className += " selected"
        }

        return re(ReactRouterDOM.Link, {to: props.to, className: className + " " + props.className});
    };
})();


