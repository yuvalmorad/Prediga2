component.BaseMainTile = (function(){
    return function(props) {
        var imageSrc = props.imageSrc,
            imageBackground = props.imageBackground,
            trend = props.trend,
            title = props.title,
            description = props.description,
            rank = props.rank,
            rankTitle = props.rankTitle,
            points = props.points,
            badgeName = props.badgeName,
            logoPosition = props.logoPosition,
            logoClassName = props.logoClassName;

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

        var imageElem;

        if (imageBackground) {
            imageElem = re("div", {className: "team-logo" + (logoClassName ? " " + logoClassName : ""), style: {backgroundImage: imageBackground, backgroundPosition: (logoPosition ? logoPosition : "")}});
        } else {
            imageElem = re("img", {src: imageSrc});
        }

        return re("div", {className: "main base"},
            re("div", {className: "left"},
                rankElem,
                re("div", {className: "image-wrapper"},
                    imageElem,
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
                re("div", {className: "points" + (points === undefined ? " hide" : "") }, points !== undefined ? points : "")
            )
        );
    };
})();


