window.action = window.action || {};
action.groups = (function () {
    var groupsAction = {
        LOAD_GROUPS: "LOAD_GROUPS",
        load: load
    };

    function load() {
        return function(dispatch){
            service.groups.getAll().then(function(res){
                dispatch(success(res));
            }, function(error){

            })
        };

        function success(groups) { return { type: groupsAction.LOAD_GROUPS, groups: groups } }
    }

    return groupsAction;
})();