window.component = window.component || {};
component.MenuItem = (function(){
    return function(props) {
        var className = "menu-item" + (props.isSelected ? " selected" : "");
        var button;
        var icon;

        if (props.hasButton) {
            button = re("button", {}, "");
        }

        if (props.icon) {
            icon = re("span", {className: "menu-icon"}, props.icon)
        }

        return re("div", {className: className, onClick: props.onMenuItemClicked},
            re("div", {className: "menu-item-text"},
                icon,
                re("div", {}, props.text)
            ),
            button
        )
    }
})();


