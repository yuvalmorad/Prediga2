component.InputNumber = (function(){
    return React.createClass({

        onKeyPress: function(e) {
            if (e.which >= 48 && e.which <= 57) {
                this.props.onChange(parseInt(e.key));
            }
        },

        onChange: function(e) {},

        render: function(){
            var props = this.props;
            var label = props.label;
            var position = props.position;
            var points = props.points;
            var input = re("input", {type: "text", value: this.props.num, onKeyPress: this.onKeyPress, onChange: this.onChange, disabled: props.isDisabled});
            var labelElement = null;
            var elem1, elem2;

            if (points !== undefined) {
                if (points > 0) {
                    labelElement = re("label", {className: "points"}, points);
                }
            } else if (label){
                labelElement = re("label", {}, label);
            }

            if (position === "right") {
                elem1 = labelElement;
                elem2 = input;
            } else {
                elem1 = input;
                elem2 = labelElement;
            }

            return re("div", {className: "input-number"},
                elem1,
                elem2
            );
        }
    });
})();


