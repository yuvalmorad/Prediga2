describe("SimulatorMatch", function () {
    it("running simulator", function () {
        var props = {
            game: {
                team1: "club1",
                team2: "club2"
            },
            clubs: [
                {
                    _id: "club1",
                    name: "Hapoel Haifa",
                    shortName: "mc1",
                    buttonColors: ["blue", "red"],
                    logoPosition: "-336px 0"
                },
                {
                    _id: "club2",
                    name: "Kiryat Shmona",
                    shortName: "mc2",
                    buttonColors: ["yellow", "green"],
                    logoPosition: "-168px 0"
                }
            ],
            league: {
                name: "israel"
            },
            matchResult: {
                active: true,
                gameTime: 32
            }
        };

        testHelper.renderComponent(component.SimulatorMatch, props);
        expect(document.querySelector(".simulate-game-date").textContent).toEqual("Running 32'");
        expect(document.querySelector(".left .team-name").textContent).toEqual("mc1");
        expect(document.querySelector(".right .team-name").textContent).toEqual("mc2");
        expect(document.querySelector(".first-score .radio-button-wrapper:nth-child(1) .radio-button").classList.contains("selected")).toBe(false);
        expect(document.querySelector(".first-score .radio-button-wrapper:nth-child(2) .radio-button").classList.contains("selected")).toBe(true);
        expect(document.querySelector(".first-score .radio-button-wrapper:nth-child(3) .radio-button").classList.contains("selected")).toBe(false);
    });
});