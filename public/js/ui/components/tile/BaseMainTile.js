component.BaseMainTile = (function(){
    return function(props) {
        var imageSrc = props.imageSrc,
            trend = props.trend,
            title = props.title,
            description = props.description,
            rank = props.rank,
            rankTitle = props.rankTitle,
            points = props.points,
            badgeName = props.badgeName;

        var trendElement = null;

        if (trend !== undefined) {
            var trendText = trend,
                trendClassName = "trend";

            if (trend > 0) {
                trendText = "+" + trend;
                trendClassName += " positive";
            } else if (trend < 0) {
                trendClassName += " negative";
            } else {
                //0
                trendText = "";
            }

            trendElement = re("div", {className: trendClassName}, trendText);
        }

        var rankElem = rank && re("div", {className: "rank"}, rank);
        var ranktitleElem = rankTitle && re("div", {className: "rankTitle"}, rankTitle);
        var badgeElem = badgeName && re("div", {className: "badge", style: {backgroundImage: "url('../images/" + badgeName + ".png')"}});

        return re("div", {className: "main base"},
            re("div", {className: "left"},
                rankElem,
                re("div", {className: "image-wrapper"},
                    re("img", {src: imageSrc}),
                    trendElement
                ),
                re("div", {className: "name-wrapper"},
                    re("div", {className: "name"}, title),
                    re("div", {className: "description"}, description)
                )
            ),
            re("div", {className: "right"},
                badgeElem,
                ranktitleElem,
                re("div", {className: "points"}, points !== undefined ? points : "")
            )
        );
    };
})();


