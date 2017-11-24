component.LoginPage = (function(){
    var connect = ReactRedux.connect;

    function LoginPage(props) {
        return re("div", { className: "login-page" },
                    re("div", {className: "login-buttons"},
                        re("button", {className: "facebook-login", onClick: props.login}, "Login with Facebook"),
                        re("a", {className: "register-account"}, "Need an Account ?")
                    )
        );

    }

    function mapStateToProps(state){
        return {

        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            login: function(){dispatch(action.authentication.login("shachar"))}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(LoginPage);
})();


