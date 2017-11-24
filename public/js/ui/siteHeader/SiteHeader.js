component.SiteHeader = (function(){
    var connect = ReactRedux.connect;

    var SiteHeader = function (props) {
        var hide = props.hide,
            title = props.title,
            isUpdating = props.isUpdating;

        return re("div", { className: "site-header" + (hide ? " hide" : "") },
            re("div", {className: "left"},
                re("div", {className: "updating" + (isUpdating ? "" : " hide")},
                    re("div", {className: "updating-image"}),
                    re("div", {}, "Saving...")
                )
            ),
            re("div", {className: "center"}, title),
            re("div", {className: "right"})
        );
    };

    function mapStateToProps(state){
        return {
            isUpdating: state.general.isUpdating
        }
    }

    return connect(mapStateToProps)(SiteHeader);
})();


