component.Menu = (function(){
    var connect = ReactRedux.connect,
        MenuItem = component.MenuItem;

    var Menu =  React.createClass({
        onMenuItemClicked: function(to) {
            this.props.toggleMenu(); //close menu
            window.routerHistory.push(to);
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
                return re(MenuItem, {text: page.title, to: page.path, iconClassName: page.name + "-icon", onMenuItemClicked: that.onMenuItemClicked, key: filterProperty + index});
            });
        },

        renderLogoutMenuItem: function() {
            return re(MenuItem, {text: "Log out", onMenuItemClicked: this.onLogout, key: "logout1"});
        },

        render: function() {
            var props = this.props;

            var topMenuItems = this.renderMenuItems("displayInTopMenu");
            var bottomMenuItems = this.renderMenuItems("displayInBottomMenu");
            bottomMenuItems.push(this.renderLogoutMenuItem());

            return re("div", { className: "menu" + (props.isMenuOpen ? " open" : "")},
                re("div", {className: "menu-header"},
                    re("a", {className: "close-menu", onClick: props.toggleMenu}, "X")
                ),
                re("div", {className: "menu-content"},
                    re("div", {className: "menu-top-content"},
                        topMenuItems
                    ),
                    re("div", {className: "menu-bottom-content"},
                        bottomMenuItems
                    )
                )
            );
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

    return connect(mapStateToProps, mapDispatchToProps)(Menu);
})();


