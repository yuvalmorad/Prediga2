window.component = window.component || {};
component.SelectGroupIcon = (function(){
    var icons = ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""];
    var colors = ["#D0021B", "#F5A623", "#F8E71C", "#7ED321", "#4A90E2", "#000000", "#710CCA", "#9B9B9B", "#50E3C2", "#E010B4", "#417505", "#0D61C4"];

    return React.createClass({
        getInitialState: function() {
            return {
                selectedIcon: this.props.selectedIcon || "",
                selectedIconColor: this.props.selectedIconColor || "",
                displayPlatteColors: false,
                iconTop: 0,
                iconHeight: 0
            };
        },

        componentDidUpdate: function() {
            var platteColorsRef = this.platteColorsRef;
            if (platteColorsRef && platteColorsRef.offsetTop + platteColorsRef.offsetHeight + 20 > document.body.offsetHeight) {
                platteColorsRef.style.top = (this.state.iconTop - platteColorsRef.offsetHeight - 20) + "px";
            }
        },

        onSave: function() {
            this.props.onSave(this.state.selectedIcon, this.state.selectedIconColor);
        },

        onIconClicked: function(event) {
            var target = event.target;
            var icon = target.textContent;
            var color = colors[0];

            if (this.state.selectedIcon === icon) {
                //icon is already selected
                color = this.state.selectedIconColor;
            }

            this.setState({
                selectedIcon: icon,
                selectedIconColor: color,
                displayPlatteColors: true,
                iconTop: target.getBoundingClientRect().top,
                iconHeight: target.offsetHeight

            });
        },

        onColorClicked: function(color) {
            this.setState({
                selectedIconColor: color,
                displayPlatteColors: false
            });
        },

        onContainerClicked: function(event) {
            var target = event.target;
            if (target.classList.contains("color") || target.classList.contains("color-pallete") || target.classList.contains("icon")) {
                return;
            }

            if (this.state.displayPlatteColors) {
                this.setState({
                    displayPlatteColors: false
                });
            }
        },

        assignPlatteColorsRef: function(platteColorsRef) {
            this.platteColorsRef = platteColorsRef;
        },

        render: function() {
            var that = this;
            var state = this.state;
            var selectedIcon = state.selectedIcon;
            var selectedIconColor = state.selectedIconColor;
            var displayPlatteColors = state.displayPlatteColors;
            var iconTop = state.iconTop;
            var iconHeight = state.iconHeight;

            var iconsElem = icons.map(function(icon) {
                var isSelected = selectedIcon === icon;
                return re("div", {className: "icon", style: {color: isSelected ? selectedIconColor : ""}, onClick: that.onIconClicked}, icon);
            });

            var colorElem = colors.map(function(color){
                return re("div", {className: "color" + (color === selectedIconColor ? " selected" : ""), onClick: that.onColorClicked.bind(that, color), style: {backgroundColor: color}});
            });

            var platteColorsElem;

            if (displayPlatteColors) {
                platteColorsElem = re("div", {ref: this.assignPlatteColorsRef, className: "color-pallete", style: {top: iconTop + iconHeight + 20}},
                    colorElem
                );
            }

            return re("div", {className: "scroll-container select-group-icon", onClick: this.onContainerClicked},
                re("div", {className: "title"}, "Select Icon"),
                re("div", {className: "icons"},
                    iconsElem
                ),
                platteColorsElem,
                re("div", {className: "row-buttons"},
                    re("button", {onClick: this.props.onCancel}, "Cancel"),
                    re("button", {onClick: this.onSave}, "Save")
                )
            )

        }
    });
})();


