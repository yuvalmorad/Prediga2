window.re = React.createElement;
var store;
var component = {};
var reducer = {};
var action = {};
var service = {};
var utils = {};

var httpInstnace = axios.create({
    baseURL: '/api',
    timeout: 5000
});