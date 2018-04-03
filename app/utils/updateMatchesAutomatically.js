const schedule = require('node-schedule');
const http = require('http');
const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const utils = require('./util');
const MatchService = require('../services/matchService');
const clubService = require('../services/clubService');

const self = module.exports = {
	run: function () {
		self.runUpdate(utils.UPDATE_ISRAELI_LEAGUE_MATCHES_1, '5a21a7c1a3f89181074e9769', 3, 'up'); // Israeli top league.
		self.runUpdate(utils.UPDATE_ISRAELI_LEAGUE_MATCHES_2, '5a21a7c1a3f89181074e9769', 4, 'bottom'); // Israeli bottom league.
		self.runUpdate(utils.UPDATE_ENGLAND_LEAGUE_MATCHES, '3a21a7c1a3f89181074e9769', 10); // England
		self.runUpdate(utils.UPDATE_SPAIN_LEAGUE_MATCHES, '2a21a7c1a3f89181074e9769', 10); // Spain

		// schedule for next day.
		schedule.scheduleJob(self.getNextDayDate(), function () {
			self.run();
		});
		return Promise.resolve({});
	},
	runUpdate: function (url, leagueId, gamesPerRound, roundType) {
		return clubService.all().then(function (clubs) {
			return self.getLatestData(url).then(function (htmlRawData) {
				if (!htmlRawData || htmlRawData.length < 1) {
					console.log('[Automatic Match Updater] - No content received from remote host');
					return Promise.resolve();
				} else {
					try {
						console.log('[Automatic Match Updater] - Start to parse response...');
						let matches = self.parseResponse(htmlRawData, leagueId, clubs, gamesPerRound, roundType);
						console.log('[Automatic Match Updater] - ' + matches.length + ' relevant matches found...');
						return MatchService.updateMatchesByTeamsAndType(matches);
					} catch (err) {
						console.log('[Automatic Match Updater] - Error with parsing result. ' + err);
						return Promise.resolve();
					}
				}
			});
		});
	},
	getLatestData: function (url) {
		return new Promise(function (resolve, reject) {
			http.get(url, function (res) {
				let str = '';
				res.on('data', function (chunk) {
					//console.log('BODY: ' + chunk);
					str += chunk;
				});

				res.on('end', function () {
					resolve(str);
				});

				res.on('error', function (err) {
					resolve({});
				});
			});
		});
	},
	parseResponse: function (htmlRawData, leagueId, clubs, gamesPerRound, roundType) {
		let matches = [];
		const dom = new JSDOM(htmlRawData);
		let allRows = dom.window.document.querySelectorAll('tr');
		let rowLength = allRows.length;
		for (let i = 1; i < rowLength; i++) {
			let cells = allRows[i].cells;
			self.appendMatch({
				clubsRaw: cells.item(0).textContent,
				scoreRaw: cells.item(1).textContent,
				dateRaw: cells.item(2).textContent,
				timeRaw: cells.item(3).textContent,
				leagueId: leagueId,
				clubs: clubs,
				matches: matches,
				roundType: roundType,
				gamesPerRound: gamesPerRound,
				i: i
			});
		}
		return matches;
	},
	appendMatch: function (input) {
		if (!input.dateRaw) {
			console.log('no date');
			return;
		}
		if (input.clubsRaw === 'משחק') {
			return;
		}

		if (input.scoreRaw.includes(":")) {
			// skipping matches with result.
			return;
		}

		let teams = input.clubsRaw.split(" - ");
		let club1 = self.findClubInArray(input.clubs, teams[0]);
		let club2 = self.findClubInArray(input.clubs, teams[1]);
		if (club1 === null) {
			console.log('club1:' + teams[0]);
			return;
		}
		if (club2 === null) {
			console.log('club2:' + teams[1]);
			return;
		}
		let date = self.parseTime(input.dateRaw, input.timeRaw);
		if (date - new Date() < 0) {
			// in the past.
			return;
		}
		let roundRaw = self.calculateRound(input.matches, date, input.gamesPerRound, input.i, input.leagueId);
		//console.log('round:' + roundRaw);
		let roundText = input.roundType !== undefined ? "Round " + roundRaw + ' ' + input.roundType : "Round " + roundRaw;
		let newMatch = {
			team1: club1._id,
			team2: club2._id,
			kickofftime: date,
			type: roundText,
			roundRaw: roundRaw,
			league: input.leagueId,
			stadium: club1.stadium
		};
		input.matches.push(newMatch);
	},
	calculateRound: function (matches, currentDate, gamesPerRound, i, leagueId) {
		if (matches.length === 0) {
			if (leagueId === '5a21a7c1a3f89181074e9769') {
				if (gamesPerRound === 4){
					return Math.floor(((i - 188) / gamesPerRound) + 1)  + 27;
				} else {
					return Math.floor(((i - 188) / gamesPerRound) + 1)  + 28;
				}
			} else {
				return (Math.floor((i - 2) / gamesPerRound) + 1);
			}
		}
		let lastMatch = matches[matches.length - 1];
		let lastMatchDate = lastMatch.kickofftime;
		var diff = Math.abs(currentDate - lastMatchDate);
		if (diff > (1000 * 60 * 60 * 24 * 2.5)) {
			return lastMatch.roundRaw + 1;
		} else {
			return lastMatch.roundRaw;
		}
	},
	getNextDayDate: function () {
		const nextJob = new Date();
		const now = new Date();
		nextJob.setHours(now.getHours() + 24);
		return nextJob;
	},
	parseTime: function (dateRaw, timeRaw) {
		let hour = "20:00";
		if (timeRaw !== "סקירה" && timeRaw.length > 0) {
			hour = timeRaw;
		}
		let datesSplit = dateRaw.split(".");
		let hourSplit = hour.split(":");
		let sport5TimeOffset = -3;
		return new Date(Date.UTC(20 + datesSplit[2], datesSplit[1] - 1, datesSplit[0], hourSplit[0] + sport5TimeOffset, hourSplit[1]));
	},
	findClubInArray: function (clubs, sport5Name) {
		for (let i = 0; i < clubs.length; i++) {
			if (clubs[i].nameSport5 === sport5Name) {
				return clubs[i];
			}
		}
		return null;
	}
};