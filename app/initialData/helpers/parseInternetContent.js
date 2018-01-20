function parseTime(dateRaw, timeRaw) {
	let hour = "20:00";
	if (timeRaw !== "סקירה" && timeRaw.length > 0) {
		hour = timeRaw;
	}

	let datesSplit = dateRaw.split(".");
	let hourSplit = hour.split(":");
	return new Date(20 + datesSplit[2], datesSplit[1] - 1, datesSplit[0], hourSplit[0], hourSplit[1]);
}

function parseScore(scoreRaw, team1, team2) {
	let scoreSplit = scoreRaw.split(":");
	let team1Goals = scoreSplit[0];
	let team2Goals = scoreSplit[1];
	let winner = 'Draw';
	if (team1Goals > team2Goals) {
		winner = team1;
	} else if (team1Goals < team2Goals) {
		winner = team2;
	}
	return {
		winner: winner,
		team1Goals: team1Goals,
		team2Goals: team2Goals
	}
}

function createNawMatch(input) {
	if (!input.dateRaw) {
		console.log('no dateRaw');
		return;
	}

	round += 1;
	idNum += 1;

	let teams = input.clubsRaw.split(" - ");
	let newMatch = {
		_id: id + idNum,
		team1: teams[0],
		team2: teams[1],
		kickofftime: parseTime(input.dateRaw, input.timeRaw),
		type: "Round " + (Math.floor(round / 10) + 1), // 10 games per round
		league: '3a21a7c1a3f89181074e9769',
		stadium: ''
	};
	allGames.push(newMatch);

	if (input.scoreRaw.includes(":")) {
		let scoreParse = parseScore(input.scoreRaw, teams[0], teams[1]);
		gamesResults.push({
			matchId: newMatch._id,
			winner: scoreParse.winner,
			team1Goals: scoreParse.team1Goals,
			team2Goals: scoreParse.team2Goals,
			goalDiff: Math.abs(scoreParse.team1Goals - scoreParse.team2Goals),
			firstToScore: 'None' // TBD
		});
	}

	console.log(JSON.stringify(allGames));
	console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
	console.log(JSON.stringify(gamesResults));
}

let id = '4a21a7c1a3f89181074e97';
let idNum = 0;
let round = -1;
const allGames = [];
const gamesResults = [];

function init() {
	let gamesTable = document.getElementById("result-table");
	let rowLength = gamesTable.rows.length;

	for (let i = 1; i < 20; i++) { //rowLength
		let oCells = gamesTable.rows.item(i).cells;
		let clubsRaw = oCells.item(0).innerText;
		let scoreRaw = oCells.item(1).innerText;
		let dateRaw = oCells.item(2).innerText;
		let timeRaw = oCells.item(3).innerText;
		createNawMatch({
			clubsRaw: clubsRaw,
			scoreRaw: scoreRaw,
			dateRaw: dateRaw,
			timeRaw: timeRaw
		});
	}
}
