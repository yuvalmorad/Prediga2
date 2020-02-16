const MatchResult = require("../models/matchResult");
const TeamResult = require("../models/teamResult");
const MatchPrediction = require("../models/matchPrediction");
const TeamPrediction = require("../models/teamPrediction");
const UserScore = require("../models/userScore");
const UserSettings = require("../models/userSettings");
const UsersLeaderboard = require("../models/usersLeaderboard");
const Club = require("../models/club");
const Match = require("../models/match");
const utils = require("../utils/util");
const Group = require("../models/group");
const User = require("../models/user");
const pushSubscription = require("../models/pushSubscription");

const self = module.exports = {

	run: function () {
		return Promise.all([

		]).then(function (arr) {
			//console.log('[Init] - Migration finished');
		});
	}
};