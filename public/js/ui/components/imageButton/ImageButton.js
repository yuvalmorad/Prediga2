component.ImageButton = (function(){
    return function(props){
        return re("button", {onClick: props.onClick, disabled: props.disabled},
            re("img", {src: "../images/" + props.imageName + (props.disabled ? "_gray" : "") + ".png"})
        );
    }
})();


