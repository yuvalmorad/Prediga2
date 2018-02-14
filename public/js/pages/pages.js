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
        EditAdminGroupPage = component.EditAdminGroupPage;
        EditUserGroupPage = component.EditUserGroupPage;

    var routePages = [
        {
            path: "/",
            title: "Match Predictions",
            icon: "",
            isAuthenticatedPage: true,
            component: GamesPredictionsPage,
            exact: true,
            displayInSiteNavigation: true
        },
        {
            path: "/leaderBoard",
            title: "Leaderboard",
            icon: "",
            isAuthenticatedPage: true,
            component: LeaderBoardPage,
            displayInSiteNavigation: true
        },
        {
            path: "/teamsPredictions",
            title: "Team Predictions",
            icon: "",
            isAuthenticatedPage: true,
            component: TeamsPredictionsPage,
            exact: true,
            displayInSiteNavigation: true
        },
        {
            path: "/simulator/:gameId?",
            title: "Simulator",
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
            isAuthenticatedPage: true,
            component: JoinGroupPage,
            hideSiteNavigation: true,
            siteHeaderConfig: {
                hideMenuButton: true,
                hasBackButton: true,
                hideGroupsIcon: true,
                actions: [
                    {
                        buttonText: "Create",
                        eventName: "onOpenCreateNewGroup"
                    }
                ]
            }
        },
        {
            path: "/createNewGroup",
            title: "Create Group",
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
            path: "/editAdminGroup/:groupId",
            isAuthenticatedPage: true,
            component: EditAdminGroupPage,
            siteHeaderConfig: {
                hideMenuButton: true,
                hasBackButton: true,
                isDynamicTitle: true
            }
        },
        {
            path: "/editUserGroup/:groupId",
            isAuthenticatedPage: true,
            component: EditUserGroupPage,
            siteHeaderConfig: {
                hideMenuButton: true,
                hasBackButton: true,
                isDynamicTitle: true
            }
        },
        {
            path: "/rules",
            title: "How to Play",
            isAuthenticatedPage: true,
            component: RulesPage,
            displayInBottomMenu: true
        },
        {
            path: "/about",
            title: "About",
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

