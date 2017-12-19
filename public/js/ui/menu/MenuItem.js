component.MenuItem = (function(){
    return function(props) {
        var className = "menu-item";
        if (props.to && routerHistory.location.pathname === (props.to)) {
            className += " selected"
        }

        return re("div", {className: className, onClick: props.onMenuItemClicked},
            re("div", {className: "menu-item-icon" + (props.iconClassName ? " " + props.iconClassName : "")}),
            re("div", {className: "menu-item-text"}, props.text)
        )
    }
})();


