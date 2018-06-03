window.component = window.component || {};
component.EditUserGroupPage = (function(){
    var connect = ReactRedux.connect;

    var EditUserGroupPage = React.createClass({
        getInitialState: function() {
            var group = this.getGroup(this.props.groups);
            return {
                group: group
            };
        },

        componentWillReceiveProps: function(nextProps) {
            var groups = nextProps.groups;
            if (groups.length && groups !== this.props.groups) {
                var group = this.getGroup(groups);
                if (group) {
                    this.setState({group: group, groupName: group.name, groupIcon: group.icon, groupIconColor: group.iconColor});
                }
            }
        },

        getGroup: function(groups) {
            var groupId = this.props.match.params.groupId;
            return utils.general.findItemInArrBy(groups, "_id", groupId);
        },

        leaveGroup: function() {
            var props = this.props;
            var state = this.state;
            if (confirm("Are you sure you want to leave this group?")) {
                service.groups.unregister(state.group._id).then(function(){
                    props.removeGroup(state.group);
                    routerHistory.goBack();
                }, function(){
                    alert("failed leave group");
                })
            }
        },

        render: function() {
            return re("div", { className: "edit-group-page content" },
                re("div", {className: "scroll-container"},
                    re("button", {className: "leave-group-button", onClick: this.leaveGroup}, "Leave Group")
                )
            );
        }
    });

    function mapStateToProps(state){
        return {
            groups: state.groups.groups
        };
    }

    function mapDispatchToProps(dispatch) {
        return {
            removeGroup: function(group){dispatch(action.groups.removeGroup(group))},
        };
    }

    return connect(mapStateToProps, mapDispatchToProps)(EditUserGroupPage);
})();


