(function(){
    var Provider = ReactRedux.Provider,
        Router = ReactRouterDOM.Router,
        App = component.App;

    window.routerHistory = History.createBrowserHistory();

    ReactDOM.render(
        re(Provider, {store: store},
            re(Router, {history: window.routerHistory},
                re(App, {})
            )
        ),
        document.getElementById('root')
    );
})();