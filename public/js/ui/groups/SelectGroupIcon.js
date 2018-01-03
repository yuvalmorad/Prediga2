window.component = window.component || {};
component.SelectGroupIcon = (function(){
    return React.createClass({
        getInitialState: function() {
            return {
                selectedIcon: this.props.selectedIcon || ""
            };
        },

        onSave: function() {
            this.props.onSave(this.state.selectedIcon);
        },

        onIconClicked: function(event) {
            var icon = event.target.textContent;
            var selectedIcon = "";
            if (this.state.selectedIcon !== icon) {
                selectedIcon = icon;
            }

            this.setState({
                selectedIcon: selectedIcon
            });
        },

        render: function() {
            var that = this;
            var state = this.state;
            var selectedIcon = state.selectedIcon;
            var icons = ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""];
            var iconsElem = icons.map(function(icon) {
                return re("div", {className: "icon" + (selectedIcon === icon ? " selected" : ""), onClick: that.onIconClicked}, icon);
            });

            return re("div", {className: "scroll-container select-group-icon"},
                re("div", {className: "title"}, "Select Icon"),
                re("div", {className: "icons"},
                    iconsElem
                ),
                re("div", {className: "row-buttons"},
                    re("button", {onClick: this.props.onCancel}, "Cancel"),
                    re("button", {onClick: this.onSave}, "Save")
                )
            )

        }
    });
})();


