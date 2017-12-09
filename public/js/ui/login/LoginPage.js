component.LoginPage = (function(){
    return function LoginPage(props) {
        return re("div", { className: "login-page" },
                    re("div", {className: "login-buttons"},
                        re("div", {className: "login-button-wrapper"},
                            re("a", {className: "facebook-login", href: "/auth/facebook"}, "Login with Facebook")
                        ),
                        re("div", {className: "login-button-wrapper"},
                            re("a", {className: "google-login", href: "/auth/google"}, "Login with Google")
                        )
                    )
        );
    };
})();


