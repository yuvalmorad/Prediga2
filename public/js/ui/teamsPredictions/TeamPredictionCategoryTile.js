window.component = window.component || {};
component.TeamPredictionCategoryTile = (function(){
    var Tile = component.Tile;

    return React.createClass({
        render: function() {
            var props = this.props,
                categoryName = props.categoryName,
                categoryTotalPoints = props.categoryTotalPoints,
                categoryId = props.categoryId,
                icon = props.icon,
                deadline = props.deadline,
                resultTime = props.resultTime,
                status = "",
                todayDate = new Date(),
                pointsEarned = 0;

            if (todayDate < new Date(deadline)){
                status = "Open until " + utils.general.formatDateToDateMonthYearString(deadline);
            } else if(todayDate < new Date(resultTime)) {
                status = "Closed - Results on " +utils.general.formatDateToDateMonthYearString(resultTime);
            } else {
                //todo when results
            }

            return re(Tile, {className: "team-prediction-category-tile", navigateOnClickTo: "/teamsPredictions/" + categoryId},
                re("div", {className: "main"},
                    re("div", {className: "left"},
                        re("img", {className: "category-icon", src: "/images/teamCategories/" + icon})),
                    re("div", {className: "center"},
                        re("div", {className: "category-name"}, categoryName),
                        re("div", {className: "category-status"}, status)
                    ),
                    re("div", {className: "right"},
                        re("div", {className: "category-total-points"},
                            re("div", {}, pointsEarned + " / " + categoryTotalPoints),
                            re("div", {}, "Points")
                        )
                    )
                )
            );
        }
    });
})();


