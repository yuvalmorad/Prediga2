component.MainMenu = (function(){
    var connect = ReactRedux.connect,
        Menu = component.Menu,
        MenuItem = component.MenuItem;

    var MainMenu =  React.createClass({
        onMenuItemClicked: function(to) {
            this.props.toggleMenu(); //close menu
            window.routerHistory.push(utils.general.cutUrlPath(to));
        },

        onLogout: function() {
            this.props.toggleMenu(); //close menu
            service.authentication.logout().then(function(){
                window.routerHistory.push("/login");
            });
        },

        renderMenuItems: function(filterProperty) {
            var that = this;
            return routePages.getPages().filter(function(page){
                return page[filterProperty];
            }).map(function(page, index){
                var to = page.path;
                var isSelected = false;
                if (to && utils.general.cutUrlPath(routerHistory.location.pathname) === utils.general.cutUrlPath(to)) {
                    isSelected = true;
                }
                return re(MenuItem, {text: page.title, isSelected: isSelected, onMenuItemClicked: that.onMenuItemClicked.bind(that, to), key: filterProperty + index});
            });
        },

        renderLogoutMenuItem: function() {
            return re(MenuItem, {text: "Log out", onMenuItemClicked: this.onLogout, key: "logout1"});
        },

        render: function() {
            var props = this.props,
                isMenuOpen = props.isMenuOpen,
                topMenuItems = this.renderMenuItems("displayInTopMenu"),
                bottomMenuItems = this.renderMenuItems("displayInBottomMenu");

            bottomMenuItems.push(this.renderLogoutMenuItem());

            return re(Menu, {title: "Prediga", isMenuOpen: isMenuOpen, topMenuItems: topMenuItems, bottomMenuItems: bottomMenuItems, toggleMenu: props.toggleMenu});
        }
    });

    function mapStateToProps(state){
        return {
            isMenuOpen: state.general.isMenuOpen
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            toggleMenu: function(){dispatch(action.general.toggleMenu())}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(MainMenu);
})();


