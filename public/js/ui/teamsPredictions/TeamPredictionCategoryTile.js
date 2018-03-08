window.component = window.component || {};
component.TeamPredictionCategoryTile = (function(){
    var Tile = component.Tile;

    return React.createClass({
        render: function() {
            var props = this.props,
                categoryName = props.categoryName,
                categoryTotalPoints = props.categoryTotalPoints,
                categoryId = props.categoryId,
                icon = props.icon;

            return re(Tile, {className: "team-prediction-category-tile", navigateOnClickTo: "/teamsPredictions/" + categoryId},
                re("div", {className: "main"},
                    re("div", {className: "left"},
                        re("img", {className: "category-icon", src: "/images/teamCategories/" + icon})),
                    re("div", {className: "center"},
                        re("div", {className: "category-name"}, categoryName)
                    ),
                    re("div", {className: "right"},
                        re("div", {className: "category-total-points"},
                            re("div", {}, categoryTotalPoints),
                            re("div", {}, "Points")
                        )
                    )
                )
            );
        }
    });
})();


