window.re = React.createElement;
var store;
var component = {};
var reducer = {};
var action = {};
var service = {};
var utils = {};

var httpInstnace = axios.create({
    baseURL: 'http://localhost:3000/'
    //timeout: 1000,
});