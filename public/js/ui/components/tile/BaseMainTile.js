window.component = window.component || {};
component.BaseMainTile = (function(){
    return function(props) {
        var imageSrc = props.imageSrc,
            trend = props.trend,
            title = props.title,
            description = props.description,
            additionalDescription = props.additionalDescription,
            additionalDescription2 = props.additionalDescription2,
            rank = props.rank,
            points = props.points,
            badgeName = props.badgeName,
            scoreCurrentMatch = props.scoreCurrentMatch;


        var trendElement = null;

        if (trend !== undefined && trend !== 0) {
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
        var badgeElem = badgeName && re("div", {className: "badge", style: {backgroundImage: "url('../images/" + badgeName + ".png')"}});
        var scoreCurrentMatchElem;

        if (scoreCurrentMatch !== undefined) {
            scoreCurrentMatchElem = re("div", {className: "points-current-match" + (scoreCurrentMatch === 0 ? " zero" : "")}, scoreCurrentMatch);
        }


        var imageElem = re("img", {src: imageSrc});

        return re("div", {className: "main base"},
            re("div", {className: "left"},
                rankElem,
                re("div", {className: "image-wrapper"},
                    imageElem,
                    trendElement
                ),
                re("div", {className: "name-wrapper"},
                    re("div", {className: "name"}, title),
                    re("div", {className: "description"}, description),
                    re("div", {className: "additional-description"}, additionalDescription),
                    re("div", {className: "additional-description"}, additionalDescription2)
                )
            ),
            re("div", {className: "right"},
                badgeElem,
                re("div", {className: "points-wrapper"},
                    re("div", {className: "points" + (points === undefined ? " hide" : "") }, points !== undefined ? points : ""),
                    scoreCurrentMatchElem
                )
            )
        );
    };
})();


