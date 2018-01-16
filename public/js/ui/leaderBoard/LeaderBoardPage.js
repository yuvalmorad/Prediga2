window.component = window.component || {};
component.LeaderBoardPage = (function(){
    var connect = ReactRedux.connect,
        LeaderBoardTiles = component.LeaderBoardTiles,
        LeaguesSubHeader = component.LeaguesSubHeader;

    var LeaderBoardPage = React.createClass({
        getInitialState: function() {
            if (this.props.selectedGroupId) {
                this.props.loadLeaderBoard(this.props.selectedGroupId);
            }

            return {};
        },

        componentWillReceiveProps: function(nextProps) {
            if (nextProps.selectedGroupId !== this.props.selectedGroupId) {
                //changed group selection -> load leader board of selected group id
                this.props.loadLeaderBoard(nextProps.selectedGroupId);
            }
        },

        render: function() {
            var props = this.props,
                selectedLeagueId = props.selectedLeagueId,
                leaders = props.leaders,
                users = props.users,
                userId = props.userId;

            if (!leaders.length || !users.length) {
                return re("div", {className: "content"});
            }

            leaders = utils.general.getLeadersByLeagueId(leaders, selectedLeagueId);
            return re("div", { className: "content hasSubHeader" },
                re(LeaguesSubHeader, {}),
                re(LeaderBoardTiles, {leaders: leaders, users: users, userId: userId, selectedLeagueId: selectedLeagueId})
            );
        }
    });

    function mapStateToProps(state){
        return {
            leaders: state.leaderBoard.leaders,
            leadersStatus: state.leaderBoard.status,
            users: state.users.users,
            selectedLeagueId: state.groups.selectedLeagueId,
            userId: state.authentication.userId,
            selectedGroupId: state.groups.selectedGroupId
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            loadLeaderBoard: function(groupId){dispatch(action.leaderBoard.loadLeaderBoard(groupId))}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(LeaderBoardPage);
})();


