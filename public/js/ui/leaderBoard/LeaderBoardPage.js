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
            var users = this.props.leaderBoard.users;
            var tiles = users.sort(function(user1, user2){
                return user2.points - user1.points;
            }).map(function(_user, index){
                var user = Object.assign({}, _user, {rank: index + 1});
                return re(LeaderBoardTile, {user: user, key: user.id});
            });

            return re("div", { className: "content" },
                tiles
            );
        }
    });

    function mapStateToProps(state){
        return {
            leaderBoard: state.leaderBoard
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            loadLeaderBoard: function(){dispatch(action.leaderBoard.loadLeaderBoard())}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(LeaderBoardPage);
})();


