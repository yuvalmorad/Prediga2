window.component = window.component || {};
component.EditGroupPage = (function(){
    var connect = ReactRedux.connect;
    var EditGroupTile = component.EditGroupTile;

    var EditGroupPage = React.createClass({
        getInitialState: function() {
            return {};
        },

        componentDidMount: function() {
            this.props.setSiteHeaderTitle("some group name test");
        },

        render: function() {
            var props = this.props;
            var state = this.state;

            var usersInGroup = [
                {
                    name: "Eran Lahav",
                    id: "userId1",
                    photo: "https://lh4.googleusercontent.com/-xQQur_W0nRU/AAAAAAAAAAI/AAAAAAAAGAw/KFtaUU1Ri2I/photo.jpg?sz=50",
                    place: 2,
                    joinedDate: "some date",
                },
                {
                    name: "Shachar Witkovsky",
                    id: "userId2",
                    photo: "https://lh4.googleusercontent.com/-Ig3rThuPJ8Y/AAAAAAAAAAI/AAAAAAAAAD0/Y6gGUD7QIs4/photo.jpg?sz=50",
                    place: 3,
                    joinedDate: "another date",
                    isAdmin: true
                }
            ];

            var tiles = usersInGroup.sort(function(user1, user2){
                if (user1.isAdmin) {
                    return -1;
                }

                if (user2.isAdmin) {
                    return 1;
                }

                return user1.name.localeCompare(user2.name);

            }).map(function(user){
                return re(EditGroupTile, {user: user, key: user.id});
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

        };
    }

    function mapDispatchToProps(dispatch) {
        return {
            setSiteHeaderTitle: function(title){dispatch(action.general.setSiteHeaderTitle(title))}
        };
    }

    return connect(mapStateToProps, mapDispatchToProps)(EditGroupPage);
})();


