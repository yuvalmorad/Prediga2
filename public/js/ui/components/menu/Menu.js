component.Menu = (function(){
    return function(props) {
        var topMenuItems = props.topMenuItems,
            bottomMenuItems = props.bottomMenuItems,
            title = props.title,
            className = props.className || "";

        return re("div", { className: "menu " + className + (props.isMenuOpen ? " open" : "")},
            re("div", {className: "menu-header"},
                re("a", {className: "close-menu", onClick: props.toggleMenu}, "X"),
                re("div", {}, title),
                re("div", {})
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
    };
})();


