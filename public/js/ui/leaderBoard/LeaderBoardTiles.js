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

    return function(props) {
        var leaders = props.leaders,
            users = props.users,
            disableOpen = props.disableOpen,
            badgesByUserId = getBadgesByUserId(leaders),
            tiles = leaders.map(function(leader, index){
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

                return re(LeaderBoardTile, {disableOpen: disableOpen, user: user, badgeName: badgeName, score: leader.score, trend: trend, borderColor: borderColor, description: description, rank: index + 1, key: user._id});
            });

        if (props.displayFirstTileByUserId) {
            var tileUserIdIndex = utils.general.findItemInArrBy(tiles, "props.user._id", props.displayFirstTileByUserId, true);
            if (tileUserIdIndex !== undefined) {
                var moveToFirstTile = tiles.splice(tileUserIdIndex,1);
                tiles.unshift(moveToFirstTile);
            }
        }

        return re("div", {className: "tiles"},
            tiles
        )
    };
})();


