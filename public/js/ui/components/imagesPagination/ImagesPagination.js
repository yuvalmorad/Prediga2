component.ImagesPagination = (function(){
    return React.createClass({
        getInitialState: function() {
            var currentIndex = 0;
            this.props.items.forEach(function(item, index){
                if (item.isSelected) {
                    currentIndex = index;
                }
            });
            return {
                currentIndex: currentIndex,
                containerWidth: 0,
                itemWidth: 56,
                spaceBetweenItems: 32
            }
        },

        onNextClicked: function() {
            if (this.state.currentIndex + 1 < this.props.items.length) {
                this.setState({currentIndex: this.state.currentIndex + 1, animate: true});
            }
        },

        onPreviousClicked: function() {
            if (this.state.currentIndex !== 0) {
                this.setState({currentIndex: this.state.currentIndex - 1, animate: true});
            }
        },

        updateContainerDimensions: function() {
            var containerWidth = this.elem.offsetWidth;
            var spaceBetweenItems = (containerWidth - 50 - (this.state.itemWidth * 3)) / 2;
            this.setState({
                containerWidth: containerWidth,
                spaceBetweenItems: spaceBetweenItems
            });
        },

        componentDidMount: function() {
            this.updateContainerDimensions();
            window.addEventListener("resize", this.updateContainerDimensions);
        },

        componentWillUnmount: function() {
            window.removeEventListener("resize", this.updateContainerDimensions);
        },

        assignRefElem: function(elem) {
            this.elem = elem
        },

        render: function(){
            var props = this.props;
            var state = this.state;
            var items = props.items;
            var itemWidth = state.itemWidth;
            var spaceBetweenItems = state.spaceBetweenItems;

            var itemsElements = items.map(function(item){
                var isSelected = item.isSelected;
                var logo = item.logo;
                var logoGray = item.logoGray;
                var shortName = item.shortName;
                var id = item.id;
                var src = isSelected ? logo : logoGray;

                return re("div", {key: id, className: "item" + (isSelected ? " selected" : ""), style: {marginRight: spaceBetweenItems}},
                    re("img", {src: "../images/teamsLogo/" + src, style: {width: itemWidth, height: itemWidth}}),
                    re("div", {className: "title"}, shortName)
                );
            });


            var containerWidth = state.containerWidth;
            var containerCenter = containerWidth / 2;
            var currentIndex = state.currentIndex;
            var startScroll = containerCenter - (itemWidth / 2);
            var leftSpace = (currentIndex * itemWidth) + (currentIndex * spaceBetweenItems);

            var scrollX = startScroll - leftSpace;

            var scrollClassName = "scroll";

            if (state.animate) {
                scrollClassName += " animate";
            }

            return re("div", {className: "images-pagination", ref: this.assignRefElem},
                re("div", {className: "images-pagination-container"},
                    re("div", {className: "button-area left"},
                        re("button", {className: "icon-left-open", onClick: this.onPreviousClicked})
                    ),
                    re("div", {className: scrollClassName, style: {transform: "translateX(" + scrollX + "px)"}},
                        itemsElements
                    ),
                    re("div", {className: "button-area right"},
                        re("button", {className: "icon-right-open", onClick: this.onNextClicked})
                    )
                ),
                re("div", {className: "title"}, items[currentIndex].name)
            );
        }
    });
})();


