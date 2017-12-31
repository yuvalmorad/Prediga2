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
        store.dispatch({type: action.leagues.LOAD_LEAGUES_SUCCESS, leagues: leagues});

        ReactDOM.render(re(component.LeaguesSubHeader, {store: store}), document.body);
        expect(document.querySelector(".leagues-sub-header .league-item.selected").textContent).toEqual("league2");
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
        store.dispatch({type: action.leagues.LOAD_LEAGUES_SUCCESS, leagues: leagues});

        ReactDOM.render(re(component.LeaguesSubHeader, {store: store}), document.body);
        expect(document.querySelector(".leagues-sub-header .league-item.selected").textContent).toEqual("league2");

        document.querySelector(".leagues-sub-header .league-item:first-child").click();
        expect(document.querySelector(".leagues-sub-header .league-item.selected").textContent).toEqual("league1");
    });
});