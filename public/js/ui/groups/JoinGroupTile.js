window.component = window.component || {};
component.JoinGroupTile = (function(){
    var Tile = component.Tile;

    return React.createClass({
        render: function() {
            var props = this.props,
                group = props.group,
                name = group.name,
                playersCount = group.playersCount,
                leaguesCount = group.leaguesCount,
                isOpen = group.isOpen,
                adminName = group.adminName;

            return re(Tile, {disableOpen: true, className: "join-group-tile"},
                re("div", {className: "join-group-main-tile"},
                    re("div", {className: "left"},
                        re("div", {className: "group-name"}, name)
                    ),
                    re("div", {className: "center"},
                        re("div", {className: "players-count"}, playersCount + " Players"),
                        re("div", {className: "leagues-count"}, leaguesCount + " Leagues"),
                        re("div", {className: "admin-name"}, isOpen ? "Open Group" : "Admin: " + adminName),
                    ),
                    re("div", {className: "right"},
                        re("button", {className: "join-group-button" + (isOpen ? " hide" : "")}, "+")
                    ),
                )
            );
        }
    });
})();


