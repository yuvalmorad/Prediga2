window.component = window.component || {};
component.LeaderBoardTiles = (function(){
    var LeaderBoardTile = component.LeaderBoardTile;

    function getBadgesByUserId(leaders) {
        var strikesMap = {}; //{strikesCount: [<userId>,<userId>,...]}

        //merge by strikes count
        leaders.forEach(function(leader){
			//don't give badge for 0 strikes
            if (leader.strikes > 0) {
				if (strikesMap[leader.strikes] === undefined) {
					strikesMap[leader.strikes] = [];
				}

				strikesMap[leader.strikes].push(leader.userId);
            }
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
                leader = this.filteredLeaders[index],
				indexInOriginLeaders = props.leaders.indexOf(leader),
                users = props.users,
                authenticatedUserId = props.userId,
                disableOpen = props.disableOpen;

            var userId = leader.userId;
            var user = utils.general.findItemInArrBy(users, "_id", userId);
            var trend = leader.placeBeforeLastGame === -1 ? 0 :  leader.placeBeforeLastGame - leader.placeCurrent;
            var borderColor;

            if (trend > 0) {
                borderColor = "#00ff00";
            } else if (trend < 0) {
                borderColor = "red";
            }

            var description = leader.description || leader.strikes + " strikes";
            var badgeName = this.badgesByUserId[userId];

            //adding selected league id to rerender tiles when selecting new league
            var leaderBoardTileProps = {disableOpen: disableOpen, user: user, badgeName: badgeName, score: leader.score, trend: trend, borderColor: borderColor, description: description, additionalDescription: leader.additionalDescription, additionalDescription2: leader.additionalDescription2, scoreCurrentMatch: leader.scoreCurrentMatch, rank: indexInOriginLeaders + 1, key: userId + (props.selectedLeagueId || "") + (props.selectedGroupId || "")};

            if (authenticatedUserId === userId) {
                leaderBoardTileProps.isAuthenticatedUser = true;
            }

            return re(LeaderBoardTile, leaderBoardTileProps);
        },

        getFilteredLeaders: function() {
            var props = this.props,
			    searchName = props.searchName || "",
				leaders = props.leaders,
                users = props.users;

			searchName = searchName.toLowerCase().trim();
			var searchNames = searchName.split(",");
			searchNames = searchNames.map(function(searchName){
				return searchName.trim();
			});

			if (searchNames.length > 1) {
				searchNames = searchNames.filter(function(searchName){
					return searchName !== ""
				});
			}

            return leaders.filter(function(leader){
                var userId = leader.userId;
				var user = utils.general.findItemInArrBy(users, "_id", userId);
				if (!user) {
				    return false;
                }

                var userName = user.name || "";
				userName = userName.toLowerCase();

				return searchNames.filter(function(searchName){
					return userName.indexOf(searchName) >= 0;
				}).length > 0;
            });
        },

		assignLeadersListRef: function(leadersListRef) {
            this.leadersListRef = leadersListRef
        },

		scrollTo: function(userId) {
            if (this.leadersListRef && userId) {
				var index = this.findIndexByUserId(userId);
				this.leadersListRef.scrollTo(index);
			}
        },

        findIndexByUserId: function(userId) {
            var i;
			for (i = 0; i < this.filteredLeaders.length; i++) {
				if (this.filteredLeaders[i].userId === userId) {
					return i;
				}
			}

			return null;
        },

        render: function() {
            var props = this.props,
                userIdFocus = props.userIdFocus,
                index,
                ReactListProps;

            this.filteredLeaders = this.getFilteredLeaders();
			ReactListProps = {
				itemRenderer: this.renderLeader,
				length: this.filteredLeaders.length,
				type: 'variable', //uniform
				ref: this.assignLeadersListRef
			};

           if (userIdFocus) {
               index = this.findIndexByUserId(userIdFocus);
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


