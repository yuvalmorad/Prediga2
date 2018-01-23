let LEAGUE_ID = '3a21a7c1a3f89181074e9769';
let GAMES_PER_ROUND = 10;
let MATCH_ID = '4a21a7c1a3f89181074e9';

function getClubIdByName365(name365) {
	let filtered = clubs.filter(function (club) {
		if (club.name365 === name365) {
			return club;
		}
	});
	if (!filtered[0]) {
		return 'XXX';
	}
	return (filtered[0])._id;
}

function getStadiumByName365(name365) {
	let filtered = clubs.filter(function (club) {
		if (club.name365 === name365) {
			return club;
		}
	});
	if (!filtered[0]) {
		return 'XXX';
	}
	return (filtered[0]).stadium;
}

let clubs = [
	{
		"_id": "1a21a7c1a3f89181074e9762",
		"name": "Arsenal",
		"name365": "ארסנל",
		"shortName": "ARS",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "King Power Stadium"
	},
	{
		"_id": "1a21a7c1a3f89181074e9763",
		"name": "Leicester City",
		"name365": "לסטר",
		"shortName": "LES",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "King Power Stadium"
	},
	{
		"_id": "1a21a7c1a3f89181074e9764",
		"name": "Bournemouth",
		"name365": "בורנמות'",
		"shortName": "BOU",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "Dean Court"
	},
	{
		"_id": "1a21a7c1a3f89181074e9765",
		"name": "Brighton",
		"name365": "ברייטון",
		"shortName": "BRI",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "Falmer Stadium"
	},
	{
		"_id": "1a21a7c1a3f89181074e9766",
		"name": "Manchester City",
		"name365": "מנצ'סטר סיטי",
		"shortName": "MC",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "Etihad Stadium"
	},
	{
		"_id": "1a21a7c1a3f89181074e9767",
		"name": "Chelsea",
		"name365": "צ'לסי",
		"shortName": "CHE",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "Stamford Bridge"
	},
	{
		"_id": "1a21a7c1a3f89181074e9768",
		"name": "Burnley",
		"name365": "ברנלי",
		"shortName": "BUR",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "Turf Moor"
	},
	{
		"_id": "1a21a7c1a3f89181074e9769",
		"name": "Crystal Palace",
		"name365": "קריסטל פאלאס",
		"shortName": "CP",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "Selhurst Park"
	},
	{
		"_id": "1a21a7c1a3f89181074e9770",
		"name": "Huddersfield",
		"name365": "האדרספילד",
		"shortName": "HUD",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "Kirklees Stadium"
	},
	{
		"_id": "1a21a7c1a3f89181074e9771",
		"name": "Everton",
		"name365": "אברטון",
		"shortName": "EVE",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "Goodison Park"
	},
	{
		"_id": "1a21a7c1a3f89181074e9772",
		"name": "Stoke City",
		"name365": "סטוק סיטי",
		"shortName": "STO",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "bet365 Stadium"
	},
	{
		"_id": "1a21a7c1a3f89181074e9773",
		"name": "Manchester United",
		"name365": "מנצ'סטר יונייטד",
		"shortName": "MU",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "Old Trafford"
	},
	{
		"_id": "1a21a7c1a3f89181074e9774",
		"name": "West Ham United",
		"name365": "ווסטהאם",
		"shortName": "WHU",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "London Stadium"
	},
	{
		"_id": "1a21a7c1a3f89181074e9775",
		"name": "Newcastle United",
		"name365": "ניוקאסל",
		"shortName": "NEW",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "St James' Park"
	},
	{
		"_id": "1a21a7c1a3f89181074e9776",
		"name": "Tottenham Hotspur",
		"name365": "טוטנהאם",
		"shortName": "TOT",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "Wembley Stadium"
	},
	{
		"_id": "1a21a7c1a3f89181074e9777",
		"name": "Southampton",
		"name365": "סאות'המפטון",
		"shortName": "SOU",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "St Mary's Stadium"
	},
	{
		"_id": "1a21a7c1a3f89181074e9778",
		"name": "Swansea City",
		"name365": "סוונזי",
		"shortName": "SWA",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "Liberty Stadium"
	},
	{
		"_id": "1a21a7c1a3f89181074e9779",
		"name": "Watford",
		"name365": "ווטפורד",
		"shortName": "WAT",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "Vicarage Road"
	},
	{
		"_id": "1a21a7c1a3f89181074e9780",
		"name": "Liverpool",
		"name365": "ליברפול",
		"shortName": "LIV",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "Anfield"
	},
	{
		"_id": "1a21a7c1a3f89181074e9781",
		"name": "West Bromwich",
		"name365": "ווסט ברומיץ'",
		"shortName": "WB",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "The Hawthorns"
	}
];


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
	let team1 = getClubIdByName365(teams[0]);
	let team2 = getClubIdByName365(teams[1]);
	let newMatch = {
		_id: MATCH_ID + idNum,
		team1: team1,
		team2: team2,
		kickofftime: parseTime(input.dateRaw, input.timeRaw),
		type: "Round " + (Math.floor(round / GAMES_PER_ROUND) + 1), // 10 games per round
		league: LEAGUE_ID,
		stadium: getStadiumByName365(teams[0])
	};
	allGames.push(newMatch);

	if (input.scoreRaw.includes(":")) {
		let scoreParse = parseScore(input.scoreRaw, team1, team2);
		gamesResults.push({
			matchId: newMatch._id,
			winner: scoreParse.winner,
			team1Goals: scoreParse.team1Goals,
			team2Goals: scoreParse.team2Goals,
			goalDiff: Math.abs(scoreParse.team1Goals - scoreParse.team2Goals),
			firstToScore: 'None' // TBD
		});
	}
}

let idNum = 100;
let round = -1;
const allGames = [];
const gamesResults = [];

function init() {
	let gamesTable = document.getElementById("result-table");
	let rowLength = gamesTable.rows.length;

	for (let i = 1; i < rowLength; i++) { //rowLength
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

	console.log(JSON.stringify(allGames));
	console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
	console.log(JSON.stringify(gamesResults));
}
