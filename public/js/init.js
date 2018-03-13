window.re = React.createElement;
window.routerHistory = History.createBrowserHistory();

(function() {
    var lastHashes = [];
    window.routerHistory.listen(function(location, _action){
        if (_action === "PUSH" && location.hash) {
            var hash = location.hash.replace("#", "");
            lastHashes.push(hash);
            return;
        }

        if (_action === "POP") {
            var hash = lastHashes.pop();
            if (hash === "dialogOpen") {
                //close dialog
                store.dispatch(action.general.closeTileDialogAction());
            }
        }

    });
})();


var httpInstnace = axios.create({
    baseURL: '/',
    timeout: 5000
});
