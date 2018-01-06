describe("GamePredictionTile", function () {
    it("no team1 and no team2 - should still render tile with stadium and date", function () {
        var props = {
            "team1": undefined,
            "team2": undefined,
            "game": {
                "_id": "5a21a7c1a3f89181074e9792",
                "team1": "C1",
                "team2": "D2",
                "kickofftime": "2018-06-30T14:00:00.000Z",
                "stadium": "Kazan Arena, Kazan",
                "type": "Round 4",
                "league": "4a21a7c1a3f89181074e9762"
            },
            "league": {
                "_id": "4a21a7c1a3f89181074e9762",
                "name": "World Cup",
                "logoPosition": "-56px -672px",
                "year": "2018",
                "clubs": ["2a21a7c1a3f89181074e9762", "2a21a7c1a3f89181074e9763", "2a21a7c1a3f89181074e9764", "2a21a7c1a3f89181074e9765", "2a21a7c1a3f89181074e9766", "2a21a7c1a3f89181074e9767", "2a21a7c1a3f89181074e9768", "2a21a7c1a3f89181074e9769", "2a21a7c1a3f89181074e9770", "2a21a7c1a3f89181074e9771", "2a21a7c1a3f89181074e9772", "2a21a7c1a3f89181074e9773", "2a21a7c1a3f89181074e9774", "2a21a7c1a3f89181074e9775", "2a21a7c1a3f89181074e9776", "2a21a7c1a3f89181074e9777", "2a21a7c1a3f89181074e9778", "2a21a7c1a3f89181074e9779", "2a21a7c1a3f89181074e9780", "2a21a7c1a3f89181074e9781", "2a21a7c1a3f89181074e9782", "2a21a7c1a3f89181074e9783", "2a21a7c1a3f89181074e9784", "2a21a7c1a3f89181074e9785", "2a21a7c1a3f89181074e9786", "2a21a7c1a3f89181074e9787", "2a21a7c1a3f89181074e9788", "2a21a7c1a3f89181074e9789", "2a21a7c1a3f89181074e9790", "2a21a7c1a3f89181074e9791", "2a21a7c1a3f89181074e9792", "2a21a7c1a3f89181074e9793"],
                "syncResults365": false
            },
            "groupConfiguration": {
                "_id": "5a3eac97d3ca76dbd12bf637",
                "winner": 4,
                "team1Goals": 2,
                "team2Goals": 2,
                "goalDiff": 2,
                "firstToScore": 2,
                "teamInGroup": 4,
                "teamWinner": 20,
                "teamRunnerUp": 15,
                "teamThird": 10,
                "teamForth": 10,
                "teamLast": 10,
                "team2ndLast": 10,
                "minutesBeforeCloseMathPrediction": 5
            },
            "predictionCounters": {}
        };

        testHelper.renderComponent(component.GamePredictionTile, props);
        expect(document.querySelector(".center .league-name").textContent).toEqual("Kazan Arena, Kazan");
        expect(document.querySelector(".center .game-date").textContent).toEqual("17:00");
    });
});