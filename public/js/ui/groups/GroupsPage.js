component.GroupsPage = (function(){
    var connect = ReactRedux.connect;
    var isRequestSent = false;

    var GroupsPage = React.createClass({
        getInitialState: function() {
            if (!isRequestSent) {
                /*this.props.loadSimulator();*/
                isRequestSent = true;
            }

            return {

            };
        },

        render: function() {
            var props = this.props;

            return re("div", { className: "content" }, "Groups");
        }
    });

    function mapStateToProps(state){
        return {

        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            /*loadSimulator: function(){dispatch(action.simulator.loadSimulator())}*/
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(GroupsPage);
})();


