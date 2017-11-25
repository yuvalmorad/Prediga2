component.InputNumber = (function(){
    return React.createClass({
        onIncrement: function() {
            this.props.onChange(this.props.num + 1);
        },

        onDecrement: function() {
            this.props.onChange(this.props.num - 1);
        },

        render: function(){
            var props = this.props;
            var points = props.points;
            var hasPoints = points !== undefined;
            var num = props.num;
            var isDisabled = props.isDisabled;
            var className = "input-number";

            if (hasPoints) {
                if (points > 0) {
                    className += " win";
                } else {
                    className += " lost";
                }

            }

            return re("div", {className: className},
                re("button", {onClick: this.onIncrement, disabled: isDisabled},
                    re("span", {}, "+")
                ),
                re("div", {className: "number"}, num),
                re("button", {onClick: this.onDecrement, disabled: isDisabled},
                    re("span", {}, "-")
                )
            );
        }
    });
})();


