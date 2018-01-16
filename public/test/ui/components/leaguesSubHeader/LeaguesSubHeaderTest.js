describe("LeaguesSubHeader", function () {
    it("initial load", function () {
        var leagues = [
            {
                _id: "id1",
                name: "league1"
            },
            {
                _id: "id2",
                name: "league2"
            }
        ];

        var groups = [
            {
                _id: "group1",
                leagueIds: ["id1", "id2"]
            }
        ];

        storeMock.dispatch({type: action.leagues.LOAD_LEAGUES_SUCCESS, leagues: leagues});
        storeMock.dispatch({type: action.groups.LOAD_GROUPS, groups: groups});
        testHelper.renderComponent(component.LeaguesSubHeader, {});

        expect(document.querySelector(".leagues-sub-header .league-item.selected").textContent).toEqual("league1");
    });

    it("click on league should change selected class", function () {
        var leagues = [
            {
                _id: "id1",
                name: "league1"
            },
            {
                _id: "id2",
                name: "league2"
            }
        ];

        var groups = [
            {
                _id: "group1",
                leagueIds: ["id1", "id2"]
            }
        ];

        storeMock.dispatch({type: action.leagues.LOAD_LEAGUES_SUCCESS, leagues: leagues});
        storeMock.dispatch({type: action.groups.LOAD_GROUPS, groups: groups});
        testHelper.renderComponent(component.LeaguesSubHeader, {});

        expect(document.querySelector(".leagues-sub-header .league-item.selected").textContent).toEqual("league1");

        document.querySelector(".leagues-sub-header .league-item:nth-child(2)").click();
        expect(document.querySelector(".leagues-sub-header .league-item.selected").textContent).toEqual("league2");
    });
});