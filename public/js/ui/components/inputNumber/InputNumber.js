window.component = window.component || {};
component.InputNumber = (function(){
    return React.createClass({
        onIncrement: function() {
            var num = this.calculateNumWithMin(this.props.num, this.props.min);

            if (num === undefined) {
                this.props.onChange(0);
            } else if (num !== 9) {
                this.props.onChange((num) + 1);
            }
        },

        onDecrement: function() {
            var min = this.props.min;
            var num = this.calculateNumWithMin(this.props.num, min);

            if (num === undefined) {
                return;
            }

            if (min !== undefined && num - 1 < min) {
                return;
            }

            if(num !== 0) {
                this.props.onChange((num) - 1);
            }
        },

        calculateNumWithMin: function(num, min) {
            if (min !== undefined) {
                if (num === undefined || num < min) {
                    num = min;
                }
            }

            return num
        },

        render: function(){
            var props = this.props;
            var points = props.points;
            var hasPoints = points !== undefined;
            var num = props.num;
            var isDisabled = props.isDisabled;
            var min = props.min;
            var className = "input-number";

            num = this.calculateNumWithMin(num, min);

            if (hasPoints) {
                if (points > 0) {
                    className += " win";
                } else {
                    className += " lost";
                }
            } else if (isDisabled) {
                className += " disabled";
            }

            return re("div", {className: className, style: {backgroundColor: isDisabled ? "transparent" : ""}},
                re("button", {onClick: this.onIncrement, className: isDisabled ? "hide" : ""},
                    re("span", {}, "+")
                ),
                re("div", {className: "number"}, num === undefined ? "-" : num),
                re("button", {onClick: this.onDecrement, className: isDisabled ? "hide" : ""},
                    re("span", {}, "-")
                )
            );
        }
    });
})();


