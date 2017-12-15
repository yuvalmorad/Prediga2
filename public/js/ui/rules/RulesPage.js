component.RulesPage = (function(){
    return function RulesPage(props) {
        return re("div", { className: "content" },
            re("div", { className: "scroll-container" },
                re("h3", {className: "smallMarginBottom"}, "Soccer"),

                re("h5", {}, "90 Minutes Play"),
                re("p", {className: "smallMarginBottom"}, "text here"),

                re("h5", {}, "Extra-time In-Play Markets"),
                re("p", {className: "smallMarginBottom"}, "text here"),

                re("h5", {}, "Matches Postponed"),
                re("p", {className: "smallMarginBottom"}, "text here")
            )
        );
    };
})();


