component.LeaderBoardMainTile = (function(){
    var BaseMainTile = component.BaseMainTile;
    var DEAFULT_PROFILE_IMAGE = "../images/default_profile.png";

    return function(props) {
        var user = props.user,
            rank = props.rank,
            score = props.score,
            photo = user.photo || DEAFULT_PROFILE_IMAGE,
            name = user.name,
            trend = props.trend,
            description = props.description;

        return re(BaseMainTile, {
            imageSrc: photo,
            trend: trend,
            title: name,
            description: description,
            rank: rank,
            points: score
        });
    };
})();


