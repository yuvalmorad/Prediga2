component.InputNumber = (function(){
    return React.createClass({
        onIncrement: function() {
            var num = this.props.num || 0;
            if (num !== 9) {
                this.props.onChange((num) + 1);
            }
        },

        onDecrement: function() {
            var num = this.props.num || 0;
            if(num !== 0) {
                this.props.onChange((num) - 1);
            }
        },

        render: function(){
            var props = this.props;
            var points = props.points;
            var hasPoints = points !== undefined;
            var num = props.num || 0;
            var isDisabled = props.isDisabled;
            var className = "input-number";

            if (hasPoints) {
                if (points > 0) {
                    className += " win";
                } else {
                    className += " lost";
                }
            } else if (isDisabled) {
                className += " disabled";
            }



            return re("div", {className: className},
                re("button", {onClick: this.onIncrement, className: isDisabled ? "hide" : ""},
                    re("span", {}, "+")
                ),
                re("div", {className: "number"}, num),
                re("button", {onClick: this.onDecrement, className: isDisabled ? "hide" : ""},
                    re("span", {}, "-")
                )
            );
        }
    });
})();


