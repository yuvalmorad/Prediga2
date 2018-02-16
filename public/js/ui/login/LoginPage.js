window.component = window.component || {};
component.LoginPage = (function(){
    return React.createClass({
        componentDidMount: function() {
            service.authentication.isLoggedIn().then(function(res){
                if (res.data.isLoggedIn) {
                    routerHistory.push("/");
                }
            });
        },

        onLoginClicked: function(event) {
            //workaround for ios - keep the home app after login and don't open safari
            var target = event.target;
            window.location = target.getAttribute("href");
            event.preventDefault();
        },

        render: function LoginPage(props) {
           return re("div", { className: "login-page" },
               re("img", {className: "login-logo", src:"../images/prediga_logo_transparent.png"}),
               re("div", {className: "login-buttons"},
                   /*re("div", {className: "login-button-wrapper"},
                       re("a", {className: "facebook-login", href: "/auth/facebook"}, "Login with Facebook")
                   ),*/
                   re("div", {className: "login-button-wrapper"},
                       re("a", {className: "google-login", href: "/auth/google", traget: "_self", onClick: this.onLoginClicked}, "Sign in with Google")
                   )
               )
           );
        }
    });
})();


