window.component = window.component || {};
component.TeamPredictionCategoryTile = (function(){
    var Tile = component.Tile;

    return React.createClass({
        render: function() {
            var props = this.props,
                categoryName = props.categoryName,
                categoryDescription = props.categoryDescription,
                categoryTotalPoints = props.categoryTotalPoints,
                categoryTotalPointsEarned = props.categoryTotalPointsEarned,
                categoryId = props.categoryId,
                icon = props.icon,
                deadline = props.deadline,
                resultTime = props.resultTime,
                status = "",
                todayDate = new Date(),
                pointsEarned = categoryTotalPointsEarned || 0,
                hasResult = categoryTotalPointsEarned !== undefined,
                className = "team-prediction-category-tile";

            if (todayDate < new Date(deadline)){
                status = "Open until " + utils.general.formatDateToDateMonthYearString(deadline);
            } else if (hasResult) {
                status = categoryTotalPointsEarned + " points out of " + categoryTotalPoints;
            } else {
                status = "Closed - Results on " +utils.general.formatDateToDateMonthYearString(resultTime);
            }

            if (hasResult) {
                className += " hasResult";
                if (pointsEarned === 0) {
                    className += " zero";
                }
            }

            return re(Tile, {className: className, navigateOnClickTo: "/teamsPredictions/" + categoryId},
                re("div", {className: "main"},
                    re("div", {className: "left"},
                        re("img", {className: "category-icon", src: "/images/teamCategories/" + icon})),
                    re("div", {className: "center"},
                        re("div", {className: "category-name"}, categoryName),
                        re("div", {className: "category-description"}, categoryDescription),
                        re("div", {className: "category-status"}, status)
                    ),
                    re("div", {className: "right"},
                        re("div", {className: "category-total-points"},
                            re("div", {}, hasResult? (pointsEarned) : (pointsEarned + " / " + categoryTotalPoints)),
                            re("div", {}, "Points")
                        )
                    )
                )
            );
        }
    });
})();


