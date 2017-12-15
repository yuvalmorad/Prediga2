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

            var strikesMap = {};

            leaders.forEach(function(leader){
                if (strikesMap[leader.strikes] === undefined) {
                    strikesMap[leader.strikes] = [];
                }

                strikesMap[leader.strikes].push(leader.userId);
            });

            var strikesArr = Object.keys(strikesMap).map(function(strikes){
                return {
                    users: strikesMap[strikes],
                    strikes: strikes
                };
            }).sort(function(obj1, obj2){
                return obj2.strikes - obj1.strikes;
            });

            var i;
            var badgesByUserId = {};
            var badgesCount = 0;
            var badgeNumber = 1;

            for (i = 0; i < strikesArr.length; i++) {
                if (badgesCount >= NUM_OF_BADGES) {
                    break;
                }

                strikesArr[i].users.forEach(function(userId){
                    badgesByUserId[userId] = "badge" + badgeNumber;
                });

                badgeNumber++;
            }


            var tiles = leaders.map(function(leader, index){
                var user = utils.general.findItemInArrBy(users, "_id", leader.userId);
                var trend = leader.placeBeforeLastGame === -1 ? 0 :  leader.placeBeforeLastGame - leader.placeCurrent;
                var borderColor = "#a7a4a4";

                if (trend > 0) {
                    borderColor = "#00ff00";
                } else if (trend < 0) {
                    borderColor = "red";
                }

                var description = leader.strikes + " strikes";
                var badgeName = badgesByUserId[leader.userId];

                return re(LeaderBoardTile, {user: user, badgeName: badgeName, score: leader.score, trend: trend, borderColor: borderColor, description: description, rank: index + 1, key: user._id});
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


