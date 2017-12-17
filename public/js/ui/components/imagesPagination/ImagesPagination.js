component.ImagesPagination = (function(){
    var ImageButton = component.ImageButton;

    return React.createClass({
        getInitialState: function() {
            return {
                containerWidth: 0,
                itemWidth: 56,
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
                var leagueId = item.leagueId;
                var logoPosition = item.logoPosition;

                if (isSelected) {
                    currentIndex = index;
                }

                return re("div", {key: name, className: "item" + (isSelected ? " selected" : ""), style: {marginRight: spaceBetweenItems}},
                    re("div", {className: "team-logo " + leagueId, style: {width: itemWidth, height: itemWidth, backgroundImage: "url('../images/sprites/" + leagueId + "_teams.png')", backgroundPosition: logoPosition}}),
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

            var isLeftButtonDisabled = currentIndex === 0;
            var isRightButtonDisabled = currentIndex === items.length - 1;

            return re("div", {className: "images-pagination", ref: this.assignRefElem},
                re("div", {className: "images-pagination-container"},
                    re("div", {className: "button-area left"},
                        re(ImageButton, {onClick: this.onPreviousClicked.bind(this, currentIndex), disabled: isLeftButtonDisabled, backgroundPosition: "-45px 0px", backgroundPositionDisabled: "-68px 0px"})
                    ),
                    re("div", {className: scrollClassName, style: {transform: "translateX(" + scrollX + "px)"}},
                        itemsElements
                    ),
                    re("div", {className: "button-area right"},
                        re(ImageButton, {onClick: this.onNextClicked.bind(this,currentIndex), disabled: isRightButtonDisabled, backgroundPosition: "0 0", backgroundPositionDisabled: "-23px 0px"})
                    )
                )
            );
        }
    });
})();


