window.component = window.component || {};
component.LeaderBoardTiles = (function(){
    var LeaderBoardTile = component.LeaderBoardTile,
		connect = ReactRedux.connect;

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

		onFavouriteToggle: function(userId, event) {
			event.stopPropagation();
			this.props.toggleFavouriteUser(userId);
		},

        renderLeader: function(index, key) {
            var props = this.props,
				favouriteUsersIds = props.favouriteUsersIds || [],
                leader = this.filteredLeaders[index],
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
            var leaderBoardTileProps = {onFavouriteToggle: this.onFavouriteToggle.bind(this, userId), disableOpen: disableOpen, user: user, badgeName: badgeName, score: leader.score, trend: trend, borderColor: borderColor, description: description, additionalDescription: leader.additionalDescription, additionalDescription2: leader.additionalDescription2, scoreCurrentMatch: leader.scoreCurrentMatch, rank: leader.placeCurrent, key: userId + (props.selectedLeagueId || "") + (props.selectedGroupId || "")};

            if (authenticatedUserId === userId) {
                leaderBoardTileProps.isAuthenticatedUser = true;
				leaderBoardTileProps.hideFavouriteIcon = true;
            } else {
            	if (favouriteUsersIds.indexOf(userId) >= 0) {
					leaderBoardTileProps.isFavouriteUser = true;
				}
			}

            return re(LeaderBoardTile, leaderBoardTileProps);
        },

		sortLeadersByThisMatch: function(leaders) {
			return leaders.sort(function(leader1, leader2) {
				var scoreDiff = (leader2.scoreCurrentMatch || 0) - (leader1.scoreCurrentMatch || 0);
				if (scoreDiff === 0) {
					var placeCurrentDiff = (leader1.placeCurrent - leader2.placeCurrent);
					if (placeCurrentDiff === 0) {
						var placeBeforeLastGame1 = leader1.placeBeforeLastGame || 0;
						var placeBeforeLastGame2 = leader2.placeBeforeLastGame || 0;
						return ((leader1.placeCurrent - placeBeforeLastGame1) - (leader2.placeCurrent - placeBeforeLastGame2));
					}

					return placeCurrentDiff;
				}
				return scoreDiff;
			});
		},

		sortLeadersByStrike: function(leaders) {
			leaders.sort(function(leader1, leader2) {
				return leader2.strikes - leader1.strikes;
			});

			var currentPlace = 1;
			var currentStrikes = 0;
			leaders.forEach(function(leader, index){
				if (leader.strikes === currentStrikes) {
					//same strikes as the one above -> same place (no need to increment currentPlace)
					leader.placeCurrent = currentPlace;
				} else {
					//different sore
					currentStrikes = leader.strikes;
					currentPlace = index + 1;
					leader.placeCurrent = currentPlace;
				}

				leader.placeBeforeLastGame = leader.placeCurrent;
			});

			return leaders;
		},

		getSortedLeaders: function() {
			var props = this.props,
				sortByStrike = props.sortByStrike,
				sortByThisMatch = props.sortByThisMatch,
				leaders = props.leaders;

			leaders = JSON.parse(JSON.stringify(leaders));

			if (sortByThisMatch) {
				return this.sortLeadersByThisMatch(leaders);
			} else if (sortByStrike) {
				return this.sortLeadersByStrike(leaders);
			} else {
				return leaders;
			}
		},

        getFilteredLeaders: function(leaders) {
            var props = this.props,
			    searchName = props.searchName || "",
                users = props.users,
				filterByFavouriteUsers = props.filterByFavouriteUsers,
				favouriteUsersIds = props.favouriteUsersIds,
				authenticatedUserId = props.userId;

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

            	if (filterByFavouriteUsers && authenticatedUserId !== userId && favouriteUsersIds.indexOf(userId) === -1) {
					//filter by favourites is on + this is not me + this user is not in favourites -> remove
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

		scrollToTop: function() {
			if (this.leadersListRef) {
				this.leadersListRef.scrollTo(0);
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

		itemSizeGetter: function(index) {
			return 96;
		},

        render: function() {
            var props = this.props,
                userIdFocus = props.userIdFocus,
                index,
                ReactListProps;

			var leaders = this.getSortedLeaders();
			this.filteredLeaders = this.getFilteredLeaders(leaders);

			ReactListProps = {
				itemRenderer: this.renderLeader,
				length: this.filteredLeaders.length,
				type: 'variable', //uniform
				ref: this.assignLeadersListRef,
				itemSizeGetter: this.itemSizeGetter
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


