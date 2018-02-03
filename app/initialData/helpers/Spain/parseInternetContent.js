let LEAGUE_ID = '2a21a7c1a3f89181074e9769';
let GAMES_PER_ROUND = 10;
let MATCH_ID = '4a21a7c1a3f89181075e9';

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
		"_id": "1a21a7c1a3f89181074e9862",
		"name": "Deportivo La Coruña",
		"name365": "דפורטיבו לה קורוניה",
		"shortName": "DLC",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "Abanca-Riazor"
	},
	{
		"_id": "1a21a7c1a3f89181074e9863",
		"name": "Real Madrid",
		"name365": "ריאל מדריד",
		"shortName": "RM",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "Santiago Bernabéu"
	},
	{
		"_id": "1a21a7c1a3f89181074e9864",
		"name": "Girona",
		"name365": "ג'ירונה",
		"shortName": "GIR",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "Montilivi"
	},
	{
		"_id": "1a21a7c1a3f89181074e9865",
		"name": "Atlético Madrid",
		"name365": "אתלטיקו מדריד",
		"shortName": "AM",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "Wanda Metropolitano"
	},
	{
		"_id": "1a21a7c1a3f89181074e9866",
		"name": "Málaga",
		"name365": "מלאגה",
		"shortName": "MAL",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "La Rosaleda"
	},
	{
		"_id": "1a21a7c1a3f89181074e9867",
		"name": "Eibar",
		"name365": "אייבר",
		"shortName": "EIB",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "Ipurua"
	},
	{
		"_id": "1a21a7c1a3f89181074e9868",
		"name": "Athletic Bilbao",
		"name365": "אתלטיק בילבאו",
		"shortName": "AB",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "San Mamés"
	},
	{
		"_id": "1a21a7c1a3f89181074e9869",
		"name": "Getafe",
		"name365": "חטאפה",
		"shortName": "GAT",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "Coliseum Alfonso Pérez"
	},
	{
		"_id": "1a21a7c1a3f89181074e9870",
		"name": "Sevilla",
		"name365": "סביליה",
		"shortName": "SEV",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "Ramón Sánchez Pizjuán"
	},
	{
		"_id": "1a21a7c1a3f89181074e9871",
		"name": "Espanyol",
		"name365": "אספניול",
		"shortName": "ESP",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "RCDE Stadium"
	},
	{
		"_id": "1a21a7c1a3f89181074e9872",
		"name": "Leganés",
		"name365": "לגאנס",
		"shortName": "LEG",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "Butarque"
	},
	{
		"_id": "1a21a7c1a3f89181074e9873",
		"name": "Alavés",
		"name365": "אלאבס",
		"shortName": "ALA",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "Mendizorrotza"
	},
	{
		"_id": "1a21a7c1a3f89181074e9874",
		"name": "Barcelona",
		"name365": "ברצלונה",
		"shortName": "BAR",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "Camp Nou"
	},
	{
		"_id": "1a21a7c1a3f89181074e9875",
		"name": "Real Betis",
		"name365": "בטיס",
		"shortName": "BET",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "Benito Villamarín"
	},
	{
		"_id": "1a21a7c1a3f89181074e9876",
		"name": "Celta Vigo",
		"name365": "סלטה ויגו",
		"shortName": "CEL",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "Balaídos"
	},
	{
		"_id": "1a21a7c1a3f89181074e9877",
		"name": "Real Sociedad",
		"name365": "ריאל סוסיאדד",
		"shortName": "SOC",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "Anoeta"
	},
	{
		"_id": "1a21a7c1a3f89181074e9878",
		"name": "Levante",
		"name365": "לבאנטה",
		"shortName": "LEV",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "Ciutat de València"
	},
	{
		"_id": "1a21a7c1a3f89181074e9879",
		"name": "Villarreal",
		"name365": "ויאריאל",
		"shortName": "VIL",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "Estadio de la Cerámica"
	},
	{
		"_id": "1a21a7c1a3f89181074e9880",
		"name": "Valencia",
		"name365": "ולנסיה",
		"shortName": "VAL",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "Mestalla"
	},
	{
		"_id": "1a21a7c1a3f89181074e9881",
		"name": "Las Palmas",
		"name365": "לאס פלמאס",
		"shortName": "LAS",
		"colors": ["#EA0000", "#000"],
		"buttonColors": ["#EA0000", "#000"],
		"graphColors": ["#000", "#EA0000"],
		"logoPosition": "",
		"stadium": "Gran Canaria"
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
