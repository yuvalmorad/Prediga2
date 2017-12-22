component.LeaderBoardMainTile = (function(){
    var BaseMainTile = component.BaseMainTile;

    return function(props) {
        var user = props.user,
            rank = props.rank,
            score = props.score,
            photo = user.photo,
            name = user.name,
            trend = props.trend,
            description = props.description,
            additionalDescription = props.additionalDescription,
            additionalDescription2 = props.additionalDescription2,
            badgeName = props.badgeName,
            opts = {
                imageSrc: photo,
                trend: trend,
                title: name,
                description: description,
                additionalDescription: additionalDescription,
                additionalDescription2: additionalDescription2,
                rank: rank,
                points: score,
                badgeName: badgeName
            };

        if (!photo) {
            opts.imageBackground = SPRITES.ASSETS;
            opts.logoPosition = "-130px 1px";
        }

        return re(BaseMainTile, opts);
    };
})();


