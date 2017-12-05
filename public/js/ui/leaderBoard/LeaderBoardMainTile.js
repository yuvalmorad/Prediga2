component.LeaderBoardMainTile = (function(){
    var BaseMainTile = component.BaseMainTile;

    return function(props) {
        var user = props.user,
            rank = props.rank,
            score = props.score,
            photo = user.photo,
            name = user.name,
            predictions = user.predictions;
            //strikes = user.strikes,
            //trend = user.trend,


        return re(BaseMainTile, {
            imageSrc: photo,
            //trend: trend,
            title: name,
            description: "",//strikes + " Strikes, " + predictions + " Predictions",
            rank: rank,
            points: score
        });
    };
})();


