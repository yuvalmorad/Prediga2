action.groupConfiguration = (function () {
    var groupConfigurationAction = {
        LOAD_GROUP_CONFIGURATION: "LOAD_GROUP_CONFIGURATION",
        load: load
    };

    function load() {
        return function(dispatch){
            service.groupConfiguration.getGroupConfiguration().then(function(res){
                dispatch(success(res));
            }, function(error){

            })
        };

        function success(groupConfiguration) { return { type: groupConfigurationAction.LOAD_GROUP_CONFIGURATION, groupConfiguration: groupConfiguration } }
    }

    return groupConfigurationAction;
})();