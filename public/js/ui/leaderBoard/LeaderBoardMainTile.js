component.LeaderBoardMainTile = (function(){
    var BaseMainTile = component.BaseMainTile;

    return function(props) {
        var user = props.user,
            rank = props.rank,
            score = props.score,
            photo = user.photo || DEAFULT_PROFILE_IMAGE,
            name = user.name,
            trend = props.trend,
            description = props.description,
            badgeName = props.badgeName;

        return re(BaseMainTile, {
            imageSrc: photo,
            trend: trend,
            title: name,
            description: description,
            rank: rank,
            points: score,
            badgeName: badgeName
        });
    };
})();


