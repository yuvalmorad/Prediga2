window.component = window.component || {};
component.LeaderBoardPage = (function(){
    var connect = ReactRedux.connect,
        LeaderBoardTiles = component.LeaderBoardTiles,
        LeaguesSubHeader = component.LeaguesSubHeader;

    var isLeaderBoardRequestSent = false;

    var LeaderBoardPage = React.createClass({
        getInitialState: function() {
            if (!isLeaderBoardRequestSent && this.props.leadersStatus === utils.action.REQUEST_STATUS.NOT_LOADED) {
                this.props.loadLeaderBoard(this.props.leadersStatus);
                isLeaderBoardRequestSent = true;
            }

            return {};
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
            selectedLeagueId: state.leagues.selectedLeagueId,
            userId: state.authentication.userId
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            loadLeaderBoard: function(){dispatch(action.leaderBoard.loadLeaderBoard())}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(LeaderBoardPage);
})();


