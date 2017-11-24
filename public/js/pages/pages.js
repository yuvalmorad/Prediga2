var routePages = (function(){
    var GamesPredictionsPage = component.GamesPredictionsPage,
        TeamsPredictionsPage = component.TeamsPredictionsPage,
        LeaderBoardPage = component.LeaderBoardPage,
        LoginPage = component.LoginPage;

    var routePages = [
        {
            path: "/",
            title: "Games Predictions",
            isAuthenticatedPage: true,
            component: GamesPredictionsPage,
            exact: true
        },
        {
            path: "/teamsPredictions",
            title: "Teams Predictions",
            isAuthenticatedPage: true,
            component: TeamsPredictionsPage,
            exact: true
        },
        {
            path: "/leaderBoard",
            title: "Leader Board",
            isAuthenticatedPage: true,
            component: LeaderBoardPage
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

