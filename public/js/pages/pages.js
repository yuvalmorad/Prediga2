var routePages = (function(){
    var GamesPredictionsPage = component.GamesPredictionsPage,
        TeamsPredictionsPage = component.TeamsPredictionsPage,
        LeaderBoardPage = component.LeaderBoardPage,
        LoginPage = component.LoginPage,
        RulesPage = component.RulesPage,
        AboutPage = component.AboutPage,
        SimulatorPage = component.SimulatorPage,
        GroupsPage = component.GroupsPage;

    var routePages = [
        {
            path: "/",
            title: "Games Predictions",
            name: "gamesPredictions",
            isAuthenticatedPage: true,
            component: GamesPredictionsPage,
            exact: true,
            displayInTopMenu: true,
            displayInSiteNavigation: true
        },
        {
            path: "/teamsPredictions",
            title: "Teams Predictions",
            name: "teamsPredictions",
            isAuthenticatedPage: true,
            component: TeamsPredictionsPage,
            exact: true,
            displayInTopMenu: true,
            displayInSiteNavigation: true
        },
        {
            path: "/leaderBoard",
            title: "Leader Board",
            name: "leaderBoard",
            isAuthenticatedPage: true,
            component: LeaderBoardPage,
            displayInTopMenu: true,
            displayInSiteNavigation: true
        },
        {
            path: "/simulator/:gameId?",

            title: "Simulator",
            name: "simulator",
            isAuthenticatedPage: true,
            component: SimulatorPage,
            displayInTopMenu: true
        },
        {
            path: "/groups",
            title: "Groups",
            name: "groups",
            isAuthenticatedPage: true,
            component: GroupsPage,
            siteHeaderActionButtons: [
                {
                    text: "+",
                    onClick: function(){}
                }
            ]
        },
        {
            path: "/rules",
            title: "Rules of the Game",
            name: "rulesOfTheGame",
            isAuthenticatedPage: true,
            component: RulesPage,
            displayInBottomMenu: true
        },
        {
            path: "/about",
            title: "About",
            name: "about",
            isAuthenticatedPage: true,
            component: AboutPage,
            displayInBottomMenu: true
        },
        {
            path: "/login",
            hideSiteHeader: true,
            hideSiteNavigation: true,
            component: LoginPage
        }
    ];

    function getPageByPath(path) {
        return getPages().filter(function(page){
            return utils.general.cutUrlPath(page.path) === path;
        })[0];
    }

    function getPages() {
        return routePages;
    }

    return {
        getPages: getPages,
        getPageByPath: getPageByPath
    }
})();

