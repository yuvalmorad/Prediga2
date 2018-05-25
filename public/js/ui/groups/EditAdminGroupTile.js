window.component = window.component || {};
component.EditAdminGroupTile = (function(){
	var connect = ReactRedux.connect;
    var Tile = component.Tile;

    var EditAdminGroupTile = React.createClass({
		onClick: function() {
		    var that = this,
                userId = this.props.user._id,
				groupId = this.props.groupId,
                activate = !this.props.isActive;
			service.leaderBoard.activateUser(userId, groupId, activate).then(function(){
				that.props.loadLeaderBoard(groupId); //TODO without rest, add action for update all leagues under this group for this user id (with activate)
            });
        },

        render: function() {
            var props = this.props,
				isActive = props.isActive,
				groupId = props.groupId,
                user = props.user,
                name = user.name,
                photo = user.photo,
                place = user.place,
                joinedDate = user.joinedDate,
                isAdmin = user.isAdmin;

            return re(Tile, {onClick: this.onClick, className: "edit-group-tile" + (isActive ? "" : " not-active")},
                re("div", {className: "edit-group-main-tile"},
                    re("div", {className: "left"},
                        re("img", {src: photo})
                    ),
                    re("div", {className: "center"},
                        re("div", {className: "user-name"}, name),
                        re("div", {className: "user-place"}, place),
                        re("div", {className: "joined-date"}, isAdmin ? "Admin" : joinedDate)
                    ),
                    re("div", {className: "right"},
                        re("button", {className: "remove-user-button" + (isAdmin ? " hide" : ""), onClick: this.props.onRemoveUserFromGroup}, "X")
                    )
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
			loadLeaderBoard: function(groupId){dispatch(action.leaderBoard.loadLeaderBoard(groupId))}
		};
	}

	return connect(mapStateToProps, mapDispatchToProps)(EditAdminGroupTile);
})();


