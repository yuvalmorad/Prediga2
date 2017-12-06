component.BaseMainTile = (function(){
    return function(props) {
        var imageSrc = props.imageSrc,
            trend = props.trend,
            title = props.title,
            description = props.description,
            rank = props.rank,
            points = props.points;

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
                trendText = "-";
            }

            trendElement = re("div", {className: trendClassName}, trendText);
        }


        return re("div", {className: "main base"},
            re("div", {className: "left"},
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
                re("div", {className: "rank"}, rank),
                re("div", {className: "points"}, points !== undefined ? points : "")
            )
        );
    };
})();


