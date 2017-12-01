component.LoginPage = (function(){
    var connect = ReactRedux.connect;

    function LoginPage(props) {
        return re("div", { className: "login-page" },
                    re("div", {className: "login-buttons"},
                        re("a", {className: "facebook-login", href: "/auth/facebook"}, "Login with Facebook")
                    )
        );

    }

    function mapStateToProps(state){
        return {

        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            login: function(){dispatch(action.authentication.login())}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(LoginPage);
})();


