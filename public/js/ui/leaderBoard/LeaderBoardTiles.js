window.component = window.component || {};
component.LeaderBoardTiles = (function(){
    var LeaderBoardTile = component.LeaderBoardTile;

    function getBadgesByUserId(leaders) {
        var strikesMap = {}; //{strikesCount: [<userId>,<userId>,...]}

        //merge by strikes count
        leaders.forEach(function(leader){
            if (strikesMap[leader.strikes] === undefined) {
                strikesMap[leader.strikes] = [];
            }

            strikesMap[leader.strikes].push(leader.userId);
        });

        //map back to arr + sort by strikes
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
                badgesCount++;
            });

            badgeNumber++;
        }

        return badgesByUserId;
    }

    var LeaderBoardTiles = React.createClass({

        componentWillUpdate: function(nextProps, nextState) {
            if (nextProps.leaders !== this.props.leaders) {
                this.setBadgesByUserId(nextProps.leaders);
            }
        },

        getInitialState: function() {
            this.setBadgesByUserId(this.props.leaders);
            return {};
        },

        setBadgesByUserId: function(leaders) {
            this.badgesByUserId = getBadgesByUserId(leaders);
        },

        renderLeader: function(index, key) {
            var props = this.props,
                leaders = props.leaders,
                leader = leaders[index],
                users = props.users,
                authenticatedUserId = props.userId,
                disableOpen = props.disableOpen;

            var userId = leader.userId;
            var user = utils.general.findItemInArrBy(users, "_id", userId);
            var trend = leader.placeBeforeLastGame === -1 ? 0 :  leader.placeBeforeLastGame - leader.placeCurrent;
            var borderColor = "#a7a4a4";

            if (trend > 0) {
                borderColor = "#00ff00";
            } else if (trend < 0) {
                borderColor = "red";
            }

            var description = leader.description || leader.strikes + " strikes";
            var badgeName = this.badgesByUserId[userId];

            //adding selected league id to rerender tiles when selecting new league
            var leaderBoardTileProps = {disableOpen: disableOpen, user: user, badgeName: badgeName, score: leader.score, trend: trend, borderColor: borderColor, description: description, additionalDescription: leader.additionalDescription, additionalDescription2: leader.additionalDescription2, rank: index + 1, key: userId + (props.selectedLeagueId || "") + (props.selectedGroupId || "")};

            if (authenticatedUserId === userId) {
                leaderBoardTileProps.isAuthenticatedUser = true;
            }

            return re(LeaderBoardTile, leaderBoardTileProps);
        },

        render: function() {
            var props = this.props,
                leaders = props.leaders,
                userIdFocus = props.userIdFocus,
                i,
                index,
                ReactListProps = {
                    itemRenderer: this.renderLeader,
                    length: leaders.length,
                    type: 'uniform'
                };

           if (userIdFocus) {
               for (i = 0; i < leaders.length; i++) {
                   if (leaders[i].userId === userIdFocus) {
                       index = i;
                       break;
                   }
               }
           }

           if (index !== undefined) {
               ReactListProps.initialIndex = index;
           }

            return re("div", {className: "tiles"},
                re(ReactList, ReactListProps)
            )
        }
    });

    return LeaderBoardTiles;
})();


