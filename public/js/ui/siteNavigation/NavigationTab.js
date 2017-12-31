window.component = window.component || {};
component.NavigationTab = (function(){
    return function (props) {
        var className = "navigation-tab";

        if (utils.general.cutUrlPath(routerHistory.location.pathname) === utils.general.cutUrlPath(props.to)) {
            className += " selected"
        }

        return re(ReactRouterDOM.Link, {to: props.to, className: className + " " + props.className});
    };
})();


