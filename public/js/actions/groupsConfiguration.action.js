window.action = window.action || {};
action.groupsConfiguration = (function () {
    var groupsConfigurationAction = {
        LOAD_GROUP_CONFIGURATION: "LOAD_GROUP_CONFIGURATION",
        load: load
    };

    function load() {
        return function(dispatch){
            service.groupsConfiguration.getGroupsConfiguration().then(function(res){
                dispatch(success(res));
            }, function(error){

            })
        };

        function success(groupsConfiguration) { return { type: groupsConfigurationAction.LOAD_GROUP_CONFIGURATION, groupsConfiguration: groupsConfiguration } }
    }

    return groupsConfigurationAction;
})();