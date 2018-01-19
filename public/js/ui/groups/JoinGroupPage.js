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

        render: function() {
            var that = this,
                props = this.props,
                allAvailableGroups = props.allAvailableGroups,
                allAvailableGroupsAdmins = props.allAvailableGroupsAdmins,
                userId = props.userId;

            var tiles = allAvailableGroups.map(function(group){
                var admin = utils.general.findItemInArrBy(allAvailableGroupsAdmins, "_id", group.createdBy);
                return re(JoinGroupTile, {group: group, userId: userId, admin: admin, joinGroup: that.joinGroup, key: group._id});
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


