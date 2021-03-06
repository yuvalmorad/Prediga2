window.component = window.component || {};
component.EditAdminGroupTile = (function(){
    var Tile = component.Tile;

    return React.createClass({

        render: function() {
            var props = this.props,
				isActive = true,
                user = props.user,
                name = user.name,
                photo = user.photo,
                place = user.place,
                joinedDate = user.joinedDate,
                isAdmin = user.isAdmin;

            return re(Tile, {className: "edit-group-tile" + (isActive ? "" : " not-active"), disableOpen: true},
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
})();


