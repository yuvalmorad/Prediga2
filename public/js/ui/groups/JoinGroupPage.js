window.component = window.component || {};
component.JoinGroupPage = (function(){
    var connect = ReactRedux.connect;
    var JoinGroupTile = component.JoinGroupTile;
    var isRequestSent = false;

    var JoinGroupPage = React.createClass({
        getInitialState: function() {
            if (!isRequestSent) {
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

        render: function() {
            var allGroups = [
                {
                    name: "Prediga",
                    icon: "",
                    iconColor: "#0d61c4",
                    id: "_group1",
                    playersCount: 3654,
                    leaguesCount: 11,
                    isOpen: true
                },
                {
                    name: "SAP Labs Israel",
                    icon: "",
                    iconColor: "#4a90e2",
                    id: "_group2",
                    playersCount: 261,
                    leaguesCount: 3,
                    isOpen: false,
                    adminName: "Yuval Morad"
                },
                {
                    name: "Man.Utd Ultras",
                    icon: "",
                    iconColor: "#d0021b",
                    id: "_group3",
                    playersCount: 80,
                    leaguesCount: 2,
                    isOpen: false,
                    adminName: "Gilad Keinan"
                }
            ];

            var tiles = allGroups.map(function(group){
                return re(JoinGroupTile, {group: group, key: group.id});
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
            siteHeaderFiredEvent: state.general.siteHeaderFiredEvent
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            resetSiteHeaderEvent: function(){dispatch(action.general.resetSiteHeaderEvent())}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(JoinGroupPage);
})();


