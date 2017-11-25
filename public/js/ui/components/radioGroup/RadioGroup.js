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
                return re(RadioButton,  {
                                            bgColor: input.bgColor,
                                            textColor: input.textColor,
                                            key: "radio_" + props.id + "_" + index,
                                            onClicked: that.onRadioClicked.bind(that, props.name, index),
                                            isChecked: input.isChecked || false,
                                            text: input.text,
                                            points: props.points,
                                            pos: index,
                                            isDisabled: props.isDisabled
                                        }
                );
            });

            return re("div", {className: props.className},
                inputs
            )
        }
    });
})();


