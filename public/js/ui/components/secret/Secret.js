window.component = window.component || {};
component.Secret = (function(){

    return React.createClass({
        getInitialState: function() {
            var state = {
                secretFocusIndex: undefined
            };

            return state;
        },

        assignInputToFocus: function(input) {
            this.focusInput = input;
        },

        componentDidUpdate: function() {
            if (this.state.secretFocusIndex !== undefined) {
                this.focusInput.focus();
            }
        },

        onNumberKeyPress: function(index) {
            var name = event.target.name;
            var zeroCode = 48;
            var nineCode = 57;
            var keyCode = event.keyCode;

            if (keyCode < zeroCode || keyCode > nineCode) {
                return; //not a number
            }

            var num = (keyCode - zeroCode) + "";
            this.setState({secretFocusIndex: (index + 1) % 6});
            this.props.onNumberChanged(name, num);
        },

        render: function() {
            var state = this.state;
            var props = this.props;
            var secretFocusIndex = state.secretFocusIndex;
            var secretInputs = [];
            var i;

            for (i = 0; i < SECRET_LENGTH; i++) {
                var secretProperty = "secret" + i;
                var inputProps = {focus: i === 3, type: "number", pattern: "\\d*", key: "secret" + i, value: props[secretProperty], name: secretProperty, onKeyPress: this.onNumberKeyPress.bind(this, i)};
                if (secretFocusIndex === i) {
                    inputProps.ref = this.assignInputToFocus;
                }
                secretInputs.push(
                    re("input", inputProps)
                );
            }

            return re("div", {className: "secret-container"},
                secretInputs
            );
        }
    });
})();


