window.component = window.component || {};
component.IconsPicker = (function () {

    var SPRITE_ICON_SIZE = 48;
    var CATEGORIES = [
        {
            icon: "",
            sprite: "/images/iconsMessage/sport.png",
            numOfIcons: 30
        },
        {
            icon: "",
            sprite: "/images/iconsMessage/flags.png",
            numOfIcons: 38
        },
        {
            icon: "",
            sprite: "/images/iconsMessage/misc.png",
            numOfIcons: 27
        },
        {
            icon: "",
            sprite: "/images/iconsMessage/emoji.png",
            numOfIcons: 26
        }
    ];

	return React.createClass({
        getInitialState: function() {

            return {
                categorySelectedIndex: 0
			};
        },

        onIconClicked: function(url, index) {
            this.props.onIconClicked(url, index);
        },

        onCategoryClicked: function(index) {
            this.setState({
                categorySelectedIndex: index
            });
        },

		render: function() {
            var that = this,
                props = this.props,
                state = this.state,
                categorySelectedIndex = state.categorySelectedIndex,
                isVisible = props.isVisible;

            var categoriesElems = CATEGORIES.map(function(category, index){
                var isSelected = categorySelectedIndex === index;
                return re("div", {className: "category-item" + (isSelected ? " selected" : ""), onClick: that.onCategoryClicked.bind(that, index), key: "categoryItem" + index}, category.icon);
            });

            var iconsPages = CATEGORIES.map(function(category, index){

                var i;

                var iconsElems = [];
                for (i = 0; i < category.numOfIcons; i++) {
                    var url = "url(" + category.sprite + ")";
                    var position = (SPRITE_ICON_SIZE * (i % 2)) + "px -" + (SPRITE_ICON_SIZE * Math.floor(i / 2)) + "px";
                    iconsElems.push(
                        re("div", {className: "icon", style: {backgroundImage: url, backgroundPosition: position}, onClick: that.onIconClicked.bind(that, category.sprite, i), key: i})
                    );
                }

                return re("div", {className: "icons-page", key: "iconsPage" + index},
                    re("div", {className: "icons"},
                        iconsElems
                    )
                );
            });

            var categoriesScrollStyle = {
                transform: "translateX(-" + (categorySelectedIndex * 100 ) +  "%)"
            };

			return re("div", {className: "icons-picker-component" + (isVisible ? "" : " hide"), style: {bottom: props.bottomPosition  + "px"}},
                re("div", {className: "icons-picker-header"},
                    categoriesElems
                ),
                re("div", {className: "icons-categories-scroll", style: categoriesScrollStyle},
                    iconsPages
                )
			);
		}
	});
})();