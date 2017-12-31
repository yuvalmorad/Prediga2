window.component = window.component || {};
component.MenuItem = (function(){
    return function(props) {
        var className = "menu-item" + (props.isSelected ? " selected" : "");

        return re("div", {className: className, onClick: props.onMenuItemClicked},
            re("div", {className: "menu-item-text"}, props.text)
        )
    }
})();


