(function() {
    var teams = [
        {
            name: "Hapoel Ironi Ashkelon",
            shortName: "HA",
            color: "blue",
            secondColor: "#fff"
        },
        {
            name: "Hapoel Haifa",
            shortName: "HH",
            color: "red",
            secondColor: "blue"
        },
        {
            name: "Maccabi Haifa",
            shortName: "MH",
            color: "green",
            secondColor: "#fff"
        },
        {
            name: "Bnei Yehuda Tel Aviv",
            shortName: "BY",
            color: "orange",
            secondColor: "#000"
        },
        {
            name: "Maccabi Netanya",
            shortName: "MN",
            color: "yellow",
            secondColor: "#000"
        },
        {
            name: "Hapoel Beer Sheva",
            shortName: "HBS",
            color: "red",
            secondColor: "#fff"
        },
        {
            name: "Bnei Sakhnin",
            shortName: "BS",
            color: "red",
            secondColor: "#fff"
        },
        {
            name: "Hapoel Kiryat Shmona",
            shortName: "HKS",
            color: "blue",
            secondColor: "#fff"
        },
        {
            name: "Beitar Jerusalem",
            shortName: "BJ",
            color: "yellow",
            secondColor: "black"
        },
        {
            name: "Maccabi Ironi Petah Tikva",
            shortName: "MPT",
            color: "#042c71",
            secondColor: "#fff"
        },
        {
            name: "FC Ashdod",
            shortName: "ASH",
            color: "#e30e13",
            secondColor: "#feef04"
        },
        {
            name: "Maccabi Tel Aviv",
            shortName: "MTA",
            color: "yellow",
            secondColor: "blue"
        },
        {
            name: "Hapoel Raanana",
            shortName: "HR",
            color: "red",
            secondColor: "#fff"
        },
        {
            name: "Hapoel Akko",
            shortName: "HA",
            color: "#42a0c8",
            secondColor: "#fff"
        }
    ];

    var league = {
        id: "IsraeliLeague18",
        name: "Israel League 17-18",
        logo: "israelLeague1718.png",
        teams: teams
    };

    models.leagues.addLeague(league);
})();