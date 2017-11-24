window.axios = (function(axiosOriginal){
    var REQUEST_TIMEOUT = 200;
    var axios = {
        put: request,
        get: request,
        post: request,
        delete: request,
        request: request
    };

    function loadJson(fileName) {
        return axiosOriginal.get("/js/mock/" + fileName).then(function(res){
            return res.data;
        });
    }

    function request(path, obj) {
        return new Promise(function(resolve, reject) {
            setTimeout(function(){
                console.log("Mock api replaced for path: ", path, "with obj:", obj);
                if (path === "/login") {
                    return resolve({});
                }
                if (path === "/leaderBoard") {
                    return loadJson("leaderBoard.mock.json").then(resolve,reject);
                }
                if (path === "/gamesPredictions") {
                    return loadJson("gamesPredictions.mock.json").then(resolve,reject);
                }
                if (path === "/gamesPredictions/updateGame") {
                    return resolve({});
                }
                if (path === "/teamsPredictions") {
                    return loadJson("teamsPredictions.mock.json").then(resolve,reject);
                }
                if (path === "/teamsPredictions/updateTeamSelected") {
                    return resolve({});
                }

                resolve({}); //default
            }, REQUEST_TIMEOUT);
        });
    }

    return {
        create: function(){
            return axios;
        }
    };

})(window.axios);


