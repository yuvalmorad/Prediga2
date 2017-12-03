window.re = React.createElement;
window.routerHistory = History.createBrowserHistory();

var store;
var component = {};
var reducer = {};
var action = {};
var service = {};
var utils = {};

var httpInstnace = axios.create({
    baseURL: '/',
    timeout: 5000
});

