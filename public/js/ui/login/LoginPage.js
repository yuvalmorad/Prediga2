component.LoginPage = (function(){
    return function LoginPage(props) {
        return re("div", { className: "login-page" },
                    re("div", {className: "login-buttons"},
                        re("a", {className: "facebook-login", href: "/auth/facebook"}, "Login with Facebook")
                    )
        );
    };
})();


