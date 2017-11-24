component.RadioButton = (function(){
    return function(props){
        var isChecked = props.isChecked,
            id = props.id,
            name = props.name,
            color = props.color,
            onClicked = props.onClicked,
            labelSelected = props.labelSelected,
            pos = props.pos,
            isDisabled = props.isDisabled,
            points = props.points;

        var className = "radio-button";

        if (pos === 2) {
            className += " right";
        }

        var labelText,
            labelClassName = "";
        if (isChecked && points !== undefined) {
            labelText = points > 0 ? points : "";
            labelClassName += "points";
        } else {
            labelText = isChecked ? labelSelected : "";
        }

        return re("div", {className: className},
            re("input", {type: "radio", name: name, id: id, onClick: onClicked, onChange: function(){}, checked: isChecked, disabled: isDisabled}),
            re("label", {htmlFor: id, className: labelClassName}, labelText),
            re("div", {style: {backgroundColor: isChecked ? color : "transparent"},className: "checked" + (isChecked ? " is-checked" : "")})
        )
    }
})();


