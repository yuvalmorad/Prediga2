var GAME = {
    STATUS: {
        PRE_GAME: "PRE_GAME",
        CLOSED_GAME: "CLOSED_GAME",
        POST_GAME: "POST_GAME"
    },

    BET_TYPES: {
        WINNER: {key: "winner", points: 1},
        TEAM1_GOALS: {key: "team1Goals", points: 1},
        TEAM2_GOALS: {key: "team2Goals", points: 1},
        GOAL_DIFF: {key: "goalDiff", points: 1},
        FIRST_TO_SCORE: {key: "firstToScore", points: 1}
    }
};

var COLORS = {
    DRAW_COLOR: "#888282"
};

var LEAGUES = (function(){
    return {
        WORLD_CUP_18: WORLD_CUP_18
    }
})();

var LEAGUE = LEAGUES.WORLD_CUP_18;

