window.component = window.component || {};
component.CreateNewGroupPage = (function(){
    var connect = ReactRedux.connect;
    var isRequestSent = false;

    var CreateNewGroupPage = React.createClass({
        getInitialState: function() {
            if (!isRequestSent) {
                isRequestSent = true;
            }

            return {

            };
        },

        render: function() {
            var props = this.props;

            return re("div", { className: "content" }, "create group...");
        }
    });

    function mapStateToProps(state){
        return {

        }
    }

    function mapDispatchToProps(dispatch) {
        return {

        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(CreateNewGroupPage);
})();


