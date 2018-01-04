window.component = window.component || {};
component.Menu = (function(){
    return function(props) {
        var topMenuItems = props.topMenuItems,
            bottomMenuItems = props.bottomMenuItems,
            topMenuTitle = props.topMenuTitle || "",
            bottomMenuTitle = props.bottomMenuTitle || "",
            className = props.className || "";

        return re("div", { className: "menu " + className},
            re("div", {className: "menu-header"}),
            re("div", {className: "menu-content"},
                re("div", {className: "menu-top-content"},
                    re("div", {className:"menu-items-header"},
                        re("div", {className:"menu-items-title"}, topMenuTitle),
                        re("button", {}, "")
                    ),
                    topMenuItems
                ),
                re("div", {className: "menu-bottom-content"},
                    re("div", {className:"menu-items-header"},
                        re("div", {className:"menu-items-title"}, bottomMenuTitle)
                    ),
                    bottomMenuItems
                )
            )
        );
    };
})();


