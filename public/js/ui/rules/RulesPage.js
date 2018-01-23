window.component = window.component || {};
component.RulesPage = (function () {
	return function RulesPage(props) {
		return re("div", {className: "content"},
			re("div", {className: "scroll-container"},
				re("h1", {className: "smallMarginBottom"}, "Features"),

				re("h4", {}, "Groups - play with your freinds"),
				re("li", {className: "small"}, "Create Group - Create a group and choose leagues, users to play with."),
				re("li", {className: "small"}, "Edit Group - override any group configuration like scoring."),
				re("li", {className: "small"}, "Delete Group"),
				re("li", {className: "small"}, "Join Group"),
				re("li", {className: "small"}, "Leave Group"),
				re("br"),

				re("h4", {}, "Match Predictions"),
				re("li", {className: "small"}, "Submit your prediction 5 minutes before game kickoff time, this can be configurable in a private group."),
				re("li", {className: "small"}, "Predict the final score after 90 minutes."),
				re("br"),

				re("h4", {}, "Team Predictions"),
				re("li", {className: "small"}, "Submit your prediction before the deadline of each prediction."),
				re("br"),

				re("h4", {}, "Scores"),
				re("h7", {}, "Match Score"),
				re("li", {className: "small"}, "Winner - 4pts"),
				re("li", {className: "small"}, "First to score - 2pts"),
				re("li", {className: "small"}, "Right on Goals - 2pts"),
				re("br"),

				re("h4", {}, "Team Score"),
				re("li", {className: "small"}, "Winning - 20pts"),
				re("li", {className: "small"}, "Runner-up - 15pts"),
				re("li", {className: "small"}, "3rd place - 10pts"),
				re("li", {className: "small"}, "4th place - 10pts"),
				re("li", {className: "small"}, "2nd last place - 10pts"),
				re("li", {className: "small"}, "Last place - 10pts"),
				re("li", {className: "small"}, "Group stage - 4pts"),
				re("br"),

				re("h4", {}, "Leaderboard"),
				re("li", {className: "small"}, "Score are aggregated from all match and team predictions"),
				re("li", {className: "small"}, "Strike is when you predict right all options in one match"),
				re("br"),

				re("h4", {}, "Simulator"),
				re("li", {className: "small"}, "Simulate your standings while the game is in progress."),
				re("br")
			)
		);
	};
})();


