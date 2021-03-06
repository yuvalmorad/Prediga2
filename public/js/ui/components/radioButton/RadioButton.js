window.component = window.component || {};
component.RadioButton = (function(){
    return function(props){
        var isChecked = props.isChecked,
            bgColor = props.bgColor,
            textColor = props.textColor || "",
            pos = props.pos,
            onClicked = props.onClicked,
            text = props.text,
            isDisabled = props.isDisabled,
            points = props.points,
            hasPoints = points !== undefined,
            className = "radio-button",
            pointsClassName = "points";

        if (isChecked) {
            className += " selected";
        }

        if (pos === 0) {
            className += " left";
        } else if (pos === 2) {
            className += " right";
            pointsClassName += " right";
        }

        if (hasPoints && isChecked) {
            if (points > 0) {
                className += " win";
            } else if (points === 0){
                className += " lost";
            }
        } else if (isDisabled) {
            className += " disabled";
        }

        return re("div", {className: "radio-button-wrapper"},
                re("button", {className: className, onClick: onClicked, disabled: isDisabled, style: {backgroundColor: (isDisabled && isChecked  ? "transparent" : ""), visibility: (isDisabled && !isChecked) ? "hidden" : ""}},
                    re("div", {style: {backgroundColor: isChecked && !hasPoints ? bgColor : "", color: isChecked && !hasPoints ? textColor : ""}}, text)
                ),
                re("div", {className: pointsClassName}, (points && isChecked) ? points : "")
        );
    }
})();


