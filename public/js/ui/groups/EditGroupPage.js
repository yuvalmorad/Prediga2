window.component = window.component || {};
component.EditGroupPage = (function(){
    var connect = ReactRedux.connect;
    var EditGroupTile = component.EditGroupTile;

    var EditGroupPage = React.createClass({
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
                this.setState({group: group});
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

        render: function() {
            var props = this.props;
            var state = this.state;
            var group = state.group;
            var users = props.users;
            var usersInGroup = [];

            if (group) {
                usersInGroup = group.users.map(function(userId){
                    var user = utils.general.findItemInArrBy(users, "_id", userId);
                    return Object.assign({}, user, {
                        isAdmin: userId === group.createdBy,
                        place: "some place", //TODO
                        joinedDate: "some date" //TODO
                    });
                });
            }

            var tiles = usersInGroup.sort(function(user1, user2){
                if (user1.isAdmin) {
                    return -1;
                }

                if (user2.isAdmin) {
                    return 1;
                }

                return user1.name.localeCompare(user2.name);
            }).map(function(user){
                return re(EditGroupTile, {user: user, key: user._id});
            });

            return re("div", { className: "edit-group-page content" },
                re("div", {className: "tiles"},
                    tiles
                )
            );
        }
    });

    function mapStateToProps(state){
        return {
            groups: state.groups.groups,
            users: state.users.users
        };
    }

    function mapDispatchToProps(dispatch) {
        return {
            setSiteHeaderTitle: function(title){dispatch(action.general.setSiteHeaderTitle(title))}
        };
    }

    return connect(mapStateToProps, mapDispatchToProps)(EditGroupPage);
})();


