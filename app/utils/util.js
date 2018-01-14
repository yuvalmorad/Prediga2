module.exports = {
	DEFAULT_GROUP: '5a3eac97d3ca76dbd12bf638',
	okResponse: {"status": "OK"},
	updateSettings: {
		upsert: true, setDefaultsOnInsert: true, isNew: true, new: true
	},
	overrideSettings: {
		overwrite: true, setDefaultsOnInsert: true, isNew: true, new: true
	},
	getErrorResponse: function (msg) {
		return {"status": "Error", "message": msg};
	},
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
	}
};