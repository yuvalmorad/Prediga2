window.component = window.component || {};
component.CreateNewGroupPage = (function(){
    var connect = ReactRedux.connect;
    var SelectGroupIcon = component.SelectGroupIcon;
    var Secret = component.Secret;
    var AvailableLeaguesList = component.AvailableLeaguesList;

    var CreateNewGroupPage = React.createClass({
        getInitialState: function() {
            if (!this.props.leagues.length) {
                //no available leagues yet-> load all
                this.props.loadAllAvailableLeagues();
            }

            var state = {
                displaySelectGroupIconPage: false,
                selectedIcon: "",
                selectedIconColor: "",
                groupName: "sample name",
                winPoints: 4,
                goalsPoints: 2,
                firstToScorePoints: 2,
                diffGoalsPoints: 2,
                selectedLeagueIds: []
            };

            for (var i = 0; i < SECRET_LENGTH; i++) {
                state["secret" + i] = "1";
            }

            return state;
        },

        onGroupNameChange: function(event) {
            var value = event.target.value;
            this.setState({groupName: value});
        },

        onNumberChange: function(event) {
            var name = event.target.name;
            var value = event.target.value;

            if (value.length > 3) {
                return;
            }
            var newState = {};
            newState[name] = parseInt(value);
            this.setState(newState);
        },

        onSecretNumberChanged: function(name, num) {
            var newState = {};
            newState[name] = num;
            this.setState(newState);
        },

        onLeagueClicked: function(leagueId) {
            var selectedLeagueIdsCopy = this.state.selectedLeagueIds.slice(0);
            var index = selectedLeagueIdsCopy.indexOf(leagueId);
            if (index >= 0) {
                selectedLeagueIdsCopy.splice(index, 1);
            } else {
                selectedLeagueIdsCopy.push(leagueId);
            }

            this.setState({selectedLeagueIds: selectedLeagueIdsCopy});
        },

        selectAllLeaguesChanged: function(event) {
            var selectedLeagueIdsCopy;
            var isSelectedAll = event.target.checked;
            if (isSelectedAll) {
                selectedLeagueIdsCopy = this.props.leagues.map(function(league){
                    return league._id;
                });
            } else {
                selectedLeagueIdsCopy = [];
            }

            this.setState({selectedLeagueIds: selectedLeagueIdsCopy});
        },

        openSelectIconPage: function() {
            this.setState({displaySelectGroupIconPage: true});
        },

        onSelectGroupIconSave: function(selectedIcon, selectedColor) {
            this.setState({displaySelectGroupIconPage: false, selectedIcon: selectedIcon, selectedIconColor: selectedColor});
        },

        onSelectGroupIconCancel: function() {
            this.setState({displaySelectGroupIconPage: false});
        },

        onCancel: function() {
            routerHistory.goBack();
        },

        onSave: function() {
            var state = this.state;

            var groupToCreate = {
                name: state.groupName,
                icon: state.selectedIcon,
                iconColor: state.selectedIconColor,
                leagueIds: state.selectedLeagueIds,
                secret: "",
                configuration: {
                    winner: state.winPoints,
                    team1Goals: state.winPoints,
                    team2Goals: state.winPoints,
                    firstToScore: state.firstToScorePoints,
                    goalDiff: state.diffGoalsPoints
                }
            };

            for (var i = 0; i < SECRET_LENGTH; i++) {
                groupToCreate.secret += state["secret" + i];
            }

            console.log("saving: ", groupToCreate);

            this.props.createGroup(groupToCreate);
            routerHistory.goBack();
        },

        render: function() {
            var that = this;
            var props = this.props;
            var state = this.state;
            var selectedLeagueIds = state.selectedLeagueIds;
            var leagues = props.leagues;
            var selectedIcon = state.selectedIcon;
            var selectedIconColor = state.selectedIconColor;
            var mainElement;

            if (this.state.displaySelectGroupIconPage) {
                mainElement = re(SelectGroupIcon, {selectedIcon: selectedIcon, selectedIconColor: selectedIconColor, onSave: this.onSelectGroupIconSave, onCancel: this.onSelectGroupIconCancel});
            } else {
                var isFormValid = true;
                var groupNameClassName = "group-name";
                var groupIconClassName = "group-icon";
                var selectLeaguesClassName = "sub-title";
                var winInputClassName = "";
                var goalsInputClassName = "";
                var firstToScoreInputClassName = "";
                var diffGoalsInputClassName = "";

                var secretProps = {
                    onNumberChanged: this.onSecretNumberChanged
                };

                for (var i = 0; i < SECRET_LENGTH; i++) {
                    secretProps["secret" + i] = state["secret" + i];
                }

                if (!state.groupName) {
                    isFormValid = false;
                    groupNameClassName += " invalid";
                }

                if (!selectedIcon) {
                    isFormValid = false;
                    groupIconClassName += " invalid";
                }

                if (!selectedLeagueIds.length) {
                    isFormValid = false;
                    selectLeaguesClassName += " invalid";
                }

                if (!state.winPoints) {
                    isFormValid = false;
                    winInputClassName += "invalid";
                }

                if (!state.goalsPoints) {
                    isFormValid = false;
                    goalsInputClassName += "invalid";
                }

                if (!state.firstToScorePoints) {
                    isFormValid = false;
                    firstToScoreInputClassName += "invalid";
                }

                if (!state.diffGoalsPoints) {
                    isFormValid = false;
                    diffGoalsInputClassName += "invalid";
                }

                mainElement = re("div", { className: "scroll-container" },
                    re("div", {className: "title"}, "Group Details"),
                    re("div", {className: "sub-title-container"},
                        re("div", {className: "sub-title"}, "Group Name:"),
                        re("div", {className: "small-text"}, "(max. 64 characters)")
                    ),
                    re("input", {type: "text", className: groupNameClassName, value: state.groupName, onChange: this.onGroupNameChange}),
                    re("div", {className: "sub-title-container"},
                        re("div", {className: "sub-title"}, "Access Code:"),
                        re("div", {className: "small-text"}, "(numbers only)")
                    ),
                    re(Secret, secretProps),
                    re("div", {className: "sub-title-container"},
                        re("div", {className: "sub-title"}, "Group Icon:")
                    ),
                    re("div", {className: "select-icon-row"},
                        re("div", {className: groupIconClassName, style: {color: selectedIconColor}}, selectedIcon),
                        re("button", {onClick: this.openSelectIconPage}, "Select Icon")
                    ),
                    re("div", {className: "title"}, "Competitions"),
                    re("div", {className: "sub-title-container"},
                        re("div", {className: selectLeaguesClassName}, "Choose the leagues and tournaments to be contested in your group"),
                        re("div", {className: "select-all-container"},
                            re("label", {className: "small-text", htmlFor: "selectAllCheckbox"}, "Select All"),
                            re("input", {type: "checkbox", id: "selectAllCheckbox", onChange: this.selectAllLeaguesChanged})
                        )
                    ),
                    re(AvailableLeaguesList, {leagues: leagues, selectedLeagueIds: selectedLeagueIds, onLeagueClicked: this.onLeagueClicked}),
                    re("div", {className: "title"}, "Prediction Scores"),
                    re("div", {className: "sub-title-container"},
                        re("div", {className: "sub-title"}, "Enter the points awarded for accurate predictions:")
                    ),
                    re("div", {className: "row-scoring"},
                        re("input", {type: "number", pattern: "\\d*", className: winInputClassName, value: state.winPoints, name: "winPoints", onChange: this.onNumberChange}),
                        re("div", {}, "Match Outcome (Win/Draw/Loss)")
                    ),
                    re("div", {className: "row-scoring"},
                        re("input", {type: "number", pattern: "\\d*", className: goalsInputClassName, value: state.goalsPoints, name: "goalsPoints", onChange: this.onNumberChange}),
                        re("div", {}, "Goals Scored")
                    ),
                    re("div", {className: "row-scoring"},
                        re("input", {type: "number", pattern: "\\d*", className: firstToScoreInputClassName, value: state.firstToScorePoints, name: "firstToScorePoints", onChange: this.onNumberChange}),
                        re("div", {}, "First to Score")
                    ),
                    re("div", {className: "row-scoring"},
                        re("input", {type: "number", pattern: "\\d*", className: diffGoalsInputClassName, value: state.diffGoalsPoints, name: "diffGoalsPoints", onChange: this.onNumberChange}),
                        re("div", {}, "Goal Difference")
                    ),
                    re("div", {className: "row-buttons"},
                        re("button", {onClick: this.onCancel}, "Cancel"),
                        re("button", {disabled: !isFormValid, onClick: this.onSave}, "Create")
                    )
                );
            }

            return re("div", { className: "create-new-group-page content" },
                mainElement
            );
        }
    });

    function mapStateToProps(state){
        return {
            leagues: state.leagues.allAvailableLeagues
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            createGroup: function(group){dispatch(action.groups.createGroup(group))},
            loadAllAvailableLeagues: function(group){dispatch(action.leagues.loadAllAvailableLeagues())}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(CreateNewGroupPage);
})();


