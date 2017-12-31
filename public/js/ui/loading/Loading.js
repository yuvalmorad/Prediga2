window.component = window.component || {};
component.Loading = (function(){
    var connect = ReactRedux.connect;

    function Loading(props) {
        var className = "loading";

        if (!props.isLoading) {
            className += " hide";
        }

        return re("div", { className: className })
    }

    function mapStateToProps(state){
        return {
            isLoading: state.general.isLoading
        }
    }

    return connect(mapStateToProps)(Loading);
})();


