var WORLD_CUP_18 = (function() {

    function mapTeamsByName(teams) {
        var res = {};
        teams.forEach(function(team){res[team.name] = team});
        return res;
    }

    var teams = [
        {
            name: "Argentina",
            shortName: "AR",
            color: "#42a0c8",
            secondColor: "#fff"
        },
        {
            name: "Brazil",
            shortName: "BR",
            color: "yellow",
            secondColor: "blue"
        },
        {
            name: "Colombia",
            shortName: "CU",
            color: "yellow",
            secondColor: "blue"
        },
        {
            name: "Peru",
            shortName: "PE",
            color: "#fff",
            secondColor: "red"
        },
        {
            name: "Uruguay",
            shortName: "UR",
            color: "#60b5ff",
            secondColor: "#000"
        },
        {
            name: "Costa Rica",
            shortName: "CR",
            color: "red",
            secondColor: "blue"
        },
        {
            name: "Mexico",
            shortName: "MX",
            color: "#1a4d3e",
            secondColor: "#fff"
        },
        {
            name: "Panama",
            shortName: "PA",
            color: "red",
            secondColor: "#fff"
        },
        {
            name: "Belgium",
            shortName: "BL",
            color: "red",
            secondColor: "yellow"
        },
        {
            name: "Croatia",
            shortName: "CR",
            color: "red",
            secondColor: "#fff"
        },
        {
            name: "Denmark",
            shortName: "DN",
            color: "red",
            secondColor: "#fff"
        },
        {
            name: "England",
            shortName: "EN",
            color: "#fff",
            secondColor: "red"
        },
        {
            name: "France",
            shortName: "FR",
            color: "blue",
            secondColor: "#fff"
        },
        {
            name: "Germany",
            shortName: "GR",
            color: "#fff",
            secondColor: "#000"
        },
        {
            name: "Iceland",
            shortName: "IC",
            color: "blue",
            secondColor: "#fff"
        },
        {
            name: "Poland",
            shortName: "PL",
            color: "#fff",
            secondColor: "red"
        },
        {
            name: "Portugal",
            shortName: "POR",
            color: "red",
            secondColor: "green"
        },
        {
            name: "Russia",
            shortName: "RUS",
            color: "blue",
            secondColor: "red"
        },
        {
            name: "Serbia",
            shortName: "SER",
            color: "red",
            secondColor: "blue"
        },
        {
            name: "Spain",
            shortName: "SP",
            color: "red",
            secondColor: "blue"
        },
        {
            name: "Sweden",
            shortName: "SW",
            color: "yellow",
            secondColor: "blue"
        },
        {
            name: "Switzerland",
            shortName: "SWI",
            color: "red",
            secondColor: "#fff"
        },
        {
            name: "Australia",
            shortName: "AUS",
            color: "green",
            secondColor: "#C5B358"
        },
        {
            name: "Iran",
            shortName: "IR",
            color: "green",
            secondColor: "#fff"
        },
        {
            name: "Japan",
            shortName: "JA",
            color: "blue",
            secondColor: "#fff"
        },
        {
            name: "South Korea",
            shortName: "SK",
            color: "red",
            secondColor: "#fff"
        },
        {
            name: "Saudi Arabia",
            shortName: "SA",
            color: "green",
            secondColor: "#fff"
        },
        {
            name: "Egypt",
            shortName: "EG",
            color: "red",
            secondColor: "#fff"
        },
        {
            name: "Morocco",
            shortName: "MOR",
            color: "red",
            secondColor: "green"
        },
        {
            name: "Nigeria",
            shortName: "NIG",
            color: "green",
            secondColor: "#fff"
        },
        {
            name: "Senegal",
            shortName: "SEN",
            color: "#fff",
            secondColor: "green"
        },
        {
            name: "Tunisia",
            shortName: "TUN",
            color: "#fff",
            secondColor: "red"
        }

    ];

    return {
        name: "World Cup 2018",
        logo: "worldcup2018.png",
        teams: mapTeamsByName(teams)
    };
})();