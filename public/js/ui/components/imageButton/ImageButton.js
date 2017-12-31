window.component = window.component || {};
component.ImageButton = (function(){
    return function(props){
        return re("button", {onClick: props.onClick, disabled: props.disabled},
            re("div", {style: {backgroundImage: SPRITES.ASSETS, backgroundPosition: props.disabled ? props.backgroundPositionDisabled : props.backgroundPosition}})
        );
    }
})();


