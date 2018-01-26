module.exports = {
	DEFAULT_GROUP: '5a3eac97d3ca76dbd12bf638',
	MINUTES_BEFORE_START_MATCH_PROPERTY_NAME: 'minutesBeforeCloseMathPrediction',
	LAST_PREDICTIONS_LIMIT_UI: 6,
	MATCH_CONSTANTS: {
		DRAW: 'draw',
		NONE: 'none'
	},
	updateSettings: {
		upsert: true, setDefaultsOnInsert: true, isNew: true, new: true, returnNewDocument: true
	},
	AUTOMATIC_UPDATE_URL: 'http://365scores.sport5.co.il:3333?SID=1',
	isLoggedIn: function (req, res, next) {
		if (req.isAuthenticated()) {
			res.header('userId', req.user.id);
			return next();
		} else {
			res.status(401).json({});
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
		arr.forEach(function (item) {
			mergedArr = mergedArr.concat(item);
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