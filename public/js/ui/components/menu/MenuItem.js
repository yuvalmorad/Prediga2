window.component = window.component || {};
component.MenuItem = (function(){
    return function(props) {
        var className = "menu-item" + (props.isSelected ? " selected" : "");
        var button;
        var icon;
        var textIndication;
        var actionButton = props.actionButton;
        var indication = props.indication;


        if (actionButton) {
            button = re("button", {onClick: actionButton.onClick}, actionButton.icon);
        }

        if (indication) {
            textIndication = re("span", {className: "text-indication"}, indication.text);
        }

        if (props.icon) {
            icon = re("span", {className: "menu-icon"}, props.icon)
        }

        return re("div", {className: className, onClick: props.onMenuItemClicked},
            re("div", {className: "menu-item-text"},
                icon,
                re("div", {}, props.text)
            ),
            textIndication,
            button
        )
    }
})();


