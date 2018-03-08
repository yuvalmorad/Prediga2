var routePages = (function(){
    var GamesPredictionsPage = component.GamesPredictionsPage,
        TeamsPredictionsCategoriesPage = component.TeamsPredictionsCategoriesPage,
        TeamsPredictionsPage = component.TeamsPredictionsPage,
        LeaderBoardPage = component.LeaderBoardPage,
        LoginPage = component.LoginPage,
        RulesPage = component.RulesPage,
        AboutPage = component.AboutPage,
        SimulatorPage = component.SimulatorPage,
        JoinGroupPage = component.JoinGroupPage,
        CreateNewGroupPage = component.CreateNewGroupPage,
        EditAdminGroupPage = component.EditAdminGroupPage,
        EditUserGroupPage = component.EditUserGroupPage,
        UserSettingsPage = component.UserSettingsPage,
        GroupMessagesPage = component.GroupMessagesPage;

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
            path: "/teamsPredictionsCategories",
            title: "Team Predictions",
            icon: "",
            isAuthenticatedPage: true,
            component: TeamsPredictionsCategoriesPage,
            exact: true,
            displayInSiteNavigation: true
        },
        {
            path: "/teamsPredictions/:teamCategoryId",
            title: "Team Predictions",
            isAuthenticatedPage: true,
            component: TeamsPredictionsPage,
            hideSiteNavigation: true,
            siteHeaderConfig: {
                hideMenuButton: true,
                hasBackButton: true
            }
        },
        {
            path: "/groupMessages",
            title: "Messages",
            icon: "",
            isAuthenticatedPage: true,
            component: GroupMessagesPage,
            exact: true,
            hideSiteNavigation: true,
            siteHeaderConfig: {
                hideMenuButton: true,
                hasBackButton: true
            }
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
                        icon: "",
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
            hideSiteNavigation: true,
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
            hideSiteNavigation: true,
            siteHeaderConfig: {
                hideMenuButton: true,
                hasBackButton: true,
                isDynamicTitle: true
            }
        },
        {
            path: "/userSettings",
            title: "Settings",
            isAuthenticatedPage: true,
            component: UserSettingsPage,
            displayInBottomMenu: true,
            hideSiteNavigation: true,
            siteHeaderConfig: {
                hideMenuButton: true,
                hasBackButton: true
            }
        },
        {
            path: "/rules",
            title: "How to Play",
            isAuthenticatedPage: true,
            component: RulesPage,
            displayInBottomMenu: true,
            hideSiteNavigation: true,
            siteHeaderConfig: {
                hideMenuButton: true,
                hasBackButton: true
            }
        },
        {
            path: "/about",
            title: "About",
            isAuthenticatedPage: true,
            component: AboutPage,
            displayInBottomMenu: true,
            hideSiteNavigation: true,
            siteHeaderConfig: {
                hideMenuButton: true,
                hasBackButton: true
            }
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

