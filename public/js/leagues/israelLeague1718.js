(function() {
    var teams = [
        {
            name: "Hapoel Ashkelon",
            shortName: "HA",
            color: "blue",
            secondColor: "#fff",
            logoPosition: "-728px 0"
        },
        {
            name: "Hapoel Haifa",
            shortName: "HH",
            color: "red",
            secondColor: "blue",
            logoPosition: "-336px 0"
        },
        {
            name: "Maccabi Haifa",
            shortName: "MH",
            color: "green",
            secondColor: "#fff",
            logoPosition: "-224px 0"
        },
        {
            name: "Bnei Yehuda",
            shortName: "BY",
            color: "orange",
            secondColor: "#000",
            logoPosition: "-616px 0"
        },
        {
            name: "Maccabi Netanya",
            shortName: "MN",
            color: "yellow",
            secondColor: "#000",
            logoPosition: "-672px 0"
        },
        {
            name: "Hapoel Beer Sheva",
            shortName: "HBS",
            color: "red",
            secondColor: "#fff",
            logoPosition: "-112px 0"
        },
        {
            name: "Bnei Sakhnin",
            shortName: "BS",
            color: "red",
            secondColor: "#fff",
            logoPosition: "-280px 0"
        },
        {
            name: "Kiryat Shmona",
            shortName: "HKS",
            color: "blue",
            secondColor: "#fff",
            logoPosition: "-168px 0"
        },
        {
            name: "Beitar Jerusalem",
            shortName: "BJ",
            color: "yellow",
            secondColor: "black",
            logoPosition: "-392px 0"
        },
        {
            name: "Maccabi Petach Tikva",
            shortName: "MPT",
            color: "#042c71",
            secondColor: "#fff",
            logoPosition: "-560px 0"
        },
        {
            name: "FC Ashdod",
            shortName: "ASH",
            color: "#e30e13",
            secondColor: "#feef04",
            logoPosition: "-56px 0"
        },
        {
            name: "Maccabi Tel Aviv",
            shortName: "MTA",
            color: "yellow",
            secondColor: "blue",
            logoPosition: "0 0"
        },
        {
            name: "Hapoel Raanana",
            shortName: "HR",
            color: "red",
            secondColor: "#fff",
            logoPosition: "-504px 0"
        },
        {
            name: "Hapoel Akko",
            shortName: "HA",
            color: "#42a0c8",
            secondColor: "#fff",
            logoPosition: "-448px 0"
        }
    ];

    var league = {
        id: "IsraeliLeague18",
        name: "Israel",
        teams: teams,
        logoPosition: "-784px 0"
    };

    models.leagues.addLeague(league);
})();