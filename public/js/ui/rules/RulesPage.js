window.component = window.component || {};
component.RulesPage = (function(){
    return function RulesPage(props) {
        return re("div", { className: "content" },
            re("div", { className: "scroll-container" },
                re("h3", {className: "smallMarginBottom"}, "Rules"),

                re("h5", {}, "Match Predictions"),
                re("ul", {className: "smallMarginBottom"}, "Enter your prediction until 5 minutes before game kickoff time"),
                re("ul", {className: "smallMarginBottom"}, "The prediction is what will be the score after 90minutes, without extra time"),
                re("ul", {className: "smallMarginBottom"}, "You can set non logical score, e.g. 2:1 (diff 0) to increase the possibility gain points but the maximum points will be reduced, you can't win it all"),

                re("h5", {}, "Team Predictions"),
                re("ul", {className: "smallMarginBottom"}, "Enter your prediction until the deadline"),

                re("h5", {}, "Score"),
                re("h7", {}, "Match Score"),
                re("ul", {className: "smallMarginBottom"}, "Winner - 4pts"),
                re("ul", {className: "smallMarginBottom"}, "First to score - 2pts"),
                re("ul", {className: "smallMarginBottom"}, "Goals (team1, team2, diff) - 2pts"),
                re("h7", {}, "Team Score"),
                re("ul", {className: "smallMarginBottom"}, "Winning - 20pts"),
                re("ul", {className: "smallMarginBottom"}, "Runner-up - 15pts"),
                re("ul", {className: "smallMarginBottom"}, "3rd place - 10pts"),
                re("ul", {className: "smallMarginBottom"}, "4th place - 10pts"),
                re("ul", {className: "smallMarginBottom"}, "2nd last place - 10pts"),
                re("ul", {className: "smallMarginBottom"}, "Last place - 10pts"),
                re("ul", {className: "smallMarginBottom"}, "Group stage - 4pts"),

                re("h5", {}, "Leaderboard"),
                re("ul", {className: "smallMarginBottom"}, "Score are aggregated from all match and team predictions"),
                re("ul", {className: "smallMarginBottom"}, "Strike is when you predict right all options in one match"),

                re("h5", {}, "Groups"),
                re("ul", {className: "smallMarginBottom"}, "TBD")
            )
        );
    };
})();


