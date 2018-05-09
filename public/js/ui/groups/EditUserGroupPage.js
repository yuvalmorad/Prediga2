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
			var groupIdParam = nextProps.match.params.groupId;
			if (groupIdParam !== this.props.selectedGroupId ) {
				this.props.selectGroup(groupIdParam);
			}

            var groups = nextProps.groups;
            if (groups.length && groups !== this.props.groups) {
                var group = this.getGroupAndSetHeader(groups);
                if (group) {
                    this.setState({group: group, groupName: group.name, groupIcon: group.icon, groupIconColor: group.iconColor});
                }
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
            setSiteHeaderTitle: function(title){dispatch(action.general.setSiteHeaderTitle(title))},
            removeGroup: function(group){dispatch(action.groups.removeGroup(group))},
			selectGroup: function(groupId){dispatch(action.groups.selectGroup(groupId))}
        };
    }

    return connect(mapStateToProps, mapDispatchToProps)(EditUserGroupPage);
})();


