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
            var tiles = users.map(function(user){
                var leader = utils.general.findItemInArrBy(leaders, "userId", user._id);
                return {
                    user: user,
                    score: leader ? leader.score || 0 : 0
                }
            }).sort(function(obj1, obj2){
                return obj2.score - obj1.score;
            }).map(function(obj, index){
                var user = obj.user;
                var score = obj.score;
                return re(LeaderBoardTile, {user: user, score: score, rank: index + 1, key: user._id});
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


