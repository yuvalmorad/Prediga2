window.component = window.component || {};
component.RadioGroup = (function(){
    var RadioButton = component.RadioButton;
    return React.createClass({
        onRadioClicked: function(groupName, radioName) {
            this.props.onChange(groupName, radioName);
        },

        render: function(){
            var props = this.props,
                that = this,
                isOneChecked = false;

            props.inputs.forEach(function(input){
                if (utils.general.compareStringsLowerCase(input.name, input.res)) {
                    isOneChecked = true;
                }
            });

            var inputs = props.inputs.map(function(input, index){
                var isChecked = utils.general.compareStringsLowerCase(input.name, input.res);
                if (input.isDefault && !isOneChecked) {
                    isChecked = true;
                }
                
                return re(RadioButton,  {
                                            bgColor: input.bgColor,
                                            textColor: input.textColor,
                                            key: "radio_" + props._id + "_" + index,
                                            onClicked: that.onRadioClicked.bind(that, props.name, input.name),
                                            isChecked: isChecked,
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


