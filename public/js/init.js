window.re = React.createElement;
window.routerHistory = History.createBrowserHistory();

var httpInstnace = axios.create({
    baseURL: '/',
    timeout: 5000
});
