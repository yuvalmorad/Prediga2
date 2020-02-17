const schedule = require('node-schedule');
const http = require('http');
const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const MatchService = require('../services/matchService');
const LeagueService = require('../services/leagueService');
const clubService = require('../services/clubService');
const self = module.exports = {
	run: function (isFirstRun) {
		if (isFirstRun) {
			return self.runUpdate();
		} else {
			schedule.scheduleJob(self.getNextDayDate(), function () {
				self.run();
			});
			return Promise.resolve({});
		}
	},
	runUpdate: function () {
		return clubService.all().then(function (clubs) {
			return self.runUpdateInner(clubs).then(function () {
				schedule.scheduleJob(self.getNextDayDate(), function () {
					self.run();
				});
				return Promise.resolve();
			});
		});
	},
	runUpdateInner: function(clubs){
		return LeagueService.getActiveLeagues().then(function (leagues) {
			const promises = leagues.map(function (league) {
				return self.getLatestData(league.updateUrl).then(function (htmlRawData) {
					if (!htmlRawData || htmlRawData.length < 1) {
						//console.log('[Automatic Match Updater] - No content received from remote host');
						return Promise.resolve();
					} else {
						try {
							//console.log('[Automatic Match Updater] - Start to parse response...');
							let matches = self.parseResponse(htmlRawData, league._id, clubs, league.leagueFirstMatchDate);
							//console.log('[Automatic Match Updater] - ' + matches.length + ' relevant matches found...');
							return MatchService.updateMatchesByTeamsAndType(matches);
						} catch (err) {
							console.log('[Automatic Match Updater] - Error with parsing result. ' + err);
							return Promise.resolve();
						}
					}
				});
			});
			return Promise.all(promises);
		});
	},
	getLatestData: function (url) {
		return new Promise(function (resolve, reject) {
		    if (url){
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
            } else {
		        resolve({});
            }
		});
	},
	parseResponse: function (htmlRawData, leagueId, clubs, leagueFirstMatchDate) {
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
				leagueFirstMatchDate: leagueFirstMatchDate,
				clubs: clubs,
				matches: matches
			});
		}
		return matches;
	},
	appendMatch: function (input) {
		if (!input.dateRaw) {
			//console.log('no date');
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
			//console.log('club1:' + teams[0]);
			return;
		}
		if (club2 === null) {
			//console.log('club2:' + teams[1]);
			return;
		}
		let date = self.parseTime(input.dateRaw, input.timeRaw);
		if (date - new Date() < 0) {
			// in the past.
			return;
		}

		let weekId = Math.floor((((date - input.leagueFirstMatchDate) / 86400000) + input.leagueFirstMatchDate.getDay() + 1) / 7);
		let roundText = "Week " + weekId;
		let newMatch = {
			team1: club1._id,
			team2: club2._id,
			kickofftime: date,
			type: roundText,
			league: input.leagueId,
			stadium: club1.stadium
		};
		input.matches.push(newMatch);
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
		let hours = Number(hourSplit[0]) + sport5TimeOffset;
		let date = new Date(20 + datesSplit[2], datesSplit[1] - 1, datesSplit[0], hours, hourSplit[1]);
		//console.log('Date of match parsed:' + date);
		return date;
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