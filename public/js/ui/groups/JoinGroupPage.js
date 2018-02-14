window.component = window.component || {};
component.JoinGroupPage = (function(){
    var connect = ReactRedux.connect;
    var JoinGroupTile = component.JoinGroupTile;
    var isRequestSent = false;

    var JoinGroupPage = React.createClass({
        getInitialState: function() {
            if (!isRequestSent) {
                this.props.loadAllAvailableGroups();
                isRequestSent = true;
            }

            return {

            };
        },

        componentWillReceiveProps: function(nextProps) {
            if (nextProps.siteHeaderFiredEvent === "onOpenCreateNewGroup") {
                this.props.resetSiteHeaderEvent();
                routerHistory.push("/createNewGroup");
            }
        },

        joinGroup: function(groupId, secret) {
            var props = this.props;
            service.groups.joinGroup(groupId, secret).then(function(){
                //TODO only add current group

                //refresh the current page
                props.loadAllAvailableGroups();

                //load groups and all related data
                props.initAll();
            }, function(){
                alert("failed to join group");
            });
        },

        getAdmin: function(allAvailableGroupsAdmins, group) {
            return utils.general.findItemInArrBy(allAvailableGroupsAdmins, "_id", group.createdBy);
        },

        isUserInGroup: function(group, userId) {
            return group.users.indexOf(userId) >= 0;;
        },

        render: function() {
            var that = this,
                props = this.props,
                allAvailableGroups = props.allAvailableGroups,
                allAvailableGroupsAdmins = props.allAvailableGroupsAdmins,
                userId = props.userId;

            var tiles = allAvailableGroups.sort(function(group1, group2){
                if (group1._id === INITIAL_PUPLIC_GROUP ) {
                    return -1;
                }

                if (group2._id === INITIAL_PUPLIC_GROUP ) {
                    return 1;
                }

                var admin1 = that.getAdmin(allAvailableGroupsAdmins, group1);
                var isUserInGroup1 = that.isUserInGroup(group1, userId);
                var admin2 = that.getAdmin(allAvailableGroupsAdmins, group2);
                var isUserInGroup2 = that.isUserInGroup(group2, userId);

                if (admin1 || isUserInGroup1) {
                    return -1;
                }

                if (admin2 || isUserInGroup2) {
                    return 1;
                }

                return group1.name.localeCompare(group2.name);
            }).map(function(group){
                var admin = that.getAdmin(allAvailableGroupsAdmins, group);
                var isUserInGroup = that.isUserInGroup(group, userId);
                return re(JoinGroupTile, {group: group, userId: userId, admin: admin, isUserInGroup: isUserInGroup, joinGroup: that.joinGroup, key: group._id});
            });

            return re("div", { className: "join-group-page content" },
                re("div", {className: "tiles"},
                    tiles
                )
            );
        }
    });

    function mapStateToProps(state){
        return {
            siteHeaderFiredEvent: state.general.siteHeaderFiredEvent,
            allAvailableGroups: state.groups.allAvailableGroups,
            allAvailableGroupsAdmins: state.groups.allAvailableGroupsAdmins,
            userId: state.authentication.userId
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            resetSiteHeaderEvent: function(){dispatch(action.general.resetSiteHeaderEvent())},
            loadAllAvailableGroups: function(){dispatch(action.groups.loadAllAvailableGroups())},
            initAll: function(){dispatch(action.init.initAll())}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(JoinGroupPage);
})();


