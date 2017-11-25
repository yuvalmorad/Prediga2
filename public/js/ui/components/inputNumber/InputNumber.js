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
            var points = props.points; //TODO show points?
            var num = props.num;
            var isDisabled = props.isDisabled;

            return re("div", {className: "input-number"},
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


