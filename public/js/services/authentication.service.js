service.authentication = (function() {
    return {
        login: login,
        logout: logout,
        register: register
    };

    function login(username, password) {
        return httpInstnace.put("/login", {username: username, password: password}).then(function(){
            localStorage.setItem('user', JSON.stringify({name: "Shachar"}));
        });
    }

    function logout() {
        localStorage.removeItem('user');
    }

    function register() {
        return httpInstnace.put("/register").then(function(){
            return {name: "Shachar"};
        });
    }

})();