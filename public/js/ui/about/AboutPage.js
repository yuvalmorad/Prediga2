window.component = window.component || {};
component.AboutPage = (function(){
    return function RulesPage(props) {
        return re("div", { className: "" },
            re("h1", {className: "smallMarginBottom"}, "About"),
		    re("p", {className: "small"}, "A social game to predict with your friends about football.")
        )
    };
})();


