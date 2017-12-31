window.component = window.component || {};
component.AuthenticateRoute = (function () {
    var Route = ReactRouterDOM.Route,
        Redirect = ReactRouterDOM.Redirect;

    return function (_props) {
        var Component = _props.component;
        var props = Object.assign({}, _props);
        delete props.component;
        props.render = function (componentProps) {
            //if (localStorage.getItem('user')) {
                return re(Component, componentProps);
            //} else {
            //    return re(Redirect, {to: "/login", state: {from: componentProps.location}});
            //}
        };

        return re(Route, props);
    }
})();