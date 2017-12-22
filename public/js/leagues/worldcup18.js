(function() {
    var teams = [
        {
            name: "Argentina",
            shortName: "AR",
            color: "#42a0c8",
            secondColor: "#fff",
            logoPosition: "0 0"
        },
        {
            name: "Brazil",
            shortName: "BR",
            color: "yellow",
            secondColor: "blue",
            logoPosition: "-56px -56px"
        },
        {
            name: "Colombia",
            shortName: "CU",
            color: "yellow",
            secondColor: "blue",
            logoPosition: "0 -112px"
        },
        {
            name: "Peru",
            shortName: "PE",
            color: "#fff",
            secondColor: "red",
            logoPosition: "-56px -560px"
        },
        {
            name: "Uruguay",
            shortName: "UR",
            color: "#60b5ff",
            secondColor: "#000",
            logoPosition: "-56px -899px"
        },
        {
            name: "Costa Rica",
            shortName: "CR",
            color: "red",
            secondColor: "blue",
            logoPosition: "-56px -112px"
        },
        {
            name: "Mexico",
            shortName: "MX",
            color: "#1a4d3e",
            secondColor: "#fff",
            logoPosition: "-56px -448px"
        },
        {
            name: "Panama",
            shortName: "PA",
            color: "red",
            secondColor: "#fff",
            logoPosition: "0 -560px"
        },
        {
            name: "Belgium",
            shortName: "BL",
            color: "red",
            secondColor: "yellow",
            logoPosition: "0 -56px"
        },
        {
            name: "Croatia",
            shortName: "CR",
            color: "red",
            secondColor: "#fff",
            logoPosition: "0 -168px"
        },
        {
            name: "Denmark",
            shortName: "DN",
            color: "red",
            secondColor: "#fff",
            logoPosition: "-56px -168px"
        },
        {
            name: "England",
            shortName: "EN",
            color: "#fff",
            secondColor: "red",
            logoPosition: "-56px -224px"
        },
        {
            name: "France",
            shortName: "FR",
            color: "blue",
            secondColor: "#fff",
            logoPosition: "0 -280px"
        },
        {
            name: "Germany",
            shortName: "GR",
            color: "#fff",
            secondColor: "#000",
            logoPosition: "-56px -280px"
        },
        {
            name: "Iceland",
            shortName: "IC",
            color: "blue",
            secondColor: "#fff",
            logoPosition: "0 -336px"
        },
        {
            name: "Poland",
            shortName: "PL",
            color: "#fff",
            secondColor: "red",
            logoPosition: "0 -616px"
        },
        {
            name: "Portugal",
            shortName: "POR",
            color: "red",
            secondColor: "green",
            logoPosition: "-56px -616px"
        },
        {
            name: "Russia",
            shortName: "RUS",
            color: "blue",
            secondColor: "red",
            logoPosition: "0 -672px"
        },
        {
            name: "Serbia",
            shortName: "SER",
            color: "red",
            secondColor: "blue",
            logoPosition: "0px -787px"
        },
        {
            name: "Spain",
            shortName: "SP",
            color: "red",
            secondColor: "blue",
            logoPosition: "-56px -787px"
        },
        {
            name: "Sweden",
            shortName: "SW",
            color: "yellow",
            secondColor: "blue",
            logoPosition: "0 -843px"
        },
        {
            name: "Switzerland",
            shortName: "SWI",
            color: "red",
            secondColor: "#fff",
            logoPosition: "-56px -843px"
        },
        {
            name: "Australia",
            shortName: "AUS",
            color: "green",
            secondColor: "#C5B358",
            logoPosition: "-56px 0"
        },
        {
            name: "Iran",
            shortName: "IR",
            color: "green",
            secondColor: "#fff",
            logoPosition: "-56px -336px"
        },
        {
            name: "Japan",
            shortName: "JA",
            color: "blue",
            secondColor: "#fff",
            logoPosition: "0 -392px"
        },
        {
            name: "South Korea",
            shortName: "SK",
            color: "red",
            secondColor: "#fff",
            logoPosition: "-56px -392px"
        },
        {
            name: "Saudi Arabia",
            shortName: "SA",
            color: "green",
            secondColor: "#fff",
            logoPosition: "0 -731px"
        },
        {
            name: "Egypt",
            shortName: "EG",
            color: "red",
            secondColor: "#fff",
            logoPosition: "0 -224px"
        },
        {
            name: "Morocco",
            shortName: "MOR",
            color: "red",
            secondColor: "green",
            logoPosition: "0 -504px"
        },
        {
            name: "Nigeria",
            shortName: "NIG",
            color: "green",
            secondColor: "#fff",
            logoPosition: "-56px -504px"
        },
        {
            name: "Senegal",
            shortName: "SEN",
            color: "#fff",
            secondColor: "green",
            logoPosition: "-56px -731px"
        },
        {
            name: "Tunisia",
            shortName: "TUN",
            color: "#fff",
            secondColor: "red",
            logoPosition: "0 -899px"
        }
    ];

    var league = {
        id: "WorldCup2018",
        name: "World Cup",
        logo: "worldcup2018.jpg",
        teams: teams,
        logoPosition: "-56px -672px"
    };

    models.leagues.addLeague(league);
})();