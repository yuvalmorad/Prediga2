var GAME = {
    STATUS: {
        PRE_GAME: "PRE_GAME",
        CLOSED_GAME: "CLOSED_GAME",
        POST_GAME: "POST_GAME"
    }
};

var COLORS = {
    DRAW_COLOR: "#888282"
};

var POINTS = {
    outcome: 1,
    team1Scores: 1,
    team2Scores: 1,
    diffScores: 1,
    firstScore: 1
};

var LEAGUES = (function(){
    function mapTeamsById(teams) {
        var res = {};
        teams.forEach(function(team){res[team.id] = team});
        return res;
    }

    return {
        WORLD_CUP_18: {
            name: "World Cup 2018",
            //logo: "israel_league.jpg",
            teams: mapTeamsById([
                {
                    id: "Russia",
                    name: "Russia",
                    shortName: "RU",
                    logo: "maccabi_tel_aviv.png",
                    logoGray: "maccabi_tel_aviv_gray.png",
                    color: "yellow",
                    secondColor: "blue"
                },
                {
                    id: "A2",
                    name: "A2",
                    shortName: "A2",
                    logo: "Hapoel_Beer_Sheva.png",
                    logoGray: "Hapoel_Beer_Shev_gray.png",
                    color: "red",
                    secondColor: "#fff"
                },
                {
                    id: "team_3",
                    name: "Beitar Jerusalem",
                    shortName: "BJ",
                    logo: "beitar_jerusalem.png",
                    logoGray: "beitar_jerusalem_gray.png",
                    color: "black",
                    secondColor: "yellow"
                },
                {
                    id: "team_4",
                    name: "Maccabi Haifa",
                    shortName: "MH",
                    logo: "maccabi_haifa.png",
                    logoGray: "maccabi_haifa_gray.png",
                    color: "green",
                    secondColor: "#fff"
                }
            ])
        }
    }
})();

var LEAGUE = LEAGUES.WORLD_CUP_18;

