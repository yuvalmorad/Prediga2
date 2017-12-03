window.axios = (function(axiosOriginal){
    var axiosMethodsList = ["put", "get", "post", "delete", "request"];
    var axios = {};

    axiosMethodsList.forEach(function(method) {
        axios[method] = function() {
            return axiosOriginal[this].apply(axiosOriginal, arguments).catch(function(e){
                if (e.response.status === 401) {
                    window.routerHistory.push('/login');
                }
                return Promise.reject(e);
            });
        }.bind(method);
    });

    return {
        create: function(){
            return axios;
        }
    };

})(window.axios);