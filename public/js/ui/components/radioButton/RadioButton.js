component.RadioButton = (function(){
    return function(props){
        var isChecked = props.isChecked,
            bgColor = props.bgColor,
            textColor = props.textColor || "",
            pos = props.pos,
            onClicked = props.onClicked,
            text = props.text,
            isDisabled = props.isDisabled,
            points = props.points, //TODO need to show points?
            className = "radio-button";

        if (isChecked) {
            className += " selected";
        }

        if (pos === 0) {
            className += " left"
        } else if (pos === 2) {
            className += " right"
        }

        return re("button", {className: className, onClick: onClicked, disabled: isDisabled},
            re("div", {style: {backgroundColor: isChecked ? bgColor : "", color: isChecked ? textColor : ""}}, text)
        );
    }
})();


