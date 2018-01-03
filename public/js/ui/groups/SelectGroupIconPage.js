window.component = window.component || {};
component.SelectGroupIconPage = (function(){
    var connect = ReactRedux.connect;

    var CreateNewGroupPage = React.createClass({
        getInitialState: function() {
            return {};
        },

        render: function() {
            return re("div", { className: "select-group-icon-page content" },
                re("div", { className: "scroll-container" },
                    "Select Icon"
                )
            );
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


