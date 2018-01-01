window.component = window.component || {};
component.CreateNewGroupPage = (function(){
    var connect = ReactRedux.connect;
    var isRequestSent = false;

    var CreateNewGroupPage = React.createClass({
        getInitialState: function() {
            if (!isRequestSent) {
                isRequestSent = true;
            }

            return {

            };
        },

        render: function() {
            var props = this.props;
            var secretInputs = [];
            var i;
            var leagues = [
                {
                    name: "Israel Premier League",
                    isSelected: true
                },
                {
                    name: "2018 FIFA World Cup"
                },
                {
                    name: "English Premier League"
                }
            ];

            for (i = 0; i < 6; i++) {
                secretInputs.push(
                    re("input", {type: "text", key: "secret" + i})
                );
            }

            var leaguesElems = leagues.map(function(league){
                return re("div", {className: league.isSelected ? "selected" : ""}, league.name);
            });

            return re("div", { className: "create-new-group-page content" },
                re("div", { className: "scroll-container" },
                    re("div", {className: "title"}, "Group Details"),
                    re("div", {className: "sub-title-container"},
                        re("div", {className: "sub-title"}, "Group Name:"),
                        re("div", {className: "small-text"}, "Max 64 Characters")
                    ),
                    re("input", {type: "text", className: "group-name"}),
                    re("div", {className: "sub-title-container"},
                        re("div", {className: "sub-title"}, "Group Secret:"),
                        re("div", {className: "small-text"}, "Only Numbers")
                    ),
                    re("div", {className: "secret-container"},
                        secretInputs
                    ),
                    re("div", {className: "title"}, "Group Leagues"),
                    re("div", {className: "sub-title-container"},
                        re("div", {className: "sub-title"}, "Select Leagues:"),
                        re("div", {className: "select-all-container"},
                            re("label", {className: "small-text"}, "Select All"),
                            re("input", {type: "checkbox"})
                        )
                    ),
                    re("div", {className: "group-leagues"},
                        leaguesElems
                    ),
                    re("div", {className: "title"}, "Group Scoring"),
                    re("div", {className: "sub-title-container"},
                        re("div", {className: "sub-title"}, "Select Points:")
                    ),
                    re("div", {className: "row-scoring"},
                        re("input", {type: "text"}),
                        re("div", {}, "Win, Draw, Lost")
                    ),
                    re("div", {className: "row-scoring"},
                        re("input", {type: "text"}),
                        re("div", {}, "Goals")
                    ),
                    re("div", {className: "row-scoring"},
                        re("input", {type: "text"}),
                        re("div", {}, "First to Score")
                    ),
                    re("div", {className: "row-scoring"},
                        re("input", {type: "text"}),
                        re("div", {}, "Diff Goals")
                    ),
                    re("div", {className: "row-buttons"},
                        re("button", {}, "Cancel"),
                        re("button", {}, "Save"),
                    )
                )
            );
        }
    });

    function mapStateToProps(state){
        return {

        }
    }

    function mapDispatchToProps(dispatch) {
        return {

        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(CreateNewGroupPage);
})();


