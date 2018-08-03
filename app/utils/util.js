let passport = null;

module.exports = {
	DEFAULT_GROUP: '5a3eac97d3ca76dbd12bf638',
	MONKEY_GUNNER_USER_ID: '5a8739aee1697b0015445020',
    MONKEY_STRIKER_USER_ID: '5b26437c7d607d0015d54791',
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
		if (typeof(realResult) !== "undefined" && typeof(userPrediction) !== 'undefined' && userPrediction.toString().toLowerCase() === realResult.toString().toLowerCase()) {
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