component.RadioGroup = (function(){
    var RadioButton = component.RadioButton;
    return React.createClass({
        onRadioClicked: function(groupName, radioIndex) {
            this.props.onChange(groupName, radioIndex);
        },

        render: function(){
            var props = this.props,
                that = this;

            var inputs = props.inputs.map(function(input, index){
                if (input.label) {
                    return re("div", {className: "text", key: index}, input.label);
                } else {
                    return re(RadioButton,  {
                                                id: "radio_" + props.id + "_" + index,
                                                name: props.name + "_" + props.id,
                                                color: input.color,
                                                key: "radio_" + props.id + "_" + index,
                                                onClicked: that.onRadioClicked.bind(that, props.name, index),
                                                isChecked: input.isChecked || false,
                                                labelSelected: props.hasLabelSelected ? ((index === 0 || index === 2) ? "Winner" : "Draw") : "",
                                                points: props.points,
                                                pos: index,
                                                isDisabled: props.isDisabled
                                            }
                    );
                }
            });

            return re("div", {className: props.className},
                inputs
            )
        }
    });
})();


