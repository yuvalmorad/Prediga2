window.component = window.component || {};
component.Graph = (function(){
    return function(props){
        var parts = props.parts;

        var partsElements = (parts || []).map(function(part, index){
            return re("div", {key: index, style: {flex: part.amount, backgroundColor: part.color}});
        });

        return re("div", {className: "graph"},
            partsElements
        );
    }
})();


