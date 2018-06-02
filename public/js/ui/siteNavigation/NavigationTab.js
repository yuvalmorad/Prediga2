window.component = window.component || {};
component.NavigationTab = (function(){
    return function (props) {
        var className = "navigation-tab";

        if (utils.general.cutUrlPath(routerHistory.location.pathname) === utils.general.cutUrlPath(props.to)) {
            className += " selected"
        }

        var indicationElem;

        if (props.indication) {
			indicationElem = re("span", {className: "nav-indication " + props.indication.status}, props.indication.text);
        }

        return re(ReactRouterDOM.Link, {to: props.to.replace(":groupId", props.selectedGroupId), className: className},
            re("span", {}, props.icon),
			indicationElem
        );
    };
})();


