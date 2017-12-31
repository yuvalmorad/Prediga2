window.component = window.component || {};
component.JoinGroupPage = (function(){
    var connect = ReactRedux.connect;
    var isRequestSent = false;

    var JoinGroupPage = React.createClass({
        getInitialState: function() {
            if (!isRequestSent) {
                isRequestSent = true;
            }

            return {

            };
        },

        render: function() {
            var props = this.props;

            return re("div", { className: "content" }, "join...");
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

    return connect(mapStateToProps, mapDispatchToProps)(JoinGroupPage);
})();


