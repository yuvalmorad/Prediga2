component.Menu = (function(){
    return function(props) {
        var topMenuItems = props.topMenuItems,
            bottomMenuItems = props.bottomMenuItems,
            title = props.title,
            className = props.className || "";

        return re("div", { className: "menu " + className},
            re("div", {className: "menu-header"},
                re("div", {}, title)
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


