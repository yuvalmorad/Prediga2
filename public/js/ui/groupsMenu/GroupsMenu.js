component.GroupsMenu = (function(){
    var connect = ReactRedux.connect,
        Menu = component.Menu,
        MenuItem = component.MenuItem;

    var GroupsMenu =  React.createClass({
        onMenuItemClicked: function() {

        },

        render: function() {
            var props = this.props,
                groups = [],
                bottomMenuItems = [];

            groups.push( // TODO mock - remove
                re(MenuItem, {text: "SAP Labs Israel", isSelected: true, onMenuItemClicked: this.onMenuItemClicked, key: "some group1"})
            );

            return re(Menu, {title: "Groups", toggleMenu: props.toggleMenu, topMenuItems: groups, bottomMenuItems: bottomMenuItems, className: "groups-menu"});
        }
    });

    function mapStateToProps(state){
        return {
            isMenuGroupsOpen: state.general.isMenuGroupsOpen
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            toggleMenu: function(){dispatch(action.general.toggleMenuGroups())}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(GroupsMenu);
})();


