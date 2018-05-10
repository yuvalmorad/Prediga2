var GAME = {
    STATUS: {
        PRE_GAME: "PRE_GAME",
        CLOSED_GAME: "CLOSED_GAME",
        RUNNING_GAME: "RUNNING_GAME",
        POST_GAME: "POST_GAME"
    },

    BET_TYPES: {
        WINNER: {key: "winner"},
        TEAM1_GOALS: {key: "team1Goals"},
        TEAM2_GOALS: {key: "team2Goals"},
        GOAL_DIFF: {key: "goalDiff"},
        FIRST_TO_SCORE: {key: "firstToScore"}
    },

    TEAM_TYPES: {
        TEAM_WINNER: {key: "teamWinner"},
        TEAM_THIRD: {key: "teamThird"},
        TEAM_RUNNER_UP: {key: "teamRunnerUp"},
        TEAM_LAST: {key: "teamLast"},
        TEAM_SECOND_LAST: {key: "team2ndLast"},
        TEAM_FOURTH: {key: "teamForth"}
    },

    MINUTES_BEFORE_CLOSE_MATCH: "minutesBeforeCloseMathPrediction"
};

var COLORS = {
    DRAW_COLOR: "#e2dfdf"
};

var INITIAL_PUPLIC_GROUP = "5a3eac97d3ca76dbd12bf638";

var NUM_OF_BADGES = 2;

var SECRET_LENGTH = 6;