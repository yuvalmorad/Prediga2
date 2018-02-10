window.component = window.component || {};
component.EditUserGroupPage = (function(){
    var connect = ReactRedux.connect;

    var EditUserGroupPage = React.createClass({
        getInitialState: function() {
            var group = this.getGroupAndSetHeader(this.props.groups);
            return {
                group: group
            };
        },

        componentWillReceiveProps: function(nextProps) {
            var groups = nextProps.groups;
            if (groups.length && groups !== this.props.groups) {
                var group = this.getGroupAndSetHeader(groups);
                this.setState({group: group, groupName: group.name, groupIcon: group.icon, groupIconColor: group.iconColor});
            }
        },

        getGroupAndSetHeader: function(groups) {
            var groupId = this.props.match.params.groupId;
            var group = utils.general.findItemInArrBy(groups, "_id", groupId);
            if (group) {
                this.props.setSiteHeaderTitle(group.name);
            }
            return group;
        },

        leaveGroup: function() {
            if (confirm("Are you sure you want to leave this group?")) {
                service.groups.unregister(this.state.group._id).then(function(){
                    //remove group
                    
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
            setSiteHeaderTitle: function(title){dispatch(action.general.setSiteHeaderTitle(title))}
        };
    }

    return connect(mapStateToProps, mapDispatchToProps)(EditUserGroupPage);
})();


