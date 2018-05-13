let passport = null;

module.exports = {
	DEFAULT_GROUP: '5a3eac97d3ca76dbd12bf638',
	MONKEY_USER_ID: '5a8739aee1697b0015445020',
	MINUTES_BEFORE_START_MATCH_PROPERTY_NAME: 'minutesBeforeCloseMathPrediction',
	LAST_PREDICTIONS_LIMIT_UI: 600,
	MATCH_CONSTANTS: {
		DRAW: 'draw',
		NONE: 'none'
	},
	updateSettings: {
		upsert: true, setDefaultsOnInsert: false, isNew: true, new: true, returnNewDocument: true
	},
	AUTOMATIC_UPDATE_URL: 'http://365scores.sport5.co.il:3333?SID=1',
	UPDATE_ISRAELI_LEAGUE_MATCHES_1: 'http://www.sport5.co.il/Ajax/GetCycleTeamGamesPopup.aspx?LSnum=7580',
	UPDATE_ISRAELI_LEAGUE_MATCHES_2: 'http://www.sport5.co.il/Ajax/GetCycleTeamGamesPopup.aspx?LSnum=7581',
	UPDATE_ENGLAND_LEAGUE_MATCHES: 'http://www.sport5.co.il/Ajax/GetCycleTeamGamesPopup.aspx?LSnum=5387',
	UPDATE_SPAIN_LEAGUE_MATCHES: 'http://www.sport5.co.il/Ajax/GetCycleTeamGamesPopup.aspx?LSnum=6411',
	USER_SETTINGS_KEYS: {
		PUSH_NOTIFICATION: "PUSH_NOTIFICATION",
		RANDOM_ALL: "RANDOM_ALL",
		COPY_ALL_GROUPS: "COPY_ALL_GROUPS"
	},
	USER_SETTINGS_VALUES: {
		TRUE: "true",
		FALSE: "false"
	},

	init: function(_passport) {
        passport = _passport;
	},

	isLoggedIn: function (req, res, next) {
		if (req.isAuthenticated()) {
			res.header('userId', req.user.id);
			return next();
		} else {
            passport.authenticate('bearer', function(err, user, info) {
                if (err) {
                    return next(err); // will generate a 500 error
                }

                if (!user) {
                    return res.status(401).json({});
                }

                res.header('userId', user.id);

                req.login(user,  function(loginErr) {
                    if (loginErr) {
                        return next(loginErr);
                    }
                    return next();
            	});
            })(req, res, next);
		}
	},

	isAdmin: function (req, res, next) {
		if (req.isAuthenticated() && req.user.hasRole('admin')) {
			return next();
		} else {
			res.status(403).json({});
		}
	},
	calculateResult: function (userPrediction, realResult, configScore) {
		if (userPrediction.toString().toLowerCase() === realResult.toString().toLowerCase()) {
			return configScore;
		} else {
			return 0;
		}
	},
	mergeArr: function (arr) {
		let mergedArr = [];
		arr.forEach(function (subArray) {
			subArray.forEach(function (item) {
				mergedArr = mergedArr.concat(item);
			});
		});
		return mergedArr;
	},
	processEachItemSynchronic: function (fn, arr, input) {
		let index = -1;

		function next() {
			if (index < arr.length - 1) {
				index = index + 1;
				fn(input, arr[index], index).then(next);
			}
		}

		next();
	}
};