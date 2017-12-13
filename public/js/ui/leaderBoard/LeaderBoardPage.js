component.LeaderBoardPage = (function(){
    var connect = ReactRedux.connect,
        LeaderBoardTile = component.LeaderBoardTile;

    var isLeaderBoardRequestSent = false;

    var LeaderBoardPage = React.createClass({
        getInitialState: function() {
            if (!isLeaderBoardRequestSent) {
                this.props.loadLeaderBoard();
                isLeaderBoardRequestSent = true;
            }

            return {};
        },

        render: function() {
            var leaders = this.props.leaders;
            var users = this.props.users;
            var tiles = leaders.map(function(leader, index){
                var user = utils.general.findItemInArrBy(users, "_id", leader.userId);
                var trend = leader.placeBeforeLastGame === -1 ? 0 :  leader.placeBeforeLastGame - leader.placeCurrent;
                var description = leader.strikes + " strikes";
                return re(LeaderBoardTile, {user: user, score: leader.score, trend: trend, description: description, rank: index + 1, key: user._id});
            });
            
            return re("div", { className: "content" },
                re("div", {className: "tiles"},
                    tiles
                )
            );
        }
    });

    function mapStateToProps(state){
        return {
            leaders: state.leaderBoard.leaders,
            users: state.leaderBoard.users
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            loadLeaderBoard: function(){dispatch(action.leaderBoard.loadLeaderBoard())}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(LeaderBoardPage);
})();


