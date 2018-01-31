window.component = window.component || {};
component.SiteNavigation = (function(){
    var connect = ReactRedux.connect,
        NavigationTab = component.NavigationTab,
        withRouter = ReactRouterDOM.withRouter;

    var SiteNavigation = function (props) {
        var league = utils.general.findItemInArrBy(props.leagues, "_id", props.selectedLeagueId);
        var leagueColor = league ? league.color: "";
        var tabs = routePages.getPages().filter(function(page){
            return page.displayInSiteNavigation;
        }).map(function(page, index){
            return re(NavigationTab, {to: page.path, icon: page.icon, key: index});
        });

        return re("div", { className: "site-navigation" + (props.hide ? " hide" : ""), style: {color: leagueColor, backgroundColor: leagueColor} },
            tabs
        );
    };

    function mapStateToProps(state){
        return {
            selectedLeagueId: state.groups.selectedLeagueId,
            leagues: state.leagues.leagues
        }
    }

    return withRouter(connect(mapStateToProps)(SiteNavigation));
})();


