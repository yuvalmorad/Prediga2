component.ImagesPagination = (function(){
    return React.createClass({
        getInitialState: function() {
            return {
                containerWidth: 0,
                itemWidth: 42,
                spaceBetweenItems: 32,
                animate: false
            }
        },

        onNextClicked: function(currentIndex) {
            if (currentIndex + 1 < this.props.items.length) {
                this.updateSelectedTeam(currentIndex + 1);
            }
        },

        onPreviousClicked: function(currentIndex) {
            if (currentIndex !== 0) {
                this.updateSelectedTeam(currentIndex - 1);
            }
        },

        updateSelectedTeam: function(index) {
            this.props.onSelectedTeamChanged(this.props.items[index].name);
            this.setState({animate: true});
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
            var currentIndex = 0;

            var itemsElements = items.map(function(item, index){
                var isSelected = item.isSelected;
                var shortName = item.shortName;
                var name = item.name;

                if (isSelected) {
                    currentIndex = index;
                }

                return re("div", {key: name, className: "item" + (isSelected ? " selected" : ""), style: {marginRight: spaceBetweenItems}},
                    re("img", {src: "../images/teamsLogo/" + name + ".png", style: {width: itemWidth, height: 28}}),
                    re("div", {className: "title"}, shortName)
                );
            });


            var containerWidth = state.containerWidth;
            var containerCenter = containerWidth / 2;
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
                        re("button", {className: "icon-left-open", onClick: this.onPreviousClicked.bind(this, currentIndex)})
                    ),
                    re("div", {className: scrollClassName, style: {transform: "translateX(" + scrollX + "px)"}},
                        itemsElements
                    ),
                    re("div", {className: "button-area right"},
                        re("button", {className: "icon-right-open", onClick: this.onNextClicked.bind(this,currentIndex)})
                    )
                ),
                re("div", {className: "title"}, items[currentIndex].name)
            );
        }
    });
})();


