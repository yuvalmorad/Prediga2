action.users = (function () {
    var usersAction = {
        LOAD_USERS: "LOAD_USERS",
        loadUsers: loadUsers
    };

    function loadUsers() {
        return function(dispatch){
            service.users.getAll().then(function(res){
                var users = res.data;
                dispatch(action.authentication.setUserId(res.headers.userid));
                dispatch(success(users));
                socket.init();
            }, function(error){

            })
        };

        function success(users) { return { type: usersAction.LOAD_USERS, users: users } }
    }

    return usersAction;
})();