window.component = window.component || {};
component.JoinGroupTile = (function(){
    var Tile = component.Tile;
    var Secret = component.Secret;

    return React.createClass({
        getInitialState: function() {
            var state = {

            };

            for (var i = 0; i < SECRET_LENGTH; i++) {
                state["secret" + i] = "";
            }

            return state;
        },

        onSecretNumberChanged: function(name, num) {
            var newState = {};
            newState[name] = num;
            this.setState(newState, function(){
                if (this.allSecretFilled()) {
                    this.props.joinGroup(this.props.group._id, this.getSecret());
                }
            });
        },

        allSecretFilled: function() {
            var state = this.state;
            for (var i = 0; i < SECRET_LENGTH; i++) {
                var currentSecret = state["secret" + i];
                if (currentSecret === undefined || currentSecret === "") {
                    return false;
                }
            }

            return true;
        },

        getSecret: function() {
            var secret = "";
            var state = this.state;
            for (var i = 0; i < SECRET_LENGTH; i++) {
                secret += state["secret" + i];
            }

            return secret;
        },

        render: function() {
            var state = this.state,
                props = this.props,
                userId = props.userId,
                admin = props.admin || {},
                group = props.group,
                name = group.name,
                icon = group.icon,
                iconColor = group.iconColor,
                users = group.users,
                playersCount = users.length,
                leaguesCount = group.leagueIds.length,
                isOpenGroup = false, //TODO
                adminName = admin.name;

            var isUserInGroup = users.indexOf(userId) >= 0;

            var secretProps = {
                onNumberChanged: this.onSecretNumberChanged
            };

            for (var i = 0; i < SECRET_LENGTH; i++) {
                secretProps["secret" + i] = state["secret" + i];
            }

            return re(Tile, {disableOpen: isOpenGroup || isUserInGroup, openInPlace: true, className: "join-group-tile"},
                re("div", {className: "join-group-main-tile"},
                    re("div", {className: "left"},
                        re("div", {className: "icon", style: {color: iconColor}}, icon),
                        re("div", {className: "group-name"}, name)
                    ),
                    re("div", {className: "center"},
                        re("div", {className: "players-count"}, playersCount + " Players"),
                        re("div", {className: "leagues-count"}, leaguesCount + " Leagues"),
                        re("div", {className: "admin-name"}, isOpenGroup ? "Open Group" : ((isUserInGroup ? "You are in this group. " : "")  + (adminName ? "Admin: " + adminName : "")))
                    ),
                    re("div", {className: "right"},
                        re("button", {className: "join-group-button" + (isOpenGroup || isUserInGroup ? " hide" : "")}, "+")
                    )
                ),
                re("div", {className: "join-group-form-tile"},
                    re("div", {className: "sub-title"}, "Group Secret:"),
                    re(Secret, secretProps)
                )
            );
        }
    });
})();


