window.action = window.action || {};
action.groupsConfiguration = (function () {
    var groupsConfigurationAction = {
        LOAD_GROUP_CONFIGURATION: "LOAD_GROUP_CONFIGURATION",
        load: load,

        ADD_GROUP_CONFIGURATION: "ADD_GROUP_CONFIGURATION",
        addGroupConfiguration: addGroupConfiguration,

        UPDATE_GROUP_CONFIGURATION: "UPDATE_GROUP_CONFIGURATION",
        updateGroupConfiguration: updateGroupConfiguration
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

    function addGroupConfiguration(groupConfiguration) {
        return {
            type: groupsConfigurationAction.ADD_GROUP_CONFIGURATION,
            groupConfiguration: groupConfiguration
        }
    }

    function updateGroupConfiguration(groupConfiguration) {
        return {
            type: groupsConfigurationAction.UPDATE_GROUP_CONFIGURATION,
            groupConfiguration: groupConfiguration
        }
    }

    return groupsConfigurationAction;
})();