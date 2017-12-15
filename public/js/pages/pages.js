var routePages = (function(){
    var GamesPredictionsPage = component.GamesPredictionsPage,
        TeamsPredictionsPage = component.TeamsPredictionsPage,
        LeaderBoardPage = component.LeaderBoardPage,
        LoginPage = component.LoginPage,
        RulesPage = component.RulesPage,
        AboutPage = component.AboutPage;

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
            return page.path === path;
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

