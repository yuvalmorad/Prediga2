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
            path: "/group/:groupId/matchPredictions",
            title: "Match Predictions",
            icon: "",
            isAuthenticatedPage: true,
            component: GamesPredictionsPage,
            exact: true,
            displayInSiteNavigation: true
        },
        {
            path: "/group/:groupId/leaderBoard",
            title: "Leaderboard",
            icon: "",
            isAuthenticatedPage: true,
            component: LeaderBoardPage,
            displayInSiteNavigation: true
        },
        {
            path: "/group/:groupId/teamsPredictionsCategories",
            title: "Team Predictions",
            icon: "",
            isAuthenticatedPage: true,
            component: TeamsPredictionsCategoriesPage,
            exact: true,
            displayInSiteNavigation: true
        },
        {
            path: "/group/:groupId/teamsPredictions/:teamCategoryId",
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
            path: "/group/:groupId/groupMessages",
            title: "Chat",
            icon: "",
            isAuthenticatedPage: true,
            component: GroupMessagesPage,
            exact: true,
			displayInSiteNavigation: true
        },
        {
            path: "/group/:groupId/simulator/:gameId?",
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
                        icon: "",
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
            path: "/group/:groupId/editAdminGroup",
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
            path: "/group/:groupId/editUserGroup",
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
            icon: "",
            isAuthenticatedPage: true,
            component: UserSettingsPage,
            displayInBottomMenu: true,
            hideSiteNavigation: true,
            siteHeaderConfig: {
                hideMenuButton: true,
                hasBackButton: true,
				hideGroupsIcon: true
            }
        },
        {
            path: "/group/:groupId/rules",
            title: "How to Play",
            isAuthenticatedPage: true,
            component: RulesPage,
            hideSiteNavigation: true,
            siteHeaderConfig: {
                hideMenuButton: true,
                hasBackButton: true,
				hideGroupsIcon: true
            }
        },
        {
            path: "/about",
            title: "About",
            icon: "",
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
        var page = getPages().filter(function(page){
            return utils.general.cutUrlPath(page.path) === path;
        })[0];

        if (!page) {
            page = getPages()[0];
        }

        return page;
    }

    function getPages() {
        return routePages;
    }

    return {
        getPages: getPages,
        getPageByPath: getPageByPath
    }
})();

