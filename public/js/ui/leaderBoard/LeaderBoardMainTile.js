component.LeaderBoardMainTile = (function(){
    var BaseMainTile = component.BaseMainTile;

    return function(props) {
        var user = props.user,
            image = user.image,
            trend = user.trend,
            name = user.name,
            strikes = user.strikes,
            predictions = user.predictions,
            rank = user.rank,
            score = user.score;

        return re(BaseMainTile, {
            imageSrc: "../images/facebook/" + image,
            trend: trend,
            title: name,
            description: strikes + " Strikes, " + predictions + " Predictions",
            rank: rank,
            points: score
        });
    };
})();


