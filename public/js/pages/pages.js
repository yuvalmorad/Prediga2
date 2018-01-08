var routePages = (function(){
    var GamesPredictionsPage = component.GamesPredictionsPage,
        TeamsPredictionsPage = component.TeamsPredictionsPage,
        LeaderBoardPage = component.LeaderBoardPage,
        LoginPage = component.LoginPage,
        RulesPage = component.RulesPage,
        AboutPage = component.AboutPage,
        SimulatorPage = component.SimulatorPage,
        JoinGroupPage = component.JoinGroupPage,
        CreateNewGroupPage = component.CreateNewGroupPage,
        EditGroupPage = component.EditGroupPage;

    var routePages = [
        {
            path: "/",
            title: "Games Predictions",
            name: "gamesPredictions",
            isAuthenticatedPage: true,
            component: GamesPredictionsPage,
            exact: true,
            displayInSiteNavigation: true
        },
        {
            path: "/teamsPredictions",
            title: "Teams Predictions",
            name: "teamsPredictions",
            isAuthenticatedPage: true,
            component: TeamsPredictionsPage,
            exact: true,
            displayInSiteNavigation: true
        },
        {
            path: "/leaderBoard",
            title: "Leader Board",
            name: "leaderBoard",
            isAuthenticatedPage: true,
            component: LeaderBoardPage,
            displayInSiteNavigation: true
        },
        {
            path: "/simulator/:gameId?",
            title: "Simulator",
            name: "simulator",
            isAuthenticatedPage: true,
            component: SimulatorPage,
            siteHeaderConfig: {
                hideMenuButton: true,
                hasBackButton: true
            }
        },
        {
            path: "/joinGroup",
            title: "Join Group",
            name: "joinGroup",
            isAuthenticatedPage: true,
            component: JoinGroupPage,
            hideSiteNavigation: true,
            siteHeaderConfig: {
                hideMenuButton: true,
                hasBackButton: true,
                hideGroupsIcon: true,
                actions: [
                    {
                        icon: "",
                        eventName: "onOpenCreateNewGroup"
                    }
                ]
            }
        },
        {
            path: "/createNewGroup",
            title: "Create New Group",
            name: "createNewGroup",
            isAuthenticatedPage: true,
            component: CreateNewGroupPage,
            hideSiteNavigation: true,
            siteHeaderConfig: {
                hideMenuButton: true,
                hasBackButton: true,
                hideGroupsIcon: true
            }
        },
        {
            path: "/editGroup",
            name: "editGroup",
            isAuthenticatedPage: true,
            component: EditGroupPage,
            siteHeaderConfig: {
                hideMenuButton: true,
                hasBackButton: true,
                isDynamicTitle: true
            }
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

